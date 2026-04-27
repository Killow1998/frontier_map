import { EVENT_PLAYER_UNIT_ATTACKED, EVENT_UNIT_DAMAGED, GAME_STATE_TIME_OF_DAY, UNIT_STATE_MANA, UNIT_STATE_MAX_LIFE, UNIT_STATE_MAX_MANA, UNIT_TYPE_RANGED_ATTACKER, bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"

const globalScope = _G as Record<string, unknown>
const jassGlobals = require("jass.globals") as Record<string, unknown> | undefined
let attackTraceInitialized = false
let attackTraceTimer: timer | undefined
const recentAttackMap: Record<string, { expiresAt: number; ranged: boolean }> = {}
const abilityRealOverrideMap: Record<string, number> = {}
const abilityStringOverrideMap: Record<string, string> = {}
const unitCraftCollapseBonusMap: Record<number, number> = {}
const unitAttackBonusFallbackMap: Record<number, number> = {}
let hasWarnedArmorFallback = false
let hasWarnedBonusAttrFallback = false
const ATTACK_BONUS_BIT_CHARS = "0123456789abcdefghijklm"
const ATTACK_BONUS_BIT_ABILITY_IDS: number[] = []
const ATTACK_BONUS_SIGN_ABILITY_ID = FourCC("YDbn")
let attackBonusAbilityFallbackAvailable: boolean | undefined

let anyUnitDamagedDispatcher: trigger | undefined
let anyUnitDamagedEnterTrigger: trigger | undefined
let anyUnitDamagedRegion: region | undefined
const anyUnitDamagedTriggers: trigger[] = []
const anyUnitDamagedTriggerSet: Record<number, true> = {}
const anyUnitDamagedUnitSet: Record<number, true> = {}

let messageThrottleInitialized = false
let messageThrottleIntervalSeconds = 4.0
let nativeDisplayTextToPlayer: ((whichPlayer: player, x: number, y: number, message: string) => void) | undefined
let nativeDisplayTimedTextToPlayer: ((whichPlayer: player, x: number, y: number, duration: number, message: string) => void) | undefined
let nativeQuestMessageBJ: ((whichPlayers: force, messageType: number, message: string) => void) | undefined
const messageQueueByPlayerId: Record<number, { x: number; y: number; duration?: number; message: string }[]> = {}
const messageQueueRunningByPlayerId: Record<number, true> = {}
const questMessageQueue: { whichPlayers: force; messageType: number; message: string }[] = []
let questMessageQueueRunning = false

/**
 * 【加固】全服同步句柄池 (Handle Pools)
 * 彻底解决由于本地动态创建 Group/Timer 导致的 Handle ID 抢占分叉。
 */
export const SYNC_GROUP = CreateGroup()
export const SYNC_TEMP_GROUP = CreateGroup()
export const SYNC_GROUP_3 = CreateGroup()
export const SYNC_GROUP_4 = CreateGroup()
export const SYNC_TIMER = CreateTimer()
export const SYNC_TIMER_2 = CreateTimer()

/**
 * 将浮点数转换为确定性的同步整数，消除跨 CPU 精度分歧。
 */
export function toSyncInt(value: number): number {
  return R2I(value + 0.0001)
}

for (let i = 0; i < ATTACK_BONUS_BIT_CHARS.length; i++) {
  const charCode = ATTACK_BONUS_BIT_CHARS.charAt(i)
  ATTACK_BONUS_BIT_ABILITY_IDS[i] = FourCC("YDb" + charCode)
}

function readMappedGlobal(name: string): unknown {
  const jassValue = jassGlobals?.[name]
  if (jassValue !== undefined) {
    return jassValue
  }
  return globalScope[name]
}

function writeMappedGlobal(name: string, value: unknown): void {
  globalScope[name] = value
  if (jassGlobals) {
    jassGlobals[name] = value
  }
}

function getOrCreatePlayerMessageQueue(playerId: number): { x: number; y: number; duration?: number; message: string }[] {
  const existing = messageQueueByPlayerId[playerId]
  if (existing !== undefined) {
    return existing
  }
  const created: { x: number; y: number; duration?: number; message: string }[] = []
  messageQueueByPlayerId[playerId] = created
  return created
}

function runNextPlayerMessage(playerId: number): void {
  if (messageQueueRunningByPlayerId[playerId]) {
    return
  }
  const queue = getOrCreatePlayerMessageQueue(playerId)
  if (queue.length <= 0) {
    return
  }
  const payload = queue.shift()
  if (!payload) {
    return
  }
  const whichPlayer = Player(playerId)
  messageQueueRunningByPlayerId[playerId] = true
  if (payload.duration !== undefined && nativeDisplayTimedTextToPlayer) {
    nativeDisplayTimedTextToPlayer(whichPlayer, payload.x, payload.y, payload.duration, payload.message)
  } else if (nativeDisplayTextToPlayer) {
    nativeDisplayTextToPlayer(whichPlayer, payload.x, payload.y, payload.message)
  }
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, messageThrottleIntervalSeconds, false, () => {
    delete messageQueueRunningByPlayerId[playerId]
    DestroyTimer(timerHandle)
    runNextPlayerMessage(playerId)
  })
}

function enqueuePlayerMessage(whichPlayer: player, x: number, y: number, duration: number | undefined, message: string): void {
  const playerId = GetPlayerId(whichPlayer)
  if (playerId < 0) {
    return
  }
  const queue = getOrCreatePlayerMessageQueue(playerId)
  queue.push({ x, y, duration, message })
  runNextPlayerMessage(playerId)
}

function shouldSuppressScreenMessage(message: string): boolean {
  // 会心提示已改为伤害飘字表现，屏蔽遗留文本刷屏。
  return message.indexOf("会心一击触发") >= 0
}

function runNextQuestMessage(): void {
  if (questMessageQueueRunning) {
    return
  }
  if (!nativeQuestMessageBJ || questMessageQueue.length <= 0) {
    return
  }
  const payload = questMessageQueue.shift()
  if (!payload) {
    return
  }
  questMessageQueueRunning = true
  nativeQuestMessageBJ(payload.whichPlayers, payload.messageType, payload.message)
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, messageThrottleIntervalSeconds, false, () => {
    questMessageQueueRunning = false
    DestroyTimer(timerHandle)
    runNextQuestMessage()
  })
}

/**
 * 初始化玩家提示节流：
 * - DisplayTextToPlayer / DisplayTimedTextToPlayer / QuestMessageBJ 统一走 4 秒间隔队列；
 * - 同一玩家的提示按队列串行发送，避免前期提示并发刷屏。
 */
export function initializeMessageThrottle(intervalSeconds: number = 4.0): void {
  if (messageThrottleInitialized) {
    return
  }
  nativeDisplayTextToPlayer = getGlobal<(whichPlayer: player, x: number, y: number, message: string) => void>("DisplayTextToPlayer")
  nativeDisplayTimedTextToPlayer = getGlobal<(whichPlayer: player, x: number, y: number, duration: number, message: string) => void>("DisplayTimedTextToPlayer")
  nativeQuestMessageBJ = getGlobal<(whichPlayers: force, messageType: number, message: string) => void>("QuestMessageBJ")
  if (!nativeDisplayTextToPlayer) {
    return
  }
  messageThrottleIntervalSeconds = Math.max(0.1, intervalSeconds)
  messageThrottleInitialized = true

  setGlobal("DisplayTextToPlayer", ((whichPlayer: player, x: number, y: number, message: string) => {
    if (message === "") {
      return
    }
    if (shouldSuppressScreenMessage(message)) {
      return
    }
    enqueuePlayerMessage(whichPlayer, x, y, undefined, message)
  }) as unknown)

  if (nativeDisplayTimedTextToPlayer) {
    setGlobal("DisplayTimedTextToPlayer", ((whichPlayer: player, x: number, y: number, duration: number, message: string) => {
      if (message === "") {
        return
      }
      if (shouldSuppressScreenMessage(message)) {
        return
      }
      enqueuePlayerMessage(whichPlayer, x, y, duration, message)
    }) as unknown)
  }

  if (nativeQuestMessageBJ) {
    setGlobal("QuestMessageBJ", ((whichPlayers: force, messageType: number, message: string) => {
      if (message === "") {
        return
      }
      if (shouldSuppressScreenMessage(message)) {
        return
      }
      questMessageQueue.push({ whichPlayers, messageType, message })
      runNextQuestMessage()
    }) as unknown)
  }
}

/**
 * 关闭指定全局触发器，避免与 TS 版本重复执行。
 */
export function disableLegacyTrigger(globalName: string): void {
  const legacyTrigger = readMappedGlobal(globalName) as trigger | undefined
  if (legacyTrigger) {
    DisableTrigger(legacyTrigger)
    TriggerClearConditions(legacyTrigger)
    TriggerClearActions(legacyTrigger)
  }
}

/**
 * 用 TS 新建触发器替换全局句柄。
 */
export function replaceGlobalTrigger(globalName: string, triggerHandle: trigger): void {
  disableLegacyTrigger(globalName)
  writeMappedGlobal(globalName, triggerHandle)
}

/**
 * 读取全局变量（含 JASS 全局函数）。
 */
export function getGlobal<T>(name: string): T | undefined {
  return readMappedGlobal(name) as T | undefined
}

/**
 * 写入全局变量。
 */
export function setGlobal(name: string, value: unknown): void {
  writeMappedGlobal(name, value)
}

/**
 * 为全玩家注册玩家单位事件（行为等价 TriggerRegisterAnyUnitEventBJ）。
 */
export function registerPlayerUnitEventAll(triggerHandle: trigger, eventId: playerunitevent): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), eventId, null)
  }
}

/**
 * 确保“任意单位受伤”总线已初始化。
 *
 * 说明：
 * - 1.27a 没有原生的“全玩家单位受伤”玩家单位事件可用（YDWE 原图用 EVENT_UNIT_DAMAGED + 全图枚举/进图注册实现）。
 * - 这里复刻同样的分发机制：一个统一的 `EVENT_UNIT_DAMAGED` 触发器负责接收事件，再依次 Evaluate/Execute 已注册的子触发器。
 */
function ensureAnyUnitDamagedDispatcher(): void {
  if (anyUnitDamagedDispatcher) {
    return
  }

  anyUnitDamagedDispatcher = CreateTrigger()
  TriggerAddAction(anyUnitDamagedDispatcher, () => {
    for (let i = 0; i < anyUnitDamagedTriggers.length; i++) {
      const t = anyUnitDamagedTriggers[i]
      if (t && IsTriggerEnabled(t) && TriggerEvaluate(t)) {
        TriggerExecute(t)
      }
    }
  })

  const registerUnit = (unitHandle: unit | undefined) => {
    if (!unitHandle || !anyUnitDamagedDispatcher) {
      return
    }
    // 跳过蝗虫单位（原图同样跳过）。
    if (GetUnitAbilityLevel(unitHandle, FourCC("Aloc")) > 0) {
      return
    }
    const uid = GetHandleId(unitHandle)
    if (!uid || anyUnitDamagedUnitSet[uid]) {
      return
    }
    anyUnitDamagedUnitSet[uid] = true
    TriggerRegisterUnitEvent(anyUnitDamagedDispatcher, unitHandle, EVENT_UNIT_DAMAGED())
  }

  const world = GetWorldBounds()
  // 【同步加固】
  GroupClear(SYNC_TEMP_GROUP)
  GroupEnumUnitsInRect(SYNC_TEMP_GROUP, world, null)
  ForGroup(SYNC_TEMP_GROUP, () => registerUnit(GetEnumUnit()))
  GroupClear(SYNC_TEMP_GROUP)

  anyUnitDamagedRegion = CreateRegion()
  RegionAddRect(anyUnitDamagedRegion, world)
  anyUnitDamagedEnterTrigger = CreateTrigger()
  TriggerRegisterEnterRegion(anyUnitDamagedEnterTrigger, anyUnitDamagedRegion, null)
  TriggerAddAction(anyUnitDamagedEnterTrigger, () => {
    registerUnit(GetTriggerUnit())
  })
}

/**
 * 注册任意单位受伤事件（通过总线分发，行为等价于 YDWE 的 AnyUnitDamaged 事件）。
 */
export function registerAnyUnitDamagedEvent(triggerHandle: trigger): void {
  ensureAnyUnitDamagedDispatcher()
  const tid = GetHandleId(triggerHandle)
  if (!tid || anyUnitDamagedTriggerSet[tid]) {
    return
  }
  anyUnitDamagedTriggerSet[tid] = true
  anyUnitDamagedTriggers.push(triggerHandle)
}

/**
 * 生成能力字段缓存键。
 */
function getAbilityDataKey(whichUnit: unit, abilityId: number, level: number, field: number): string {
  return `${GetHandleId(whichUnit)}:${abilityId}:${level}:${field}`
}

/**
 * 读取单位能力句柄。
 */
function getUnitAbilityHandle(whichUnit: unit, abilityId: number): ability | undefined {
  const exGetUnitAbility = getGlobal<(whichUnitHandle: unit, abilityRawId: number) => ability>("EXGetUnitAbility")
  if (!exGetUnitAbility) {
    return undefined
  }
  const abilityHandle = exGetUnitAbility(whichUnit, abilityId)
  if (!abilityHandle) {
    return undefined
  }
  return abilityHandle
}

/**
 * 读取能力实数字段（优先 YDWE 包装，其次 EX 原生）。
 */
function readAbilityDataRealNative(whichUnit: unit, abilityId: number, level: number, field: number): number | undefined {
  const hasAbility = GetUnitAbilityLevel(whichUnit, abilityId) > 0 || getUnitAbilityHandle(whichUnit, abilityId) !== undefined
  if (!hasAbility) {
    return undefined
  }
  const safeLevel = Math.max(1, level)
  const ydweGetter = getGlobal<(whichUnitHandle: unit, abilityRawId: number, abilityLevel: number, fieldType: number) => number>(
    "YDWEGetUnitAbilityDataReal"
  )
  if (ydweGetter) {
    return ydweGetter(whichUnit, abilityId, safeLevel, field)
  }
  const abilityHandle = getUnitAbilityHandle(whichUnit, abilityId)
  const exGetter = getGlobal<(abilityHandle: ability, abilityLevel: number, fieldType: number) => number>("EXGetAbilityDataReal")
  if (!abilityHandle || !exGetter) {
    return undefined
  }
  return exGetter(abilityHandle, safeLevel, field)
}

/**
 * 写入能力实数字段（优先 YDWE 包装，其次 EX 原生）。
 */
function writeAbilityDataRealNative(whichUnit: unit, abilityId: number, level: number, field: number, value: number): void {
  const safeLevel = Math.max(1, level)
  const ydweSetter = getGlobal<(
    whichUnitHandle: unit,
    abilityRawId: number,
    abilityLevel: number,
    fieldType: number,
    fieldValue: number
  ) => boolean>("YDWESetUnitAbilityDataReal")
  if (ydweSetter) {
    ydweSetter(whichUnit, abilityId, safeLevel, field, value)
    return
  }
  const abilityHandle = getUnitAbilityHandle(whichUnit, abilityId)
  const exSetter = getGlobal<(
    abilityHandle: ability,
    abilityLevel: number,
    fieldType: number,
    fieldValue: number
  ) => boolean>("EXSetAbilityDataReal")
  if (!abilityHandle || !exSetter) {
    return
  }
  exSetter(abilityHandle, safeLevel, field, value)
}

/**
 * 写入能力字符串字段（优先 YDWE 包装，其次 EX 原生）。
 */
function writeAbilityDataStringNative(whichUnit: unit, abilityId: number, level: number, field: number, value: string): void {
  const safeLevel = Math.max(1, level)
  const ydweSetter = getGlobal<(
    whichUnitHandle: unit,
    abilityRawId: number,
    abilityLevel: number,
    fieldType: number,
    fieldValue: string
  ) => boolean>("YDWESetUnitAbilityDataString")
  if (ydweSetter) {
    ydweSetter(whichUnit, abilityId, safeLevel, field, value)
    return
  }
  const abilityHandle = getUnitAbilityHandle(whichUnit, abilityId)
  const exSetter = getGlobal<(
    abilityHandle: ability,
    abilityLevel: number,
    fieldType: number,
    fieldValue: string
  ) => boolean>("EXSetAbilityDataString")
  if (!abilityHandle || !exSetter) {
    return
  }
  exSetter(abilityHandle, safeLevel, field, value)
}

/**
 * 读取能力状态字段（优先 YDWE 包装，其次 EX 原生）。
 */
function readAbilityStateNative(whichUnit: unit, abilityId: number, field: number): number | undefined {
  const hasAbility = GetUnitAbilityLevel(whichUnit, abilityId) > 0 || getUnitAbilityHandle(whichUnit, abilityId) !== undefined
  if (!hasAbility) {
    return undefined
  }
  const ydweGetter = getGlobal<(whichUnitHandle: unit, abilityRawId: number, stateType: number) => number>("YDWEGetUnitAbilityState")
  if (ydweGetter) {
    return ydweGetter(whichUnit, abilityId, field)
  }
  const abilityHandle = getUnitAbilityHandle(whichUnit, abilityId)
  const exGetter = getGlobal<(abilityHandle: ability, stateType: number) => number>("EXGetAbilityState")
  if (!abilityHandle || !exGetter) {
    return undefined
  }
  return exGetter(abilityHandle, field)
}

/**
 * 读取能力实数字段（优先读取真实技能对象，缓存仅做兜底）。
 */
export function getAbilityDataRealValue(whichUnit: unit, abilityId: number, level: number, field: number, fallback: number): number {
  const key = getAbilityDataKey(whichUnit, abilityId, level, field)
  const value = abilityRealOverrideMap[key]
  if (value !== undefined) {
    return value
  }
  const nativeValue = readAbilityDataRealNative(whichUnit, abilityId, level, field)
  if (nativeValue !== undefined && nativeValue === nativeValue) {
    return nativeValue
  }
  return fallback
}

/**
 * 写入能力实数字段并回写到真实技能对象。
 */
export function setAbilityDataRealValue(whichUnit: unit, abilityId: number, level: number, field: number, value: number): void {
  const key = getAbilityDataKey(whichUnit, abilityId, level, field)
  abilityRealOverrideMap[key] = value
  writeAbilityDataRealNative(whichUnit, abilityId, level, field, value)
}

/**
 * 写入能力字符串字段并回写到真实技能对象。
 */
export function setAbilityDataStringValue(whichUnit: unit, abilityId: number, level: number, field: number, value: string): void {
  const key = getAbilityDataKey(whichUnit, abilityId, level, field)
  abilityStringOverrideMap[key] = value
  writeAbilityDataStringNative(whichUnit, abilityId, level, field, value)
}

/**
 * 读取能力状态字段。
 */
export function getAbilityStateValue(whichUnit: unit, abilityId: number, field: number, fallback: number): number {
  const stateValue = readAbilityStateNative(whichUnit, abilityId, field)
  if (stateValue !== undefined && stateValue === stateValue) {
    return stateValue
  }
  return fallback
}

/**
 * 同事件改写本次伤害值（优先 EXSetEventDamage / BlzSetEventDamage）。
 */
export function overrideCurrentEventDamage(nextDamage: number): boolean {
  const damage = nextDamage < 0.0 ? 0.0 : nextDamage
  const exSetEventDamage = getGlobal<(damageValue: number) => void>("EXSetEventDamage")
  if (exSetEventDamage) {
    exSetEventDamage(damage)
    return true
  }
  const blzSetEventDamage = getGlobal<(damageValue: number) => void>("BlzSetEventDamage")
  if (blzSetEventDamage) {
    blzSetEventDamage(damage)
    return true
  }
  return false
}

/**
 * 检查 YDWE 伤害加成能力是否可用于 fallback（YDb0..YDbm + YDbn）。
 */
function isAttackBonusAbilityFallbackAvailable(): boolean {
  if (attackBonusAbilityFallbackAvailable !== undefined) {
    return attackBonusAbilityFallbackAvailable
  }
  const objectName = GetObjectName(ATTACK_BONUS_BIT_ABILITY_IDS[0])
  attackBonusAbilityFallbackAvailable = objectName !== ""
  return attackBonusAbilityFallbackAvailable
}

/**
 * 通过 YDWE 二进制加成能力写入攻击加成（面板绿字）。
 */
function applyAttackBonusAbilityFallback(whichUnit: unit, amount: number): boolean {
  if (!isAttackBonusAbilityFallbackAvailable()) {
    return false
  }
  let remaining = amount
  UnitRemoveAbility(whichUnit, ATTACK_BONUS_SIGN_ABILITY_ID)
  for (let i = ATTACK_BONUS_BIT_ABILITY_IDS.length - 1; i >= 0; i--) {
    const abilityId = ATTACK_BONUS_BIT_ABILITY_IDS[i]
    const bitValue = 1 << i
    if (remaining >= bitValue) {
      UnitAddAbility(whichUnit, abilityId)
      UnitMakeAbilityPermanent(whichUnit, true, abilityId)
      remaining -= bitValue
    } else {
      UnitRemoveAbility(whichUnit, abilityId)
    }
  }
  return true
}

/**
 * 兼容属性系统增减（op:0=增加，op:1=移除）。
 */
export function applyUnitBonus(whichUnit: unit, attr: number, op: number, value: number): void {
  const amount = R2I(Math.abs(value))
  if (amount <= 0) {
    return
  }

  const ydweBonusSetter = getGlobal<(unitHandle: unit, bonusType: number, mod: number, amountValue: number) => void>(
    "YDWEGeneralBounsSystemUnitSetBonus"
  )
  if (ydweBonusSetter) {
    ydweBonusSetter(whichUnit, attr, op, amount)
    return
  }

  const delta = op === 1 ? -amount : amount
  if (delta === 0) {
    return
  }
  if (attr === 0) {
    const currentMaxLife = GetUnitState(whichUnit, UNIT_STATE_MAX_LIFE())
    const nextMaxLife = Math.max(1.0, currentMaxLife + delta)
    SetUnitState(whichUnit, UNIT_STATE_MAX_LIFE(), nextMaxLife)
    SetWidgetLife(whichUnit, Math.min(nextMaxLife, GetWidgetLife(whichUnit) + Math.max(0.0, delta)))
    return
  }
  if (attr === 1) {
    const currentMaxMana = GetUnitState(whichUnit, UNIT_STATE_MAX_MANA())
    const nextMaxMana = Math.max(0.0, currentMaxMana + delta)
    SetUnitState(whichUnit, UNIT_STATE_MAX_MANA(), nextMaxMana)
    SetUnitState(whichUnit, UNIT_STATE_MANA(), Math.min(nextMaxMana, GetUnitState(whichUnit, UNIT_STATE_MANA())))
    return
  }
  if (attr === 2) {
    const getArmor = getGlobal<(unitHandle: unit) => number>("BlzGetUnitArmor")
    const setArmor = getGlobal<(unitHandle: unit, armor: number) => void>("BlzSetUnitArmor")
    if (getArmor && setArmor) {
      setArmor(whichUnit, getArmor(whichUnit) + delta)
      return
    }
    if (!hasWarnedArmorFallback) {
      hasWarnedArmorFallback = true
      print("[migration] Missing BlzSetUnitArmor/BlzGetUnitArmor, armor bonus fallback disabled")
    }
    return
  }
  if (attr === 3) {
    const unitId = GetHandleId(whichUnit)
    if (!unitId) {
      return
    }
    const current = unitAttackBonusFallbackMap[unitId] ?? 0
    const next = Math.max(0, current + delta)
    unitAttackBonusFallbackMap[unitId] = next
    if (applyAttackBonusAbilityFallback(whichUnit, next)) {
      return
    }
    return
  }
  if (!hasWarnedBonusAttrFallback) {
    hasWarnedBonusAttrFallback = true
    print("[migration] Unsupported bonus attr in fallback layer: " + I2S(attr))
  }
}

/**
 * 读取 fallback 层维护的攻击加成（仅在缺少 YDWE bonus 系统时生效）。
 */
export function getFallbackAttackBonus(whichUnit: unit): number {
  if (isAttackBonusAbilityFallbackAvailable()) {
    return 0
  }
  const unitId = GetHandleId(whichUnit)
  if (!unitId) {
    return 0
  }
  return unitAttackBonusFallbackMap[unitId] ?? 0
}

/**
 * 启动“近期攻击”追踪：用于在缺少 EX 伤害上下文时近似判断当前伤害是否来自普攻。
 */
function ensureRecentAttackTracker(): void {
  if (attackTraceInitialized) {
    return
  }
  attackTraceInitialized = true
  attackTraceTimer = CreateTimer()
  TimerStart(attackTraceTimer, 2147483.0, false, () => {
    attackTraceInitialized = false
    attackTraceTimer = undefined
  })

  const attackTraceTrigger = CreateTrigger()
  registerPlayerUnitEventAll(attackTraceTrigger, EVENT_PLAYER_UNIT_ATTACKED())
  TriggerAddAction(attackTraceTrigger, () => {
    const source = GetAttacker()
    const target = GetTriggerUnit()
    const sourceId = GetHandleId(source)
    const targetId = GetHandleId(target)
    if (!sourceId || !targetId || !attackTraceTimer) {
      return
    }
    recentAttackMap[`${sourceId}:${targetId}`] = {
      expiresAt: TimerGetElapsed(attackTraceTimer) + 0.40,
      ranged: IsUnitType(source, UNIT_TYPE_RANGED_ATTACKER())
    }
  })
}

/**
 * 手动标记一次“近期攻击”窗口。
 * 适用于脚本技能希望复用普攻判定链（会心、闪避、反击等）的场景。
 */
export function markRecentAttackInfo(source: unit, target: unit, ranged: boolean = false, duration: number = 0.40): void {
  ensureRecentAttackTracker()
  if (!attackTraceTimer) {
    return
  }
  const sourceId = GetHandleId(source)
  const targetId = GetHandleId(target)
  if (!sourceId || !targetId) {
    return
  }
  recentAttackMap[`${sourceId}:${targetId}`] = {
    expiresAt: TimerGetElapsed(attackTraceTimer) + Math.max(0.03, duration),
    ranged
  }
}

/**
 * 查询“近期攻击”信息，用于受伤事件中判断是否来自普攻。
 */
export function getRecentAttackInfo(source: unit, target: unit): { isAttack: boolean; isRanged: boolean } {
  ensureRecentAttackTracker()
  if (!attackTraceTimer) {
    return { isAttack: false, isRanged: false }
  }
  const sourceId = GetHandleId(source)
  const targetId = GetHandleId(target)
  if (!sourceId || !targetId) {
    return { isAttack: false, isRanged: false }
  }
  const key = `${sourceId}:${targetId}`
  const entry = recentAttackMap[key]
  if (!entry) {
    return { isAttack: false, isRanged: false }
  }
  const now = TimerGetElapsed(attackTraceTimer)
  if (entry.expiresAt < now) {
    delete recentAttackMap[key]
    return { isAttack: false, isRanged: false }
  }
  return { isAttack: true, isRanged: entry.ranged }
}

/**
 * 判断是否为 1-4 号雇佣兵玩家。
 */
export function isHumanMercenaryPlayer(whichPlayer: player): boolean {
  return (
    whichPlayer === Player(0) ||
    whichPlayer === Player(1) ||
    whichPlayer === Player(2) ||
    whichPlayer === Player(3)
  )
}

/**
 * 向 1~4 号雇佣兵玩家广播文本。
 */
export function displayTextToMercenaryPlayers(message: string): void {
  for (let i = 0; i < 4; i++) {
    DisplayTextToPlayer(Player(i), 0, 0, message)
  }
}

/**
 * 向 1~4 号雇佣兵玩家广播限时文本。
 */
export function displayTimedTextToMercenaryPlayers(duration: number, message: string): void {
  for (let i = 0; i < 4; i++) {
    DisplayTimedTextToPlayer(Player(i), 0, 0, duration, message)
  }
}

/**
 * 基于游戏时间判断白昼/黑夜（本图 12:00~24:00 为白昼）。
 */
export function isDayTimeFromHashtable(): boolean {
  return GetFloatGameState(GAME_STATE_TIME_OF_DAY()) >= 12.0
}

/**
 * 为全玩家注册聊天事件（行为等价于逐个 TriggerRegisterPlayerChatEvent）。
 */
export function registerPlayerChatEventAll(triggerHandle: trigger, chatText: string, exactMatchOnly: boolean): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerChatEvent(triggerHandle, Player(i), chatText, exactMatchOnly)
  }
}

/**
 * 在单位背包中查找指定类型物品。
 */
export function findItemInInventory(unitHandle: unit, itemTypeId: number): item | undefined {
  for (let slot = 0; slot < 6; slot++) {
    const itemHandle = UnitItemInSlot(unitHandle, slot)
    if (itemHandle && GetItemTypeId(itemHandle) === itemTypeId) {
      return itemHandle
    }
  }
  return undefined
}

/**
 * 统计单位背包中指定类型物品数量。
 */
export function countItemInInventory(unitHandle: unit, itemTypeId: number): number {
  let count = 0
  for (let slot = 0; slot < 6; slot++) {
    const itemHandle = UnitItemInSlot(unitHandle, slot)
    if (itemHandle && GetItemTypeId(itemHandle) === itemTypeId) {
      count++
    }
  }
  return count
}

/**
 * 读取单位当前“概率坍缩”额外概率（单位绑定）。
 */
export function getUnitCraftCollapseBonus(unitHandle: unit): number {
  const unitId = GetHandleId(unitHandle)
  if (!unitId) {
    return 0
  }
  return unitCraftCollapseBonusMap[unitId] ?? 0
}

/**
 * 成功后清空单位“概率坍缩”额外概率。
 */
export function resetUnitCraftCollapseBonus(unitHandle: unit): void {
  const unitId = GetHandleId(unitHandle)
  if (!unitId) {
    return
  }
  delete unitCraftCollapseBonusMap[unitId]
}

/**
 * 失败后按基础成功率递增额外概率，越低基础概率递增越快。
 */
export function increaseUnitCraftCollapseBonus(unitHandle: unit, baseSuccessRate: number): number {
  const unitId = GetHandleId(unitHandle)
  if (!unitId) {
    return 0
  }
  const currentBonus = unitCraftCollapseBonusMap[unitId] ?? 0
  const increase = Math.max(3, Math.floor((100 - baseSuccessRate) / 8))
  const nextBonus = Math.min(100, currentBonus + increase)
  unitCraftCollapseBonusMap[unitId] = nextBonus
  return nextBonus
}

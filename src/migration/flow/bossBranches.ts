import {
  EVENT_UNIT_ATTACKED,
  EVENT_UNIT_DEATH,
  EVENT_UNIT_TARGET_IN_RANGE,
  UNIT_STATE_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_STRUCTURE,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  displayTimedTextToMercenaryPlayers,
  getAbilityStateValue,
  getGlobal,
  replaceGlobalTrigger,
  setAbilityDataRealValue,
  setGlobal
} from "../core/helpers"

const BASE_RECT_GLOBAL = "gg_rct_base_area"
const ENEMYCOMING_TRIGGER_GLOBAL = "gg_trg_enemycoming"

const BOSS_COUNT_GLOBAL = "udg_bosscnt"
const BOSS_PROPERTY_GLOBAL = "udg_boss_property"
const BOSS_WAVE_GLOBAL = "udg_bosswave"
const BASE_WAVE_TIME_GLOBAL = "udg_base_wave_time"
const WAVE_INTERVAL_REDUCTION_GLOBAL = "udg_wave_interval_reduction"
const DIFFICULTY_GLOBAL = "udg_difficulty"
const ENEMY_WAVE_COUNT_GLOBAL = "udg_enemywaveCount"

const REWARD_ITEMS = [FourCC("I02H"), FourCC("I02I"), FourCC("I02J"), FourCC("I02K")]
const BASE_DROP_ITEM_ID = FourCC("I00D")
const DEFEAT_EFFECT_MODEL = "Abilities\\Spells\\Orc\\EtherealForm\\SpiritWalkerChange.mdl"

const ZOMBIE_AURA_ABILITY_ID = FourCC("A07I")
const SLIME_TRIGGER_ABILITY_ID = FourCC("A07Q")

interface BossAiOrder {
  orderId: number
  orderType: number
  abilityName?: string
  targetOrder?: string
  probability: number
}

interface BossAbilityScale {
  abilityId: number
  factor: number
}

interface BossBranchConfig {
  triggerGlobal: string
  bossGlobal: string
  specialDropItemId?: number
  defeatMessageDuration: number
  defeatMessageText: string
  attackMessageTimed: boolean
  attackMessageDuration?: number
  aiEventType?: 0 | 1
  aiOrders: BossAiOrder[]
  abilityScale?: BossAbilityScale
  onSpawn?: (state: BossBranchState) => void
  onTick?: (state: BossBranchState) => void
  isDefeated?: (state: BossBranchState) => boolean
}

interface BossBranchState {
  boss: unit
  stage: number
  timer: timer
  companion?: unit
  aiTrigger?: trigger
}

/**
 * 延迟执行目标触发器。
 */
function runTriggerAfter(delay: number, triggerGlobal: string): void {
  const targetTrigger = getGlobal<trigger>(triggerGlobal)
  if (!targetTrigger) {
    print("Missing trigger: " + triggerGlobal)
    return
  }
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    TriggerExecute(targetTrigger)
    DestroyTimer(timerHandle)
  })
}

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(effectHandle: effect, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 计算随机偏移坐标点。
 */
function randomOffsetPoint(x: number, y: number, distance: number): [number, number] {
  const degrees = GetRandomReal(0.0, 360.0)
  const radians = (degrees * math.pi) / 180
  return [x + distance * math.cos(radians), y + distance * math.sin(radians)]
}

/**
 * 统一激活 Boss（显形、可受伤、解除暂停）。
 */
function activateBoss(boss: unit): void {
  ShowUnit(boss, true)
  SetUnitInvulnerable(boss, false)
  PauseUnit(boss, false)
}

/**
 * 命令 Boss 攻向基地。
 */
function issueAttackBaseOrder(boss: unit): void {
  const baseRect = getGlobal<rect>(BASE_RECT_GLOBAL)
  if (!baseRect) {
    return
  }
  IssuePointOrder(boss, "attack", GetRectCenterX(baseRect), GetRectCenterY(baseRect))
}

/**
 * 根据当前阶段发放阶段奖励。
 */
function grantStageReward(boss: unit, stage: number): void {
  if (stage > 0 && stage < 5) {
    UnitAddItem(boss, CreateItem(REWARD_ITEMS[stage - 1], GetUnitX(boss), GetUnitY(boss)))
  }
}

/**
 * 依据阶段重置 Boss 三围。
 */
function resetBossStatsByStage(boss: unit, stage: number): void {
  const bossProperty = getGlobal<number>(BOSS_PROPERTY_GLOBAL) ?? 0
  const value = stage * bossProperty
  SetHeroStr(boss, value, true)
  SetHeroAgi(boss, value, true)
  SetHeroInt(boss, value, true)
}

/**
 * 设置 Boss 蓝量为上限 5%。
 */
function setBossManaToFivePercent(boss: unit): void {
  const setManaPercent = getGlobal<(target: unit, percent: number) => void>("SetUnitManaPercentBJ")
  if (setManaPercent) {
    setManaPercent(boss, 5.0)
    return
  }
  SetUnitState(boss, UNIT_STATE_MANA(), GetUnitState(boss, UNIT_STATE_MAX_MANA()) * 0.05)
}

/**
 * 按配置写入 Boss 动态技能系数。
 */
function applyBossAbilityScale(boss: unit, stage: number, scale: BossAbilityScale | undefined): void {
  if (!scale) {
    return
  }
  setAbilityDataRealValue(boss, scale.abilityId, 1, 108, scale.factor * stage)
  SetUnitAbilityLevel(boss, scale.abilityId, 1)
}

/**
 * 为 Boss 追加 AI 指令模板。
 */
function pickBossAiOrder(aiOrders: BossAiOrder[]): BossAiOrder | undefined {
  const count = aiOrders.length
  if (count <= 0) {
    return undefined
  }
  const randomBucket = GetRandomInt(0, 100 * count)
  let selected: BossAiOrder | undefined
  for (let i = 0; i <= count; i++) {
    const current = aiOrders[i]
    if (!current) {
      continue
    }
    const probability = math.max(0, math.min(100, current.probability))
    const rangeStart = 100 * i
    if (rangeStart <= randomBucket && randomBucket < rangeStart + probability) {
      selected = current
    }
  }
  return selected
}

/**
 * 根据订单类型下发技能指令。
 */
function issueBossAiOrder(boss: unit, aiOrder: BossAiOrder, eventTarget: unit | undefined): void {
  const order = aiOrder.targetOrder ?? aiOrder.abilityName
  if (!order) {
    return
  }
  if (aiOrder.orderType === 1) {
    if (!eventTarget) {
      return
    }
    IssueTargetOrder(boss, order, eventTarget)
    return
  }
  if (aiOrder.orderType === 2) {
    if (!eventTarget) {
      return
    }
    IssuePointOrder(boss, order, GetUnitX(eventTarget), GetUnitY(eventTarget))
    return
  }
  if (aiOrder.orderType === 3) {
    IssueImmediateOrder(boss, order)
    return
  }
  if (aiOrder.orderType === 4) {
    IssueTargetOrder(boss, order, boss)
  }
}

/**
 * 注册 Boss 事件驱动 AI（对齐 YDWEAddAIOrder 语义）。
 */
function registerBossAiDispatcher(boss: unit, aiOrders: BossAiOrder[], eventType: 0 | 1): trigger | undefined {
  if (aiOrders.length <= 0) {
    return undefined
  }
  const aiTrigger = CreateTrigger()
  if (eventType === 1) {
    TriggerRegisterUnitEvent(aiTrigger, boss, EVENT_UNIT_TARGET_IN_RANGE())
  } else {
    TriggerRegisterUnitEvent(aiTrigger, boss, EVENT_UNIT_ATTACKED())
  }
  TriggerAddAction(aiTrigger, () => {
    if (GetWidgetLife(boss) <= 0.405) {
      return
    }
    const aiOrder = pickBossAiOrder(aiOrders)
    if (!aiOrder) {
      return
    }
    issueBossAiOrder(boss, aiOrder, GetEventTargetUnit())
  })
  return aiTrigger
}

/**
 * 难度大于 1 时每轮成长 1 点三围。
 */
function growBossStatsByDifficulty(boss: unit): void {
  if ((getGlobal<number>(DIFFICULTY_GLOBAL) ?? 1) <= 1) {
    return
  }
  SetHeroStr(boss, GetHeroStr(boss, false) + 1, true)
  SetHeroAgi(boss, GetHeroAgi(boss, false) + 1, true)
  SetHeroInt(boss, GetHeroInt(boss, false) + 1, true)
}

/**
 * Boss 死亡结算：掉落、波次回写与下一波启动。
 */
function handleBossDefeated(boss: unit, specialDropItemId: number | undefined, messageDuration: number, messageText: string): void {
  const bossX = GetUnitX(boss)
  const bossY = GetUnitY(boss)
  const defeatEffect = AddSpecialEffect(DEFEAT_EFFECT_MODEL, bossX, bossY)
  destroyEffectLater(defeatEffect, 2.0)

  const [drop1X, drop1Y] = randomOffsetPoint(bossX, bossY, 256.0)
  const [drop2X, drop2Y] = randomOffsetPoint(bossX, bossY, 256.0)
  CreateItem(BASE_DROP_ITEM_ID, drop1X, drop1Y)
  CreateItem(BASE_DROP_ITEM_ID, drop2X, drop2Y)

  if (specialDropItemId !== undefined && GetRandomInt(1, 100) <= 33) {
    CreateItem(specialDropItemId, bossX, bossY)
  }

  setGlobal(BOSS_WAVE_GLOBAL, false)
  const currentWave = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? 0
  if (currentWave > 0) {
    setGlobal(ENEMY_WAVE_COUNT_GLOBAL, currentWave + 1)
  }
  const baseWaveTime = getGlobal<number>(BASE_WAVE_TIME_GLOBAL) ?? 0
  const waveReduction = getGlobal<number>(WAVE_INTERVAL_REDUCTION_GLOBAL) ?? 0
  setGlobal(BASE_WAVE_TIME_GLOBAL, baseWaveTime - waveReduction)

  displayTimedTextToMercenaryPlayers(messageDuration, messageText)
  runTriggerAfter(2.0, ENEMYCOMING_TRIGGER_GLOBAL)
}

/**
 * 注册单个 Boss 分支触发器（Captain/Mana/Arrow/Zombie/Slime/Sea God）。
 */
function registerBossBranchTrigger(config: BossBranchConfig): void {
  disableLegacyTrigger(config.triggerGlobal)
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    const boss = getGlobal<unit>(config.bossGlobal)
    if (!boss) {
      print("Missing boss unit: " + config.bossGlobal)
      return
    }

    const stage = getGlobal<number>(BOSS_COUNT_GLOBAL) ?? 0
    const state: BossBranchState = {
      boss,
      stage,
      timer: CreateTimer()
    }

    activateBoss(state.boss)
    issueAttackBaseOrder(state.boss)
    grantStageReward(state.boss, state.stage)
    resetBossStatsByStage(state.boss, state.stage)
    SetUnitState(state.boss, UNIT_STATE_LIFE(), GetUnitState(state.boss, UNIT_STATE_MAX_LIFE()))
    config.onSpawn?.(state)
    applyBossAbilityScale(state.boss, state.stage, config.abilityScale)
    state.aiTrigger = registerBossAiDispatcher(state.boss, config.aiOrders, config.aiEventType ?? 1)
    setBossManaToFivePercent(state.boss)

    if (config.attackMessageTimed) {
      displayTimedTextToMercenaryPlayers(config.attackMessageDuration ?? 10.0, "|cffffcc00强敌已进攻|r")
    } else {
      displayTextToMercenaryPlayers("|cffffcc00强敌已进攻|r")
    }
    setGlobal(BOSS_COUNT_GLOBAL, state.stage + 1)

    // 【加固】将死亡判定从 5.0 秒的轮询计时器中抽离，改为纯同步的死亡事件驱动
    const deathTrigger = CreateTrigger()
    TriggerRegisterUnitEvent(deathTrigger, state.boss, EVENT_UNIT_DEATH())
    TriggerAddAction(deathTrigger, () => {
      if (state.aiTrigger) {
        DestroyTrigger(state.aiTrigger)
        state.aiTrigger = undefined
      }
      handleBossDefeated(state.boss, config.specialDropItemId, config.defeatMessageDuration, config.defeatMessageText)
      DestroyTimer(state.timer)
      DestroyTrigger(deathTrigger)
    })

    TimerStart(state.timer, 5.0, true, () => {
      issueAttackBaseOrder(state.boss)
      config.onTick?.(state)

      // 如果有特殊的击败判定（如僵尸联动），才在轮询中处理自定义死亡逻辑（不杀本体但视为击败）
      if (config.isDefeated && config.isDefeated(state)) {
        if (state.aiTrigger) {
          DestroyTrigger(state.aiTrigger)
          state.aiTrigger = undefined
        }
        handleBossDefeated(state.boss, config.specialDropItemId, config.defeatMessageDuration, config.defeatMessageText)
        DestroyTimer(state.timer)
        DestroyTrigger(deathTrigger)
        return
      }

      growBossStatsByDifficulty(state.boss)
    })
  })
  replaceGlobalTrigger(config.triggerGlobal, triggerHandle)
}

/**
 * Captain 分支。
 */
function registerCaptainTrigger(): void {
  registerBossBranchTrigger({
    triggerGlobal: "gg_trg_Captain",
    bossGlobal: "gg_unit_O004_0108",
    specialDropItemId: FourCC("I030"),
    defeatMessageDuration: 60.0,
    defeatMessageText: "|cffff0000敌将的陨落彻底激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r",
    attackMessageTimed: true,
    attackMessageDuration: 10.0,
    aiEventType: 1,
    aiOrders: [
      { orderId: 1, orderType: 3, targetOrder: "fanofknives", probability: 50 },
      { orderId: 1, orderType: 3, targetOrder: "spiritwolf", probability: 50 }
    ]
  })
}

/**
 * Mana_ruin 分支。
 */
function registerManaRuinTrigger(): void {
  registerBossBranchTrigger({
    triggerGlobal: "gg_trg_Mana_ruin",
    bossGlobal: "gg_unit_E005_0110",
    defeatMessageDuration: 60.0,
    defeatMessageText: "|cffff0000敌将的陨落彻底激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r",
    attackMessageTimed: false,
    aiEventType: 1,
    aiOrders: [
      { orderId: 1, orderType: 3, targetOrder: "stomp", probability: 50 },
      { orderId: 1, orderType: 3, abilityName: "banish", probability: 50 }
    ]
  })
}

/**
 * Arrow_Shooter 分支。
 */
function registerArrowShooterTrigger(): void {
  registerBossBranchTrigger({
    triggerGlobal: "gg_trg_Arrow_Shooter",
    bossGlobal: "gg_unit_H00F_0256",
    specialDropItemId: FourCC("I031"),
    defeatMessageDuration: 60.0,
    defeatMessageText: "|cffff0000敌将的陨落彻底激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r",
    attackMessageTimed: true,
    attackMessageDuration: 10.0,
    aiEventType: 1,
    abilityScale: {
      abilityId: FourCC("A07J"),
      factor: 333.0
    },
    aiOrders: [
      { orderId: 1, orderType: 3, targetOrder: "fanofknives", probability: 30 },
      { orderId: 0, orderType: 3, targetOrder: "mirrorimage", probability: 100 }
    ]
  })
}

/**
 * Zombie 分支（附带墓碑随从联动）。
 */
function registerZombieTrigger(): void {
  registerBossBranchTrigger({
    triggerGlobal: "gg_trg_Zombie",
    bossGlobal: "gg_unit_U006_0255",
    specialDropItemId: FourCC("I02V"),
    defeatMessageDuration: 60.0,
    defeatMessageText: "|cffff0000敌将的陨落彻底激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r",
    attackMessageTimed: false,
    aiEventType: 1,
    onSpawn: (state) => {
      const tombRect = getGlobal<rect>("gg_rct_tombs")
      if (!tombRect) {
        return
      }
      state.companion = CreateUnit(Player(11), FourCC("u008"), GetRectCenterX(tombRect), GetRectCenterY(tombRect), bj_UNIT_FACING)
    },
    onTick: (state) => {
      if (state.companion && GetWidgetLife(state.companion) <= 0.405) {
        UnitRemoveAbility(state.boss, ZOMBIE_AURA_ABILITY_ID)
      }
    },
    isDefeated: (state) => {
      if (!state.companion) {
        return GetWidgetLife(state.boss) <= 0.405
      }
      return GetWidgetLife(state.boss) <= 0.405 && GetWidgetLife(state.companion) <= 0.405
    },
    aiOrders: [
      { orderId: 1, orderType: 3, targetOrder: "spiritwolf", probability: 50 },
      { orderId: 1, orderType: 3, targetOrder: "thunderclap", probability: 50 }
    ]
  })
}

/**
 * Slime 分支（半血后尝试死亡契约吞友军）。
 */
function registerSlimeTrigger(): void {
  registerBossBranchTrigger({
    triggerGlobal: "gg_trg_Slime",
    bossGlobal: "gg_unit_U00B_0258",
    specialDropItemId: FourCC("I02X"),
    defeatMessageDuration: 60.0,
    defeatMessageText: "|cffff0000敌将的陨落激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r",
    attackMessageTimed: true,
    attackMessageDuration: 10.0,
    aiEventType: 1,
    onSpawn: (state) => {
      RemoveGuardPosition(state.boss)
    },
    onTick: (state) => {
      const lifePercent = (GetWidgetLife(state.boss) / math.max(1.0, GetUnitState(state.boss, UNIT_STATE_MAX_LIFE()))) * 100.0
      if (lifePercent > 50.0 || getAbilityStateValue(state.boss, SLIME_TRIGGER_ABILITY_ID, 1, 0.0) !== 0.0) {
        return
      }
      const groupHandle = CreateGroup()
      GroupEnumUnitsInRange(groupHandle, GetUnitX(state.boss), GetUnitY(state.boss), 1000.0, null)
      ForGroup(groupHandle, () => {
        const enumUnit = GetEnumUnit()
        if (GetOwningPlayer(enumUnit) === GetOwningPlayer(state.boss)) {
          IssueTargetOrder(state.boss, "deathpact", enumUnit)
        }
      })
      DestroyGroup(groupHandle)
    },
    aiOrders: [
      { orderId: 1, orderType: 1, abilityName: "thunderbolt", probability: 30 },
      { orderId: 0, orderType: 3, targetOrder: "waterelemental", probability: 100 }
    ]
  })
}

/**
 * Sea_God 分支。
 */
function registerSeaGodTrigger(): void {
  registerBossBranchTrigger({
    triggerGlobal: "gg_trg_Sea_God",
    bossGlobal: "gg_unit_U00D_0259",
    defeatMessageDuration: 30.0,
    defeatMessageText: "|cffff0000敌将的陨落激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r",
    attackMessageTimed: true,
    attackMessageDuration: 10.0,
    aiEventType: 1,
    abilityScale: {
      abilityId: FourCC("A07S"),
      factor: 111.0
    },
    onSpawn: (state) => {
      RemoveGuardPosition(state.boss)
      UnitAddItemToSlotById(state.boss, FourCC("I02L"), 2)
    },
    aiOrders: [
      { orderId: 1, orderType: 1, abilityName: "entanglingroots", probability: 30 },
      { orderId: 1, orderType: 3, targetOrder: "avatar", probability: 30 },
      { orderId: 0, orderType: 3, targetOrder: "divineshield", probability: 30 }
    ]
  })
}

/**
 * 入口：迁移 Captain / Mana_ruin / Arrow_Shooter / Zombie / Slime / Sea_God。
 */
export function migrateBossBranchTriggers(): void {
  registerCaptainTrigger()
  registerManaRuinTrigger()
  registerArrowShooterTrigger()
  registerZombieTrigger()
  registerSlimeTrigger()
  registerSeaGodTrigger()
}

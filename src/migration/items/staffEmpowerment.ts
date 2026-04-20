import {
  ATTACK_TYPE_MAGIC,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_STATE_ATTACK_RANGE,
  UNIT_STATE_ATTACK_SPEED,
  UNIT_STATE_ATTACK_WHITE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  WEAPON_TYPE_WHOKNOWS
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { findItemInInventory, getGlobal, registerAnyUnitDamagedEvent, registerPlayerUnitEventAll } from "../core/helpers"

const STAFF_LV1_ITEM_ID = FourCC("I01S")
const STAFF_LV2_ITEM_ID = FourCC("I01T")
const STAFF_LV3_ITEM_ID = FourCC("I01U")
const STAFF_LV4_ITEM_ID = FourCC("I01V")
const STAFF_LV5_ITEM_ID = FourCC("I01W")

const LIGHTNING_STAFF_ACTIVE_ID = FourCC("A045")
const LIGHTNING_BASE_STUN_SECONDS = 2.5

const HELL_STEP_INT = 15
const HELL_MULTIPLIER_STEP = 1.05
const STAFF_MANA_SIPHON_EFFECT_PATH = "Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl"
const STAFF_MANA_SIPHON_EFFECT_ATTACH_POINT = "origin"
const STAFF_MANA_SIPHON_EFFECT_DURATION = 0.35

type StaffScalingState = {
  snakeSpeedBonus: number
  snakeRangeBonus: number
  hellAttackBonus: number
  hellArmorBonus: number
}

const staffScalingStateByUnitId: Record<number, StaffScalingState> = {}
const pendingLightningExtraStunByUnitId: Record<number, number> = {}
const hellMultiplierCache: number[] = [1.0]

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
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 仅将杖系强化应用在雇佣兵英雄（1~4 号玩家）上。
 */
function isMercenaryHero(unitHandle: unit): boolean {
  if (!IsUnitType(unitHandle, UNIT_TYPE_HERO())) {
    return false
  }
  const ownerId = GetPlayerId(GetOwningPlayer(unitHandle))
  return ownerId >= 0 && ownerId <= 3
}

/**
 * 读取法杖魔能汲取比例（按法杖等级递增）。
 */
function getStaffManaSiphonRate(unitHandle: unit): number {
  if (findItemInInventory(unitHandle, STAFF_LV5_ITEM_ID)) {
    return 0.05
  }
  if (findItemInInventory(unitHandle, STAFF_LV4_ITEM_ID)) {
    return 0.04
  }
  if (findItemInInventory(unitHandle, STAFF_LV3_ITEM_ID)) {
    return 0.03
  }
  if (findItemInInventory(unitHandle, STAFF_LV2_ITEM_ID)) {
    return 0.02
  }
  if (findItemInInventory(unitHandle, STAFF_LV1_ITEM_ID)) {
    return 0.01
  }
  return 0.0
}

/**
 * 按需扩展“地狱之杖”乘法表并返回倍率。
 */
function getHellMultiplier(stacks: number): number {
  let safeStacks = stacks
  if (safeStacks < 0) {
    safeStacks = 0
  }
  while (hellMultiplierCache.length <= safeStacks) {
    const last = hellMultiplierCache[hellMultiplierCache.length - 1]
    hellMultiplierCache.push(last * HELL_MULTIPLIER_STEP)
  }
  return hellMultiplierCache[safeStacks]
}

/**
 * 获取单位法杖动态加成状态。
 */
function getOrCreateStaffScalingState(unitId: number): StaffScalingState {
  const existing = staffScalingStateByUnitId[unitId]
  if (existing !== undefined) {
    return existing
  }
  const created: StaffScalingState = {
    snakeSpeedBonus: 0.0,
    snakeRangeBonus: 0.0,
    hellAttackBonus: 0.0,
    hellArmorBonus: 0.0
  }
  staffScalingStateByUnitId[unitId] = created
  return created
}

/**
 * 雷杖额外眩晕：在原始 2.5 秒眩晕结束后追加延长眩晕。
 */
function queueLightningExtraStun(target: unit, extraDuration: number): void {
  if (extraDuration <= 0.0) {
    return
  }
  const unitId = GetHandleId(target)
  if (!unitId) {
    return
  }
  const pending = pendingLightningExtraStunByUnitId[unitId] ?? 0.0
  pendingLightningExtraStunByUnitId[unitId] = pending + extraDuration
  if (pending > 0.0) {
    return
  }
  const delayTimer = CreateTimer()
  TimerStart(delayTimer, LIGHTNING_BASE_STUN_SECONDS, false, () => {
    DestroyTimer(delayTimer)
    const bonusDuration = pendingLightningExtraStunByUnitId[unitId] ?? 0.0
    delete pendingLightningExtraStunByUnitId[unitId]
    if (bonusDuration <= 0.0 || !isUnitAlive(target)) {
      return
    }
    PauseUnit(target, true)
    const releaseTimer = CreateTimer()
    TimerStart(releaseTimer, bonusDuration, false, () => {
      PauseUnit(target, false)
      DestroyTimer(releaseTimer)
    })
  })
}

/**
 * 注册“魔能汲取”：法杖造成伤害后按杖阶回复法力。
 */
function registerStaffManaSiphonTrigger(): void {
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetEventDamage() > 0.0))
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    const source = GetEventDamageSource()
    if (!source || !target) {
      return
    }
    if (!isMercenaryHero(source) || !isUnitAlive(source)) {
      return
    }
    if (!IsUnitEnemy(target, GetOwningPlayer(source))) {
      return
    }
    const siphonRate = getStaffManaSiphonRate(source)
    if (siphonRate <= 0.0) {
      return
    }
    const restoreMana = GetEventDamage() * siphonRate
    if (restoreMana <= 0.0) {
      return
    }
    const currentMana = GetUnitState(source, UNIT_STATE_MANA())
    const maxMana = GetUnitState(source, UNIT_STATE_MAX_MANA())
    const actualRestore = math.min(restoreMana, maxMana - currentMana)
    if (actualRestore <= 0.0) {
      return
    }
    SetUnitState(source, UNIT_STATE_MANA(), currentMana + actualRestore)
    const effectHandle = AddSpecialEffectTarget(
      STAFF_MANA_SIPHON_EFFECT_PATH,
      source,
      STAFF_MANA_SIPHON_EFFECT_ATTACH_POINT
    )
    destroyEffectLater(effectHandle, STAFF_MANA_SIPHON_EFFECT_DURATION)
  })
}

/**
 * 注册“雷杖共鸣”：主动额外伤害与智力追加眩晕。
 */
function registerLightningStaffTrigger(): void {
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const caster = GetTriggerUnit()
      const target = GetSpellTargetUnit()
      return (
        GetSpellAbilityId() === LIGHTNING_STAFF_ACTIVE_ID &&
        !!caster &&
        !!target &&
        isMercenaryHero(caster) &&
        !IsUnitType(target, UNIT_TYPE_DEAD()) &&
        !!findItemInInventory(caster, STAFF_LV3_ITEM_ID)
      )
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const target = GetSpellTargetUnit()
    if (!target) {
      return
    }
    const intelligence = GetHeroInt(caster, true)
    const extraDamage = intelligence * 0.5
    if (extraDamage > 0.0) {
      UnitDamageTarget(caster, target, extraDamage, false, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
    }

    const extraStunDuration = math.floor(intelligence / 100) * 0.2
    queueLightningExtraStun(target, extraStunDuration)
  })
}

/**
 * 蛇杖：按智力动态追加攻速与攻击范围。
 */
function updateSnakeStaffScaling(hero: unit, state: StaffScalingState, intelligence: number): void {
  const targetSpeedBonus = intelligence * 0.01
  const speedDiff = targetSpeedBonus - state.snakeSpeedBonus
  if (math.abs(speedDiff) > 0.0001) {
    SetUnitState(hero, UNIT_STATE_ATTACK_SPEED(), GetUnitState(hero, UNIT_STATE_ATTACK_SPEED()) + speedDiff)
    state.snakeSpeedBonus = targetSpeedBonus
  }

  const currentRange = GetUnitState(hero, UNIT_STATE_ATTACK_RANGE())
  const baseRange = math.max(1.0, currentRange - state.snakeRangeBonus)
  const targetRangeBonus = baseRange * intelligence * 0.01
  const rangeDiff = targetRangeBonus - state.snakeRangeBonus
  if (math.abs(rangeDiff) > 0.0001) {
    SetUnitState(hero, UNIT_STATE_ATTACK_RANGE(), math.max(1.0, currentRange + rangeDiff))
    state.snakeRangeBonus = targetRangeBonus
  }
}

/**
 * 地狱之杖：按智力分段指数提升攻击与护甲。
 */
function updateHellStaffScaling(hero: unit, state: StaffScalingState, intelligence: number): void {
  const stackCount = math.floor(intelligence / HELL_STEP_INT)
  const multiplier = getHellMultiplier(stackCount)
  const factor = multiplier - 1.0

  const currentAttack = GetUnitState(hero, UNIT_STATE_ATTACK_WHITE())
  const baseAttack = currentAttack - state.hellAttackBonus
  const targetAttackBonus = baseAttack * factor
  const attackDiff = targetAttackBonus - state.hellAttackBonus
  if (math.abs(attackDiff) > 0.0001) {
    SetUnitState(hero, UNIT_STATE_ATTACK_WHITE(), currentAttack + attackDiff)
    state.hellAttackBonus = targetAttackBonus
  }

  const getArmor = getGlobal<(unitHandle: unit) => number>("BlzGetUnitArmor")
  const setArmor = getGlobal<(unitHandle: unit, armor: number) => void>("BlzSetUnitArmor")
  if (!getArmor || !setArmor) {
    return
  }
  const currentArmor = getArmor(hero)
  const baseArmor = currentArmor - state.hellArmorBonus
  const targetArmorBonus = baseArmor * factor
  const armorDiff = targetArmorBonus - state.hellArmorBonus
  if (math.abs(armorDiff) > 0.0001) {
    setArmor(hero, currentArmor + armorDiff)
    state.hellArmorBonus = targetArmorBonus
  }
}

/**
 * 移除蛇杖动态加成。
 */
function clearSnakeStaffScaling(hero: unit, state: StaffScalingState): void {
  if (math.abs(state.snakeSpeedBonus) > 0.0001) {
    SetUnitState(hero, UNIT_STATE_ATTACK_SPEED(), GetUnitState(hero, UNIT_STATE_ATTACK_SPEED()) - state.snakeSpeedBonus)
    state.snakeSpeedBonus = 0.0
  }
  if (math.abs(state.snakeRangeBonus) > 0.0001) {
    SetUnitState(hero, UNIT_STATE_ATTACK_RANGE(), math.max(1.0, GetUnitState(hero, UNIT_STATE_ATTACK_RANGE()) - state.snakeRangeBonus))
    state.snakeRangeBonus = 0.0
  }
}

/**
 * 移除地狱之杖动态加成。
 */
function clearHellStaffScaling(hero: unit, state: StaffScalingState): void {
  if (math.abs(state.hellAttackBonus) > 0.0001) {
    SetUnitState(hero, UNIT_STATE_ATTACK_WHITE(), GetUnitState(hero, UNIT_STATE_ATTACK_WHITE()) - state.hellAttackBonus)
    state.hellAttackBonus = 0.0
  }
  if (math.abs(state.hellArmorBonus) > 0.0001) {
    const getArmor = getGlobal<(unitHandle: unit) => number>("BlzGetUnitArmor")
    const setArmor = getGlobal<(unitHandle: unit, armor: number) => void>("BlzSetUnitArmor")
    if (getArmor && setArmor) {
      setArmor(hero, getArmor(hero) - state.hellArmorBonus)
    }
    state.hellArmorBonus = 0.0
  }
}

/**
 * 刷新单个英雄的法杖智力加成状态。
 */
function updateStaffIntScalingForHero(hero: unit): void {
  const unitId = GetHandleId(hero)
  if (!unitId) {
    return
  }
  const state = getOrCreateStaffScalingState(unitId)
  const intelligence = math.max(0.0, GetHeroInt(hero, true))
  const hasSnakeStaff = !!findItemInInventory(hero, STAFF_LV4_ITEM_ID)
  const hasHellStaff = !!findItemInInventory(hero, STAFF_LV5_ITEM_ID)

  if (hasSnakeStaff) {
    updateSnakeStaffScaling(hero, state, intelligence)
  } else {
    clearSnakeStaffScaling(hero, state)
  }

  if (hasHellStaff) {
    updateHellStaffScaling(hero, state, intelligence)
  } else {
    clearHellStaffScaling(hero, state)
  }

  if (!hasSnakeStaff && !hasHellStaff) {
    delete staffScalingStateByUnitId[unitId]
  }
}

/**
 * 周期刷新杖系智力缩放加成（蛇杖 / 地狱之杖）。
 */
function registerStaffScalingTimer(): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, 1.0, true, () => {
    const groupHandle = CreateGroup()
    GroupEnumUnitsInRect(groupHandle, GetWorldBounds(), Filter(() => IsUnitType(GetFilterUnit(), UNIT_TYPE_HERO())))
    while (true) {
      const hero = FirstOfGroup(groupHandle)
      if (!hero) {
        break
      }
      GroupRemoveUnit(groupHandle, hero)
      if (isUnitAlive(hero) && isMercenaryHero(hero)) {
        updateStaffIntScalingForHero(hero)
      }
    }
    DestroyGroup(groupHandle)
  })
}

/**
 * 入口：迁移杖系强化逻辑（魔能汲取、雷杖共鸣、蛇杖/地狱之杖智力缩放）。
 */
export function migrateStaffEmpowermentTriggers(): void {
  registerStaffManaSiphonTrigger()
  registerLightningStaffTrigger()
  registerStaffScalingTimer()
}


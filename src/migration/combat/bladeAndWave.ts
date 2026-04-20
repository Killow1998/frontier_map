import {
  ATTACK_TYPE_HERO,
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_HERO_LEVEL,
  EVENT_PLAYER_HERO_SKILL,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  EVENT_PLAYER_UNIT_SUMMON,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { applyUnitBonus, disableLegacyTrigger, getAbilityDataRealValue, getGlobal, getRecentAttackInfo, registerAnyUnitDamagedEvent, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const THOUSANDFOLD_UNIT_ID = FourCC("H00A")
const THOUSANDFOLD_ABILITY_ID = FourCC("A063")

const SOUL_RITE_UNIT_ID = FourCC("H00A")
const SOUL_RITE_ABILITY_ID = FourCC("A065")

const SHARPENING_UNIT_ID = FourCC("H00A")
const SHARPENING_ABILITY_ID = FourCC("A067")
const SHARPENING_EFFECT_KEY = 0x9F3E1AA6
const SHARPENING_ACTIVE_KEY = 0x1010ED95
const SHARPENING_TARGET_KEY = 0xABC78A91
const SHARPENING_STACK_KEY = 0x7F418CA2
const SHARPENING_LAST_BONUS_KEY = 0xFD1D8589
const SHARPENING_BASE_DAMAGE_FACTORS = [3.85, 4.7, 5.55, 6.4, 7.25, 8.1, 4.0, 4.0]
const SHARPENING_STACK_MULTIPLIERS = [5, 6, 7, 8, 9, 10, 11, 12]
const SHARPENING_FULL_STACK_BONUS = [0.25, 0.4, 0.55, 0.7, 0.85, 1.0, 1.15, 1.3]

const TEMPEST_UNIT_ID = FourCC("H00A")
const TEMPEST_ABILITY_ID = FourCC("A069")
const TEMPEST_DUMMY_UNIT_ID = FourCC("e004")
const TEMPEST_DUMMY_STOMP_ID = FourCC("A0AC")

const BIG_WAVE_UNIT_ID = FourCC("H001")
const BIG_WAVE_ABILITY_ID = FourCC("A086")
const BIG_WAVE_DUMMY_ID = FourCC("e004")
const BIG_WAVE_DUMMY_ABILITY_ID = FourCC("A002")

const FIRE_MANA_UNIT_ID = FourCC("H007")
const FIRE_MANA_ABILITY_ID = FourCC("A05M")
const FIRE_MANA_FAST_ID = FourCC("A05S")
const FIRE_MANA_GUARD_ID = FourCC("A05O")
const FIRE_MANA_CLAW_ID = FourCC("A05T")
const FIRE_MANA_BEAST_ID = FourCC("A05R")
const PERFECT_CRAFT_SKILL_ID = FourCC("A05Q")
const PERFECT_CRAFT_SUMMONED_IDS = [FourCC("h005"), FourCC("n00H"), FourCC("n00I"), FourCC("n00G"), FourCC("h006"), FourCC("h008"), FourCC("n00K"), FourCC("n00L"), FourCC("n00M"), FourCC("n00N")]
const PERFECT_CRAFT_MANA_COST_IDS = [FourCC("h005"), FourCC("n00H"), FourCC("n00I"), FourCC("n00G"), FourCC("h006"), FourCC("n00K"), FourCC("n00L"), FourCC("n00M")]

/**
 * 读取能力字段。
 */
function getAbilityDataReal(whichUnit: unit, abilityId: number, level: number, dataType: number, fallback: number): number {
  return getAbilityDataRealValue(whichUnit, abilityId, level, dataType, fallback)
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
 * 延迟销毁文字标签。
 */
function destroyTextTagLater(textTag: texttag, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyTextTag(textTag)
    DestroyTimer(timerHandle)
  })
}

/**
 * 延迟移除单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 注册任何单位受伤事件。
 */
function registerAnyDamageEvent(triggerHandle: trigger): void {
  registerAnyUnitDamagedEvent(triggerHandle)
}

/**
 * 是否为普攻造成的伤害（无 EX 上下文时基于近期攻击追踪近似判定）。
 */
function isAttackDamage(source: unit, target: unit): boolean {
  const exGetEventDamageData = getGlobal<(dataType: number) => number>("EXGetEventDamageData")
  const attackFlagDataType = getGlobal<number>("YDWEEventDamageData___EVENT_DAMAGE_DATA_IS_ATTACK")
  if (exGetEventDamageData && attackFlagDataType !== undefined) {
    return exGetEventDamageData(attackFlagDataType) !== 0
  }
  return getRecentAttackInfo(source, target).isAttack
}

/**
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 极坐标投射。
 */
function polarProjection(baseLoc: location, distance: number, angleDegrees: number): location {
  const rad = angleDegrees * bj_DEGTORAD
  return Location(GetLocationX(baseLoc) + distance * Cos(rad), GetLocationY(baseLoc) + distance * Sin(rad))
}

/**
 * 创建单位脚下文本标签。
 */
function createTextTagOnUnit(whichUnit: unit, text: string, height: number): texttag {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, text, 0.023)
  SetTextTagPosUnit(textTag, whichUnit, height)
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 1.2)
  SetTextTagFadepoint(textTag, 0.6)
  return textTag
}

/**
 * 将技能等级映射到数组索引。
 */
function toLevelIndex(level: number, maxLength: number): number {
  return Math.min(maxLength - 1, Math.max(0, level - 1))
}

/**
 * Thousandfold Slash：扇形连斩。
 */
function registerThousandfoldSlashTrigger(): void {
  disableLegacyTrigger("gg_trg_Thousandfold_Slash")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === THOUSANDFOLD_UNIT_ID && GetSpellAbilityId() === THOUSANDFOLD_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(caster, THOUSANDFOLD_ABILITY_ID)
    const damage = 10.0 + (3.0 + 0.85 * abilityLevel) * GetHeroStr(caster, true)
    const radius = 525.0
    const baseLoc = GetUnitLoc(caster)
    const facing = GetUnitFacing(caster)

    const damageGroup = CreateGroup()
    GroupEnumUnitsInRange(
      damageGroup,
      GetLocationX(baseLoc),
      GetLocationY(baseLoc),
      radius,
      Filter(() => {
        const target = GetFilterUnit()
        if (!IsUnitEnemy(target, GetOwningPlayer(caster))) {
          return false
        }
        if (IsUnitType(target, UNIT_TYPE_STRUCTURE())) {
          return false
        }
        const targetAngle = Atan2(GetUnitY(target) - GetUnitY(caster), GetUnitX(target) - GetUnitX(caster)) / bj_DEGTORAD
        let angle = facing - targetAngle
        if (angle > 180.0) {
          angle -= 360.0
        } else if (angle < -180.0) {
          angle += 360.0
        }
        return angle <= 35.0 && angle >= -35.0
      })
    )
    ForGroup(damageGroup, () => {
      const target = GetEnumUnit()
      UnitDamageTarget(caster, target, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
    })
    DestroyGroup(damageGroup)

    let progress = 0.0
    const visualTimer = CreateTimer()
    TimerStart(visualTimer, 0.03, true, () => {
      if (progress >= radius) {
        RemoveLocation(baseLoc)
        DestroyTimer(visualTimer)
        return
      }
      const offsets = [-30.0, 0.0, 30.0]
      for (const offset of offsets) {
        const pointLoc = polarProjection(baseLoc, progress, facing + offset)
        const effectHandle = AddSpecialEffectLoc("Abilities\\Spells\\Human\\Thunderclap\\ThunderClapCaster.mdl", pointLoc)
        destroyEffectLater(effectHandle, 0.3)
        RemoveLocation(pointLoc)
      }
      progress += radius / 10.0
    })
  })
  replaceGlobalTrigger("gg_trg_Thousandfold_Slash", triggerHandle)
}

/**
 * Soul Severing Blood Rite：持续吸血并给自己临时力量。
 */
function registerSoulSeveringBloodRiteTrigger(): void {
  disableLegacyTrigger("gg_trg_Soul_Severing_Blood_Rite")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === SOUL_RITE_UNIT_ID && GetSpellAbilityId() === SOUL_RITE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(hero, SOUL_RITE_ABILITY_ID)
    const healBase = 10.0 * abilityLevel + GetHeroStr(hero, true) * (0.5 * abilityLevel)
    const chestEffect = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\Rejuvenation\\RejuvenationTarget.mdl", hero, "chest")
    let tick = 0
    let accumulatedBonus = 0
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 1.0, true, () => {
      if (!isUnitAlive(hero)) {
        DestroyEffect(chestEffect)
        DestroyTimer(timerHandle)
        return
      }
      if (tick >= 8) {
        DestroyEffect(chestEffect)
        const cleanupTimer = CreateTimer()
        TimerStart(cleanupTimer, 2.5, false, () => {
          if (accumulatedBonus > 0) {
            applyUnitBonus(hero, 3, 1, accumulatedBonus)
          }
          DestroyTimer(cleanupTimer)
        })
        DestroyTimer(timerHandle)
        return
      }

      const lifePercent = GetUnitState(hero, UNIT_STATE_LIFE()) / math.max(1.0, GetUnitState(hero, UNIT_STATE_MAX_LIFE()))
      const missingRatio = 1.0 - lifePercent
      tick++
      accumulatedBonus += 5 * abilityLevel
      applyUnitBonus(hero, 3, 0, 5 * abilityLevel)
      const healAmount = healBase * (1.0 + missingRatio)
      SetWidgetLife(hero, GetWidgetLife(hero) + healAmount)
      const tag = createTextTagOnUnit(hero, I2S(R2I(healAmount)), 36.0)
      SetTextTagColor(tag, 40, 255, 40, 255)
      destroyTextTagLater(tag, 0.85)
    })
  })
  replaceGlobalTrigger("gg_trg_Soul_Severing_Blood_Rite", triggerHandle)
}

/**
 * Sharpening Edge learn：初始化/刷新刀客的专注状态。
 */
function registerSharpeningEdgeLearnTrigger(): void {
  disableLegacyTrigger("gg_trg_Sharpening_Edge_learn")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_SKILL())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === SHARPENING_UNIT_ID && GetLearnedSkill() === SHARPENING_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    const currentLevel = GetUnitAbilityLevel(hero, SHARPENING_ABILITY_ID)
    const cachedEffect = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_EFFECT_KEY)
    if (cachedEffect !== null) {
      DestroyEffect(cachedEffect)
    }

    if (currentLevel > 1 && LoadBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY)) {
      const bonusEffect = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_LAST_BONUS_KEY)
      if (bonusEffect !== null) {
        DestroyEffect(bonusEffect)
      }
      const previousBonus = SHARPENING_FULL_STACK_BONUS[toLevelIndex(currentLevel - 1, SHARPENING_FULL_STACK_BONUS.length)]
      SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) - previousBonus)
      SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, false)
    }

    const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\BattleRoar\\RoarTarget.mdl", hero, "overhead")
    SaveEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_EFFECT_KEY, effectHandle)
    SaveUnitHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_TARGET_KEY, hero)
    SaveInteger(ydht, SHARPENING_ABILITY_ID, SHARPENING_STACK_KEY, 1)
    SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, false)
  })
  replaceGlobalTrigger("gg_trg_Sharpening_Edge_learn", triggerHandle)
}

/**
 * Sharpening Edge attack：累计命中同一目标触发爆发。
 */
function registerSharpeningEdgeAttackTrigger(): void {
  disableLegacyTrigger("gg_trg_Sharpening_Edge_attack")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    return IsUnitType(source, UNIT_TYPE_HERO()) && GetUnitTypeId(source) === SHARPENING_UNIT_ID && GetUnitAbilityLevel(source, SHARPENING_ABILITY_ID) > 0 && isAttackDamage(source, target)
  }))
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    const currentLevel = Math.max(1, GetUnitAbilityLevel(source, SHARPENING_ABILITY_ID))
    const levelIndex = toLevelIndex(currentLevel, SHARPENING_BASE_DAMAGE_FACTORS.length)
    const baseDamageFactor = SHARPENING_BASE_DAMAGE_FACTORS[levelIndex]
    const fullStackBonus = SHARPENING_FULL_STACK_BONUS[levelIndex]

    const savedTarget = LoadUnitHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_TARGET_KEY)
    const active = LoadBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY)
    const effectHandle = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_EFFECT_KEY)

    if (savedTarget && GetHandleId(savedTarget) === GetHandleId(target)) {
      const nextCount = math.min(8, LoadInteger(ydht, SHARPENING_ABILITY_ID, SHARPENING_STACK_KEY) + 1)
      SaveInteger(ydht, SHARPENING_ABILITY_ID, SHARPENING_STACK_KEY, nextCount)
      if (nextCount >= 8 && !active) {
        const bonusEffect = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\Bloodlust\\BloodlustTarget.mdl", source, "weapon")
        SaveEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_LAST_BONUS_KEY, bonusEffect)
        SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, true)
        SetUnitState(source, ConvertUnitState(0x51), GetUnitState(source, ConvertUnitState(0x51)) + fullStackBonus)
      }
      const scaledDamage = baseDamageFactor * SHARPENING_STACK_MULTIPLIERS[nextCount - 1]
      DisableTrigger(triggerHandle)
      UnitDamageTarget(source, target, scaledDamage, true, false, ATTACK_TYPE_HERO(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      EnableTrigger(triggerHandle)
    } else {
      if (active) {
        const bonusEffect = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_LAST_BONUS_KEY)
        if (bonusEffect !== null) {
          DestroyEffect(bonusEffect)
        }
        SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, false)
        SetUnitState(source, ConvertUnitState(0x51), GetUnitState(source, ConvertUnitState(0x51)) - fullStackBonus)
      }
      if (effectHandle !== null) {
        DestroyEffect(effectHandle)
      }
      const overheadEffect = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\BattleRoar\\RoarTarget.mdl", target, "overhead")
      SaveEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_EFFECT_KEY, overheadEffect)
      SaveUnitHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_TARGET_KEY, target)
      SaveInteger(ydht, SHARPENING_ABILITY_ID, SHARPENING_STACK_KEY, 1)
      DisableTrigger(triggerHandle)
      UnitDamageTarget(source, target, baseDamageFactor, true, false, ATTACK_TYPE_HERO(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      EnableTrigger(triggerHandle)
    }

    const tag = createTextTagOnUnit(target, I2S(LoadInteger(ydht, SHARPENING_ABILITY_ID, SHARPENING_STACK_KEY)), 10.0)
    SetTextTagColor(tag, 255, 102, 102, 128)
    destroyTextTagLater(tag, 2.0)

    if (!isUnitAlive(target)) {
      const bonusEffect = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_LAST_BONUS_KEY)
      if (bonusEffect !== null) {
        DestroyEffect(bonusEffect)
      }
      if (LoadBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY) && fullStackBonus > 0.0) {
        SetUnitState(source, ConvertUnitState(0x51), GetUnitState(source, ConvertUnitState(0x51)) - fullStackBonus)
      }
      SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, false)
    }
  })
  replaceGlobalTrigger("gg_trg_Sharpening_Edge_attack", triggerHandle)
}

/**
 * blademan_die：刀客相关单位死亡时重置“磨刃”目标与层数。
 */
function registerBlademanDieTrigger(): void {
  disableLegacyTrigger("gg_trg_blademan_die")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const deadUnit = GetTriggerUnit()
    const killerUnit = GetKillingUnit()
    const deadIsBlademan = IsUnitType(deadUnit, UNIT_TYPE_HERO()) && GetUnitTypeId(deadUnit) === SHARPENING_UNIT_ID && GetUnitAbilityLevel(deadUnit, SHARPENING_ABILITY_ID) > 0
    const killerIsBlademan = killerUnit !== null && IsUnitType(killerUnit, UNIT_TYPE_HERO()) && GetUnitTypeId(killerUnit) === SHARPENING_UNIT_ID && GetUnitAbilityLevel(killerUnit, SHARPENING_ABILITY_ID) > 0
    return deadIsBlademan || killerIsBlademan
  }))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const killerUnit = GetKillingUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    const cachedEffect = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_EFFECT_KEY)
    if (cachedEffect !== null) {
      DestroyEffect(cachedEffect)
    }

    const source = GetUnitTypeId(deadUnit) === SHARPENING_UNIT_ID ? deadUnit : killerUnit
    if (!source) {
      return
    }

    if (LoadBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY)) {
      const levelIndex = toLevelIndex(GetUnitAbilityLevel(source, SHARPENING_ABILITY_ID), SHARPENING_FULL_STACK_BONUS.length)
      const fullStackBonus = SHARPENING_FULL_STACK_BONUS[levelIndex]
      SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, false)
      const bonusEffect = LoadEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_LAST_BONUS_KEY)
      if (bonusEffect !== null) {
        DestroyEffect(bonusEffect)
      }
      SetUnitState(source, ConvertUnitState(0x51), GetUnitState(source, ConvertUnitState(0x51)) - fullStackBonus)
    }

    const overheadEffect = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\BattleRoar\\RoarTarget.mdl", source, "overhead")
    SaveEffectHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_EFFECT_KEY, overheadEffect)
    SaveUnitHandle(ydht, SHARPENING_ABILITY_ID, SHARPENING_TARGET_KEY, source)
    SaveInteger(ydht, SHARPENING_ABILITY_ID, SHARPENING_STACK_KEY, 1)
    SaveBoolean(ydht, SHARPENING_ABILITY_ID, SHARPENING_ACTIVE_KEY, false)
  })
  replaceGlobalTrigger("gg_trg_blademan_die", triggerHandle)
}

/**
 * Tempest of Termination：进入无敌闪袭状态并随机斩击周围目标。
 */
function registerTempestOfTerminationTrigger(): void {
  disableLegacyTrigger("gg_trg_Tempest_of_Termination")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === TEMPEST_UNIT_ID && GetSpellAbilityId() === TEMPEST_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(caster, TEMPEST_ABILITY_ID)
    const strength = GetHeroStr(caster, true)
    const damageScale = (strength * abilityLevel) / 100.0
    const maxStrikes = R2I(getAbilityDataReal(caster, TEMPEST_ABILITY_ID, abilityLevel, 106, 6.0))
    let currentTarget: unit | undefined = GetSpellTargetUnit()
    let strikeCount = 0

    const bodyEffect = AddSpecialEffectTarget("Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl", caster, "chest")
    const blinkEffect = AddSpecialEffect("Abilities\\Spells\\NightElf\\Blink\\BlinkCaster.mdl", GetUnitX(caster), GetUnitY(caster))
    destroyEffectLater(blinkEffect, 1.0)
    SetUnitVertexColor(caster, 255, 255, 255, 100)
    SetUnitInvulnerable(caster, true)
    SetUnitPathing(caster, false)

    const timerHandle = CreateTimer()
    const cleanup = () => {
      SetUnitVertexColor(caster, 255, 255, 255, 255)
      SetUnitInvulnerable(caster, false)
      SetUnitPathing(caster, true)
      DestroyEffect(bodyEffect)
      DestroyTimer(timerHandle)
    }

    TimerStart(timerHandle, 0.45, true, () => {
      if (!isUnitAlive(caster) || strikeCount >= maxStrikes) {
        cleanup()
        return
      }

      if (!currentTarget || !isUnitAlive(currentTarget) || strikeCount > 0) {
        const candidates = CreateGroup()
        GroupEnumUnitsInRange(candidates, GetUnitX(caster), GetUnitY(caster), 700.0, null)
        const enemies: unit[] = []
        ForGroup(candidates, () => {
          const enumUnit = GetEnumUnit()
          if (IsUnitEnemy(enumUnit, GetOwningPlayer(caster)) && !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) && isUnitAlive(enumUnit)) {
            enemies.push(enumUnit)
          }
        })
        DestroyGroup(candidates)
        currentTarget = enemies.length > 0 ? enemies[GetRandomInt(0, enemies.length - 1)] : undefined
      }

      if (!currentTarget || !isUnitAlive(currentTarget)) {
        cleanup()
        return
      }

      const distance = GetRandomReal(49.0, 129.0)
      const randomAngle = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
      const nextX = GetUnitX(currentTarget) + distance * Cos(randomAngle)
      const nextY = GetUnitY(currentTarget) + distance * Sin(randomAngle)
      SetUnitX(caster, nextX)
      SetUnitY(caster, nextY)
      const hitEffect = AddSpecialEffectTarget("Abilities\\Weapons\\Blood\\BloodImpact.mdl", currentTarget, "overhead")
      destroyEffectLater(hitEffect, 0.2)

      const randomDamage = GetRandomReal(GetUnitState(caster, ConvertUnitState(0x14)), GetUnitState(caster, ConvertUnitState(0x15)))
      if (IsUnitEnemy(currentTarget, GetOwningPlayer(caster))) {
        UnitDamageTarget(caster, currentTarget, randomDamage * (1.0 + damageScale), false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
        if (!isUnitAlive(currentTarget)) {
          const stompDummy = CreateUnit(GetOwningPlayer(caster), TEMPEST_DUMMY_UNIT_ID, nextX, nextY, bj_UNIT_FACING)
          ShowUnit(stompDummy, false)
          SetUnitInvulnerable(stompDummy, true)
          SetUnitPathing(stompDummy, false)
          UnitAddAbility(stompDummy, TEMPEST_DUMMY_STOMP_ID)
          SetUnitAbilityLevel(stompDummy, TEMPEST_DUMMY_STOMP_ID, 1)
          IssueImmediateOrder(stompDummy, "stomp")
          removeUnitLater(stompDummy, 2.0)
        }
      }

      strikeCount++
    })
  })
  replaceGlobalTrigger("gg_trg_Tempest_of_Termination", triggerHandle)
}

/**
 * big_wave：召唤冲锋大浪。
 */
function registerBigWaveTrigger(): void {
  disableLegacyTrigger("gg_trg_big_wave")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === BIG_WAVE_UNIT_ID && GetSpellAbilityId() === BIG_WAVE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const targetX = GetSpellTargetX()
    const targetY = GetSpellTargetY()
    const abilityLevel = GetUnitAbilityLevel(caster, BIG_WAVE_ABILITY_ID)
    const waveDummy = CreateUnit(owner, BIG_WAVE_DUMMY_ID, targetX, targetY, GetUnitFacing(caster))
    ShowUnit(waveDummy, false)
    SetUnitInvulnerable(waveDummy, true)
    UnitAddAbility(waveDummy, BIG_WAVE_DUMMY_ABILITY_ID)
    SetUnitAbilityLevel(waveDummy, BIG_WAVE_DUMMY_ABILITY_ID, abilityLevel)
    IssuePointOrder(waveDummy, "stampede", targetX, targetY)
    removeUnitLater(waveDummy, 14.0)
  })
  replaceGlobalTrigger("gg_trg_big_wave", triggerHandle)
}

/**
 * fire_mana：切换建筑师的火系/法力系形态按钮。
 */
function registerFireManaTrigger(): void {
  disableLegacyTrigger("gg_trg_fire_mana")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === FIRE_MANA_UNIT_ID && GetSpellAbilityId() === FIRE_MANA_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }
    SetUnitState(hero, UNIT_STATE_MANA(), GetUnitState(hero, UNIT_STATE_MANA()) * 0.73)
    SaveInteger(ydht, FIRE_MANA_UNIT_ID, 0xFAFE5485, GetUnitAbilityLevel(hero, FIRE_MANA_GUARD_ID))
    SaveInteger(ydht, FIRE_MANA_UNIT_ID, 0x457BCFC0, GetUnitAbilityLevel(hero, FIRE_MANA_BEAST_ID))

    if (LoadInteger(ydht, FIRE_MANA_UNIT_ID, 0xFAFE5485) > 0) {
      UnitRemoveAbility(hero, FIRE_MANA_GUARD_ID)
      UnitAddAbility(hero, FIRE_MANA_FAST_ID)
      SetUnitAbilityLevel(hero, FIRE_MANA_FAST_ID, 1)
    } else {
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "建筑师尚未习得快速建造技能")
    }
    if (LoadInteger(ydht, FIRE_MANA_UNIT_ID, 0x457BCFC0) > 0) {
      UnitRemoveAbility(hero, FIRE_MANA_BEAST_ID)
      UnitAddAbility(hero, FIRE_MANA_CLAW_ID)
      SetUnitAbilityLevel(hero, FIRE_MANA_CLAW_ID, 1)
    } else {
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "建筑师尚未习得傀儡军团技能")
    }
  })
  replaceGlobalTrigger("gg_trg_fire_mana", triggerHandle)
}

/**
 * fire_mana_use：清理临时按钮并恢复原始技能。
 */
function registerFireManaUseTrigger(): void {
  disableLegacyTrigger("gg_trg_fire_mana_use")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === FIRE_MANA_UNIT_ID && (GetSpellAbilityId() === FIRE_MANA_FAST_ID || GetSpellAbilityId() === FIRE_MANA_CLAW_ID)))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }
    const restoreTimer = CreateTimer()
    TimerStart(restoreTimer, 0.10, false, () => {
      UnitRemoveAbility(hero, FIRE_MANA_FAST_ID)
      UnitRemoveAbility(hero, FIRE_MANA_CLAW_ID)
      UnitRemoveAbility(hero, FIRE_MANA_BEAST_ID)
      UnitRemoveAbility(hero, FIRE_MANA_GUARD_ID)
      if (LoadInteger(ydht, FIRE_MANA_UNIT_ID, 0xFAFE5485) > 0) {
        UnitAddAbility(hero, FIRE_MANA_GUARD_ID)
        SetUnitAbilityLevel(hero, FIRE_MANA_GUARD_ID, LoadInteger(ydht, FIRE_MANA_UNIT_ID, 0xFAFE5485))
      }
      if (LoadInteger(ydht, FIRE_MANA_UNIT_ID, 0x457BCFC0) > 0) {
        UnitAddAbility(hero, FIRE_MANA_BEAST_ID)
        SetUnitAbilityLevel(hero, FIRE_MANA_BEAST_ID, LoadInteger(ydht, FIRE_MANA_UNIT_ID, 0x457BCFC0))
      }
      DestroyTimer(restoreTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_fire_mana_use", triggerHandle)
}

/**
 * perfect_craft：建筑师召唤单位时，根据蓝量与技能等级强化造物。
 */
function registerPerfectCraftTrigger(): void {
  disableLegacyTrigger("gg_trg_perfect_craft")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SUMMON())
  TriggerAddCondition(triggerHandle, Condition(() => PERFECT_CRAFT_SUMMONED_IDS.indexOf(GetUnitTypeId(GetTriggerUnit())) !== -1))
  TriggerAddAction(triggerHandle, () => {
    const summoned = GetSummonedUnit()
    const summoner = GetSummoningUnit()
    if (!summoned || !summoner) {
      return
    }
    const craftLevel = GetUnitAbilityLevel(summoner, PERFECT_CRAFT_SKILL_ID)
    if (craftLevel <= 0) {
      return
    }
    const levelDivisors = [0, 1000, 950, 850, 700, 550, 450]
    const normalizedLevel = Math.max(1, Math.min(craftLevel, 6))
    const divisor = levelDivisors[normalizedLevel]
    const manaScale = PERFECT_CRAFT_MANA_COST_IDS.indexOf(GetUnitTypeId(summoned)) !== -1 ? 1.0 : 1.25
    const stackCount = Math.floor((GetUnitState(summoner, UNIT_STATE_MANA()) * manaScale) / divisor)
    if (stackCount < 1) {
      return
    }

    const scaling = Pow(1.20, stackCount)
    const maxLifeBonus = GetUnitState(summoned, UNIT_STATE_MAX_LIFE()) * 0.10 * scaling
    const statBonus = (GetUnitState(summoned, ConvertUnitState(0x12)) / 2.0) * scaling
    applyUnitBonus(summoned, 3, 0, R2I(statBonus))
    SetUnitState(summoned, UNIT_STATE_MAX_LIFE(), GetUnitState(summoned, UNIT_STATE_MAX_LIFE()) + maxLifeBonus)
    SetUnitState(summoned, UNIT_STATE_LIFE(), GetUnitState(summoned, UNIT_STATE_MAX_LIFE()))

    if (PERFECT_CRAFT_MANA_COST_IDS.indexOf(GetUnitTypeId(summoned)) !== -1) {
      const maxMana = GetUnitState(summoner, UNIT_STATE_MAX_MANA())
      if (maxMana > 0.0) {
        const manaPercent = (GetUnitState(summoner, UNIT_STATE_MANA()) / maxMana) * 100.0
        SetUnitState(summoner, UNIT_STATE_MANA(), maxMana * Math.max(0.0, manaPercent - 3.0) / 100.0)
      }
    }
    DisplayTextToPlayer(GetOwningPlayer(summoner), 0, 0, `建筑师已触发精湛技艺，其造物获得强化，叠加次数为：${I2S(stackCount)}`)

    const fireManaLevel = GetUnitAbilityLevel(summoner, FIRE_MANA_ABILITY_ID)
    if (fireManaLevel === 1 && GetRandomInt(1, 101) <= 7) {
      const manaBonus = GetRandomInt(15, 25 + GetHeroInt(summoner, false) * 2 + 5)
      applyUnitBonus(summoner, 1, 0, manaBonus)
      DisplayTextToPlayer(GetOwningPlayer(summoner), 0, 0, `建筑师已增加${I2S(manaBonus)}最大魔法值`)
    }
    if (fireManaLevel === 2 && GetRandomInt(1, 101) <= 13) {
      const manaBonus = GetRandomInt(25, 25 + GetHeroInt(summoner, false) * 4 + 5)
      applyUnitBonus(summoner, 1, 0, manaBonus)
      DisplayTextToPlayer(GetOwningPlayer(summoner), 0, 0, `建筑师已增加${I2S(manaBonus)}最大魔法值`)
    }
  })
  replaceGlobalTrigger("gg_trg_perfect_craft", triggerHandle)
}

/**
 * perfect_craft_lv：建筑师升级时额外提升智力与法力上限。
 */
function registerPerfectCraftLevelTrigger(): void {
  disableLegacyTrigger("gg_trg_perfect_craft_lv")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_LEVEL())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === FIRE_MANA_UNIT_ID && GetUnitAbilityLevel(GetTriggerUnit(), PERFECT_CRAFT_SKILL_ID) > 0))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const craftLevel = GetUnitAbilityLevel(hero, PERFECT_CRAFT_SKILL_ID)
    const intBonus = GetRandomInt(1, craftLevel + 1)
    const manaBonus = GetRandomInt(7, 16) * intBonus
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, `建筑师精湛其技艺，提高了${I2S(intBonus)}智力，增加了${I2S(manaBonus)}最大魔法值`)
    SetHeroInt(hero, GetHeroInt(hero, false) + intBonus, true)
    applyUnitBonus(hero, 1, 0, manaBonus)
  })
  replaceGlobalTrigger("gg_trg_perfect_craft_lv", triggerHandle)
}

/**
 * perfect_craft_______u：原图无初始化实现，显式接管为空触发器以避免遗留接管干预。
 */
function registerPerfectCraftUnusedTrigger(): void {
  disableLegacyTrigger("gg_trg_perfect_craft_______u")
  const triggerHandle = CreateTrigger()
  replaceGlobalTrigger("gg_trg_perfect_craft_______u", triggerHandle)
}

/**
 * 入口：迁移 Thousandfold / Soul Rite / Sharpening Edge / big wave / fire mana。
 */
export function migrateBladeAndWaveTriggers(): void {
  registerThousandfoldSlashTrigger()
  registerSoulSeveringBloodRiteTrigger()
  registerSharpeningEdgeLearnTrigger()
  registerSharpeningEdgeAttackTrigger()
  registerBlademanDieTrigger()
  registerTempestOfTerminationTrigger()
  registerBigWaveTrigger()
  registerFireManaTrigger()
  registerFireManaUseTrigger()
  registerPerfectCraftTrigger()
  registerPerfectCraftUnusedTrigger()
  registerPerfectCraftLevelTrigger()
}

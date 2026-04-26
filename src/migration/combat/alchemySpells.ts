import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_MAGIC,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  PLAYER_STATE_RESOURCE_GOLD,
  UNIT_STATE_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { SYNC_GROUP, applyUnitBonus, disableLegacyTrigger, getAbilityDataRealValue, registerAnyUnitDamagedEvent, registerPlayerUnitEventAll, replaceGlobalTrigger, setAbilityDataRealValue, setGlobal, toSyncInt } from "../core/helpers"

const POISONOUS_FOG_UNIT_ID = FourCC("N00Q")
const POISONOUS_FOG_ABILITY_ID = FourCC("A06W")
const POISONOUS_FOG_DUMMY_ID = FourCC("e003")
const POISONOUS_FOG_DUMMY_ABILITY_ID = FourCC("A06X")

const UBSTABLE_UNIT_ID = FourCC("N00Q")
const UBSTABLE_ABILITY_ID = FourCC("A071")
const UBSTABLE_DUMMY_ID = FourCC("e003")
const UBSTABLE_DUMMY_ABILITY_ID = FourCC("A070")

const LIFE_SYNTHESIS_UNIT_ID = FourCC("N00Q")
const LIFE_SYNTHESIS_ABILITY_ID = FourCC("A072")

const EXTREME_DOSAGE_UNIT_ID = FourCC("N00Q")
const EXTREME_DOSAGE_ABILITY_ID = FourCC("A073")
const COUNTDOWN_TEXT_SCALE = 0.074
const NORMAL_FLOAT_TEXT_SCALE = 0.064

/**
 * 读取能力数据。
 */
function getAbilityDataReal(whichUnit: unit, abilityId: number, level: number, dataType: number, fallback: number): number {
  return getAbilityDataRealValue(whichUnit, abilityId, level, dataType, fallback)
}

/**
 * 写入能力数据。
 */
function setAbilityDataReal(whichUnit: unit, abilityId: number, level: number, dataType: number, value: number): void {
  setAbilityDataRealValue(whichUnit, abilityId, level, dataType, value)
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
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 判断单位是否死亡。
 */
function isUnitDead(unitHandle: unit): boolean {
  return !isUnitAlive(unitHandle)
}

/**
 * 以极坐标投射新位置。
 */
function polarProjection(baseLoc: location, distance: number, angleDegrees: number): location {
  const rad = angleDegrees * bj_DEGTORAD
  return Location(GetLocationX(baseLoc) + distance * Cos(rad), GetLocationY(baseLoc) + distance * Sin(rad))
}

/**
 * 创建单位脚下的文本标签。
 */
function createTextTagOnUnit(
  whichUnit: unit,
  text: string,
  height: number,
  size: number = NORMAL_FLOAT_TEXT_SCALE,
  color?: [number, number, number, number]
): texttag {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, text, size)
  SetTextTagPosUnit(textTag, whichUnit, height)
  if (color) {
    SetTextTagColor(textTag, color[0], color[1], color[2], color[3])
  }
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 1.5)
  SetTextTagFadepoint(textTag, 0.75)
  return textTag
}

/**
 * poisonous_fog：持续在目标区域制造毒雾，并周期伤害范围内敌人。
 */
function registerPoisonousFogTrigger(): void {
  disableLegacyTrigger("gg_trg_poisonous_fog")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === POISONOUS_FOG_UNIT_ID && GetSpellAbilityId() === POISONOUS_FOG_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const abilityLevel = GetUnitAbilityLevel(caster, POISONOUS_FOG_ABILITY_ID)
    const targetLoc = GetSpellTargetLoc()
    const targetX = GetLocationX(targetLoc)
    const targetY = GetLocationY(targetLoc)
    const radius = getAbilityDataReal(caster, POISONOUS_FOG_ABILITY_ID, abilityLevel, 106, 700.0)
    const duration = getAbilityDataReal(caster, POISONOUS_FOG_ABILITY_ID, abilityLevel, 102, 12.0)
    const interval = 0.75
    const damage = GetHeroStr(caster, true) * (0.20 * abilityLevel) + GetUnitState(caster, UNIT_STATE_MAX_MANA()) * (0.02 * abilityLevel)
    const dummy = CreateUnit(owner, POISONOUS_FOG_DUMMY_ID, targetX, targetY, bj_UNIT_FACING)
    ShowUnit(dummy, false)
    PauseUnit(dummy, true)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, POISONOUS_FOG_DUMMY_ABILITY_ID)
    SetUnitAbilityLevel(dummy, POISONOUS_FOG_DUMMY_ABILITY_ID, 1)
    setAbilityDataReal(dummy, POISONOUS_FOG_DUMMY_ABILITY_ID, 1, 106, radius)
    removeUnitLater(dummy, duration)

    let elapsed = 0.0
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, interval, true, () => {
      elapsed += interval
      let i = 0
      while (i < 12) {
        // 【加固】移除计时器回调内的 GetRandomReal。
        // 改用基于索引 i 的确定性偏移（螺旋扩展步进），确保全服坐标绝对对齐。
        const angle = i * 30.0 // 12个点均匀分布
        const dist = 50.0 + (i % 3) * (radius / 3.0)
        const pointLoc = polarProjection(targetLoc, dist, angle)
        const effectHandle = AddSpecialEffectLoc("Abilities\\Spells\\Undead\\DeathandDecay\\DeathandDecayTarget.mdl", pointLoc)
        destroyEffectLater(effectHandle, 0.35)
        RemoveLocation(pointLoc)
        i++
      }

      // 【加固】使用全服同步组
      GroupClear(SYNC_GROUP)
      GroupEnumUnitsInRange(
        SYNC_GROUP,
        targetX,
        targetY,
        radius,
        null
      )
      ForGroup(SYNC_GROUP, () => {
        const target = GetEnumUnit()
        if (isUnitAlive(target) && IsUnitEnemy(target, owner) && !IsUnitType(target, UNIT_TYPE_STRUCTURE())) {
          UnitDamageTarget(caster, target, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
          const hitEffect = AddSpecialEffectTarget("Abilities\\Spells\\Undead\\DeathandDecay\\DeathandDecayDamage.mdl", target, "chest")
          destroyEffectLater(hitEffect, 0.35)
        }
      })
      GroupClear(SYNC_GROUP)

      if (elapsed >= duration) {
        RemoveLocation(targetLoc)
        DestroyTimer(timerHandle)
      }
    })
  })
  replaceGlobalTrigger("gg_trg_poisonous_fog", triggerHandle)
}

/**
 * ubstable：短时强化后倒计时爆发，对周围有机单位造成范围伤害。
 */
function registerUbstableTrigger(): void {
  disableLegacyTrigger("gg_trg_ubstable")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === UBSTABLE_UNIT_ID && GetSpellAbilityId() === UBSTABLE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const abilityLevel = GetUnitAbilityLevel(caster, UBSTABLE_ABILITY_ID)
    const castLoc = GetUnitLoc(caster)
    const radius = getAbilityDataReal(caster, UBSTABLE_ABILITY_ID, abilityLevel, 106, 300.0)
    const duration = getAbilityDataReal(caster, UBSTABLE_ABILITY_ID, abilityLevel, 102, 5.0)

    const dummy = CreateUnit(owner, UBSTABLE_DUMMY_ID, GetLocationX(castLoc), GetLocationY(castLoc), bj_UNIT_FACING)
    ShowUnit(dummy, false)
    PauseUnit(dummy, true)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, UBSTABLE_DUMMY_ABILITY_ID)
    SetUnitAbilityLevel(dummy, UBSTABLE_DUMMY_ABILITY_ID, 1)

    const attackSpeedBonus = getAbilityDataReal(dummy, UBSTABLE_DUMMY_ABILITY_ID, abilityLevel, 111, 0.35)
    const moveSpeedBonus = getAbilityDataReal(dummy, UBSTABLE_DUMMY_ABILITY_ID, abilityLevel, 110, 55.0)
    const strengthBonus = R2I(getAbilityDataReal(dummy, UBSTABLE_DUMMY_ABILITY_ID, abilityLevel, 108, 15.0))
    const damageFactor = getAbilityDataReal(dummy, UBSTABLE_DUMMY_ABILITY_ID, abilityLevel, 109, 0.75)
    removeUnitLater(dummy, 0.5)

    const attackState = ConvertUnitState(0x51)
    SetUnitState(caster, attackState, GetUnitState(caster, attackState) + attackSpeedBonus)
    SetUnitMoveSpeed(caster, GetUnitDefaultMoveSpeed(caster) + moveSpeedBonus)
    SetHeroStr(caster, GetHeroStr(caster, false) + strengthBonus, true)
    const burstDamage = GetHeroStr(caster, true) * damageFactor

    SetUnitVertexColor(caster, 255, 65, 65, 255)
    const weaponEffect = AddSpecialEffectTarget("Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile.mdl", caster, "weapon")

    let elapsed = 0.0
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 1.0, true, () => {
      const remainSeconds = math.max(0, R2I(duration - elapsed))
      const textTag = createTextTagOnUnit(caster, I2S(remainSeconds), 25.0, COUNTDOWN_TEXT_SCALE, [255, 28, 28, 255])
      destroyTextTagLater(textTag, 0.8)

      if (elapsed >= duration) {
        const centerX = GetUnitX(caster)
        const centerY = GetUnitY(caster)
        
        // 【加固】使用全服同步组
        GroupClear(SYNC_GROUP)
        GroupEnumUnitsInRange(
          SYNC_GROUP,
          centerX,
          centerY,
          radius,
          null
        )
        ForGroup(SYNC_GROUP, () => {
          const target = GetEnumUnit()
          if (!IsUnitType(target, UNIT_TYPE_STRUCTURE()) && !IsUnitHidden(target) && isUnitAlive(target)) {
            UnitDamageTarget(caster, target, burstDamage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
            const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Incinerate\\FireLordDeathExplode.mdl", target, "chest")
            destroyEffectLater(effectHandle, 0.3)
          }
        })
        GroupClear(SYNC_GROUP)

        SetUnitState(caster, attackState, GetUnitState(caster, attackState) - attackSpeedBonus)
        SetUnitMoveSpeed(caster, GetUnitDefaultMoveSpeed(caster))
        SetHeroStr(caster, GetHeroStr(caster, false) - strengthBonus, true)
        SetUnitVertexColor(caster, 255, 255, 255, 255)
        DestroyEffect(weaponEffect)
        DestroyTimer(timerHandle)
        RemoveLocation(castLoc)
        return
      }

      elapsed += 1.0
    })
  })
  replaceGlobalTrigger("gg_trg_ubstable", triggerHandle)
}

/**
 * Life_Synthesis：击杀后根据概率获得金钱、经验或力量。
 */
function registerLifeSynthesisTrigger(): void {
  disableLegacyTrigger("gg_trg_Life_Synthesis")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetKillingUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetKillingUnit()) === LIFE_SYNTHESIS_UNIT_ID && GetUnitAbilityLevel(GetKillingUnit(), LIFE_SYNTHESIS_ABILITY_ID) > 0))
  TriggerAddAction(triggerHandle, () => {
    const killer = GetKillingUnit()
    const abilityLevel = GetUnitAbilityLevel(killer, LIFE_SYNTHESIS_ABILITY_ID)
    const successChance = getAbilityDataReal(killer, LIFE_SYNTHESIS_ABILITY_ID, abilityLevel, 101, 0.0)
    const manaReward = GetUnitState(killer, UNIT_STATE_MANA()) * 0.01
    if (GetRandomInt(1, 100) <= successChance && manaReward >= 1.0) {
      const textTag = createTextTagOnUnit(GetDyingUnit(), "+" + I2S(R2I(manaReward)), 10.0)
      destroyTextTagLater(textTag, 2.0)
      SetPlayerState(GetOwningPlayer(killer), PLAYER_STATE_RESOURCE_GOLD(), GetPlayerState(GetOwningPlayer(killer), PLAYER_STATE_RESOURCE_GOLD()) + R2I(manaReward))
    }

    if (GetRandomInt(1, 100) <= 7 && abilityLevel >= 4) {
      if (GetHeroLevel(killer) < 33) {
        const xp = R2I(GetUnitState(killer, UNIT_STATE_MAX_MANA()) / 4.0) + GetRandomInt(1, 99)
        AddHeroXP(killer, xp, true)
        DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, "炼药师通过生命炼成获得了额外经验值：" + I2S(xp))
      } else {
        const strBonus = R2I(GetUnitState(killer, UNIT_STATE_MAX_MANA()) / 400.0)
        if (strBonus >= 1) {
          SetHeroStr(killer, GetHeroStr(killer, true) + strBonus, true)
          DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, "炼药师通过生命炼成获得了额外力量：" + I2S(strBonus))
        }
      }
    }
  })
  replaceGlobalTrigger("gg_trg_Life_Synthesis", triggerHandle)
}

/**
 * Extreme_Dosage：以生命换取持续的爆发强化。
 */
function registerExtremeDosageTrigger(): void {
  disableLegacyTrigger("gg_trg_Extreme_Dosage")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === EXTREME_DOSAGE_UNIT_ID && GetSpellAbilityId() === EXTREME_DOSAGE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const abilityLevel = GetUnitAbilityLevel(caster, EXTREME_DOSAGE_ABILITY_ID)
    const duration = 7.0 + 4.0 * abilityLevel
    const lifeCost = 0.35 * abilityLevel
    const manaDrainPerTick = GetUnitState(caster, UNIT_STATE_MANA()) / (GetUnitState(caster, UNIT_STATE_MAX_MANA()) <= 0.0 ? 1.0 : GetUnitState(caster, UNIT_STATE_MAX_MANA())) / duration * 100.0
    const lifeRestoreFactor = 0.50 + 0.35 * abilityLevel
    const strengthBonus = R2I(GetUnitState(caster, UNIT_STATE_MAX_LIFE()) / 13.0)
    applyUnitBonus(caster, 3, 0, strengthBonus)
    const addTag = createTextTagOnUnit(caster, "+" + I2S(strengthBonus) + "攻", 30.0, NORMAL_FLOAT_TEXT_SCALE, [120, 255, 120, 255])
    destroyTextTagLater(addTag, 1.2)
    SetWidgetLife(caster, 1.0)
    const headEffect = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\Bloodlust\\BloodlustTarget.mdl", caster, "head")
    const chestEffect = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\Rejuvenation\\RejuvenationTarget.mdl", caster, "chest")

    let elapsed = 0.0
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 1.0, true, () => {
      elapsed += 1.0
      const currentMana = GetUnitState(caster, UNIT_STATE_MANA())
      const maxMana = GetUnitState(caster, UNIT_STATE_MAX_MANA())
      const manaPercent = currentMana / (maxMana <= 0.0 ? 1.0 : maxMana) * 100.0

      if (isUnitDead(caster) || manaPercent < manaDrainPerTick || elapsed >= duration) {
        applyUnitBonus(caster, 3, 1, strengthBonus)
        const removeTag = createTextTagOnUnit(caster, "-" + I2S(strengthBonus) + "攻", 30.0, NORMAL_FLOAT_TEXT_SCALE, [255, 110, 110, 255])
        destroyTextTagLater(removeTag, 1.2)
        SetWidgetLife(caster, GetWidgetLife(caster) + lifeCost)
        DestroyEffect(headEffect)
        DestroyEffect(chestEffect)
        DestroyTimer(timerHandle)
        return
      }

      SetUnitState(caster, UNIT_STATE_MANA(), currentMana - maxMana * (manaDrainPerTick / 100.0))
      SetWidgetLife(caster, GetWidgetLife(caster) + GetUnitState(caster, UNIT_STATE_MAX_LIFE()) * ((manaDrainPerTick / 100.0) * lifeRestoreFactor))
    })
  })
  replaceGlobalTrigger("gg_trg_Extreme_Dosage", triggerHandle)
}

/**
 * 入口：迁移 poisonous_fog / ubstable / Life_Synthesis / Extreme_Dosage。
 */
export function migrateAlchemySpellTriggers(): void {
  registerPoisonousFogTrigger()
  registerUbstableTrigger()
  registerLifeSynthesisTrigger()
  registerExtremeDosageTrigger()
}

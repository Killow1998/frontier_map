import {
  ATTACK_TYPE_MAGIC,
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_HERO_SKILL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  PLAYER_STATE_RESOURCE_GOLD,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, registerAnyUnitDamagedEvent, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const ARCANE_IMPALE_UNIT_ID = FourCC("H00E")
const ARCANE_IMPALE_ABILITY_ID = FourCC("A06V")
const ARCANE_IMPALE_DUMMY_EFFECT = "Abilities\\Spells\\Undead\\Impale\\ImpaleHitTarget.mdl"
const ARCANE_IMPALE_MISS_EFFECT = "Abilities\\Spells\\Undead\\Impale\\ImpaleMissTarget.mdl"
const ARCANE_IMPALE_TRACE_EFFECT = "Abilities\\Spells\\Other\\BrakeLights\\BrakeLights.mdl"
const ARCANE_IMPALE_AOE = [500.0, 550.0, 600.0, 650.0, 700.0]

const STARSTRIKE_UNIT_ID = FourCC("H00E")
const STARSTRIKE_ABILITY_ID = FourCC("A06S")
const STARSTRIKE_AOE = [400.0, 425.0, 450.0, 475.0, 500.0]

const ILLUSORY_VOID_UNIT_ID = FourCC("H00E")
const ILLUSORY_VOID_ABILITY_ID = FourCC("A06U")
const ILLUSORY_VOID_AURA_BUFF_ID = FourCC("B00G")
const ILLUSORY_VOID_AOE = [500.0, 600.0, 750.0]

const ARCANE_SUSCEPTIBILITY_UNIT_ID = FourCC("H00E")
const ARCANE_SUSCEPTIBILITY_LEARN_ID = FourCC("A06N")
const ARCANE_SUSCEPTIBILITY_AURA_ID = FourCC("A06O")

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
 * 以极坐标投射新位置。
 */
function polarProjection(baseLoc: location, distance: number, angleDegrees: number): location {
  const rad = angleDegrees * bj_DEGTORAD
  return Location(GetLocationX(baseLoc) + distance * Cos(rad), GetLocationY(baseLoc) + distance * Sin(rad))
}

/**
 * 判断单位是否拥有指定 buff。
 */
function hasUnitBuff(unitHandle: unit, buffId: number): boolean {
  const unitHasBuff = getGlobal<(whichUnit: unit, buffId: number) => boolean>("UnitHasBuffBJ")
  return unitHasBuff ? unitHasBuff(unitHandle, buffId) : false
}

/**
 * 从技能等级读取定值表，等级从 1 开始。
 */
function getLevelValue(values: number[], level: number): number {
  return values[Math.max(0, Math.min(values.length - 1, level - 1))]
}

/**
 * Arcane_Impale_New_stomp：旋转推进的冲击波。
 */
function registerArcaneImpaleTrigger(): void {
  disableLegacyTrigger("gg_trg_Arcane_Impale_New_stomp")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === ARCANE_IMPALE_UNIT_ID && GetSpellAbilityId() === ARCANE_IMPALE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const abilityLevel = GetUnitAbilityLevel(caster, ARCANE_IMPALE_ABILITY_ID)
    const levelIndex = Math.max(1, abilityLevel)
    const baseLoc = GetUnitLoc(caster)
    const lineLoc = polarProjection(baseLoc, 150.0, GetRandomReal(0.0, 360.0))
    const radius = getLevelValue(ARCANE_IMPALE_AOE, levelIndex)
    const damage = GetHeroInt(caster, true) * (2.0 + 1.2 * abilityLevel)
    const hitUnits = new Set<number>()
    const jumpTimer = getGlobal<(whichUnit: unit, angle: number, distance: number, duration: number, step: number, height: number) => void>("YDWEJumpTimer")
    const scaleEffect = getGlobal<(whichEffect: effect, x: number, y: number, z: number) => void>("EXEffectMatScale")
    const traceEffect = AddSpecialEffectLoc(ARCANE_IMPALE_TRACE_EFFECT, lineLoc)
    if (scaleEffect) {
      scaleEffect(traceEffect, 5.0, 5.0, 5.0)
    }
    let angle = 0.0
    const timerHandle = CreateTimer()

    TimerStart(timerHandle, 0.06, true, () => {
      if (angle > 360.0) {
        DestroyEffect(traceEffect)
        RemoveLocation(baseLoc)
        RemoveLocation(lineLoc)
        DestroyTimer(timerHandle)
        return
      }

      const pointCount = 4 + abilityLevel
      let index = 0
      while (index <= pointCount) {
        const pointLoc = polarProjection(lineLoc, radius * (index / pointCount), angle)
        const groupHandle = CreateGroup()
        GroupEnumUnitsInRange(
          groupHandle,
          GetLocationX(pointLoc),
          GetLocationY(pointLoc),
          91.0,
          Filter(() => {
            const target = GetFilterUnit()
            return IsUnitEnemy(target, owner) && !IsUnitType(target, UNIT_TYPE_STRUCTURE()) && isUnitAlive(target)
          })
        )
        ForGroup(groupHandle, () => {
          const target = GetEnumUnit()
          const handleId = GetHandleId(target)
          if (!hitUnits.has(handleId)) {
            hitUnits.add(handleId)
            UnitDamageTarget(caster, target, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
            if (jumpTimer) {
              jumpTimer(target, 0.0, 1.0, 0.7, 0.05, 500.0)
            }
            const hitEffect = AddSpecialEffectTarget(ARCANE_IMPALE_DUMMY_EFFECT, target, "sprite,first")
            destroyEffectLater(hitEffect, 0.3)
          }
        })
        DestroyGroup(groupHandle)
        const missEffect = AddSpecialEffectLoc(ARCANE_IMPALE_MISS_EFFECT, pointLoc)
        destroyEffectLater(missEffect, 1.0)
        RemoveLocation(pointLoc)
        index++
      }

      angle += 12.0
    })
  })
  replaceGlobalTrigger("gg_trg_Arcane_Impale_New_stomp", triggerHandle)
}

/**
 * Starstrike：范围星坠打击。
 */
function registerStarstrikeTrigger(): void {
  disableLegacyTrigger("gg_trg_Starstrike")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === STARSTRIKE_UNIT_ID && GetSpellAbilityId() === STARSTRIKE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const abilityLevel = GetUnitAbilityLevel(caster, STARSTRIKE_ABILITY_ID)
    const centerLoc = GetUnitLoc(caster)
    const radius = getLevelValue(STARSTRIKE_AOE, abilityLevel)
    const damage = 40.0 * abilityLevel + GetHeroInt(caster, true) * (1.0 + 0.4 * abilityLevel)

    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(
      groupHandle,
      GetLocationX(centerLoc),
      GetLocationY(centerLoc),
      radius,
      Filter(() => {
        const target = GetFilterUnit()
        return IsUnitEnemy(target, owner) && !IsUnitType(target, UNIT_TYPE_STRUCTURE()) && isUnitAlive(target)
      })
    )
    ForGroup(groupHandle, () => {
      const target = GetEnumUnit()
      const castFx = AddSpecialEffect("Abilities\\Spells\\NightElf\\Starfall\\StarfallCaster.mdl", GetUnitX(target), GetUnitY(target))
      destroyEffectLater(castFx, 0.6)
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\Starfall\\StarfallTarget.mdl", target, "origin")
      destroyEffectLater(effectHandle, 1.2)
      UnitDamageTarget(caster, target, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
    })
    DestroyGroup(groupHandle)
    RemoveLocation(centerLoc)
  })
  replaceGlobalTrigger("gg_trg_Starstrike", triggerHandle)
}

/**
 * Illusory_Void：迟滞敌人并刷新友军冷却。
 */
function registerIllusoryVoidTrigger(): void {
  disableLegacyTrigger("gg_trg_Illusory_Void")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === ILLUSORY_VOID_UNIT_ID && GetSpellAbilityId() === ILLUSORY_VOID_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const abilityLevel = GetUnitAbilityLevel(caster, ILLUSORY_VOID_ABILITY_ID)
    const centerLoc = GetSpellTargetLoc()
    const centerX = GetLocationX(centerLoc)
    const centerY = GetLocationY(centerLoc)
    const radius = getLevelValue(ILLUSORY_VOID_AOE, abilityLevel)
    const duration = 3.0 + 2.0 * abilityLevel
    const trackedEnemies = CreateGroup()
    const trackedAllies = CreateGroup()
    let cleaned = false

    const cleanup = (): void => {
      if (cleaned) {
        return
      }
      cleaned = true
      ForGroup(trackedEnemies, () => {
        PauseUnit(GetEnumUnit(), false)
      })
      GroupClear(trackedEnemies)
      GroupClear(trackedAllies)
      DestroyGroup(trackedEnemies)
      DestroyGroup(trackedAllies)
      RemoveLocation(centerLoc)
      DestroyTimer(visualTimer)
      DestroyTimer(controlTimer)
    }

    const visualTimer = CreateTimer()
    let visualElapsed = 0.0
    let visualAngleOffset = 0.0
    TimerStart(visualTimer, 0.1, true, () => {
      if (visualElapsed > duration) {
        cleanup()
        return
      }

      let index = 0
      while (index <= 30) {
        const pointLoc = polarProjection(centerLoc, radius, 360.0 * (index / 30.0) + visualAngleOffset)
        const effectHandle = AddSpecialEffectLoc("Abilities\\Spells\\Human\\HolyBolt\\HolyBoltMissile.mdl", pointLoc)
        destroyEffectLater(effectHandle, 0.15)
        RemoveLocation(pointLoc)
        index++
      }

      visualElapsed += 0.1
      visualAngleOffset += 3.0
    })

    const controlTimer = CreateTimer()
    let controlElapsed = 0.0
    TimerStart(controlTimer, 0.75, true, () => {
      if (controlElapsed > duration) {
        cleanup()
        return
      }

      const scanGroup = CreateGroup()
      GroupEnumUnitsInRange(
        scanGroup,
        centerX,
        centerY,
        radius,
        Filter(() => isUnitAlive(GetFilterUnit()))
      )
      ForGroup(scanGroup, () => {
        const target = GetEnumUnit()
        if (IsUnitAlly(target, owner) && IsUnitType(target, UNIT_TYPE_HERO()) && !IsUnitInGroup(target, trackedAllies)) {
          GroupAddUnit(trackedAllies, target)
        } else if (IsUnitEnemy(target, owner) && !IsUnitType(target, UNIT_TYPE_STRUCTURE()) && !IsUnitInGroup(target, trackedEnemies)) {
          GroupAddUnit(trackedEnemies, target)
          PauseUnit(target, true)
        }
      })
      DestroyGroup(scanGroup)

      ForGroup(trackedAllies, () => {
        const ally = GetEnumUnit()
        if (GetUnitTypeId(ally) === ILLUSORY_VOID_UNIT_ID) {
          const impaleLevel = GetUnitAbilityLevel(ally, ARCANE_IMPALE_ABILITY_ID)
          const strikeLevel = GetUnitAbilityLevel(ally, STARSTRIKE_ABILITY_ID)
          if (impaleLevel > 0) {
            UnitRemoveAbility(ally, ARCANE_IMPALE_ABILITY_ID)
            UnitAddAbility(ally, ARCANE_IMPALE_ABILITY_ID)
            SetUnitAbilityLevel(ally, ARCANE_IMPALE_ABILITY_ID, impaleLevel)
          }
          if (strikeLevel > 0) {
            UnitRemoveAbility(ally, STARSTRIKE_ABILITY_ID)
            UnitAddAbility(ally, STARSTRIKE_ABILITY_ID)
            SetUnitAbilityLevel(ally, STARSTRIKE_ABILITY_ID, strikeLevel)
          }
        } else {
          UnitResetCooldown(ally)
        }
      })
      GroupClear(trackedAllies)
      controlElapsed += 0.75
    })
  })
  replaceGlobalTrigger("gg_trg_Illusory_Void", triggerHandle)
}

/**
 * Arcane_Susceptibility_Aura_Learn：开启魔法易损光环。
 */
function registerArcaneSusceptibilityAuraLearnTrigger(): void {
  disableLegacyTrigger("gg_trg_Arcane_Susceptibility_Aura_Learn")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_SKILL())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetLearningUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetLearningUnit()) === ARCANE_SUSCEPTIBILITY_UNIT_ID && GetLearnedSkill() === ARCANE_SUSCEPTIBILITY_LEARN_ID && GetLearnedSkillLevel() === 1))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetLearningUnit()
    const owner = GetOwningPlayer(hero)
    const affectedUnits: unit[] = []
    const timerHandle = CreateTimer()

    const cleanup = (): void => {
      for (const unitHandle of affectedUnits) {
        if (isUnitAlive(unitHandle) && GetUnitAbilityLevel(unitHandle, ARCANE_SUSCEPTIBILITY_AURA_ID) > 0) {
          UnitRemoveAbility(unitHandle, ARCANE_SUSCEPTIBILITY_AURA_ID)
        }
      }
      affectedUnits.length = 0
      DestroyTimer(timerHandle)
    }

    TimerStart(timerHandle, 0.5, true, () => {
      if (!isUnitAlive(hero)) {
        cleanup()
        return
      }

      for (const unitHandle of affectedUnits) {
        if (isUnitAlive(unitHandle) && GetUnitAbilityLevel(unitHandle, ARCANE_SUSCEPTIBILITY_AURA_ID) > 0) {
          UnitRemoveAbility(unitHandle, ARCANE_SUSCEPTIBILITY_AURA_ID)
        }
      }
      affectedUnits.length = 0

      const currentLevel = GetUnitAbilityLevel(hero, ARCANE_SUSCEPTIBILITY_LEARN_ID)
      const heroLoc = GetUnitLoc(hero)
      const groupHandle = CreateGroup()
      GroupEnumUnitsInRange(
        groupHandle,
        GetLocationX(heroLoc),
        GetLocationY(heroLoc),
        700.0,
        Filter(() => isUnitAlive(GetFilterUnit()) && hasUnitBuff(GetFilterUnit(), ILLUSORY_VOID_AURA_BUFF_ID))
      )
      ForGroup(groupHandle, () => {
        const target = GetEnumUnit()
        if (IsUnitAlly(target, owner)) {
          UnitAddAbility(target, ARCANE_SUSCEPTIBILITY_AURA_ID)
          SetUnitAbilityLevel(target, ARCANE_SUSCEPTIBILITY_AURA_ID, currentLevel)
          affectedUnits.push(target)
        }
      })
      DestroyGroup(groupHandle)
      RemoveLocation(heroLoc)
    })
  })
  replaceGlobalTrigger("gg_trg_Arcane_Susceptibility_Aura_Learn", triggerHandle)
}

/**
 * Arcane_Susceptibility_Aura_Damage：魔法伤害触发智力提升。
 */
function registerArcaneSusceptibilityAuraDamageTrigger(): void {
  disableLegacyTrigger("gg_trg_Arcane_Susceptibility_Aura_Damage")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => {
    const source = GetEventDamageSource()
    const getEventDamageType = getGlobal<() => unknown>("BlzGetEventDamageType")
    const getEventAttackType = getGlobal<() => unknown>("BlzGetEventAttackType")
    const damageType = getEventDamageType ? getEventDamageType() : undefined
    const attackType = getEventAttackType ? getEventAttackType() : undefined
    const isMagicDamage = damageType === DAMAGE_TYPE_MAGIC() || attackType === ATTACK_TYPE_MAGIC()
    return (
      IsUnitEnemy(GetTriggerUnit(), GetOwningPlayer(source)) &&
      GetUnitAbilityLevel(source, ARCANE_SUSCEPTIBILITY_LEARN_ID) > 0 &&
      GetUnitTypeId(source) === ARCANE_SUSCEPTIBILITY_UNIT_ID &&
      isMagicDamage
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    const level = GetUnitAbilityLevel(source, ARCANE_SUSCEPTIBILITY_LEARN_ID)
    const bonus = GetRandomInt(1, level + 1)
    if (GetRandomInt(1, 100) <= level + 1) {
      DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "研法者洞悉魔法的奥秘，提高了" + I2S(bonus) + "智力 ")
      SetHeroInt(source, GetHeroInt(source, true) + bonus, true)
      DisableTrigger(triggerHandle)
      const reenableTimer = CreateTimer()
      TimerStart(reenableTimer, 5.0, false, () => {
        EnableTrigger(triggerHandle)
        DestroyTimer(reenableTimer)
      })
    }
  })
  replaceGlobalTrigger("gg_trg_Arcane_Susceptibility_Aura_Damage", triggerHandle)
}

/**
 * 入口：迁移 Arcane/奥术系触发器。
 */
export function migrateArcaneSpellTriggers(): void {
  registerArcaneImpaleTrigger()
  registerStarstrikeTrigger()
  registerIllusoryVoidTrigger()
  registerArcaneSusceptibilityAuraLearnTrigger()
  registerArcaneSusceptibilityAuraDamageTrigger()
}

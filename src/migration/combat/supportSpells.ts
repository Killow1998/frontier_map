import {
  ATTACK_TYPE_MAGIC,
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_MAGIC,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_STATE_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { applyUnitBonus, disableLegacyTrigger, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const COUNTDOWN_TEXT_SCALE = 0.074

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
 * 延迟销毁闪电。
 */
function destroyLightningLater(lightningHandle: lightning, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyLightning(lightningHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 创建单位脚下的倒计时文字。
 */
function createCountdownTextTag(whichUnit: unit, text: string): texttag {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, text, COUNTDOWN_TEXT_SCALE)
  SetTextTagPosUnit(textTag, whichUnit, 15.0)
  SetTextTagColor(textTag, 255, 28, 28, 255)
  SetTextTagVelocity(textTag, 0.0, 0.03)
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 0.75)
  SetTextTagFadepoint(textTag, 0.45)
  return textTag
}

/**
 * 在范围内枚举满足条件的单位。
 */
function collectUnitsInRange(
  x: number,
  y: number,
  radius: number,
  filter: (whichUnit: unit) => boolean
): unit[] {
  const groupHandle = CreateGroup()
  const units: unit[] = []
  GroupEnumUnitsInRange(groupHandle, x, y, radius, Filter(() => filter(GetFilterUnit())))
  ForGroup(groupHandle, () => {
    units.push(GetEnumUnit())
  })
  DestroyGroup(groupHandle)
  return units
}

/**
 * 吞噬腺体：以法力换生命并强化自身。
 */
function registerDigestiveGlandsTrigger(): void {
  disableLegacyTrigger("gg_trg_digestive_glands")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A09M")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const target = GetSpellTargetUnit()
    const currentMana = GetUnitState(caster, UNIT_STATE_MANA())
    const targetThreshold = GetUnitState(target, UNIT_STATE_LIFE()) * 1.25
    const currentMaxMana = GetUnitState(caster, UNIT_STATE_MAX_MANA())

    SetUnitState(caster, UNIT_STATE_MANA(), 0.0)
    if (currentMana >= targetThreshold) {
      const maxLifeBonus = Math.floor(GetUnitState(target, UNIT_STATE_MAX_LIFE()) * 0.25)
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\TargetArtLumber\\TargetArtLumber.mdl", caster, "origin")
      destroyEffectLater(effectHandle, 2.0)
      SetUnitState(caster, UNIT_STATE_MAX_LIFE(), GetUnitState(caster, UNIT_STATE_MAX_LIFE()) + maxLifeBonus)
      SetUnitState(caster, UNIT_STATE_MAX_MANA(), Math.max(0.0, currentMaxMana - 0.06))
      UnitDamageTarget(caster, target, GetUnitState(target, UNIT_STATE_LIFE()) * 9.0, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      DisplayTextToPlayer(GetOwningPlayer(caster), 0, 0, GetUnitName(caster) + "吞噬成功，获得了" + I2S(maxLifeBonus) + "点生命上限")
    } else {
      const manaPenalty = GetRandomInt(10, 100)
      SetUnitState(caster, UNIT_STATE_MAX_MANA(), Math.max(1.0, currentMaxMana - manaPenalty))
      DisplayTextToPlayer(GetOwningPlayer(caster), 0, 0, GetUnitName(caster) + "吞噬失败，损失了" + I2S(manaPenalty) + "点魔法上限")
    }
  })
  replaceGlobalTrigger("gg_trg_digestive_glands", triggerHandle)
}

/**
 * 漩涡沉默：读条后对目标位置施放群体沉默。
 */
function registerAreaSilenceTrigger(): void {
  disableLegacyTrigger("gg_trg_area_slience")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A091")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const targetX = GetSpellTargetX()
    const targetY = GetSpellTargetY()

    const setupTimer = CreateTimer()
    TimerStart(setupTimer, 0.2, false, () => {
      DestroyTimer(setupTimer)
      PauseUnit(caster, true)
      SetUnitAnimation(caster, "stand")
      SetUnitAnimation(caster, "channel")

      let remaining = 3
      const countdownTimer = CreateTimer()
      TimerStart(countdownTimer, 1.0, true, () => {
        const textTag = createCountdownTextTag(caster, I2S(remaining))
        destroyTextTagLater(textTag, 0.75)
        if (remaining <= 1) {
          SetUnitAnimation(caster, "stand")
          PauseUnit(caster, false)

          const dummy = CreateUnit(GetOwningPlayer(caster), FourCC("ewsp"), targetX, targetY, bj_UNIT_FACING)
          ShowUnit(dummy, false)
          SetUnitInvulnerable(dummy, true)
          UnitAddAbility(dummy, FourCC("A090"))
          IssuePointOrder(dummy, "silence", targetX, targetY)

          const cleanupTimer = CreateTimer()
          TimerStart(cleanupTimer, 1.5, false, () => {
            RemoveUnit(dummy)
            DestroyTimer(cleanupTimer)
          })

          DestroyTimer(countdownTimer)
        }
        remaining--
      })
    })
  })
  replaceGlobalTrigger("gg_trg_area_slience", triggerHandle)
}

/**
 * hpwave：治疗链波，按附近友军的受伤单位依次抬血。
 */
function registerHpWaveTrigger(): void {
  disableLegacyTrigger("gg_trg_hpwave")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A08U")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const healAmount = Math.floor(GetUnitState(caster, UNIT_STATE_MAX_LIFE()) * 0.07)
    const allies = collectUnitsInRange(GetUnitX(caster), GetUnitY(caster), 700.0, (enumUnit) => {
      return (
        enumUnit !== caster &&
        GetWidgetLife(enumUnit) > 0.405 &&
        GetUnitState(enumUnit, UNIT_STATE_LIFE()) < GetUnitState(enumUnit, UNIT_STATE_MAX_LIFE()) &&
        IsUnitAlly(enumUnit, GetOwningPlayer(caster)) &&
        !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE())
      )
    })

    if (allies.length === 0) {
      SetUnitState(caster, UNIT_STATE_LIFE(), GetUnitState(caster, UNIT_STATE_LIFE()) + healAmount * 2)
      return
    }

    SetUnitState(caster, UNIT_STATE_LIFE(), GetUnitState(caster, UNIT_STATE_LIFE()) + healAmount * 2)

    let index = 0
    let previousUnit = caster
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 0.35, true, () => {
      if (index >= allies.length) {
        DestroyTimer(timerHandle)
        return
      }

      const currentUnit = allies[index++]
      SetUnitState(currentUnit, UNIT_STATE_LIFE(), GetUnitState(currentUnit, UNIT_STATE_LIFE()) + healAmount)
      const fx = AddSpecialEffectTarget("Abilities\\Spells\\Undead\\ReplenishHealth\\ReplenishHealthCaster.mdl", currentUnit, "overhead")
      destroyEffectLater(fx, 0.44)
      const dummy = CreateUnit(GetOwningPlayer(currentUnit), FourCC("ewsp"), GetUnitX(currentUnit), GetUnitY(currentUnit), bj_UNIT_FACING)
      ShowUnit(dummy, false)
      SetUnitInvulnerable(dummy, true)
      UnitAddAbility(dummy, FourCC("A08V"))
      IssueTargetOrder(dummy, "innerfire", currentUnit)
      const removeTimer = CreateTimer()
      TimerStart(removeTimer, 1.5, false, () => {
        RemoveUnit(dummy)
        DestroyTimer(removeTimer)
      })

      const lightningHandle = AddLightning("AFOD", true, GetUnitX(previousUnit), GetUnitY(previousUnit), GetUnitX(currentUnit), GetUnitY(currentUnit))
      destroyLightningLater(lightningHandle, 0.44)
      previousUnit = currentUnit
    })
  })
  replaceGlobalTrigger("gg_trg_hpwave", triggerHandle)
}

/**
 * mana_steal：从周围敌人身上按顺序抽取法力。
 */
function registerManaStealTrigger(): void {
  disableLegacyTrigger("gg_trg_mana_steal")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A08Z")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const drainAmount = Math.floor(GetUnitState(caster, UNIT_STATE_MAX_LIFE()) * 0.04)
    const enemies = collectUnitsInRange(GetUnitX(caster), GetUnitY(caster), 1200.0, (enumUnit) => {
      return (
        enumUnit !== caster &&
        GetWidgetLife(enumUnit) > 0.405 &&
        GetUnitState(enumUnit, UNIT_STATE_MANA()) > 0.0 &&
        IsUnitEnemy(enumUnit, GetOwningPlayer(caster)) &&
        !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE())
      )
    }).slice(0, 7)

    if (enemies.length === 0) {
      return
    }

    let index = 0
    const sourceFx = AddSpecialEffectTarget("Abilities\\Spells\\Undead\\ReplenishHealth\\ReplenishHealthCaster.mdl", caster, "overhead")
    destroyEffectLater(sourceFx, 0.44)
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 0.35, true, () => {
      if (index >= enemies.length) {
        DestroyTimer(timerHandle)
        return
      }

      const targetUnit = enemies[index++]
      SetUnitState(targetUnit, UNIT_STATE_MANA(), Math.max(0.0, GetUnitState(targetUnit, UNIT_STATE_MANA()) - drainAmount))
      UnitDamageTarget(caster, targetUnit, drainAmount * 1.25, false, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
      SetUnitState(caster, UNIT_STATE_MANA(), GetUnitState(caster, UNIT_STATE_MANA()) + drainAmount)

      const lightningHandle = AddLightning("DRAM", true, GetUnitX(caster), GetUnitY(caster), GetUnitX(targetUnit), GetUnitY(targetUnit))
      destroyLightningLater(lightningHandle, 0.44)

      const targetFx = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Drain\\ManaDrainTarget.mdl", targetUnit, "overhead")
      destroyEffectLater(targetFx, 0.44)
    })
  })
  replaceGlobalTrigger("gg_trg_mana_steal", triggerHandle)
}

/**
 * enemy_group：召唤战团协同作战（3若弩手 + 2近战 + 1精英）。
 */
function registerEnemyGroupTrigger(): void {
  disableLegacyTrigger("gg_trg_enemy_group")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A08T")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const enemyWaveCount = getGlobal<number>("udg_enemywaveCount") ?? 0

    const spawnOne = (unitId: number, scaleLife: boolean): void => {
      const angle = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
      const distance = GetRandomReal(80.0, 256.0)
      const x = GetUnitX(caster) + distance * Cos(angle)
      const y = GetUnitY(caster) + distance * Sin(angle)
      const summonFx = AddSpecialEffect("Abilities\\Spells\\Orc\\FeralSpirit\\feralspirittarget.mdl", x, y)
      destroyEffectLater(summonFx, 0.34)
      const summoned = CreateUnit(GetOwningPlayer(caster), unitId, x, y, bj_UNIT_FACING)
      if (scaleLife) {
        SetUnitState(summoned, UNIT_STATE_MAX_LIFE(), GetUnitState(summoned, UNIT_STATE_MAX_LIFE()) + 62.0 * enemyWaveCount)
        SetUnitState(summoned, UNIT_STATE_LIFE(), GetUnitState(summoned, UNIT_STATE_MAX_LIFE()))
      }
      applyUnitBonus(summoned, 3, 0, GetRandomInt(1, 99))
      UnitApplyTimedLife(summoned, FourCC("BHwe"), 42.0)
    }

    for (let i = 0; i < 3; i++) {
      spawnOne(FourCC("n011"), true)
    }
    for (let i = 0; i < 2; i++) {
      spawnOne(FourCC("u00F"), false)
    }
    spawnOne(FourCC("o002"), false)
  })
  replaceGlobalTrigger("gg_trg_enemy_group", triggerHandle)
}

/**
 * 入口：迁移 digestive_glands / area_slience / hpwave / mana_steal / enemy_group。
 */
export function migrateSupportSpellTriggers(): void {
  registerDigestiveGlandsTrigger()
  registerAreaSilenceTrigger()
  registerHpWaveTrigger()
  registerManaStealTrigger()
  registerEnemyGroupTrigger()
}

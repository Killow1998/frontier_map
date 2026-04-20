import { EVENT_PLAYER_UNIT_SPELL_EFFECT, UNIT_STATE_LIFE, UNIT_STATE_MAX_LIFE, UNIT_TYPE_STRUCTURE } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const HOLY_LIGHT_GUARDIAN_ABILITY_ID = FourCC("A0A3")

/**
 * 延迟结束神圣护佑效果。
 */
function scheduleHolyLightEnd(targetUnit: unit, effectHandle: effect, duration: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    SetUnitInvulnerable(targetUnit, false)
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * holy_light_guardian：
 * 对施法目标提供短时无敌，建筑目标额外回复生命并延长持续时间。
 */
function registerHolyLightGuardianTrigger(): void {
  disableLegacyTrigger("gg_trg_holy_light_guardian")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === HOLY_LIGHT_GUARDIAN_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const targetUnit = GetSpellTargetUnit()
    if (!targetUnit) {
      return
    }

    if (IsUnitType(targetUnit, UNIT_TYPE_STRUCTURE())) {
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Items\\AIda\\AIdaTarget.mdl", targetUnit, "overhead")
      SetUnitInvulnerable(targetUnit, true)
      const currentLife = GetUnitState(targetUnit, UNIT_STATE_LIFE())
      const maxLife = GetUnitState(targetUnit, UNIT_STATE_MAX_LIFE())
      const nextLife = currentLife + maxLife * 0.091
      SetWidgetLife(targetUnit, nextLife > maxLife ? maxLife : nextLife)
      scheduleHolyLightEnd(targetUnit, effectHandle, 21.0)
      return
    }

    const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Human\\DivineShield\\DivineShieldTarget.mdl", targetUnit, "origin")
    SetUnitInvulnerable(targetUnit, true)
    scheduleHolyLightEnd(targetUnit, effectHandle, 4.7)
  })
  replaceGlobalTrigger("gg_trg_holy_light_guardian", triggerHandle)
}

/**
 * 入口：迁移 holy_light_guardian 触发器。
 */
export function migrateHolyLightGuardianTrigger(): void {
  registerHolyLightGuardianTrigger()
}

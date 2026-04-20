import {
  UNIT_STATE_ATTACK_RANGE,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, registerAnyUnitDamagedEvent, replaceGlobalTrigger } from "../core/helpers"

/**
 * 在单位背包里查找指定类型物品。
 */
function hasItemByTypeId(unitHandle: unit, itemTypeId: number): boolean {
  for (let slot = 0; slot < 6; slot++) {
    const current = UnitItemInSlot(unitHandle, slot)
    if (current && GetItemTypeId(current) === itemTypeId) {
      return true
    }
  }
  return false
}

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(duration: number, effectHandle: effect): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * hp_steal：
 * 按 buff/装备叠加吸血系数，在满足阈值时为伤害来源恢复生命。
 */
function registerHpStealTrigger(): void {
  disableLegacyTrigger("gg_trg_hp_steal")
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetEventDamage() >= 1.0))
  TriggerAddAction(triggerHandle, () => {
    const damageSource = GetEventDamageSource()
    let stealRate = 0.0

    if (GetUnitAbilityLevel(damageSource, FourCC("B009")) > 0 && GetUnitState(damageSource, UNIT_STATE_ATTACK_RANGE()) <= 250.0) {
      stealRate += 0.07
    } else if (GetUnitAbilityLevel(damageSource, FourCC("B00T")) > 0 && GetUnitState(damageSource, UNIT_STATE_ATTACK_RANGE()) <= 250.0) {
      stealRate += 0.13
    }

    if (hasItemByTypeId(damageSource, FourCC("I027"))) {
      stealRate += 0.06
    } else if (hasItemByTypeId(damageSource, FourCC("I028"))) {
      stealRate += 0.07
    } else if (hasItemByTypeId(damageSource, FourCC("I022"))) {
      stealRate += 0.13
    }

    const stealValue = stealRate * GetEventDamage()
    if (stealValue >= 10.0 && GetUnitState(damageSource, UNIT_STATE_MAX_LIFE()) > GetUnitState(damageSource, UNIT_STATE_LIFE())) {
      const effectHandle = AddSpecialEffectTarget(
        "Abilities\\Spells\\Undead\\VampiricAura\\VampiricAuraTarget.mdl",
        damageSource,
        "chest"
      )
      destroyEffectLater(0.2, effectHandle)
      SetUnitState(damageSource, UNIT_STATE_LIFE(), GetUnitState(damageSource, UNIT_STATE_LIFE()) + stealValue)
    }
  })
  replaceGlobalTrigger("gg_trg_hp_steal", triggerHandle)
}

/**
 * 入口：迁移 hp_steal 触发器。
 */
export function migrateHpStealTrigger(): void {
  registerHpStealTrigger()
}

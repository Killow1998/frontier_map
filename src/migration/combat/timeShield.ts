import { bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { applyUnitBonus, disableLegacyTrigger, registerAnyUnitDamagedEvent, replaceGlobalTrigger } from "../core/helpers"

const TIME_SHIELD_ITEM_ID = FourCC("I02U")
const TIME_SHIELD_SLOW_ABILITY_ID = FourCC("A09C")
const DUMMY_UNIT_TYPE_ID = FourCC("ewsp")

/**
 * 判断单位背包中是否携带指定道具。
 */
function hasItem(unitHandle: unit, itemTypeId: number): boolean {
  for (let slot = 0; slot < 6; slot++) {
    const itemHandle = UnitItemInSlot(unitHandle, slot)
    if (itemHandle && GetItemTypeId(itemHandle) === itemTypeId) {
      return true
    }
  }
  return false
}

/**
 * 延迟移除临时单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 施加 3 秒临时防御惩罚。
 */
function applyTemporaryArmorPenalty(target: unit): void {
  applyUnitBonus(target, 2, 1, 3)
  const rollbackTimer = CreateTimer()
  TimerStart(rollbackTimer, 3.0, false, () => {
    applyUnitBonus(target, 2, 0, 3)
    DestroyTimer(rollbackTimer)
  })
}

/**
 * time_shield：
 * 持有 I02U 的单位受伤时有 30% 概率反制攻击者（临时马甲施放 Slow）。
 */
function registerTimeShieldTrigger(): void {
  disableLegacyTrigger("gg_trg_time_shield")
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => hasItem(GetTriggerUnit(), TIME_SHIELD_ITEM_ID)))
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    if (!source) {
      return
    }
    if (GetRandomInt(1, 100) > 30) {
      return
    }

    const dummy = CreateUnit(GetOwningPlayer(target), DUMMY_UNIT_TYPE_ID, GetUnitX(source), GetUnitY(source), bj_UNIT_FACING)
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, TIME_SHIELD_SLOW_ABILITY_ID)
    IssueTargetOrder(dummy, "slow", source)
    removeUnitLater(dummy, 3.0)
    applyTemporaryArmorPenalty(source)
  })
  replaceGlobalTrigger("gg_trg_time_shield", triggerHandle)
}

/**
 * 入口：迁移 time_shield 触发器。
 */
export function migrateTimeShieldTrigger(): void {
  registerTimeShieldTrigger()
}

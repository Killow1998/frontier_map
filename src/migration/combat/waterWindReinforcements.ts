import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  WEAPON_TYPE_WHOKNOWS
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const WATER_SHIELD_BUFF_ID = FourCC("B004")

/**
 * 水盾事件重构。
 */
function registerWaterShieldTrigger(): void {
  disableLegacyTrigger("gg_trg_water_shield")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    const damage = GetEventDamage()
    if (damage <= 10.0 || GetUnitAbilityLevel(target, WATER_SHIELD_BUFF_ID) === 0) return

    const tx = GetUnitX(target)
    const ty = GetUnitY(target)
    
    // 【同步加固】
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 250.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      if (IsUnitEnemy(u, GetOwningPlayer(target)) && GetWidgetLife(u) > 0.405) {
        UnitDamageTarget(target, u, damage * 0.40, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    GroupClear(SYNC_GROUP)
  })
  
  replaceGlobalTrigger("gg_trg_water_shield", triggerHandle)
}

export function migrateReinforcementTriggers(): void {
  registerWaterShieldTrigger()
}

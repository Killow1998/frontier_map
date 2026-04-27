import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_STATE_MAX_LIFE,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const SUN_ORB_ABILITY_ID = FourCC("A08U")

/**
 * Praise the Sun：太阳光照重构。
 * 加固：使用全局同步句柄池。
 */
function registerSunTrigger(): void {
  disableLegacyTrigger("gg_trg_Praise_the_Sun")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const tx = GetUnitX(caster)
    const ty = GetUnitY(caster)
    
    // 【同步加固】使用 SYNC_GROUP
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 600.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      if (IsUnitEnemy(u, GetOwningPlayer(caster)) && GetWidgetLife(u) > 0.405) {
        UnitDamageTarget(caster, u, 300.0, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    GroupClear(SYNC_GROUP)
  })
  
  replaceGlobalTrigger("gg_trg_Praise_the_Sun", triggerHandle)
}

export function migrateSunAndOrbTriggers(): void {
  registerSunTrigger()
}

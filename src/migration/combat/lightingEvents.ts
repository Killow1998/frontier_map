import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const LIGHTING_ABILITY_ID = FourCC("A08U")

/**
 * 雷击事件重构。
 * 加固：使用全局同步句柄池。
 */
function registerLightingTrigger(): void {
  disableLegacyTrigger("gg_trg_lighting_armor_attack")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    const caster = GetEventDamageSource()
    if (!caster) return

    const tx = GetUnitX(target)
    const ty = GetUnitY(target)
    
    // 【同步加固】
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 300.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      if (IsUnitEnemy(u, GetOwningPlayer(target)) && GetWidgetLife(u) > 0.405) {
        UnitDamageTarget(target, u, 100.0, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), null)
        const fx = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\LightningShield\\LightningShieldBuff.mdl", u, "origin")
        const t = CreateTimer()
        TimerStart(t, 0.5, false, () => {
          DestroyEffect(fx)
          DestroyTimer(t)
        })
      }
    })
    GroupClear(SYNC_GROUP)
  })
  
  replaceGlobalTrigger("gg_trg_lighting_armor_attack", triggerHandle)
}

export function migrateLightingTriggers(): void {
  registerLightingTrigger()
}

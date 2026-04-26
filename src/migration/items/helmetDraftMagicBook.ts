import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_TYPE_STRUCTURE
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const BOOK_FIRE_ABILITY_ID = FourCC("A01N")

/**
 * 魔法书：烈焰释放逻辑重构。
 * 加固：使用全局同步组池。
 */
function registerBookFireTrigger(): void {
  disableLegacyTrigger("gg_trg_book_fire")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const tx = GetSpellTargetX()
    const ty = GetSpellTargetY()
    const owner = GetOwningPlayer(caster)
    
    // 【同步加固】
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 350.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      if (IsUnitEnemy(u, owner) && !IsUnitType(u, UNIT_TYPE_STRUCTURE()) && GetWidgetLife(u) > 0.405) {
        UnitDamageTarget(caster, u, 250.0, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), null)
        const fx = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Incinerate\\FireLordDeathExplode.mdl", u, "origin")
        const t = CreateTimer()
        TimerStart(t, 0.5, false, () => {
          DestroyEffect(fx)
          DestroyTimer(t)
        })
      }
    })
    GroupClear(SYNC_GROUP)
  })
  
  replaceGlobalTrigger("gg_trg_book_fire", triggerHandle)
}

export function migrateBookTriggers(): void {
  registerBookFireTrigger()
}

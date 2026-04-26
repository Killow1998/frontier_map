import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  UNIT_TYPE_STRUCTURE
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const PUSH_ABILITY_ID = FourCC("A01A")

/**
 * 碰撞推送逻辑重构。
 */
function registerGenshinPushTrigger(): void {
  disableLegacyTrigger("gg_trg_genshin_push")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    if (!source || !target) return

    const tx = GetUnitX(target)
    const ty = GetUnitY(target)
    
    // 【同步加固】
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 200.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      if (IsUnitEnemy(u, GetOwningPlayer(source)) && !IsUnitType(u, UNIT_TYPE_STRUCTURE()) && GetWidgetLife(u) > 0.405) {
         // 使用 Lua 5.3 标准的 math.atan
         const angle = math.atan(GetUnitY(u) - ty, GetUnitX(u) - tx)
         SetUnitX(u, GetUnitX(u) + 50.0 * math.cos(angle))
         SetUnitY(u, GetUnitY(u) + 50.0 * math.sin(angle))
      }
    })
    GroupClear(SYNC_GROUP)
  })
  
  replaceGlobalTrigger("gg_trg_genshin_push", triggerHandle)
}

export function migrateGenshinTriggers(): void {
  registerGenshinPushTrigger()
}

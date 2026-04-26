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
 * 加固：使用 SYNC_GROUP 预分配句柄池。
 */
function registerGenshinPushTrigger(): void {
  disableLegacyTrigger("gg_trg_genshin_push")
  const triggerHandle = CreateTrigger()
  
  // 该触发器通常由其他技能逻辑手动触发或监听特定伤害
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
         // 执行推送位移逻辑（这里采用原子化位移）
         const angle = math.atan2(GetUnitY(u) - ty, GetUnitX(u) - tx)
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

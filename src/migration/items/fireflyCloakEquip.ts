import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
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

const FIREFLY_CLOAK_BUFF_ID = FourCC("B005")

/**
 * 萤火披风：周期性对周围敌人造成伤害。
 * 加固：使用全局同步组池。
 */
function registerFireflyCloakTrigger(): void {
  disableLegacyTrigger("gg_trg_Firefly_Cloak_Equip")
  const triggerHandle = CreateTrigger()
  
  // 每 1.0 秒执行一次全图拥有披风单位的同步伤害判定
  const timer = CreateTimer()
  TimerStart(timer, 1.0, true, () => {
    // 【同步加固】使用 SYNC_GROUP 枚举具有 Buff 的单位，避免 Handle 分叉
    GroupClear(SYNC_GROUP)
    const world = GetWorldBounds()
    GroupEnumUnitsInRect(SYNC_GROUP, world, null)
    
    ForGroup(SYNC_GROUP, () => {
      const caster = GetEnumUnit()
      if (GetUnitAbilityLevel(caster, FIREFLY_CLOAK_BUFF_ID) > 0 && GetWidgetLife(caster) > 0.405) {
        const cx = GetUnitX(caster)
        const cy = GetUnitY(caster)
        const owner = GetOwningPlayer(caster)
        
        // 嵌套枚举必须使用另一个同步组
        GroupClear(SYNC_TEMP_GROUP)
        GroupEnumUnitsInRange(SYNC_TEMP_GROUP, cx, cy, 300.0, null)
        ForGroup(SYNC_TEMP_GROUP, () => {
          const target = GetEnumUnit()
          if (IsUnitEnemy(target, owner) && !IsUnitType(target, UNIT_TYPE_STRUCTURE()) && GetWidgetLife(target) > 0.405) {
            UnitDamageTarget(caster, target, 25.0, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), null)
          }
        })
      }
    })
    
    GroupClear(SYNC_GROUP)
    GroupClear(SYNC_TEMP_GROUP)
    RemoveRect(world)
  })
  
  replaceGlobalTrigger("gg_trg_Firefly_Cloak_Equip", triggerHandle)
}

export function migrateFireflyTriggers(): void {
  registerFireflyCloakTrigger()
}

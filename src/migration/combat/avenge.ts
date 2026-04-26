import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  findItemInInventory,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const AVENGE_ITEM_ID = FourCC("I004")
const AVENGE_BUFF_ID = FourCC("B000")
const AVENGE_ABILITY_ID = FourCC("A002")

/**
 * avenge：受击积累复仇能量并反伤。
 */
function registerAvengeTrigger(): void {
  disableLegacyTrigger("gg_trg_Avenge")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    const source = GetEventDamageSource()
    if (!source || GetUnitAbilityLevel(target, AVENGE_BUFF_ID) === 0) return

    const damage = GetEventDamage()
    const owner = GetOwningPlayer(target)

    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, GetUnitX(target), GetUnitY(target), 450.0, null)
    ForGroup(SYNC_GROUP, () => {
      const enumUnit = GetEnumUnit()
      if (IsUnitEnemy(enumUnit, owner) && GetWidgetLife(enumUnit) > 0.405) {
        // 【同步加固】修正 weapontype 传递
        UnitDamageTarget(target, enumUnit, damage * 0.15, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    GroupClear(SYNC_GROUP)
  })
  replaceGlobalTrigger("gg_trg_Avenge", triggerHandle)
}

export function migrateAvengeTriggers(): void {
  registerAvengeTrigger()
}

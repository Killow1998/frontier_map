import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_UNIT_ATTACKED,
  EVENT_PLAYER_UNIT_DROP_ITEM,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  UNIT_STATE_ATTACK_WHITE,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_HERO,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  findItemInInventory,
  getGlobal,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  setGlobal
} from "../core/helpers"

const AVENGE_ITEM_ID = FourCC("I004")

/**
 * 获取复仇装备持有者分组；若尚未初始化则即时创建。
 */
function getAvengeGroup(): group {
  const groupHandle = getGlobal<group>("udg_Avenge_Group")
  if (groupHandle) {
    return groupHandle
  }
  const createdGroup = CreateGroup()
  setGlobal("udg_Avenge_Group", createdGroup)
  return createdGroup
}

/**
 * 在单位头顶显示短时文字标签。
 */
function showFloatingText(unitHandle: unit, text: string, red: number, green: number, blue: number, angleMin: number, angleMax: number): void {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, text, 0.023)
  SetTextTagPosUnit(textTag, unitHandle, 10)
  const angle = GetRandomReal(angleMin, angleMax) * bj_DEGTORAD
  const speed = 0.04
  SetTextTagVelocity(textTag, speed * Math.cos(angle), speed * Math.sin(angle))
  SetTextTagColor(textTag, red, green, blue, 255)
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 0.5)
  SetTextTagFadepoint(textTag, 0.4)
}

/**
 * Avenge_Equip：
 * 英雄拾取/丢弃 I004 时，维护 udg_Avenge_Group 持有者名单。
 */
function registerAvengeEquipTrigger(): void {
  disableLegacyTrigger("gg_trg_Avenge_Equip")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DROP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === AVENGE_ITEM_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const avengeGroup = getAvengeGroup()
    if (findItemInInventory(hero, AVENGE_ITEM_ID)) {
      GroupAddUnit(avengeGroup, hero)
    } else {
      GroupRemoveUnit(avengeGroup, hero)
    }
  })
  replaceGlobalTrigger("gg_trg_Avenge_Equip", triggerHandle)
}

/**
 * Avenge_Timer：
 * 每 7 秒衰减一次 I004 层数（-10，最低 0）。
 */
function registerAvengeTimerTrigger(): void {
  disableLegacyTrigger("gg_trg_Avenge_Timer")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 7.0, true)
  TriggerAddAction(triggerHandle, () => {
    const avengeGroup = getAvengeGroup()
    const staleUnits: unit[] = []
    ForGroup(avengeGroup, () => {
      const enumUnit = GetEnumUnit()
      if (GetUnitState(enumUnit, UNIT_STATE_LIFE()) <= 0.405) {
        staleUnits.push(enumUnit)
        return
      }
      const avengeItem = findItemInInventory(enumUnit, AVENGE_ITEM_ID)
      if (!avengeItem) {
        staleUnits.push(enumUnit)
        return
      }
      const currentCharges = GetItemCharges(avengeItem)
      SetItemCharges(avengeItem, currentCharges > 10 ? currentCharges - 10 : 0)
    })
    for (const unitHandle of staleUnits) {
      GroupRemoveUnit(avengeGroup, unitHandle)
    }
  })
  replaceGlobalTrigger("gg_trg_Avenge_Timer", triggerHandle)
}

/**
 * Avenge_Attacked：
 * I004 持有者被攻击时增加层数并反伤；高层数时额外强化生命与攻击。
 */
function registerAvengeAttackedTrigger(): void {
  disableLegacyTrigger("gg_trg_Avenge_Attacked")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_ATTACKED())
  TriggerAddCondition(triggerHandle, Condition(() => !!findItemInInventory(GetTriggerUnit(), AVENGE_ITEM_ID)))
  TriggerAddAction(triggerHandle, () => {
    const attackedUnit = GetTriggerUnit()
    const attacker = GetAttacker()
    if (!attacker || GetUnitState(attacker, UNIT_STATE_LIFE()) <= 0.405) {
      return
    }

    const avengeItem = findItemInInventory(attackedUnit, AVENGE_ITEM_ID)
    if (!avengeItem) {
      return
    }

    let charges = GetItemCharges(avengeItem)
    if (charges < 100) {
      charges += 1
    }
    SetItemCharges(avengeItem, charges)

    const damage = charges * 0.5
    UnitDamageTarget(attackedUnit, attacker, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())

    if (charges >= 49) {
      SetUnitState(attackedUnit, UNIT_STATE_MAX_LIFE(), GetUnitState(attackedUnit, UNIT_STATE_MAX_LIFE()) + 1)
      showFloatingText(attackedUnit, "HP↑", 25, 100, 25, 155, 165)
      if (charges % 49 === 0) {
        SetUnitState(attackedUnit, UNIT_STATE_ATTACK_WHITE(), GetUnitState(attackedUnit, UNIT_STATE_ATTACK_WHITE()) + 1)
        showFloatingText(attackedUnit, "ATK↑", 100, 25, 25, 15, 25)
      }
    }
  })
  replaceGlobalTrigger("gg_trg_Avenge_Attacked", triggerHandle)
}

/**
 * 入口：迁移 Avenge_Equip / Avenge_Timer / Avenge_Attacked。
 */
export function migrateAvengeTriggers(): void {
  registerAvengeEquipTrigger()
  registerAvengeTimerTrigger()
  registerAvengeAttackedTrigger()
}

import { EVENT_PLAYER_UNIT_DROP_ITEM, EVENT_PLAYER_UNIT_PICKUP_ITEM, EVENT_PLAYER_UNIT_USE_ITEM, UNIT_STATE_LIFE, UNIT_TYPE_HERO, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { countItemInInventory, disableLegacyTrigger, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const SHIELD_ITEM_1 = FourCC("I00F")
const SHIELD_ITEM_2 = FourCC("I00J")
const SHIELD_ITEM_3 = FourCC("I00I")
const SHIELD_ITEM_4 = FourCC("I00E")

const SHIELD_ABILITY_1 = FourCC("A010")
const SHIELD_ABILITY_2 = FourCC("A011")
const SHIELD_ABILITY_3 = FourCC("A014")
const SHIELD_ABILITY_4 = FourCC("A00Z")

const SHIELD_BUFF_ID = FourCC("B001")
const SHIELD_USE_DUMMY_ABILITY = FourCC("A081")
const SHIELD_USE_DUMMY_UNIT = FourCC("ewsp")
const SHIELD_UNIQUE_HINT = "|cffFF0000同类盾牌只能携带一件，已自动卸下多余盾牌。|r"

/**
 * 延迟移除临时马甲单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 获取全局分组变量，不存在时返回 undefined。
 */
function getGroupFromGlobal(name: string): group | undefined {
  return getGlobal<group>(name)
}

/**
 * 同类盾牌唯一约束：若拾取后超过 1 件，则自动卸下本次拾取的盾牌。
 */
function rejectDuplicateShieldPickup(hero: unit, itemTypeId: number): boolean {
  if (countItemInInventory(hero, itemTypeId) <= 1) {
    return false
  }
  UnitRemoveItem(hero, GetManipulatedItem())
  DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, SHIELD_UNIQUE_HINT)
  return true
}

/**
 * shield_use：
 * 带 B001 的英雄使用道具时触发自损流程并施加减速控制。
 */
function registerShieldUseTrigger(): void {
  disableLegacyTrigger("gg_trg_shield_use")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    if (GetUnitAbilityLevel(hero, SHIELD_BUFF_ID) <= 0) {
      return
    }

    const dummy = CreateUnit(GetOwningPlayer(hero), SHIELD_USE_DUMMY_UNIT, GetUnitX(hero), GetUnitY(hero), bj_UNIT_FACING)
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, SHIELD_USE_DUMMY_ABILITY)
    SetUnitAbilityLevel(dummy, SHIELD_USE_DUMMY_ABILITY, 1)
    IssueTargetOrder(dummy, "cripple", hero)
    removeUnitLater(dummy, 1.0)

    let tick = 0
    const lifeDrainTimer = CreateTimer()
    TimerStart(lifeDrainTimer, 1.0, true, () => {
      tick++
      SetUnitState(hero, UNIT_STATE_LIFE(), GetUnitState(hero, UNIT_STATE_LIFE()) - 50.0)
      if (tick >= 7) {
        PauseTimer(lifeDrainTimer)
        DestroyTimer(lifeDrainTimer)
      }
    })
  })
  replaceGlobalTrigger("gg_trg_shield_use", triggerHandle)
}

/**
 * shield_throw：
 * 丢弃对应盾牌时移除分组标签与附加技能。
 */
function registerShieldThrowTrigger(): void {
  disableLegacyTrigger("gg_trg_shield_throw")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DROP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const droppedTypeId = GetItemTypeId(GetManipulatedItem())
    const shieldGroup1 = getGroupFromGlobal("udg_shield1")
    const shieldGroup2 = getGroupFromGlobal("udg_shield2")
    const shieldGroup3 = getGroupFromGlobal("udg_shield3")

    if (shieldGroup1 && IsUnitInGroup(hero, shieldGroup1) && droppedTypeId === SHIELD_ITEM_1) {
      if (countItemInInventory(hero, SHIELD_ITEM_1) <= 0) {
        GroupRemoveUnit(shieldGroup1, hero)
        UnitRemoveAbility(hero, SHIELD_ABILITY_1)
      }
    }
    if (shieldGroup2 && IsUnitInGroup(hero, shieldGroup2) && droppedTypeId === SHIELD_ITEM_2) {
      if (countItemInInventory(hero, SHIELD_ITEM_2) <= 0) {
        GroupRemoveUnit(shieldGroup2, hero)
        UnitRemoveAbility(hero, SHIELD_ABILITY_2)
      }
    }
    if (shieldGroup3 && IsUnitInGroup(hero, shieldGroup3)) {
      if (droppedTypeId === SHIELD_ITEM_3 && countItemInInventory(hero, SHIELD_ITEM_3) <= 0) {
        UnitRemoveAbility(hero, SHIELD_ABILITY_3)
      }
      if (droppedTypeId === SHIELD_ITEM_4 && countItemInInventory(hero, SHIELD_ITEM_4) <= 0) {
        UnitRemoveAbility(hero, SHIELD_ABILITY_4)
      }
      if (countItemInInventory(hero, SHIELD_ITEM_3) <= 0 && countItemInInventory(hero, SHIELD_ITEM_4) <= 0) {
        GroupRemoveUnit(shieldGroup3, hero)
      }
    }
  })
  replaceGlobalTrigger("gg_trg_shield_throw", triggerHandle)
}

/**
 * shield_get：
 * 拾取对应盾牌时加入分组并授予技能。
 */
function registerShieldGetTrigger(): void {
  disableLegacyTrigger("gg_trg_shield_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const pickedTypeId = GetItemTypeId(GetManipulatedItem())
    const shieldGroup1 = getGroupFromGlobal("udg_shield1")
    const shieldGroup2 = getGroupFromGlobal("udg_shield2")
    const shieldGroup3 = getGroupFromGlobal("udg_shield3")

    if (pickedTypeId === SHIELD_ITEM_1 && shieldGroup1) {
      if (rejectDuplicateShieldPickup(hero, SHIELD_ITEM_1)) {
        return
      }
      GroupAddUnit(shieldGroup1, hero)
      UnitAddAbility(hero, SHIELD_ABILITY_1)
    }
    if (pickedTypeId === SHIELD_ITEM_2 && shieldGroup2) {
      if (rejectDuplicateShieldPickup(hero, SHIELD_ITEM_2)) {
        return
      }
      GroupAddUnit(shieldGroup2, hero)
      UnitAddAbility(hero, SHIELD_ABILITY_2)
    }
    if (pickedTypeId === SHIELD_ITEM_3 && shieldGroup3) {
      if (rejectDuplicateShieldPickup(hero, SHIELD_ITEM_3)) {
        return
      }
      GroupAddUnit(shieldGroup3, hero)
      UnitAddAbility(hero, SHIELD_ABILITY_3)
    }
    if (pickedTypeId === SHIELD_ITEM_4 && shieldGroup3) {
      if (rejectDuplicateShieldPickup(hero, SHIELD_ITEM_4)) {
        return
      }
      GroupAddUnit(shieldGroup3, hero)
      UnitAddAbility(hero, SHIELD_ABILITY_4)
    }
  })
  replaceGlobalTrigger("gg_trg_shield_get", triggerHandle)
}

/**
 * 入口：迁移 shield_use / shield_throw / shield_get。
 */
export function migrateShieldItemSetTriggers(): void {
  registerShieldUseTrigger()
  registerShieldThrowTrigger()
  registerShieldGetTrigger()
}

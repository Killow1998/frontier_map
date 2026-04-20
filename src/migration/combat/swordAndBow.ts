import {
  EVENT_PLAYER_UNIT_USE_ITEM,
  UNIT_STATE_LIFE,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, findItemInInventory, getGlobal, registerAnyUnitDamagedEvent, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const SWORD_CHARGE_ITEM_ID = FourCC("I009")
const SWORD_UPGRADED_ITEM_ID = FourCC("I00A")
const SWORD_PROGRESS_CHILD_KEY = 0x83f5aa80
const BOW_LEVEL5_ITEM_ID = FourCC("I020")

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(effectHandle: effect, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * Sworduse：
 * 使用 I009 时累计充能，满足概率后进化为 I00A。
 */
function registerSwordUseTrigger(): void {
  disableLegacyTrigger("gg_trg_Sworduse")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    const sword = findItemInInventory(unitHandle, SWORD_CHARGE_ITEM_ID)
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && !!sword && GetManipulatedItem() === sword
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    const parentKey = GetHandleId(unitHandle)
    const progress = LoadInteger(ydht, parentKey, SWORD_PROGRESS_CHILD_KEY) + 1
    SaveInteger(ydht, parentKey, SWORD_PROGRESS_CHILD_KEY, progress)
    const chance = progress + 3
    if (GetRandomInt(1, 100) <= chance) {
      const effectHandle = AddSpecialEffectTarget("Abilities\\Weapons\\Bolt\\BoltImpact.mdl", unitHandle, "origin")
      destroyEffectLater(effectHandle, 0.5)
      const sword = findItemInInventory(unitHandle, SWORD_CHARGE_ITEM_ID)
      if (sword) {
        RemoveItem(sword)
      }
      RemoveSavedInteger(ydht, parentKey, SWORD_PROGRESS_CHILD_KEY)
      UnitAddItem(unitHandle, CreateItem(SWORD_UPGRADED_ITEM_ID, GetUnitX(unitHandle), GetUnitY(unitHandle)))
      DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "你的雇佣兵已完全掌握空间的力量")
      return
    }
    DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "闪身剑充能" + I2S(chance) + "/100")
  })
  replaceGlobalTrigger("gg_trg_Sworduse", triggerHandle)
}

/**
 * Bow_lv5：
 * 持有 I020 的英雄对敌方单位造成伤害时，追加目标当前生命 2.5% 的额外流失。
 */
function registerBowLevel5Trigger(): void {
  disableLegacyTrigger("gg_trg_Bow_lv5")
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    return (
      !!findItemInInventory(source, BOW_LEVEL5_ITEM_ID) &&
      !IsUnitType(target, UNIT_TYPE_DEAD()) &&
      IsUnitType(source, UNIT_TYPE_HERO()) &&
      IsUnitEnemy(target, GetOwningPlayer(source))
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    const currentLife = GetUnitState(target, UNIT_STATE_LIFE())
    const extraDamage = (currentLife * 25.0) / 1000.0
    SetWidgetLife(target, currentLife - extraDamage)
  })
  replaceGlobalTrigger("gg_trg_Bow_lv5", triggerHandle)
}

/**
 * 入口：迁移 Sworduse / Bow_lv5。
 */
export function migrateSwordAndBowTriggers(): void {
  registerSwordUseTrigger()
  registerBowLevel5Trigger()
}

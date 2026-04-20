import { EVENT_PLAYER_UNIT_PICKUP_ITEM, UNIT_TYPE_HERO } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  findItemInInventory,
  getUnitCraftCollapseBonus,
  getGlobal,
  increaseUnitCraftCollapseBonus,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  resetUnitCraftCollapseBonus
} from "../core/helpers"

const BASE_REAGENT_ITEM_ID = FourCC("I00D")
const DEFAULT_SUCCESS_EFFECT = "Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl"
const DEFAULT_FAIL_EFFECT = "Abilities\\Spells\\Human\\Feedback\\ArcaneTowerAttack.mdl"
const SWORD_PROGRESS_CHILD_KEY = 0x83f5aa80

interface CraftRule {
  requires: number[]
  result: number
  successRate?: number
  successText: string
  successEffect?: string
  failText?: string
  failEffect?: string
  failConsumes?: number[]
  onSuccess?: (unitHandle: unit) => void
}

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
 * 从背包中移除一件指定类型物品。
 */
function removeItemFromInventory(unitHandle: unit, itemTypeId: number): boolean {
  const itemHandle = findItemInInventory(unitHandle, itemTypeId)
  if (!itemHandle) {
    return false
  }
  RemoveItem(itemHandle)
  return true
}

/**
 * 判断单位是否具备某条配方所需全部素材。
 */
function hasAllRequiredItems(unitHandle: unit, itemIds: number[]): boolean {
  for (const itemId of itemIds) {
    if (!findItemInInventory(unitHandle, itemId)) {
      return false
    }
  }
  return true
}

/**
 * 扣除配方素材。
 */
function consumeItems(unitHandle: unit, itemIds: number[]): void {
  for (const itemId of itemIds) {
    removeItemFromInventory(unitHandle, itemId)
  }
}

/**
 * 执行单条合成规则（可带概率）。
 */
function executeCraftRule(unitHandle: unit, rule: CraftRule): void {
  if (!hasAllRequiredItems(unitHandle, rule.requires)) {
    return
  }

  const baseSuccessRate = rule.successRate ?? 100
  const collapseBonus = baseSuccessRate < 100 ? getUnitCraftCollapseBonus(unitHandle) : 0
  const successRate = Math.min(100, baseSuccessRate + collapseBonus)
  if (GetRandomInt(1, 100) <= successRate) {
    const owner = GetOwningPlayer(unitHandle)
    const effectHandle = AddSpecialEffectTarget(rule.successEffect ?? DEFAULT_SUCCESS_EFFECT, unitHandle, "origin")
    destroyEffectLater(effectHandle, 0.5)
    consumeItems(unitHandle, rule.requires)
    UnitAddItem(unitHandle, CreateItem(rule.result, GetUnitX(unitHandle), GetUnitY(unitHandle)))
    resetUnitCraftCollapseBonus(unitHandle)
    rule.onSuccess?.(unitHandle)
    DisplayTextToPlayer(owner, 0, 0, rule.successText)
    if (baseSuccessRate < 100) {
      if (collapseBonus > 0) {
        DisplayTextToPlayer(owner, 0, 0, "额外概率已清空")
      } else {
        DisplayTextToPlayer(owner, 0, 0, "暴击!升级成功")
      }
    }
    return
  }

  const failEffect = AddSpecialEffectTarget(rule.failEffect ?? DEFAULT_FAIL_EFFECT, unitHandle, "origin")
  destroyEffectLater(failEffect, 0.5)
  consumeItems(unitHandle, rule.failConsumes ?? [BASE_REAGENT_ITEM_ID])
  if (baseSuccessRate < 100) {
    increaseUnitCraftCollapseBonus(unitHandle, baseSuccessRate)
    DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "升级失败")
    DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "您的雇佣兵获得了锻造的经验，下次升级概率提升")
    return
  }
  DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, rule.failText ?? "升级失败")
}

/**
 * 通用合成触发器注册：英雄拾取物品时按顺序执行配方链。
 */
function registerCraftingTrigger(globalTriggerName: string, rules: CraftRule[]): void {
  disableLegacyTrigger(globalTriggerName)
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    for (const rule of rules) {
      executeCraftRule(hero, rule)
    }
  })
  replaceGlobalTrigger(globalTriggerName, triggerHandle)
}

/**
 * 构建 Sword 触发器配方链。
 */
function registerSwordCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Sword", [
    { requires: [FourCC("I005"), BASE_REAGENT_ITEM_ID], result: FourCC("I006"), successText: "剑获得提升" },
    { requires: [FourCC("I006"), BASE_REAGENT_ITEM_ID], result: FourCC("I007"), successText: "剑获得提升" },
    { requires: [FourCC("I007"), BASE_REAGENT_ITEM_ID], result: FourCC("I008"), successRate: 55, successText: "剑获得提升" },
    {
      requires: [FourCC("I008"), BASE_REAGENT_ITEM_ID, FourCC("I038")],
      result: FourCC("I009"),
      successText: "刽剑融入了空间宝石，获得空间之力",
      onSuccess: (hero) => {
        const ydht = getGlobal<hashtable>("YDHT")
        if (ydht) {
          SaveInteger(ydht, GetHandleId(hero), SWORD_PROGRESS_CHILD_KEY, 0)
        }
      }
    },
    {
      requires: [FourCC("I008"), BASE_REAGENT_ITEM_ID, FourCC("I03S")],
      result: FourCC("I03T"),
      successText: "刽剑融入了星石，获得星辰之力"
    }
  ])
}

/**
 * 构建 Armor 触发器配方链。
 */
function registerArmorCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Armor", [
    { requires: [FourCC("I00U"), BASE_REAGENT_ITEM_ID], result: FourCC("I00S"), successText: "甲获得提升" },
    { requires: [FourCC("I00S"), BASE_REAGENT_ITEM_ID], result: FourCC("I00R"), successText: "甲获得提升" },
    { requires: [FourCC("I00R"), BASE_REAGENT_ITEM_ID], result: FourCC("I00V"), successRate: 55, successText: "甲获得提升" },
    { requires: [FourCC("I00V"), BASE_REAGENT_ITEM_ID, FourCC("I01E")], result: FourCC("I00T"), successText: "甲获得提升" },
    {
      requires: [FourCC("I00T"), FourCC("I043")],
      result: FourCC("I042"),
      successText: "你的雇佣兵已得到雷霆的加护"
    }
  ])
}

/**
 * 构建 Flag 触发器配方链。
 */
function registerFlagCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Flag", [
    { requires: [FourCC("I01L"), BASE_REAGENT_ITEM_ID], result: FourCC("I01M"), successText: "旗获得提升" },
    { requires: [FourCC("I01M"), BASE_REAGENT_ITEM_ID], result: FourCC("I01N"), successText: "旗获得提升" },
    { requires: [FourCC("I01N"), BASE_REAGENT_ITEM_ID], result: FourCC("I01O"), successRate: 55, successText: "旗获得提升" },
    { requires: [FourCC("I01O"), BASE_REAGENT_ITEM_ID], result: FourCC("I01P"), successRate: 35, successText: "旗获得提升" },
    {
      requires: [FourCC("I01P"), BASE_REAGENT_ITEM_ID, FourCC("I01R")],
      result: FourCC("I01Q"),
      successText: "牧师的鲜血激发了你们的斗志"
    }
  ])
}

/**
 * 构建 Ring 触发器配方链。
 */
function registerRingCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Ring", [
    { requires: [FourCC("I01J"), BASE_REAGENT_ITEM_ID], result: FourCC("I01H"), successText: "戒获得提升" },
    { requires: [FourCC("I01H"), BASE_REAGENT_ITEM_ID], result: FourCC("I01K"), successText: "戒获得提升" },
    { requires: [FourCC("I01K"), BASE_REAGENT_ITEM_ID], result: FourCC("I01G"), successRate: 55, successText: "戒获得提升" },
    {
      requires: [FourCC("I01G"), FourCC("I036"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I01I"),
      successText: "你的雇佣兵已掌握狮心之力"
    }
  ])
}

/**
 * 构建 Staff 触发器配方链。
 */
function registerStaffCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Staff", [
    { requires: [FourCC("I01S"), BASE_REAGENT_ITEM_ID], result: FourCC("I01T"), successText: "杖获得提升" },
    { requires: [FourCC("I01T"), BASE_REAGENT_ITEM_ID], result: FourCC("I01U"), successText: "杖获得提升" },
    { requires: [FourCC("I01U"), BASE_REAGENT_ITEM_ID], result: FourCC("I01V"), successRate: 55, successText: "杖获得提升" },
    {
      requires: [FourCC("I01V"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I01W"),
      successRate: 35,
      successText: "你的雇佣兵从地狱中获取了力量"
    }
  ])
}

/**
 * 构建 Bow 触发器配方链。
 */
function registerBowCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Bow", [
    { requires: [FourCC("I01Z"), BASE_REAGENT_ITEM_ID], result: FourCC("I01X"), successText: "弓获得提升" },
    { requires: [FourCC("I01X"), BASE_REAGENT_ITEM_ID], result: FourCC("I01Y"), successText: "弓获得提升" },
    { requires: [FourCC("I01Y"), BASE_REAGENT_ITEM_ID], result: FourCC("I021"), successRate: 55, successText: "弓获得提升" },
    {
      requires: [FourCC("I021"), BASE_REAGENT_ITEM_ID, FourCC("I037")],
      result: FourCC("I020"),
      successText: "你的雇佣兵已掌握箭矢的力量",
      successEffect: "Abilities\\Spells\\NightElf\\Starfall\\StarfallCaster.mdl"
    }
  ])
}

/**
 * 构建 Axe 触发器配方链。
 */
function registerAxeCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Axe", [
    { requires: [FourCC("I010"), BASE_REAGENT_ITEM_ID], result: FourCC("I00Z"), successText: "斧获得提升" },
    { requires: [FourCC("I00Z"), BASE_REAGENT_ITEM_ID], result: FourCC("I00X"), successText: "斧获得提升" },
    { requires: [FourCC("I00X"), BASE_REAGENT_ITEM_ID], result: FourCC("I011"), successRate: 55, successText: "斧获得提升" },
    {
      requires: [FourCC("I011"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I012"),
      successRate: 35,
      successText: "你的雇佣兵一斧可以砍翻天下"
    },
    {
      requires: [FourCC("I011"), FourCC("I00X"), FourCC("I014")],
      result: FourCC("I00Y"),
      successText: "你的雇佣兵已掌握魂珠的奥秘",
      successEffect: "Abilities\\Spells\\Demon\\DemonBoltImpact\\DemonBoltImpact.mdl"
    }
  ])
}

/**
 * 构建 Shield 触发器配方链。
 */
function registerShieldCraftingTrigger(): void {
  registerCraftingTrigger("gg_trg_Shield", [
    { requires: [FourCC("I00H"), BASE_REAGENT_ITEM_ID], result: FourCC("I00F"), successText: "盾获得提升" },
    { requires: [FourCC("I00F"), BASE_REAGENT_ITEM_ID], result: FourCC("I00J"), successText: "盾获得提升" },
    { requires: [FourCC("I00J"), BASE_REAGENT_ITEM_ID], result: FourCC("I00I"), successRate: 55, successText: "盾获得提升" },
    {
      requires: [FourCC("I00I"), FourCC("I035"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I00E"),
      successText: "你的雇佣兵已获得城墙般的防御力"
    },
    {
      requires: [FourCC("I00I"), FourCC("I03S"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I03Q"),
      successText: "你的雇佣兵已获得星辰之御"
    }
  ])
}

/**
 * 入口：迁移 Sword / Armor / Flag / Ring / Staff / Bow / Axe / Shield。
 */
export function migrateEquipmentCraftingTriggers(): void {
  registerSwordCraftingTrigger()
  registerArmorCraftingTrigger()
  registerFlagCraftingTrigger()
  registerRingCraftingTrigger()
  registerStaffCraftingTrigger()
  registerBowCraftingTrigger()
  registerAxeCraftingTrigger()
  registerShieldCraftingTrigger()
}

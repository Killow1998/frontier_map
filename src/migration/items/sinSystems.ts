import { bj_MAX_PLAYER_SLOTS, bj_UNIT_FACING, EVENT_PLAYER_UNIT_PICKUP_ITEM } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { panCameraToBaseForPlayer } from "../core/camera"
import { countItemInInventory, disableLegacyTrigger, findItemInInventory, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const SIN_GEM_ID = FourCC("I00D")
const SIN_BASE_ITEM_ID = FourCC("I01F")
const SIN_FALLBACK_ITEM_ID = FourCC("I02T")
const SIN_SELECT_HERO_ID = FourCC("H004")

/**
 * 在基地生成原罪英雄并同步公共状态。
 */
function spawnSinHero(whichPlayer: player): void {
  const baseArea = getGlobal<rect>("gg_rct_base_area")
  const heroSelect = getGlobal<group>("udg_hero_select")
  const playerForce = getGlobal<force>("udg_player")
  const diedHeroes = getGlobal<Record<number, unit | undefined>>("udg_diedhero")
  if (!baseArea || !heroSelect || !playerForce || !diedHeroes) {
    print("Missing sin selection globals")
    return
  }

  const hero = CreateUnit(whichPlayer, SIN_SELECT_HERO_ID, GetRectCenterX(baseArea), GetRectCenterY(baseArea), bj_UNIT_FACING)
  const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Human\\ReviveHuman\\ReviveHuman.mdl", hero, "origin")
  const effectTimer = CreateTimer()
  TimerStart(effectTimer, 2.0, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(effectTimer)
  })

  UnitAddAbility(hero, FourCC("A053"))
  GroupAddUnit(heroSelect, hero)
  diedHeroes[GetPlayerId(whichPlayer) + 1] = hero
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    DisplayTextToPlayer(Player(i), 0, 0, "玩家" + GetPlayerName(whichPlayer) + "雇佣了罪人")
  }
  DisplayTextToPlayer(whichPlayer, 0, 0, "原罪已获得专属武器——小刀，但他无法携带除战旗外的普通装备")
  DisplayTextToPlayer(whichPlayer, 0, 0, "主动使用专武可获取原罪力量，每次升级之后可使用一次")
  UnitAddItem(hero, CreateItem(FourCC("I023"), GetUnitX(hero), GetUnitY(hero)))
  UnitAddItem(hero, CreateItem(SIN_FALLBACK_ITEM_ID, GetUnitX(hero), GetUnitY(hero)))
  const recoverTimer = CreateTimer()
  TimerStart(recoverTimer, 0.25, false, () => {
    if (GetUnitAbilityLevel(hero, FourCC("A053")) <= 0) {
      UnitAddAbility(hero, FourCC("A053"))
    }
    if (!findItemInInventory(hero, FourCC("I023"))) {
      UnitAddItem(hero, CreateItem(FourCC("I023"), GetUnitX(hero), GetUnitY(hero)))
    }
    if (!findItemInInventory(hero, SIN_FALLBACK_ITEM_ID)) {
      UnitAddItem(hero, CreateItem(SIN_FALLBACK_ITEM_ID, GetUnitX(hero), GetUnitY(hero)))
    }
    DestroyTimer(recoverTimer)
  })
  ForceAddPlayer(playerForce, whichPlayer)
  panCameraToBaseForPlayer(whichPlayer)
}

/**
 * sin_select：选择原罪英雄并初始化专武。
 */
function registerSinSelectTrigger(): void {
  disableLegacyTrigger("gg_trg_sin_select")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === SIN_BASE_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    spawnSinHero(GetOwningPlayer(GetTriggerUnit()))
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_sin_select", triggerHandle)
}

/**
 * 统一移除背包中的指定数量物品。
 */
function removeItemsById(unitHandle: unit, itemTypeId: number, amount: number): void {
  let removed = 0
  for (let slot = 0; slot < 6 && removed < amount; slot++) {
    const itemHandle = UnitItemInSlot(unitHandle, slot)
    if (itemHandle && GetItemTypeId(itemHandle) === itemTypeId) {
      RemoveItem(itemHandle)
      removed++
    }
  }
}

/**
 * 尝试按顺序升级原罪武器。
 */
function trySinUpgrade(unitHandle: unit, needLevel: number, oldItemId: number, gemNeed: number, newItemId: number, needLevelCheck: boolean): boolean {
  const slotItem = findItemInInventory(unitHandle, oldItemId)
  if (!slotItem) {
    return false
  }
  const gemCount = countItemInInventory(unitHandle, SIN_GEM_ID)
  if (gemCount < gemNeed) {
    return false
  }
  if (needLevelCheck && GetHeroLevel(unitHandle) < needLevel) {
    DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "您的雇佣兵当前的能力不足以接受下一次的原罪试炼")
    return true
  }
  removeItemsById(unitHandle, SIN_GEM_ID, gemNeed)
  let equipSlot = -1
  for (let slot = 0; slot < 6; slot++) {
    if (UnitItemInSlot(unitHandle, slot) === slotItem) {
      equipSlot = slot
      break
    }
  }
  RemoveItem(slotItem)
  if (equipSlot >= 0) {
    UnitAddItemToSlotById(unitHandle, newItemId, equipSlot)
  } else {
    UnitAddItem(unitHandle, CreateItem(newItemId, GetUnitX(unitHandle), GetUnitY(unitHandle)))
  }
  DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "您的雇佣兵获得了更强的罪孽之力")
  return true
}

/**
 * sin_lvup_new：使用宝石逐级升级原罪专武。
 */
function registerSinLvupTrigger(): void {
  disableLegacyTrigger("gg_trg_sin_lvup_new")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SIN_SELECT_HERO_ID && GetItemTypeId(GetManipulatedItem()) === SIN_GEM_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    if (trySinUpgrade(hero, 25, FourCC("I028"), 5, FourCC("I022"), true)) {
      return
    }
    if (trySinUpgrade(hero, 20, FourCC("I027"), 5, FourCC("I028"), true)) {
      return
    }
    if (trySinUpgrade(hero, 15, FourCC("I026"), 5, FourCC("I027"), true)) {
      return
    }
    if (trySinUpgrade(hero, 10, FourCC("I025"), 4, FourCC("I026"), true)) {
      return
    }
    if (trySinUpgrade(hero, 5, FourCC("I024"), 3, FourCC("I025"), true)) {
      return
    }
    trySinUpgrade(hero, 0, FourCC("I023"), 3, FourCC("I024"), false)
  })
  replaceGlobalTrigger("gg_trg_sin_lvup_new", triggerHandle)
}

/**
 * sin_upgrade：使用专武时清理守护道具。
 */
function registerSinUpgradeTrigger(): void {
  disableLegacyTrigger("gg_trg_sin_upgrade")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === FourCC("I024")))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const guardItem = findItemInInventory(hero, SIN_FALLBACK_ITEM_ID)
    if (!guardItem) {
      return
    }
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 2.0, false, () => {
      RemoveItem(guardItem)
      DestroyTimer(timerHandle)
    })
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "罪孽为你的守护已破碎")
  })
  replaceGlobalTrigger("gg_trg_sin_upgrade", triggerHandle)
}

/**
 * sin_init：初始化原罪专武状态缓存。
 */
function registerSinInitTrigger(): void {
  disableLegacyTrigger("gg_trg_sin_init")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 0.01, false)
  TriggerAddAction(triggerHandle, () => {
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }
    SaveBoolean(ydht, FourCC("I023"), 0x8376128B, false)
    SaveBoolean(ydht, FourCC("I024"), 0x8376128B, false)
    SaveBoolean(ydht, FourCC("I025"), 0x8376128B, false)
    SaveBoolean(ydht, FourCC("I026"), 0x8376128B, false)
    SaveBoolean(ydht, FourCC("I027"), 0x8376128B, false)
    SaveBoolean(ydht, FourCC("I028"), 0x8376128B, false)
    SaveBoolean(ydht, FourCC("I022"), 0x8376128B, false)
  })
  replaceGlobalTrigger("gg_trg_sin_init", triggerHandle)
}

/**
 * 入口：迁移原罪英雄、升级与初始化触发器。
 */
export function migrateSinSystemTriggers(): void {
  registerSinInitTrigger()
  registerSinSelectTrigger()
  registerSinLvupTrigger()
  registerSinUpgradeTrigger()
}

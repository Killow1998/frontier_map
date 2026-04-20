import {
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_DROP_ITEM,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  UNIT_STATE_ATTACK_SPACE,
  UNIT_STATE_ATTACK_SPEED,
  UNIT_STATE_ATTACK_WHITE,
  UNIT_STATE_DEFEND_WHITE,
  UNIT_TYPE_HERO
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  findItemInInventory,
  getGlobal,
  isHumanMercenaryPlayer,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger
} from "../core/helpers"

const ITEM_TOKEN_SOUL_ID = FourCC("I03R")
const ITEM_TOKEN_EAT_ID = FourCC("I044")
const ITEM_TOKEN_AVENGE_ID = FourCC("I045")
const ITEM_TOKEN_COIN_ID = FourCC("I046")
const ITEM_COIN_ID = FourCC("I001")
const ITEM_SOUL_ID = FourCC("I002")
const ITEM_EAT_ID = FourCC("I003")
const ITEM_AVENGE_ID = FourCC("I004")
const ITEM_EXCHANGE_COST = 100

const TRACK_KEY_COIN = 0x726D3703
const TRACK_KEY_SOUL = 0xd8d518b7
const TRACK_KEY_EAT = 0x7fd142cc

/**
 * 获取奖励点数数组（udg_credits）。
 */
function getCreditsTable(): number[] {
  return getGlobal<number[]>("udg_credits") ?? []
}

/**
 * 获取 YDHT 句柄，作为装备计数持久化存储。
 */
function getYdht(): hashtable | undefined {
  return getGlobal<hashtable>("YDHT")
}

/**
 * 读取单位某件装备的累计计数。
 */
function loadItemTrackCount(unitHandle: unit, childKey: number): number {
  const ydht = getYdht()
  if (!ydht) {
    return 0
  }
  return LoadInteger(ydht, GetHandleId(unitHandle), childKey)
}

/**
 * 写入单位某件装备的累计计数。
 */
function saveItemTrackCount(unitHandle: unit, childKey: number, value: number): void {
  const ydht = getYdht()
  if (!ydht) {
    return
  }
  SaveInteger(ydht, GetHandleId(unitHandle), childKey, value)
}

/**
 * 将兑换凭证映射到对应装备。
 */
function resolveExchangeReward(tokenItemTypeId: number): number | undefined {
  if (tokenItemTypeId === ITEM_TOKEN_SOUL_ID) {
    return ITEM_SOUL_ID
  }
  if (tokenItemTypeId === ITEM_TOKEN_EAT_ID) {
    return ITEM_EAT_ID
  }
  if (tokenItemTypeId === ITEM_TOKEN_AVENGE_ID) {
    return ITEM_AVENGE_ID
  }
  if (tokenItemTypeId === ITEM_TOKEN_COIN_ID) {
    return ITEM_COIN_ID
  }
  return undefined
}

/**
 * 按装备类型返回对应的计数键。
 */
function resolveTrackKey(itemTypeId: number): number | undefined {
  if (itemTypeId === ITEM_COIN_ID) {
    return TRACK_KEY_COIN
  }
  if (itemTypeId === ITEM_SOUL_ID) {
    return TRACK_KEY_SOUL
  }
  if (itemTypeId === ITEM_EAT_ID) {
    return TRACK_KEY_EAT
  }
  return undefined
}

/**
 * get_item：
 * 处理凭证兑换（消耗奖励点数，发放 I001/I002/I003/I004）。
 */
function registerGetItemTrigger(): void {
  disableLegacyTrigger("gg_trg_get_item")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const tokenTypeId = GetItemTypeId(GetManipulatedItem())
    return (
      (tokenTypeId === ITEM_TOKEN_SOUL_ID ||
        tokenTypeId === ITEM_TOKEN_EAT_ID ||
        tokenTypeId === ITEM_TOKEN_AVENGE_ID ||
        tokenTypeId === ITEM_TOKEN_COIN_ID) &&
      isHumanMercenaryPlayer(GetOwningPlayer(GetTriggerUnit()))
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const owner = GetOwningPlayer(unitHandle)
    const playerIndex = GetPlayerId(owner) + 1
    const credits = getCreditsTable()
    const currentCredits = credits[playerIndex] ?? 0
    const tokenItem = GetManipulatedItem()
    const tokenTypeId = GetItemTypeId(tokenItem)
    const rewardTypeId = resolveExchangeReward(tokenTypeId)

    if (!rewardTypeId) {
      return
    }
    if (currentCredits < ITEM_EXCHANGE_COST) {
      DisplayTextToPlayer(
        owner,
        0,
        0,
        "您的奖励点数不足，当前点数为" + I2S(currentCredits) + "，所需点数为" + I2S(ITEM_EXCHANGE_COST)
      )
      return
    }

    RemoveItem(tokenItem)
    credits[playerIndex] = currentCredits - ITEM_EXCHANGE_COST
    const rewardItem = CreateItem(rewardTypeId, GetUnitX(unitHandle), GetUnitY(unitHandle))
    DisplayTextToPlayer(owner, 0, 0, "兑换" + GetItemName(rewardItem) + "成功")
    UnitAddItem(unitHandle, rewardItem)
  })
  replaceGlobalTrigger("gg_trg_get_item", triggerHandle)
}

/**
 * Item_Equip：
 * 拾取 I001/I002/I003 时，从 YDHT 读取累计计数并同步到物品层数。
 */
function registerItemEquipTrigger(): void {
  disableLegacyTrigger("gg_trg_Item_Equip")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    return !!findItemInInventory(unitHandle, ITEM_COIN_ID) || !!findItemInInventory(unitHandle, ITEM_SOUL_ID) || !!findItemInInventory(unitHandle, ITEM_EAT_ID)
  }))
  TriggerAddAction(triggerHandle, () => {
    const itemHandle = GetManipulatedItem()
    const itemTypeId = GetItemTypeId(itemHandle)
    const childKey = resolveTrackKey(itemTypeId)
    if (childKey === undefined) {
      return
    }
    const count = loadItemTrackCount(GetTriggerUnit(), childKey)
    SetItemCharges(itemHandle, count)
  })
  replaceGlobalTrigger("gg_trg_Item_Equip", triggerHandle)
}

/**
 * Item_Drop：
 * 丢弃 I001/I002/I003/I004 时重置其层数显示。
 */
function registerItemDropTrigger(): void {
  disableLegacyTrigger("gg_trg_Item_Drop")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DROP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const itemTypeId = GetItemTypeId(GetManipulatedItem())
    return itemTypeId === ITEM_COIN_ID || itemTypeId === ITEM_SOUL_ID || itemTypeId === ITEM_EAT_ID || itemTypeId === ITEM_AVENGE_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    SetItemCharges(GetManipulatedItem(), 0)
  })
  replaceGlobalTrigger("gg_trg_Item_Drop", triggerHandle)
}

/**
 * coin 系列：击杀累积计数，每 22 层提高防御与三维。
 */
function applyCoinKillProgress(killer: unit): void {
  const coinItem = findItemInInventory(killer, ITEM_COIN_ID)
  if (!coinItem) {
    return
  }

  const nextCount = loadItemTrackCount(killer, TRACK_KEY_COIN) + 1
  saveItemTrackCount(killer, TRACK_KEY_COIN, nextCount)
  SetItemCharges(coinItem, nextCount)
  if (nextCount <= 0 || nextCount % 22 !== 0) {
    return
  }

  SetUnitState(killer, UNIT_STATE_DEFEND_WHITE(), GetUnitState(killer, UNIT_STATE_DEFEND_WHITE()) + 0.5)
  SetHeroStr(killer, GetHeroStr(killer, true) + 1, true)
  SetHeroAgi(killer, GetHeroAgi(killer, true) + 1, true)
  SetHeroInt(killer, GetHeroInt(killer, true) + 1, true)
}

/**
 * soul 系列：击杀后提高攻速并牺牲攻击力，英雄击杀额外缩短攻速间隔。
 */
function applySoulKillProgress(killer: unit, deadUnit: unit): void {
  const soulItem = findItemInInventory(killer, ITEM_SOUL_ID)
  if (!soulItem) {
    return
  }

  const deadIsHero = IsUnitType(deadUnit, UNIT_TYPE_HERO())
  const qualifiedKill = deadIsHero || (GetRandomInt(1, 100) <= 15 && !deadIsHero && GetUnitLevel(deadUnit) >= 7)
  if (!qualifiedKill) {
    return
  }

  const nextCount = loadItemTrackCount(killer, TRACK_KEY_SOUL) + 1
  saveItemTrackCount(killer, TRACK_KEY_SOUL, nextCount)
  SetItemCharges(soulItem, nextCount)

  const currentAttackWhite = GetUnitState(killer, UNIT_STATE_ATTACK_WHITE())
  SetUnitState(killer, UNIT_STATE_ATTACK_WHITE(), currentAttackWhite >= 9.0 ? currentAttackWhite - 8.0 : 1.0)
  SetUnitState(killer, UNIT_STATE_ATTACK_SPEED(), GetUnitState(killer, UNIT_STATE_ATTACK_SPEED()) + 0.05)

  if (deadIsHero) {
    DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, GetUnitName(killer) + "触发窃魂效果，攻击速度得到提升，攻击力下降，攻击间隔减少")
    SetUnitState(killer, UNIT_STATE_ATTACK_SPACE(), GetUnitState(killer, UNIT_STATE_ATTACK_SPACE()) - 0.01)
    return
  }

  DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, GetUnitName(killer) + "触发窃魂效果，攻击速度得到提升，攻击力下降")
}

/**
 * eat 系列：击杀后提高攻击力并降低攻速，英雄击杀额外缩短攻速间隔。
 */
function applyEatKillProgress(killer: unit, deadUnit: unit): void {
  const eatItem = findItemInInventory(killer, ITEM_EAT_ID)
  if (!eatItem) {
    return
  }

  const deadIsHero = IsUnitType(deadUnit, UNIT_TYPE_HERO())
  const qualifiedKill = deadIsHero || (GetRandomInt(1, 100) <= 15 && !deadIsHero && GetUnitLevel(deadUnit) >= 7)
  if (!qualifiedKill) {
    return
  }

  const nextCount = loadItemTrackCount(killer, TRACK_KEY_EAT) + 1
  saveItemTrackCount(killer, TRACK_KEY_EAT, nextCount)
  SetItemCharges(eatItem, nextCount)

  SetUnitState(killer, UNIT_STATE_ATTACK_WHITE(), GetUnitState(killer, UNIT_STATE_ATTACK_WHITE()) + 10.0)
  const currentAttackSpeed = GetUnitState(killer, UNIT_STATE_ATTACK_SPEED())
  SetUnitState(killer, UNIT_STATE_ATTACK_SPEED(), currentAttackSpeed >= 0.05 ? currentAttackSpeed - 0.04 : 0.01)

  if (deadIsHero) {
    DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, GetUnitName(killer) + "触发狂噬效果，攻击力得到提升，攻击速度下降，攻击间隔减少")
    SetUnitState(killer, UNIT_STATE_ATTACK_SPACE(), GetUnitState(killer, UNIT_STATE_ATTACK_SPACE()) - 0.01)
    return
  }

  DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, GetUnitName(killer) + "触发狂噬效果，攻击力得到提升，攻击速度下降")
}

/**
 * Item_Kill_Events：
 * 处理 I001/I002/I003 的击杀成长逻辑。
 */
function registerItemKillEventsTrigger(): void {
  disableLegacyTrigger("gg_trg_Item_Kill_Events")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const killer = GetKillingUnit()
    const deadUnit = GetTriggerUnit()
    if (!killer) {
      return false
    }
    return (
      IsUnitType(killer, UNIT_TYPE_HERO()) &&
      IsUnitEnemy(deadUnit, GetOwningPlayer(killer)) &&
      (!!findItemInInventory(killer, ITEM_COIN_ID) ||
        !!findItemInInventory(killer, ITEM_SOUL_ID) ||
        !!findItemInInventory(killer, ITEM_EAT_ID))
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const killer = GetKillingUnit()
    if (!killer) {
      return
    }
    const deadUnit = GetTriggerUnit()
    applyCoinKillProgress(killer)
    applySoulKillProgress(killer, deadUnit)
    applyEatKillProgress(killer, deadUnit)
  })
  replaceGlobalTrigger("gg_trg_Item_Kill_Events", triggerHandle)
}

/**
 * 入口：迁移 get_item / Item_Equip / Item_Drop / Item_Kill_Events。
 */
export function migrateItemProgressionTriggers(): void {
  registerGetItemTrigger()
  registerItemEquipTrigger()
  registerItemDropTrigger()
  registerItemKillEventsTrigger()
}

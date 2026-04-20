import {
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  PLAYER_STATE_RESOURCE_GOLD,
  UNIT_STATE_ATTACK_SPACE,
  UNIT_STATE_ATTACK_SPEED,
  UNIT_TYPE_HERO
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  findItemInInventory,
  getUnitCraftCollapseBonus,
  increaseUnitCraftCollapseBonus,
  registerPlayerChatEventAll,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  getGlobal,
  resetUnitCraftCollapseBonus,
  setGlobal
} from "../core/helpers"

const BASE_REAGENT_ITEM_ID = FourCC("I00D")
const DIED_HERO_ARRAY_GLOBAL = "udg_diedhero"
const HERO_SELECT_GROUP_GLOBAL = "udg_hero_select"
const MIN_ALIVE_LIFE = 0.405

interface HelmetCraftRule {
  requires: number[]
  result: number
  successRate?: number
  successText: string
  successEffect: string
  failEffect?: string
  failText?: string
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
 * 检查单位是否满足合成条件。
 */
function hasAllItems(unitHandle: unit, itemTypeIds: number[]): boolean {
  for (const itemTypeId of itemTypeIds) {
    if (!findItemInInventory(unitHandle, itemTypeId)) {
      return false
    }
  }
  return true
}

/**
 * 执行头盔合成规则。
 */
function executeHelmetCraftRule(hero: unit, rule: HelmetCraftRule): void {
  if (!hasAllItems(hero, rule.requires)) {
    return
  }

  const baseSuccessRate = rule.successRate ?? 100
  const collapseBonus = baseSuccessRate < 100 ? getUnitCraftCollapseBonus(hero) : 0
  const successRate = Math.min(100, baseSuccessRate + collapseBonus)
  if (GetRandomInt(1, 100) <= successRate) {
    const owner = GetOwningPlayer(hero)
    const effectHandle = AddSpecialEffectTarget(rule.successEffect, hero, "origin")
    destroyEffectLater(effectHandle, 0.5)
    for (const itemTypeId of rule.requires) {
      removeItemFromInventory(hero, itemTypeId)
    }
    UnitAddItem(hero, CreateItem(rule.result, GetUnitX(hero), GetUnitY(hero)))
    resetUnitCraftCollapseBonus(hero)
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

  const failEffect = AddSpecialEffectTarget(rule.failEffect ?? "Abilities\\Spells\\Human\\Feedback\\ArcaneTowerAttack.mdl", hero, "origin")
  destroyEffectLater(failEffect, 0.5)
  removeItemFromInventory(hero, BASE_REAGENT_ITEM_ID)
  if (baseSuccessRate < 100) {
    increaseUnitCraftCollapseBonus(hero, baseSuccessRate)
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "升级失败")
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "您的雇佣兵获得了锻造的经验，下次升级概率提升")
    return
  }
  DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, rule.failText ?? "升级失败")
}

/**
 * helmet：
 * 处理头盔系装备升阶与分支合成。
 */
function registerHelmetCraftingTrigger(): void {
  disableLegacyTrigger("gg_trg_helmet")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    executeHelmetCraftRule(hero, {
      requires: [FourCC("I018"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I015"),
      successText: "盔获得提升",
      successEffect: "Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl"
    })
    executeHelmetCraftRule(hero, {
      requires: [FourCC("I015"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I016"),
      successText: "盔获得提升",
      successEffect: "Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl"
    })
    executeHelmetCraftRule(hero, {
      requires: [FourCC("I016"), BASE_REAGENT_ITEM_ID],
      result: FourCC("I017"),
      successRate: 55,
      successText: "盔获得提升",
      successEffect: "Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl"
    })
    executeHelmetCraftRule(hero, {
      requires: [FourCC("I017"), BASE_REAGENT_ITEM_ID, FourCC("I01E")],
      result: FourCC("I019"),
      successText: "你的雇佣兵获得了某种神奇野兽的力量",
      successEffect: "Abilities\\Spells\\Undead\\ReplenishHealth\\ReplenishHealthCaster.mdl"
    })
    executeHelmetCraftRule(hero, {
      requires: [FourCC("I017"), BASE_REAGENT_ITEM_ID, FourCC("I01C")],
      result: FourCC("I01A"),
      successText: "你的雇佣兵获得了某种神奇野兽的力量",
      successEffect: "Abilities\\Spells\\Undead\\ReplenishHealth\\ReplenishHealthCasterOverhead.mdl"
    })
  })
  replaceGlobalTrigger("gg_trg_helmet", triggerHandle)
}

/**
 * 注册科技聊天指令触发器。
 */
function registerTechChatTrigger(globalName: string, chatCommand: string, techId: number): void {
  disableLegacyTrigger(globalName)
  const triggerHandle = CreateTrigger()
  registerPlayerChatEventAll(triggerHandle, chatCommand, true)
  TriggerAddAction(triggerHandle, () => {
    AddPlayerTechResearched(GetTriggerPlayer(), techId, 1)
  })
  replaceGlobalTrigger(globalName, triggerHandle)
}

/**
 * 获取聊天触发玩家绑定的英雄。
 *
 * 优先使用 `udg_diedhero[playerId+1]`（原图口径），若缺失则尝试：
 * - 从 `udg_hero_select` 组中找该玩家的英雄并回写；
 * - 全图枚举该玩家英雄兜底并回写。
 */
function getTriggerPlayerHero(): unit | undefined {
  const triggerPlayer = GetTriggerPlayer()
  const index = GetPlayerId(triggerPlayer) + 1

  const isValidBoundUnit = (unitHandle: unit | undefined): unitHandle is unit => {
    if (!unitHandle) {
      return false
    }
    if (GetOwningPlayer(unitHandle) !== triggerPlayer) {
      return false
    }
    return GetWidgetLife(unitHandle) > MIN_ALIVE_LIFE
  }

  const heroes = getGlobal<Record<number, unit | undefined>>(DIED_HERO_ARRAY_GLOBAL)
  if (heroes) {
    const existing = heroes[index]
    // 原图口径：udg_diedhero 里记录的是“当前雇佣兵”，并不严格要求单位必须带 HERO 类型。
    if (isValidBoundUnit(existing)) {
      return existing
    }
  }

  const heroSelectGroup = getGlobal<group>(HERO_SELECT_GROUP_GLOBAL)
  if (heroSelectGroup) {
    let found: unit | undefined
    ForGroup(heroSelectGroup, () => {
      if (found) {
        return
      }
      const current = GetEnumUnit()
      if (isValidBoundUnit(current)) {
        found = current
      }
    })
    if (found) {
      if (heroes) {
        heroes[index] = found
      }
      return found
    }
  }

  const g = CreateGroup()
  GroupEnumUnitsOfPlayer(
    g,
    triggerPlayer,
    Filter(() => GetWidgetLife(GetFilterUnit()) > MIN_ALIVE_LIFE)
  )
  const fallbackHero = FirstOfGroup(g)
  DestroyGroup(g)
  if (fallbackHero) {
    if (heroes) {
      heroes[index] = fallbackHero
    }
    return fallbackHero
  }

  return undefined
}

function showHeroLookupDebug(whichPlayer: player): void {
  const pid = GetPlayerId(whichPlayer)
  const slot = pid + 1
  const diedHeroes = getGlobal<Record<number, unit | undefined>>(DIED_HERO_ARRAY_GLOBAL)
  const bound = diedHeroes ? diedHeroes[slot] : undefined
  const boundName = bound ? GetUnitName(bound) : "(nil)"
  const boundOwner = bound ? GetPlayerId(GetOwningPlayer(bound)) : -1

  const heroSelectGroup = getGlobal<group>(HERO_SELECT_GROUP_GLOBAL)
  let heroSelectOwned = 0
  if (heroSelectGroup) {
    ForGroup(heroSelectGroup, () => {
      const u = GetEnumUnit()
      if (u && GetOwningPlayer(u) === whichPlayer) {
        heroSelectOwned++
      }
    })
  }

  const owned = CreateGroup()
  let ownedAlive = 0
  GroupEnumUnitsOfPlayer(owned, whichPlayer, Filter(() => GetWidgetLife(GetFilterUnit()) > MIN_ALIVE_LIFE))
  while (true) {
    const u = FirstOfGroup(owned)
    if (!u) {
      break
    }
    GroupRemoveUnit(owned, u)
    ownedAlive++
  }
  DestroyGroup(owned)

  DisplayTextToPlayer(
    whichPlayer,
    0,
    0,
    "debug(-ms/-as/-at): pid=" +
      I2S(pid) +
      " udg_diedhero[" +
      I2S(slot) +
      "]=" +
      boundName +
      " ownerPid=" +
      I2S(boundOwner) +
      " hero_select_owned=" +
      I2S(heroSelectOwned) +
      " owned_alive_units=" +
      I2S(ownedAlive)
  )
}

/**
 * 注册“查询英雄属性”聊天触发器。
 */
function registerHeroInfoChatTrigger(globalName: string, chatCommand: string, messageBuilder: (hero: unit) => string): void {
  disableLegacyTrigger(globalName)
  const triggerHandle = CreateTrigger()
  registerPlayerChatEventAll(triggerHandle, chatCommand, true)
  TriggerAddAction(triggerHandle, () => {
    const hero = getTriggerPlayerHero()
    if (!hero) {
      DisplayTextToPlayer(GetTriggerPlayer(), 0, 0, "未找到当前玩家雇佣兵数据")
      showHeroLookupDebug(GetTriggerPlayer())
      return
    }
    DisplayTextToPlayer(GetTriggerPlayer(), 0, 0, messageBuilder(hero))
  })
  replaceGlobalTrigger(globalName, triggerHandle)
}

/**
 * get_gold：
 * 聊天命令增加测试金币。
 */
function registerGetGoldTrigger(): void {
  disableLegacyTrigger("gg_trg_get_gold")
  const triggerHandle = CreateTrigger()
  registerPlayerChatEventAll(triggerHandle, "-getgold1998", true)
  TriggerAddAction(triggerHandle, () => {
    SetPlayerState(GetTriggerPlayer(), PLAYER_STATE_RESOURCE_GOLD(), GetPlayerState(GetTriggerPlayer(), PLAYER_STATE_RESOURCE_GOLD()) + 9999)
  })
  replaceGlobalTrigger("gg_trg_get_gold", triggerHandle)
}

/**
 * 入口：迁移 helmet / tech_get* / get_ms / get_gold / get_as / get_at。
 */
export function migrateHelmetAndTechTriggers(): void {
  registerHelmetCraftingTrigger()

  registerTechChatTrigger("gg_trg_tech_get", "-foot", FourCC("R000"))
  registerTechChatTrigger("gg_trg_tech_get_1", "-crossbow", FourCC("R001"))
  registerTechChatTrigger("gg_trg_tech_get_2", "-ride", FourCC("R002"))
  registerTechChatTrigger("gg_trg_tech_get_3", "-zhizhu", FourCC("R003"))
  registerTechChatTrigger("gg_trg_tech_get_4", "-scp", FourCC("R004"))
  registerTechChatTrigger("gg_trg_tech_get_5", "-sky", FourCC("R005"))

  registerHeroInfoChatTrigger("gg_trg_get_ms", "-ms", (hero) => {
    return GetUnitName(hero) + "的移动速度为" + R2S(GetUnitMoveSpeed(hero))
  })
  registerGetGoldTrigger()
  registerHeroInfoChatTrigger("gg_trg_get_as", "-as", (hero) => {
    return GetUnitName(hero) + "的攻击速度为" + R2S(GetUnitState(hero, UNIT_STATE_ATTACK_SPEED()))
  })
  registerHeroInfoChatTrigger("gg_trg_get_at", "-at", (hero) => {
    return GetUnitName(hero) + "的攻击间隔为" + R2S(GetUnitState(hero, UNIT_STATE_ATTACK_SPACE()))
  })
}

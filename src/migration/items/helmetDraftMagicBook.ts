import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, findItemInInventory, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const HELMET_SPELL_ID = FourCC("A034")
const HELMET_DUMMY_UNIT_ID = FourCC("ewsp")
const HELMET_DUMMY_ABILITY_ID = FourCC("A02Y")

const DRAFT_ITEM_ID = FourCC("I00Q")
const BOOK_REAGENT_ID = FourCC("I00D")
const BOOK_STAGE_1 = FourCC("I00L")
const BOOK_STAGE_2 = FourCC("I00M")
const BOOK_STAGE_3 = FourCC("I00N")
const BOOK_STAGE_4 = FourCC("I00O")
const BOOK_STAGE_5 = FourCC("I00K")
const BOOK_DRAFT_PAPER = FourCC("I00P")
const DRAFT_PAPER_CRAFTED_KEY = 0x641FDAD7

const BOOK_SUCCESS_FX = "Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl"
const BOOK_FAIL_FX = "Abilities\\Spells\\Human\\Feedback\\ArcaneTowerAttack.mdl"
const BOOK_FIRE_IMPACT_MODEL = "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl"
const BOOK_FIRE_WAVE_COUNT = 8
const BOOK_FIRE_WAVE_INTERVAL = 1.5
const BOOK_FIRE_IMPACT_COUNT = 5
const BOOK_FIRE_IMPACT_SPREAD = 280.0
const BOOK_FIRE_DAMAGE_RADIUS = 280.0
const BOOK_FIRE_BASE_DAMAGE = 166.0

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
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 判断单位是否位于某个矩形。
 */
function isUnitInRect(targetRect: rect, unitHandle: unit): boolean {
  const x = GetUnitX(unitHandle)
  const y = GetUnitY(unitHandle)
  return x >= GetRectMinX(targetRect) && x <= GetRectMaxX(targetRect) && y >= GetRectMinY(targetRect) && y <= GetRectMaxY(targetRect)
}

/**
 * 从背包删除指定类型的一件物品。
 */
function removeItemFromInventory(unitHandle: unit, itemTypeId: number): boolean {
  const target = findItemInInventory(unitHandle, itemTypeId)
  if (!target) {
    return false
  }
  RemoveItem(target)
  return true
}

/**
 * 检查单位是否拥有指定集合内全部物品。
 */
function hasAllItems(unitHandle: unit, itemIds: number[]): boolean {
  for (const itemId of itemIds) {
    if (!findItemInInventory(unitHandle, itemId)) {
      return false
    }
  }
  return true
}

/**
 * 将背包中的指定物品丢到脚下（不销毁）。
 */
function dropItemToFeet(unitHandle: unit, itemTypeId: number): void {
  const itemHandle = findItemInInventory(unitHandle, itemTypeId)
  if (!itemHandle) {
    return
  }
  SetItemPosition(itemHandle, GetUnitX(unitHandle), GetUnitY(unitHandle))
}

/**
 * 判断草稿纸是否已被任意玩家合成（对齐原图 YDHT 状态来源）。
 */
function isDraftPaperCrafted(): boolean {
  const ydht = getGlobal<hashtable>("YDHT")
  if (!ydht) {
    print("Missing hashtable: YDHT")
    return false
  }
  return LoadBoolean(ydht, BOOK_DRAFT_PAPER, DRAFT_PAPER_CRAFTED_KEY)
}

/**
 * 标记草稿纸已合成（全局唯一）。
 */
function markDraftPaperCrafted(): void {
  const ydht = getGlobal<hashtable>("YDHT")
  if (!ydht) {
    print("Missing hashtable: YDHT")
    return
  }
  SaveBoolean(ydht, BOOK_DRAFT_PAPER, DRAFT_PAPER_CRAFTED_KEY, true)
}

/**
 * 魔法书-火：单次火山喷发（多落点表现 + 本体结算伤害）。
 */
function runBookFireWave(caster: unit, owner: player, centerX: number, centerY: number, damageAmount: number): void {
  const damagedInWave: Record<number, true> = {}
  for (let index = 0; index < BOOK_FIRE_IMPACT_COUNT; index++) {
    const angleRad = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
    const distance = GetRandomReal(0.0, BOOK_FIRE_IMPACT_SPREAD)
    const impactX = centerX + distance * Cos(angleRad)
    const impactY = centerY + distance * Sin(angleRad)
    const impactFx = AddSpecialEffect(BOOK_FIRE_IMPACT_MODEL, impactX, impactY)
    destroyEffectLater(impactFx, 0.45)

    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, impactX, impactY, BOOK_FIRE_DAMAGE_RADIUS, null)
    ForGroup(groupHandle, () => {
      const target = GetEnumUnit()
      const targetId = GetHandleId(target)
      if (!targetId || damagedInWave[targetId]) {
        return
      }
      if (!IsUnitEnemy(target, owner) || IsUnitType(target, UNIT_TYPE_STRUCTURE()) || !isUnitAlive(target)) {
        return
      }
      damagedInWave[targetId] = true
      UnitDamageTarget(caster, target, damageAmount, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
    })
    DestroyGroup(groupHandle)
  }
}

/**
 * 魔法书-火：在目标区域持续触发火山喷发，伤害由施法者本体结算。
 */
function startBookFireSimulation(caster: unit, owner: player, centerX: number, centerY: number): void {
  const damageAmount = BOOK_FIRE_BASE_DAMAGE + GetHeroInt(caster, true)
  let waveCount = 1

  runBookFireWave(caster, owner, centerX, centerY, damageAmount)
  if (BOOK_FIRE_WAVE_COUNT <= 1) {
    return
  }

  const waveTimer = CreateTimer()
  TimerStart(waveTimer, BOOK_FIRE_WAVE_INTERVAL, true, () => {
    waveCount++
    if (waveCount > BOOK_FIRE_WAVE_COUNT) {
      DestroyTimer(waveTimer)
      return
    }
    runBookFireWave(caster, owner, centerX, centerY, damageAmount)
  })
}

/**
 * helmet_use：
 * 英雄施放 A034 时，为周围友军非建筑单位套上短时寒霜护甲。
 */
function registerHelmetUseTrigger(): void {
  disableLegacyTrigger("gg_trg_helmet_use")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === HELMET_SPELL_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    if (!IsUnitType(caster, UNIT_TYPE_HERO())) {
      return
    }
    const owner = GetOwningPlayer(caster)
    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, GetUnitX(caster), GetUnitY(caster), 512.0, null)
    ForGroup(groupHandle, () => {
      const target = GetEnumUnit()
      if (
        !IsUnitAlly(target, owner) ||
        IsUnitType(target, UNIT_TYPE_STRUCTURE()) ||
        IsUnitIllusion(target)
      ) {
        return
      }
      const dummy = CreateUnit(owner, HELMET_DUMMY_UNIT_ID, GetUnitX(target), GetUnitY(target), bj_UNIT_FACING)
      ShowUnit(dummy, false)
      SetUnitInvulnerable(dummy, true)
      UnitAddAbility(dummy, HELMET_DUMMY_ABILITY_ID)
      SetUnitAbilityLevel(dummy, HELMET_DUMMY_ABILITY_ID, 1)
      IssueTargetOrder(dummy, "frostarmor", target)
      removeUnitLater(dummy, 2.5)
    })
    DestroyGroup(groupHandle)
  })
  replaceGlobalTrigger("gg_trg_helmet_use", triggerHandle)
}

/**
 * draft：
 * 在指定区域摧毁可破坏物时有 8% 概率掉落草稿并关闭该触发器。
 */
function registerDraftTrigger(): void {
  disableLegacyTrigger("gg_trg_draft")
  const triggerHandle = CreateTrigger()
  const draftRect = getGlobal<rect>("gg_rct_______u")
  if (draftRect) {
    EnumDestructablesInRect(draftRect, null, () => {
      const enumDestructable = GetEnumDestructable()
      if (enumDestructable !== undefined) {
        TriggerRegisterDeathEvent(triggerHandle, enumDestructable)
      }
    })
  }
  TriggerAddAction(triggerHandle, () => {
    const dyingDestructable = GetTriggerDestructable()
    if (!dyingDestructable || GetRandomInt(1, 100) > 8) {
      return
    }
    CreateItem(DRAFT_ITEM_ID, GetDestructableX(dyingDestructable), GetDestructableY(dyingDestructable))
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_draft", triggerHandle)
}

/**
 * 处理书籍进阶：from + I00D => to，支持概率失败。
 */
function processBookUpgrade(
  unitHandle: unit,
  fromItemId: number,
  toItemId: number,
  successRate: number
): void {
  if (!hasAllItems(unitHandle, [fromItemId, BOOK_REAGENT_ID])) {
    return
  }
  if (GetRandomInt(1, 100) <= successRate) {
    const successEffect = AddSpecialEffectTarget(BOOK_SUCCESS_FX, unitHandle, "origin")
    destroyEffectLater(successEffect, 0.5)
    removeItemFromInventory(unitHandle, fromItemId)
    removeItemFromInventory(unitHandle, BOOK_REAGENT_ID)
    UnitAddItem(unitHandle, CreateItem(toItemId, GetUnitX(unitHandle), GetUnitY(unitHandle)))
    DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "书获得提升")
    return
  }
  const failEffect = AddSpecialEffectTarget(BOOK_FAIL_FX, unitHandle, "origin")
  destroyEffectLater(failEffect, 0.5)
  removeItemFromInventory(unitHandle, BOOK_REAGENT_ID)
  DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "升级失败")
}

/**
 * magic_book：
 * 处理书籍升阶与草稿纸合成链。
 */
function registerMagicBookTrigger(): void {
  disableLegacyTrigger("gg_trg_magic_book")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()

    if (hasAllItems(hero, [BOOK_STAGE_1, BOOK_STAGE_2, BOOK_STAGE_3, BOOK_STAGE_4, BOOK_STAGE_5])) {
      if (!isDraftPaperCrafted()) {
        const effectHandle = AddSpecialEffectTarget("Units\\NightElf\\Wisp\\WispExplode.mdl", hero, "origin")
        destroyEffectLater(effectHandle, 0.5)
        removeItemFromInventory(hero, BOOK_STAGE_1)
        removeItemFromInventory(hero, BOOK_STAGE_2)
        removeItemFromInventory(hero, BOOK_STAGE_3)
        removeItemFromInventory(hero, BOOK_STAGE_4)
        removeItemFromInventory(hero, BOOK_STAGE_5)
        UnitAddItem(hero, CreateItem(BOOK_DRAFT_PAPER, GetUnitX(hero), GetUnitY(hero)))
        markDraftPaperCrafted()
        DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "你获得了一张？草稿纸")
      } else {
        dropItemToFeet(hero, BOOK_STAGE_1)
        dropItemToFeet(hero, BOOK_STAGE_2)
        dropItemToFeet(hero, BOOK_STAGE_3)
        dropItemToFeet(hero, BOOK_STAGE_4)
        dropItemToFeet(hero, BOOK_STAGE_5)
        DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "已经有人合成过草稿纸了，无法再合成")
      }
    }

    processBookUpgrade(hero, BOOK_STAGE_1, BOOK_STAGE_2, 100)
    processBookUpgrade(hero, BOOK_STAGE_2, BOOK_STAGE_3, 100)
    processBookUpgrade(hero, BOOK_STAGE_3, BOOK_STAGE_4, 55)
    processBookUpgrade(hero, BOOK_STAGE_4, BOOK_STAGE_5, 35)
  })
  replaceGlobalTrigger("gg_trg_magic_book", triggerHandle)
}

/**
 * book_fire：
 * 施放 A01N 时在目标区域触发火山喷发（无马甲伤害，直接本体结算）。
 */
function registerBookFireTrigger(): void {
  disableLegacyTrigger("gg_trg_book_fire")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === FourCC("A01N")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const targetX = GetSpellTargetX()
    const targetY = GetSpellTargetY()
    startBookFireSimulation(caster, owner, targetX, targetY)
  })
  replaceGlobalTrigger("gg_trg_book_fire", triggerHandle)
}

/**
 * 入口：迁移 helmet_use / draft / magic_book / book_fire。
 */
export function migrateHelmetDraftMagicBookTriggers(): void {
  registerHelmetUseTrigger()
  registerDraftTrigger()
  registerMagicBookTrigger()
  registerBookFireTrigger()
}

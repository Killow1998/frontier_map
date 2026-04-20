import {
  EVENT_PLAYER_HERO_LEVEL,
  EVENT_PLAYER_UNIT_DROP_ITEM,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  EVENT_PLAYER_UNIT_USE_ITEM,
  UNIT_STATE_ATTACK_WHITE,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_HERO
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, findItemInInventory, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger, setAbilityDataRealValue, setAbilityDataStringValue } from "../core/helpers"

const RING_INT_ITEM_ID = FourCC("I01J")
const RING_STR_ITEM_ID = FourCC("I01H")
const RING_AGI_ITEM_ID = FourCC("I01K")
const RING_ATTACK_ITEM_ID = FourCC("I01G")
const RING_SPIRIT_ITEM_ID = FourCC("I01I")
const RING_SPIRIT_ABILITY_ID = FourCC("A03G")

const HELMET_VOLCANO_ITEM_ID = FourCC("I01B")
const HELMET_VOLCANO_REWARD_ID = FourCC("I01C")
const HELMET_THUNDER_ITEM_ID = FourCC("I01D")
const HELMET_THUNDER_REWARD_ID = FourCC("I01E")

/**
 * 判断单位是否位于指定矩形内。
 */
function isUnitInRect(targetRect: rect, unitHandle: unit): boolean {
  const x = GetUnitX(unitHandle)
  const y = GetUnitY(unitHandle)
  return x >= GetRectMinX(targetRect) && x <= GetRectMaxX(targetRect) && y >= GetRectMinY(targetRect) && y <= GetRectMaxY(targetRect)
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
 * 刷新属性之戒(I01I)附带技能 A03G 的数值与描述。
 */
function refreshRingSpiritAbility(hero: unit): void {
  if (!findItemInInventory(hero, RING_SPIRIT_ITEM_ID)) {
    return
  }
  if (GetUnitAbilityLevel(hero, RING_SPIRIT_ABILITY_ID) <= 0) {
    UnitAddAbility(hero, RING_SPIRIT_ABILITY_ID)
  }

  const totalAttr = GetHeroStr(hero, false) + GetHeroAgi(hero, false) + GetHeroInt(hero, false)
  const bonus = Math.floor(totalAttr / 6)
  setAbilityDataRealValue(hero, RING_SPIRIT_ABILITY_ID, 1, 110, bonus)
  setAbilityDataRealValue(hero, RING_SPIRIT_ABILITY_ID, 1, 108, bonus)
  setAbilityDataRealValue(hero, RING_SPIRIT_ABILITY_ID, 1, 109, bonus)
  setAbilityDataStringValue(hero, RING_SPIRIT_ABILITY_ID, 1, 218, "属性附加：" + I2S(bonus))

  IncUnitAbilityLevel(hero, RING_SPIRIT_ABILITY_ID)
  DecUnitAbilityLevel(hero, RING_SPIRIT_ABILITY_ID)
}

/**
 * ring_levelup：
 * 英雄升级时，根据戒指类型追加属性成长。
 */
function registerRingLevelupTrigger(): void {
  disableLegacyTrigger("gg_trg_ring_levelup")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_LEVEL())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    if (findItemInInventory(hero, RING_INT_ITEM_ID)) {
      SetHeroInt(hero, GetHeroInt(hero, true) + 1, true)
    }
    if (findItemInInventory(hero, RING_STR_ITEM_ID)) {
      SetHeroStr(hero, GetHeroStr(hero, true) + 2, true)
    }
    if (findItemInInventory(hero, RING_AGI_ITEM_ID)) {
      SetHeroAgi(hero, GetHeroAgi(hero, true) + 3, true)
    }
    if (findItemInInventory(hero, RING_ATTACK_ITEM_ID)) {
      SetUnitState(hero, UNIT_STATE_ATTACK_WHITE(), GetUnitState(hero, UNIT_STATE_ATTACK_WHITE()) + 5.0)
    }
    if (findItemInInventory(hero, RING_SPIRIT_ITEM_ID)) {
      SetUnitState(hero, UNIT_STATE_MAX_LIFE(), GetUnitState(hero, UNIT_STATE_MAX_LIFE()) + 210.0)
      refreshRingSpiritAbility(hero)
    }
  })
  replaceGlobalTrigger("gg_trg_ring_levelup", triggerHandle)
}

/**
 * ring_get：
 * 拾取属性之戒(I01I)时为英雄补挂并刷新 A03G。
 */
function registerRingGetTrigger(): void {
  disableLegacyTrigger("gg_trg_ring_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    if (GetItemTypeId(GetManipulatedItem()) === RING_SPIRIT_ITEM_ID && findItemInInventory(hero, RING_SPIRIT_ITEM_ID)) {
      refreshRingSpiritAbility(hero)
    }
  })
  replaceGlobalTrigger("gg_trg_ring_get", triggerHandle)
}

/**
 * ring_throw：
 * 丢弃属性之戒(I01I)时移除 A03G。
 */
function registerRingThrowTrigger(): void {
  disableLegacyTrigger("gg_trg_ring_throw")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DROP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    if (GetItemTypeId(GetManipulatedItem()) === RING_SPIRIT_ITEM_ID) {
      UnitRemoveAbility(GetTriggerUnit(), RING_SPIRIT_ABILITY_ID)
    }
  })
  replaceGlobalTrigger("gg_trg_ring_throw", triggerHandle)
}

/**
 * helmet_1：
 * 在火山区域使用 I01B 触发炼化，概率产出 I01C。
 */
function registerHelmetOneTrigger(): void {
  disableLegacyTrigger("gg_trg_helmet_1")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const volcanoRect = getGlobal<rect>("gg_rct_____________111")
    if (!volcanoRect) {
      return
    }
    if (GetItemTypeId(GetManipulatedItem()) !== HELMET_VOLCANO_ITEM_ID || !isUnitInRect(volcanoRect, hero)) {
      return
    }

    RemoveItem(GetManipulatedItem())
    if (GetRandomInt(1, 100) <= 50) {
      const successEffect = AddSpecialEffectTarget("Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl", hero, "origin")
      destroyEffectLater(successEffect, 0.5)
      CreateItem(HELMET_VOLCANO_REWARD_ID, GetUnitX(hero), GetUnitY(hero))
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "火山中蹦出了一块晶体，哇，这是什么？")
      return
    }

    const failEffect = AddSpecialEffectTarget("Units\\NightElf\\Wisp\\WispExplode.mdl", hero, "origin")
    destroyEffectLater(failEffect, 0.5)
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "喔哟，不耐烧，怎么没了呀")
  })
  replaceGlobalTrigger("gg_trg_helmet_1", triggerHandle)
}

/**
 * helmet_2：
 * 在雷区使用 I01D 时先触发雷核判定，再概率产出 I01E。
 */
function registerHelmetTwoTrigger(): void {
  disableLegacyTrigger("gg_trg_helmet_2")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const thunderRect = getGlobal<rect>("gg_rct_____________1112")
    if (!thunderRect) {
      return
    }
    if (GetItemTypeId(GetManipulatedItem()) !== HELMET_THUNDER_ITEM_ID || !isUnitInRect(thunderRect, hero)) {
      return
    }

    RemoveItem(GetManipulatedItem())
    const lightingGetTrigger = getGlobal<trigger>("gg_trg_lighting_get_trig")
    if (lightingGetTrigger) {
      TriggerExecute(lightingGetTrigger)
    }

    if (GetRandomInt(1, 100) <= 50) {
      const successEffect = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\FeralSpirit\\feralspirittarget.mdl", hero, "origin")
      destroyEffectLater(successEffect, 0.5)
      CreateItem(HELMET_THUNDER_REWARD_ID, GetUnitX(hero), GetUnitY(hero))
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "雷击落下，火焰迸发，烟雾散去之后还有一块发光的皮毛")
      return
    }

    const failEffect = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\CorrosiveBreath\\ChimaeraAcidTargetArt.mdl", hero, "origin")
    destroyEffectLater(failEffect, 0.5)
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "雷击落下，火焰迸发，烟雾散去之后什么都没了")
  })
  replaceGlobalTrigger("gg_trg_helmet_2", triggerHandle)
}

/**
 * 入口：迁移 ring_levelup / ring_get / ring_throw / helmet_1 / helmet_2。
 */
export function migrateRingAndHelmetTriggers(): void {
  registerRingLevelupTrigger()
  registerRingGetTrigger()
  registerRingThrowTrigger()
  registerHelmetOneTrigger()
  registerHelmetTwoTrigger()
}

import {
  ATTACK_TYPE_MAGIC,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  EVENT_PLAYER_UNIT_USE_ITEM,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, findItemInInventory, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const PRAISE_THE_SUN_ITEM_ID = FourCC("I030")
const SOUL_ORB_ITEM_ID = FourCC("I02W")
const HEART_OF_CORRUPTION_ITEM_ID = FourCC("I02V")
const SUN_TIMER_BY_HERO = new Map<number, timer>()

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
 * 延迟销毁闪电。
 */
function destroyLightningLater(lightningHandle: lightning, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyLightning(lightningHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 在指定范围内对敌军造成日轮伤害。
 */
function applySunBurst(hero: unit): void {
  const heroX = GetUnitX(hero)
  const heroY = GetUnitY(hero)
  const damage = GetUnitState(hero, UNIT_STATE_MAX_LIFE()) * 0.199
  const pulses = GetRandomInt(4, 9)

  for (let i = 0; i < pulses; i++) {
    const angle = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
    const distance = GetRandomReal(100.0, 500.0)
    const x = heroX + distance * Cos(angle)
    const y = heroY + distance * Sin(angle)
    const trueshotFx = AddSpecialEffect("Abilities\\Spells\\NightElf\\TrueshotAura\\TrueshotAura.mdl", x, y)
    const holyFx = AddSpecialEffect("Abilities\\Spells\\Human\\HolyBolt\\HolyBoltSpecialArt.mdl", x, y)
    destroyEffectLater(trueshotFx, 0.2)
    destroyEffectLater(holyFx, 0.5)

    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, x, y, 244.0, null)
    ForGroup(groupHandle, () => {
      const enumUnit = GetEnumUnit()
      if (
        enumUnit !== hero &&
        GetWidgetLife(enumUnit) > 0.405 &&
        !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) &&
        IsUnitEnemy(enumUnit, GetOwningPlayer(hero))
      ) {
        UnitDamageTarget(hero, enumUnit, damage, false, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    DestroyGroup(groupHandle)
  }

  UnitDamageTarget(hero, hero, GetUnitState(hero, UNIT_STATE_LIFE()) * 0.11, false, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
}

/**
 * 监听日轮披风拾取后开启周期爆发。
 */
function registerPraiseTheSunTrigger(): void {
  disableLegacyTrigger("gg_trg_Praise_the_Sun")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const hero = GetTriggerUnit()
      return IsUnitType(hero, UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === PRAISE_THE_SUN_ITEM_ID && !!findItemInInventory(hero, PRAISE_THE_SUN_ITEM_ID)
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const heroId = GetHandleId(hero)
    if (SUN_TIMER_BY_HERO.has(heroId)) {
      return
    }

    const timerHandle = CreateTimer()
    SUN_TIMER_BY_HERO.set(heroId, timerHandle)
    TimerStart(timerHandle, 9.0, true, () => {
      if (GetWidgetLife(hero) <= 0.405 || !findItemInInventory(hero, PRAISE_THE_SUN_ITEM_ID)) {
        DestroyTimer(timerHandle)
        SUN_TIMER_BY_HERO.delete(heroId)
        return
      }
      applySunBurst(hero)
    })
  })
  replaceGlobalTrigger("gg_trg_Praise_the_Sun", triggerHandle)
}

/**
 * Soul Orb：英雄死亡周围的灵魂球效果。
 */
function registerSoulOrbTrigger(): void {
  disableLegacyTrigger("gg_trg_Soul_Orb")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddAction(triggerHandle, () => {
    const dyingUnit = GetDyingUnit()
    const owner = GetOwningPlayer(dyingUnit)
    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, GetUnitX(dyingUnit), GetUnitY(dyingUnit), 500.0, null)
    ForGroup(groupHandle, () => {
      const enumUnit = GetEnumUnit()
      if (
        IsUnitEnemy(enumUnit, owner) &&
        IsUnitType(enumUnit, UNIT_TYPE_HERO()) &&
        GetUnitState(enumUnit, UNIT_STATE_MAX_LIFE()) >= 100.0 &&
        !!findItemInInventory(enumUnit, SOUL_ORB_ITEM_ID)
      ) {
        const lightningHandle = AddLightning("CLSB", true, GetUnitX(dyingUnit), GetUnitY(dyingUnit), GetUnitX(enumUnit), GetUnitY(enumUnit))
        SetLightningColor(lightningHandle, 1.0, 1.0, 1.0, 0.8)
        destroyLightningLater(lightningHandle, 0.4)
        SetUnitState(enumUnit, UNIT_STATE_MAX_LIFE(), GetUnitState(enumUnit, UNIT_STATE_MAX_LIFE()) - 4.0)
        SetUnitState(enumUnit, UNIT_STATE_MAX_MANA(), GetUnitState(enumUnit, UNIT_STATE_MAX_MANA()) + 3.0)
      }
    })
    DestroyGroup(groupHandle)
  })
  replaceGlobalTrigger("gg_trg_Soul_Orb", triggerHandle)
}

/**
 * Heart of Corruption：使用后削减三围。
 */
function registerHeartOfCorruptionTrigger(): void {
  disableLegacyTrigger("gg_trg_Heart_of_Corruption")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === HEART_OF_CORRUPTION_ITEM_ID)
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    SetHeroStr(hero, GetHeroStr(hero, true) - 3, true)
    SetHeroAgi(hero, GetHeroAgi(hero, true) - 3, true)
    SetHeroInt(hero, GetHeroInt(hero, true) - 3, true)
  })
  replaceGlobalTrigger("gg_trg_Heart_of_Corruption", triggerHandle)
}

/**
 * 入口：迁移 Praise_the_Sun / Soul_Orb / Heart_of_Corruption。
 */
export function migrateSunAndOrbTriggers(): void {
  registerPraiseTheSunTrigger()
  registerSoulOrbTrigger()
  registerHeartOfCorruptionTrigger()
}

import { EVENT_PLAYER_HERO_SKILL, EVENT_PLAYER_UNIT_PICKUP_ITEM, EVENT_PLAYER_UNIT_SPELL_EFFECT, EVENT_PLAYER_UNIT_USE_ITEM, UNIT_TYPE_DEAD, UNIT_TYPE_HERO, UNIT_TYPE_STRUCTURE } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { applyUnitBonus, disableLegacyTrigger, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const CONCEALED_WEAPON_ITEM_ID = FourCC("I02L")
const CONCEALED_WEAPON_HERO_ID = FourCC("U00D")
const CONCEALED_WEAPON_DUMMY_ID = FourCC("u00E")
const SEA_GOD_BOSS_GLOBAL = "gg_unit_U00D_0259"

const MORPH_HERO_ID = FourCC("E002")
const WALK_ABILITY_ID = FourCC("A06F")
const STAY_ABILITY_ID = FourCC("A06E")
const Q_LEARN_ID = FourCC("A06G")
const E_LEARN_ID = FourCC("A06K")
const SWEET_SOUP_ITEM_ID = FourCC("I02Q")
const SHARPENING_FULL_STACK_BONUS = [0.25, 0.4, 0.55, 0.7, 0.85, 1.0, 1.15, 1.3]
const WALK_MODE_DATA_106 = [80.0, 90.0, 100.0]
const WALK_MODE_DATA_107 = [0.25, 0.6, 0.85]
const STAY_MODE_DATA_106 = [600.0, 700.0, 800.0]
const STAY_MODE_DATA_107 = [35.0, 65.0, 110.0]

const concealedWeaponTimers = new Map<number, timer>()

/**
 * 延迟移除单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * concealed_weapon：每 9 秒从 800 范围内随机挑一个敌人，派暗器傀儡施放一次技能。
 */
function registerConcealedWeaponTrigger(): void {
  disableLegacyTrigger("gg_trg_concealed_weapon")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const triggerUnit = GetTriggerUnit()
      const seaGodBoss = getGlobal<unit>(SEA_GOD_BOSS_GLOBAL)
      return !!seaGodBoss
        && triggerUnit === seaGodBoss
        && IsUnitType(triggerUnit, UNIT_TYPE_HERO())
        && GetUnitTypeId(triggerUnit) === CONCEALED_WEAPON_HERO_ID
        && GetItemTypeId(GetManipulatedItem()) === CONCEALED_WEAPON_ITEM_ID
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const heroId = GetHandleId(hero)
    if (concealedWeaponTimers.has(heroId)) {
      return
    }

    const timerHandle = CreateTimer()
    concealedWeaponTimers.set(heroId, timerHandle)
    TimerStart(timerHandle, 9.0, true, () => {
      if (GetWidgetLife(hero) <= 0.405 || IsUnitType(hero, UNIT_TYPE_DEAD())) {
        concealedWeaponTimers.delete(heroId)
        DestroyTimer(timerHandle)
        return
      }

      const enemyUnits: unit[] = []
      const aroundGroup = CreateGroup()
      GroupEnumUnitsInRange(
        aroundGroup,
        GetUnitX(hero),
        GetUnitY(hero),
        800.0,
        Filter(() => {
          const enumUnit = GetFilterUnit()
          return IsUnitEnemy(enumUnit, GetOwningPlayer(hero)) && !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) && !IsUnitType(enumUnit, UNIT_TYPE_DEAD())
        })
      )

      ForGroup(aroundGroup, () => {
        enemyUnits.push(GetEnumUnit())
      })
      DestroyGroup(aroundGroup)

      if (enemyUnits.length === 0) {
        return
      }

      const target = enemyUnits[GetRandomInt(0, enemyUnits.length - 1)]
      const markEffect = AddSpecialEffectTarget("Abilities\\Spells\\Other\\TalkToMe\\TalkToMe.mdl", target, "overhead")
      const destroyTimer = CreateTimer()
      TimerStart(destroyTimer, 1.0, false, () => {
        DestroyEffect(markEffect)
        DestroyTimer(destroyTimer)
      })
      const randomOrder = GetRandomInt(1, 4)
      const orderTimer = CreateTimer()
      TimerStart(orderTimer, 1.0, false, () => {
        const dummy = CreateUnit(GetOwningPlayer(hero), CONCEALED_WEAPON_DUMMY_ID, GetUnitX(hero), GetUnitY(hero), GetUnitFacing(hero))
        ShowUnit(dummy, false)
        SetUnitInvulnerable(dummy, true)
        if (randomOrder === 1) {
          IssueTargetOrder(dummy, "soulburn", target)
        } else if (randomOrder === 2) {
          IssueTargetOrder(dummy, "coldarrowstarg", target)
        } else if (randomOrder === 3) {
          IssueTargetOrder(dummy, "manaburn", target)
        } else {
          IssueTargetOrder(dummy, "fingerofdeath", target)
        }
        removeUnitLater(dummy, 2.0)
        DestroyTimer(orderTimer)
      })
    })
  })
  replaceGlobalTrigger("gg_trg_concealed_weapon", triggerHandle)
}

/**
 * walk/stay 共享的形态缓存读取。
 */
function getMorphLevelValue(values: number[], level: number): number {
  return values[Math.max(0, Math.min(values.length - 1, level - 1))]
}

function loadMorphData(hero: unit, abilityId: number): [number, number] {
  const level = Math.max(1, GetUnitAbilityLevel(hero, abilityId))
  if (abilityId === WALK_ABILITY_ID) {
    return [getMorphLevelValue(WALK_MODE_DATA_106, level), getMorphLevelValue(WALK_MODE_DATA_107, level)]
  }
  if (abilityId === STAY_ABILITY_ID) {
    return [getMorphLevelValue(STAY_MODE_DATA_106, level), getMorphLevelValue(STAY_MODE_DATA_107, level)]
  }
  return [0.0, 0.0]
}

/**
 * walk：切换到移动形态。
 */
function registerWalkTrigger(): void {
  disableLegacyTrigger("gg_trg_walk")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === MORPH_HERO_ID && GetSpellAbilityId() === WALK_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const storedLevel = GetUnitAbilityLevel(hero, WALK_ABILITY_ID)
    const ydht = getGlobal<hashtable>("YDHT")
    if (ydht) {
      const cachedEffect = LoadEffectHandle(ydht, MORPH_HERO_ID, 0x41B94617)
      if (cachedEffect !== undefined && cachedEffect !== null) {
        DestroyEffect(cachedEffect)
      }
    }
    UnitAddAbility(hero, STAY_ABILITY_ID)
    SetUnitAbilityLevel(hero, STAY_ABILITY_ID, storedLevel)
    const [walkMoveSpeed, walkMana] = loadMorphData(hero, WALK_ABILITY_ID)
    const [stayMoveSpeed, stayMana] = loadMorphData(hero, STAY_ABILITY_ID)
    if (ydht) {
      const effectHandle = AddSpecialEffectTarget("Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl", hero, "weapon")
      SaveEffectHandle(ydht, MORPH_HERO_ID, 0x41B94617, effectHandle)
      SaveReal(ydht, MORPH_HERO_ID, 0x7583CB65, walkMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5, walkMana)
      SaveReal(ydht, MORPH_HERO_ID, 0xF8535EA1, stayMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x7340FB38, stayMana)
    }
    SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) + walkMana)
    SetUnitMoveSpeed(hero, GetUnitDefaultMoveSpeed(hero) + walkMoveSpeed)
    SetUnitState(hero, ConvertUnitState(0x16), GetUnitState(hero, ConvertUnitState(0x16)) - stayMoveSpeed)
    applyUnitBonus(hero, 3, 1, R2I(stayMana))
    UnitRemoveAbility(hero, WALK_ABILITY_ID)
  })
  replaceGlobalTrigger("gg_trg_walk", triggerHandle)
}

/**
 * stay：切换到驻停形态。
 */
function registerStayTrigger(): void {
  disableLegacyTrigger("gg_trg_stay")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === MORPH_HERO_ID && GetSpellAbilityId() === STAY_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const storedLevel = GetUnitAbilityLevel(hero, STAY_ABILITY_ID)
    const ydht = getGlobal<hashtable>("YDHT")
    if (ydht) {
      const cachedEffect = LoadEffectHandle(ydht, MORPH_HERO_ID, 0x41B94617)
      if (cachedEffect !== undefined && cachedEffect !== null) {
        DestroyEffect(cachedEffect)
      }
    }
    UnitAddAbility(hero, WALK_ABILITY_ID)
    SetUnitAbilityLevel(hero, WALK_ABILITY_ID, storedLevel)
    const [walkMoveSpeed, walkMana] = loadMorphData(hero, WALK_ABILITY_ID)
    const [stayMoveSpeed, stayMana] = loadMorphData(hero, STAY_ABILITY_ID)
    if (ydht) {
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Human\\slow\\slowtarget.mdl", hero, "origin")
      SaveEffectHandle(ydht, MORPH_HERO_ID, 0x41B94617, effectHandle)
      SaveReal(ydht, MORPH_HERO_ID, 0x7583CB65, walkMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5, walkMana)
      SaveReal(ydht, MORPH_HERO_ID, 0xF8535EA1, stayMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x7340FB38, stayMana)
    }
    SetUnitMoveSpeed(hero, GetUnitDefaultMoveSpeed(hero) - 0.0)
    SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) - walkMana)
    SetUnitState(hero, ConvertUnitState(0x16), GetUnitState(hero, ConvertUnitState(0x16)) + stayMoveSpeed)
    applyUnitBonus(hero, 3, 0, R2I(stayMana))
    UnitRemoveAbility(hero, STAY_ABILITY_ID)
  })
  replaceGlobalTrigger("gg_trg_stay", triggerHandle)
}

/**
 * Q_learn：学习 Q 后建立两种形态的基础缓存。
 */
function registerQLearnTrigger(): void {
  disableLegacyTrigger("gg_trg_Q_learn")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_SKILL())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === MORPH_HERO_ID && GetLearnedSkill() === Q_LEARN_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const learnedLevel = GetUnitAbilityLevel(hero, Q_LEARN_ID)
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    if (learnedLevel === 1) {
      SaveInteger(ydht, MORPH_HERO_ID, 0x0E6FBF16, 1)
      UnitAddAbility(hero, WALK_ABILITY_ID)
      SetUnitAbilityLevel(hero, WALK_ABILITY_ID, 1)
      const [walkMoveSpeed, walkMana] = loadMorphData(hero, WALK_ABILITY_ID)
      const [stayMoveSpeed, stayMana] = loadMorphData(hero, STAY_ABILITY_ID)
      const effectHandle = AddSpecialEffectTarget("Abilities\\Weapons\\PhoenixMissile\\Phoenix_Missile_mini.mdl", hero, "weapon")
      SaveEffectHandle(ydht, MORPH_HERO_ID, 0x41B94617, effectHandle)
      SaveReal(ydht, MORPH_HERO_ID, 0x7583CB65, walkMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5, walkMana)
      SaveReal(ydht, MORPH_HERO_ID, 0xF8535EA1, stayMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x7340FB38, stayMana)
      SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) + walkMana)
      SetUnitMoveSpeed(hero, GetUnitDefaultMoveSpeed(hero) + walkMoveSpeed)
      UnitRemoveAbility(hero, WALK_ABILITY_ID)
      UnitAddAbility(hero, STAY_ABILITY_ID)
      SetUnitAbilityLevel(hero, STAY_ABILITY_ID, 1)
      return
    }

    if (GetUnitAbilityLevel(hero, WALK_ABILITY_ID) > 0) {
      SetUnitAbilityLevel(hero, WALK_ABILITY_ID, learnedLevel)
      SetUnitState(hero, ConvertUnitState(0x16), GetUnitState(hero, ConvertUnitState(0x16)) - LoadReal(ydht, MORPH_HERO_ID, 0xF8535EA1))
      applyUnitBonus(hero, 3, 1, R2I(LoadReal(ydht, MORPH_HERO_ID, 0x7340FB38)))
      const [walkMoveSpeed, walkMana] = loadMorphData(hero, WALK_ABILITY_ID)
      const [stayMoveSpeed, stayMana] = loadMorphData(hero, STAY_ABILITY_ID)
      SaveReal(ydht, MORPH_HERO_ID, 0x7583CB65, walkMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5, walkMana)
      SaveReal(ydht, MORPH_HERO_ID, 0xF8535EA1, stayMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x7340FB38, stayMana)
      UnitAddAbility(hero, STAY_ABILITY_ID)
      SetUnitAbilityLevel(hero, STAY_ABILITY_ID, learnedLevel)
      UnitRemoveAbility(hero, STAY_ABILITY_ID)
      SetUnitState(hero, ConvertUnitState(0x16), GetUnitState(hero, ConvertUnitState(0x16)) + stayMoveSpeed)
      applyUnitBonus(hero, 3, 0, R2I(stayMana))
    }

    if (GetUnitAbilityLevel(hero, STAY_ABILITY_ID) > 0) {
      SetUnitAbilityLevel(hero, STAY_ABILITY_ID, learnedLevel)
      SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) - LoadReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5))
      SetUnitMoveSpeed(hero, GetUnitDefaultMoveSpeed(hero) - 0.0)
      const [walkMoveSpeed, walkMana] = loadMorphData(hero, WALK_ABILITY_ID)
      const [stayMoveSpeed, stayMana] = loadMorphData(hero, STAY_ABILITY_ID)
      SaveReal(ydht, MORPH_HERO_ID, 0x7583CB65, walkMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5, walkMana)
      SaveReal(ydht, MORPH_HERO_ID, 0xF8535EA1, stayMoveSpeed)
      SaveReal(ydht, MORPH_HERO_ID, 0x7340FB38, stayMana)
      UnitAddAbility(hero, WALK_ABILITY_ID)
      SetUnitAbilityLevel(hero, WALK_ABILITY_ID, learnedLevel)
      UnitRemoveAbility(hero, WALK_ABILITY_ID)
      SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) + walkMana)
      SetUnitMoveSpeed(hero, GetUnitDefaultMoveSpeed(hero) + walkMoveSpeed)
    }
  })
  replaceGlobalTrigger("gg_trg_Q_learn", triggerHandle)
}

/**
 * E_learn：学习 E 后增加敏捷。
 */
function registerELearnTrigger(): void {
  disableLegacyTrigger("gg_trg_E_learn")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_SKILL())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === MORPH_HERO_ID && GetLearnedSkill() === E_LEARN_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    SetHeroAgi(hero, GetHeroAgi(hero, true) + GetUnitAbilityLevel(hero, E_LEARN_ID) * 5, true)
  })
  replaceGlobalTrigger("gg_trg_E_learn", triggerHandle)
}

/**
 * sweet_soup：清理形态缓存和相关英雄的特殊状态。
 */
function registerSweetSoupTrigger(): void {
  disableLegacyTrigger("gg_trg_sweet_soup")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === SWEET_SOUP_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    if (GetUnitTypeId(hero) === MORPH_HERO_ID) {
      const cachedEffect = LoadEffectHandle(ydht, MORPH_HERO_ID, 0x41B94617)
      if (cachedEffect !== undefined && cachedEffect !== null) {
        DestroyEffect(cachedEffect)
      }
      if (GetUnitAbilityLevel(hero, WALK_ABILITY_ID) > 0) {
        SetUnitState(hero, ConvertUnitState(0x16), GetUnitState(hero, ConvertUnitState(0x16)) - LoadReal(ydht, MORPH_HERO_ID, 0xF8535EA1))
        applyUnitBonus(hero, 3, 1, R2I(LoadReal(ydht, MORPH_HERO_ID, 0x7340FB38)))
      }
      if (GetUnitAbilityLevel(hero, STAY_ABILITY_ID) > 0) {
        SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) - LoadReal(ydht, MORPH_HERO_ID, 0x0A2C3FB5))
        SetUnitMoveSpeed(hero, GetUnitDefaultMoveSpeed(hero) - 0.0)
      }
      UnitRemoveAbility(hero, STAY_ABILITY_ID)
      UnitRemoveAbility(hero, WALK_ABILITY_ID)
    }

    if (GetUnitTypeId(hero) === FourCC("H007") && GetUnitAbilityLevel(hero, FourCC("A05T")) > 0 && GetUnitAbilityLevel(hero, FourCC("A05S")) > 0) {
      UnitRemoveAbility(hero, FourCC("A05T"))
      UnitRemoveAbility(hero, FourCC("A05S"))
      UnitModifySkillPoints(hero, LoadInteger(ydht, FourCC("H007"), 0xFAFE5485))
      UnitModifySkillPoints(hero, LoadInteger(ydht, FourCC("H007"), 0x457BCFC0))
      SaveInteger(ydht, FourCC("H007"), 0xFAFE5485, 0)
      SaveInteger(ydht, FourCC("H007"), 0x457BCFC0, 0)
    }

    if (GetUnitTypeId(hero) === FourCC("H00A") && GetUnitAbilityLevel(hero, FourCC("A067")) > 0) {
      if (LoadBoolean(ydht, FourCC("A067"), 0x1010ED95)) {
        const effectHandle = LoadEffectHandle(ydht, FourCC("A067"), 0xFD1D8589)
        if (effectHandle !== undefined && effectHandle !== null) {
          DestroyEffect(effectHandle)
        }
        const bonusIndex = Math.max(0, Math.min(SHARPENING_FULL_STACK_BONUS.length - 1, GetUnitAbilityLevel(hero, FourCC("A067")) - 1))
        const attackSpeedBonus = SHARPENING_FULL_STACK_BONUS[bonusIndex]
        SetUnitState(hero, ConvertUnitState(0x51), GetUnitState(hero, ConvertUnitState(0x51)) - attackSpeedBonus)
        SaveBoolean(ydht, FourCC("A067"), 0x1010ED95, false)
      }
    }

    if (GetUnitTypeId(hero) === FourCC("H009") && GetUnitAbilityLevel(hero, FourCC("A062")) > 0) {
      const effectHandle = LoadEffectHandle(ydht, FourCC("H009"), 0xF8F856EA)
      if (effectHandle !== undefined && effectHandle !== null) {
        DestroyEffect(effectHandle)
      }
    }
  })
  replaceGlobalTrigger("gg_trg_sweet_soup", triggerHandle)
}

/**
 * 入口：迁移 concealed_weapon / walk / stay / Q_learn / E_learn / sweet_soup。
 */
export function migrateSkillMorphTriggers(): void {
  registerConcealedWeaponTrigger()
  registerWalkTrigger()
  registerStayTrigger()
  registerQLearnTrigger()
  registerELearnTrigger()
  registerSweetSoupTrigger()
}

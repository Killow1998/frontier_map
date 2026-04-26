import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_HERO_LEVEL,
  EVENT_PLAYER_HERO_SKILL,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_DROP_ITEM,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  ITEM_TYPE_ARTIFACT,
  ITEM_TYPE_CAMPAIGN,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  SYNC_TEMP_GROUP,
  applyUnitBonus,
  disableLegacyTrigger,
  findItemInInventory,
  getAbilityDataRealValue,
  getGlobal,
  overrideCurrentEventDamage,
  registerAnyUnitDamagedEvent,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  setAbilityDataRealValue,
  setAbilityDataStringValue,
  toSyncInt
} from "../core/helpers"
import { ydhtLoadItemUseFlag, ydhtSaveItemUseFlag } from "../core/userData"

const SHADOW_HERO_ID = FourCC("H004")
const SHADOW_DARK_ITEM_ID = FourCC("I014")
const SHADOW_GEM_ITEM_ID = FourCC("I040")
const SHADOW_FORM_ITEM_ID = FourCC("I041")

const SHADOW_ASSASSIN_ID = FourCC("H009")
const SHADOW_RAID_ABILITY_ID = FourCC("A05V")
const SHADOW_SHACKLE_ABILITY_ID = FourCC("A05Y")
const SHADOW_RETURN_ABILITY_ID = FourCC("A05Z")
const SHADOW_DUMMY_BUFF_ID = FourCC("A05U")
const SHADOW_DUMMY_LEASH_ID = FourCC("A05X")
const SHADOW_DUMMY_BLOOD_ID = FourCC("A061")
const KNIFE_USE_ABILITY_ID = FourCC("A054")
let hasWarnedMissingEventDamageOverride = false
const SLOTH_SKILL_ABILITY_ID = FourCC("A05B")
const SLOTH_STUN_ABILITY_ID = FourCC("A05C")
const SLOTH_CURSE_ABILITY_ID = FourCC("A05D")
const WRATH_SKILL_ABILITY_ID = FourCC("A05G")
const WRATH_AOE_ABILITY_ID = FourCC("A05E")
const WRATH_SHELL_ABILITY_ID = FourCC("A05F")
const PRIDE_SKILL_ABILITY_ID = FourCC("A05I")
const ENVY_SKILL_ABILITY_ID = FourCC("A05H")
const BLOOD_SHADOW_ABILITY_ID = FourCC("A062")
const BLOOD_SHADOW_EFFECT_KEY = 0xF8F856EA
const SIN_ALLOWED_ARTIFACT_IDS = [FourCC("I01L"), FourCC("I01M"), FourCC("I01N"), FourCC("I01O"), FourCC("I01P"), FourCC("I01Q"), FourCC("tkno")]

const KNIFE_ITEM_IDS = [FourCC("I023"), FourCC("I024"), FourCC("I025"), FourCC("I026"), FourCC("I027"), FourCC("I028"), FourCC("I022")]
const KNIFE_ABILITY_IDS = [FourCC("A04U"), FourCC("A04V"), FourCC("A04W"), FourCC("A04Y"), FourCC("A04Z")]
const KNIFE_UPGRADE_SOURCE_ID = FourCC("A053")

const SIN_SLOTH_KEY = 0x193764E8
const SIN_PRIDE_KEY = 0x5CFF73A0
const SIN_WRATH_KEY = 0xCBCE51D0
const SIN_ENVY_KEY = 0x5EE5C0C0
const SIN_GLUTTONY_KEY = 0xB088C2E3
const SIN_GREED_KEY = 0xFC90CAC3
const SIN_LUST_KEY = 0xD03034F6
const SIN_BONE_COUNT_KEY = 0x6CCF2C68
const FINAL_KNIFE_ITEM_ID = FourCC("I022")
const FINAL_KNIFE_STR_BONUS_KEY = 0x651DD2FC
const FINAL_KNIFE_MANA_BONUS_KEY = 0xC13B904E
const FINAL_KNIFE_LIFE_REGEN_BONUS_KEY = 0xEF12EDB1
const FINAL_KNIFE_AGI_BONUS_KEY = 0xCBF95817

/**
 * 注册任意单位死亡事件。
 */
function registerAnyDamageEvent(triggerHandle: trigger): void {
  registerAnyUnitDamagedEvent(triggerHandle)
}

/**
 * 读取能力字段。
 */
function getAbilityDataReal(whichUnit: unit, abilityId: number, level: number, dataType: number, fallback: number): number {
  return getAbilityDataRealValue(whichUnit, abilityId, level, dataType, fallback)
}

/**
 * 写入能力字段。
 */
function setAbilityDataReal(whichUnit: unit, abilityId: number, level: number, dataType: number, value: number): void {
  setAbilityDataRealValue(whichUnit, abilityId, level, dataType, value)
}

/**
 * 写入能力字符串字段。
 */
function setAbilityDataString(whichUnit: unit, abilityId: number, level: number, dataType: number, value: string): void {
  setAbilityDataStringValue(whichUnit, abilityId, level, dataType, value)
}

/**
 * 在同一个受伤事件内改写本次伤害值。
 */
function adjustCurrentEventDamage(value: number): void {
  const nextDamage = value < 0.0 ? 0.0 : value
  if (overrideCurrentEventDamage(nextDamage)) {
    return
  }
  if (!hasWarnedMissingEventDamageOverride) {
    hasWarnedMissingEventDamageOverride = true
    print("[migration] Missing EXSetEventDamage/BlzSetEventDamage; damage rewrite skipped")
  }
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
 * 延迟销毁文字标签。
 */
function destroyTextTagLater(textTag: texttag, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyTextTag(textTag)
    DestroyTimer(timerHandle)
  })
}

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
 * 在单位头顶显示提示。
 */
function createTextTagOnUnit(whichUnit: unit, text: string, height: number): texttag {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, text, 0.023)
  SetTextTagPosUnit(textTag, whichUnit, height)
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 1.5)
  SetTextTagFadepoint(textTag, 0.75)
  return textTag
}

/**
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 根据角度投射坐标。
 */
function projectPoint(x: number, y: number, distance: number, angleDegrees: number): [number, number] {
  const angleRad = angleDegrees * bj_DEGTORAD
  return [x + distance * Cos(angleRad), y + distance * Sin(angleRad)]
}

/**
 * 刷新技能等级以应用运行时字段写入。
 */
function refreshAbilityLevel(whichUnit: unit, abilityId: number): void {
  const level = GetUnitAbilityLevel(whichUnit, abilityId)
  if (level > 0) {
    IncUnitAbilityLevel(whichUnit, abilityId)
    DecUnitAbilityLevel(whichUnit, abilityId)
  }
}

/**
 * 获取属性加成接口（本地兼容层）。
 */
function getBonusSystem(): ((whichUnit: unit, attr: number, op: number, value: number) => void) | undefined {
  return applyUnitBonus
}

/**
 * 用定时位移模拟“拉向施法者”的抛物表现，尽量减少对 YDWEJumpTimer 的依赖。
 */
function pullUnitTowards(target: unit, anchor: unit, targetDistance: number, duration: number, step: number): void {
  const totalTicks = Math.max(1, Math.floor(duration / step))
  let tick = 0
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, step, true, () => {
    tick++
    if (!isUnitAlive(target) || !isUnitAlive(anchor) || tick > totalTicks) {
      DestroyTimer(timerHandle)
      return
    }
    const targetX = GetUnitX(target)
    const targetY = GetUnitY(target)
    const anchorX = GetUnitX(anchor)
    const anchorY = GetUnitY(anchor)
    const deltaX = anchorX - targetX
    const deltaY = anchorY - targetY
    const distance = SquareRoot(deltaX * deltaX + deltaY * deltaY)
    const remainTicks = Math.max(1, totalTicks - tick + 1)
    const stepDistance = (distance - targetDistance) / remainTicks
    if (distance <= targetDistance || stepDistance <= 0.0) {
      DestroyTimer(timerHandle)
      return
    }
    const ratio = stepDistance / distance
    SetUnitX(target, targetX + deltaX * ratio)
    SetUnitY(target, targetY + deltaY * ratio)
  })
}

/**
 * 傲慢冲刺：沿路径推进并对首次接触敌人造成伤害。
 */
function runPrideRush(caster: unit, targetX: number, targetY: number, duration: number, step: number, hitDamage: number): void {
  const startX = GetUnitX(caster)
  const startY = GetUnitY(caster)
  const owner = GetOwningPlayer(caster)
  const totalDistance = SquareRoot((targetX - startX) * (targetX - startX) + (targetY - startY) * (targetY - startY))
  if (totalDistance <= 5.0) {
    return
  }

  let elapsed = 0.0
  let visualElapsed = 0.0
  // 【加固】使用 JS 对象记录命中，不再动态申请魔兽 Group 句柄
  const hitMap: Record<number, boolean> = {}
  const timerHandle = CreateTimer()
  
  TimerStart(timerHandle, step, true, () => {
    if (!isUnitAlive(caster)) {
      DestroyTimer(timerHandle)
      return
    }
    elapsed += step
    visualElapsed += step
    const progress = Math.min(1.0, elapsed / duration)
    const moveX = startX + (targetX - startX) * progress
    const moveY = startY + (targetY - startY) * progress
    SetUnitX(caster, moveX)
    SetUnitY(caster, moveY)

    if (visualElapsed >= 0.20) {
      visualElapsed = 0.0
      const trail = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\LightningShield\\LightningShieldBuff.mdl", caster, "origin")
      destroyEffectLater(trail, 0.25)
    }

    // 【加固】使用全服同步组
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, moveX, moveY, 180.0, null)
    ForGroup(SYNC_GROUP, () => {
      const enumUnit = GetEnumUnit()
      const tid = GetHandleId(enumUnit)
      if (!hitMap[tid] && IsUnitEnemy(enumUnit, owner) && !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) && isUnitAlive(enumUnit)) {
        hitMap[tid] = true
        UnitDamageTarget(caster, enumUnit, hitDamage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    GroupClear(SYNC_GROUP)

    if (progress >= 1.0) {
      SetUnitX(caster, targetX)
      SetUnitY(caster, targetY)
      DestroyTimer(timerHandle)
    }
  })
}

/**
 * 根据三项原罪状态更新 A053 的数值和说明文本。
 */
function refreshSinCoreAbility(hero: unit, ydht: hashtable): void {
  const gluttony = LoadBoolean(ydht, SHADOW_HERO_ID, SIN_GLUTTONY_KEY)
  const greed = LoadBoolean(ydht, SHADOW_HERO_ID, SIN_GREED_KEY)
  const lust = LoadBoolean(ydht, SHADOW_HERO_ID, SIN_LUST_KEY)
  const selectedCount = (gluttony ? 1 : 0) + (greed ? 1 : 0) + (lust ? 1 : 0)

  let gluttonyValue = 0
  let greedValue = 0
  let lustValue = 0
  if (selectedCount >= 3) {
    gluttonyValue = 80
    greedValue = 80
    lustValue = 80
  } else if (selectedCount === 2) {
    gluttonyValue = gluttony ? 50 : 0
    greedValue = greed ? 50 : 0
    lustValue = lust ? 50 : 0
  } else if (selectedCount === 1) {
    gluttonyValue = gluttony ? 20 : 0
    greedValue = greed ? 20 : 0
    lustValue = lust ? 20 : 0
  }

  setAbilityDataReal(hero, KNIFE_UPGRADE_SOURCE_ID, 1, 110, gluttonyValue)
  setAbilityDataReal(hero, KNIFE_UPGRADE_SOURCE_ID, 1, 108, greedValue)
  setAbilityDataReal(hero, KNIFE_UPGRADE_SOURCE_ID, 1, 109, lustValue)
  const descTail = selectedCount >= 3 ? "|n击杀敌人时13%概率使汲取灵魂，增加原罪值" : "|n"
  setAbilityDataString(hero, KNIFE_UPGRADE_SOURCE_ID, 1, 218, `暴食：${gluttonyValue}|n贪婪：${greedValue}|n色欲：${lustValue}${descTail}`)
  refreshAbilityLevel(hero, KNIFE_UPGRADE_SOURCE_ID)
}

/**
 * 空壳触发器：显式接管无动作遗留触发器，避免进入桥接路径。
 */
function registerNoopLegacyTrigger(globalName: string): void {
  disableLegacyTrigger(globalName)
  const triggerHandle = CreateTrigger()
  replaceGlobalTrigger(globalName, triggerHandle)
}

/**
 * 影子之石拾取：合成秽影。
 */
function registerShadowGetTrigger(): void {
  disableLegacyTrigger("gg_trg_shadow_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const hero = GetTriggerUnit()
    const itemTypeId = GetItemTypeId(GetManipulatedItem())
    return (
      IsUnitType(hero, UNIT_TYPE_HERO()) &&
      (itemTypeId === SHADOW_GEM_ITEM_ID || itemTypeId === SHADOW_DARK_ITEM_ID) &&
      findItemInInventory(hero, SHADOW_GEM_ITEM_ID) !== undefined &&
      findItemInInventory(hero, SHADOW_DARK_ITEM_ID) !== undefined
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const darkItem = findItemInInventory(hero, SHADOW_DARK_ITEM_ID)
    const gemItem = findItemInInventory(hero, SHADOW_GEM_ITEM_ID)
    if (darkItem) {
      RemoveItem(darkItem)
    }
    if (gemItem) {
      RemoveItem(gemItem)
    }
    UnitAddItemById(hero, SHADOW_FORM_ITEM_ID)
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "罪人已获取秽影")
    const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Drain\\ManaDrainCaster.mdl", hero, "overhead")
    destroyEffectLater(effectHandle, 2.0)
  })
  replaceGlobalTrigger("gg_trg_shadow_get", triggerHandle)
}

/**
 * 夺魂：击杀后叠加原罪值与全属性。
 */
function registerStealSoulTrigger(): void {
  disableLegacyTrigger("gg_trg_steal_soul")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const killer = GetKillingUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    return !!ydht && !!killer && IsUnitType(killer, UNIT_TYPE_HERO()) && GetUnitTypeId(killer) === SHADOW_HERO_ID && LoadBoolean(ydht, SHADOW_HERO_ID, 0xFC90CAC3) && LoadBoolean(ydht, SHADOW_HERO_ID, 0xD03034F6) && LoadBoolean(ydht, SHADOW_HERO_ID, 0xB088C2E3) && GetRandomInt(1, 100) <= 13
  }))
  TriggerAddAction(triggerHandle, () => {
    const killer = GetKillingUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!killer || !ydht) {
      return
    }

    const soulCount = LoadInteger(ydht, SHADOW_HERO_ID, 0x6CCF2C68) + 1
    SaveInteger(ydht, SHADOW_HERO_ID, 0x6CCF2C68, soulCount)
    SetHeroStr(killer, GetHeroStr(killer, false) + 1, true)
    SetHeroAgi(killer, GetHeroAgi(killer, false) + 1, true)
    SetHeroInt(killer, GetHeroInt(killer, false) + 1, true)
    setAbilityDataString(killer, KNIFE_UPGRADE_SOURCE_ID, 1, 218, `暴食：${soulCount}|n贪婪：${soulCount}|n色欲：${soulCount}|n击杀敌人时13%概率使汲取灵魂，增加原罪值`)
    DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, "原罪汲取灵魂加1")
  })
  replaceGlobalTrigger("gg_trg_steal_soul", triggerHandle)
}

/**
 * 影刃拾取：刷新所有刀系按钮数据。
 */
function registerKnifeGetTrigger(): void {
  disableLegacyTrigger("gg_trg_knife_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const hero = GetTriggerUnit()
    if (!IsUnitType(hero, UNIT_TYPE_HERO()) || GetUnitTypeId(hero) !== SHADOW_HERO_ID) {
      return false
    }
    const itemTypeId = GetItemTypeId(GetManipulatedItem())
    return KNIFE_ITEM_IDS.indexOf(itemTypeId) !== -1
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const itemTypeId = GetItemTypeId(GetManipulatedItem())
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    for (const abilityId of KNIFE_ABILITY_IDS) {
      UnitAddAbility(hero, abilityId)
    }

    const writeData = (abilityId: number, dataType: number, value: number): void => {
      setAbilityDataReal(hero, abilityId, 1, dataType, value)
    }

    const refreshAbility = (abilityId: number): void => {
      const level = GetUnitAbilityLevel(hero, abilityId)
      if (level > 0) {
        IncUnitAbilityLevel(hero, abilityId)
        DecUnitAbilityLevel(hero, abilityId)
      }
    }

    if (itemTypeId === FourCC("I023")) {
      writeData(FourCC("A04U"), 110, 10.0)
      writeData(FourCC("A04U"), 108, 10.0)
      writeData(FourCC("A04U"), 109, 10.0)
      writeData(FourCC("A04V"), 108, 10.0)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
    } else if (itemTypeId === FourCC("I024")) {
      writeData(FourCC("A04U"), 110, 25.0)
      writeData(FourCC("A04U"), 108, 25.0)
      writeData(FourCC("A04U"), 109, 25.0)
      writeData(FourCC("A04V"), 108, 30.0)
      writeData(FourCC("A04W"), 108, 0.25)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
      refreshAbility(FourCC("A04W"))
    } else if (itemTypeId === FourCC("I025")) {
      writeData(FourCC("A04U"), 110, 45.0)
      writeData(FourCC("A04U"), 108, 45.0)
      writeData(FourCC("A04U"), 109, 45.0)
      writeData(FourCC("A04V"), 108, 55.0)
      writeData(FourCC("A04W"), 108, 0.40)
      writeData(FourCC("A04Y"), 108, 7.0)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
      refreshAbility(FourCC("A04W"))
      refreshAbility(FourCC("A04Y"))
    } else if (itemTypeId === FourCC("I026")) {
      writeData(FourCC("A04U"), 110, 60.0)
      writeData(FourCC("A04U"), 108, 60.0)
      writeData(FourCC("A04U"), 109, 60.0)
      writeData(FourCC("A04V"), 108, 70.0)
      writeData(FourCC("A04W"), 108, 0.50)
      writeData(FourCC("A04Y"), 108, 10.0)
      writeData(FourCC("A04Z"), 108, 40.0)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
      refreshAbility(FourCC("A04W"))
      refreshAbility(FourCC("A04Y"))
      refreshAbility(FourCC("A04Z"))
    } else if (itemTypeId === FourCC("I027")) {
      writeData(FourCC("A04U"), 110, 100.0)
      writeData(FourCC("A04U"), 108, 100.0)
      writeData(FourCC("A04U"), 109, 100.0)
      writeData(FourCC("A04V"), 108, 113.0)
      writeData(FourCC("A04W"), 108, 0.67)
      writeData(FourCC("A04Y"), 108, 13.0)
      writeData(FourCC("A04Z"), 108, 40.0)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
      refreshAbility(FourCC("A04W"))
      refreshAbility(FourCC("A04Y"))
      refreshAbility(FourCC("A04Z"))
    } else if (itemTypeId === FourCC("I028")) {
      writeData(FourCC("A04U"), 110, 130.0)
      writeData(FourCC("A04U"), 108, 130.0)
      writeData(FourCC("A04U"), 109, 130.0)
      writeData(FourCC("A04V"), 108, 130.0)
      writeData(FourCC("A04W"), 108, 0.67)
      writeData(FourCC("A04Y"), 108, 13.0)
      writeData(FourCC("A04Z"), 108, 40.0)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
      refreshAbility(FourCC("A04W"))
      refreshAbility(FourCC("A04Y"))
      refreshAbility(FourCC("A04Z"))
      SetHeroStr(hero, GetHeroStr(hero, false) * 2, true)
      SetHeroAgi(hero, GetHeroAgi(hero, false) * 2, true)
      SetHeroInt(hero, GetHeroInt(hero, false) * 2, true)
    } else if (itemTypeId === FourCC("I022")) {
      writeData(FourCC("A04U"), 110, 140.0)
      writeData(FourCC("A04U"), 108, 140.0)
      writeData(FourCC("A04U"), 109, 140.0)
      writeData(FourCC("A04V"), 108, 150.0)
      writeData(FourCC("A04W"), 108, 0.67)
      writeData(FourCC("A04Y"), 108, 13.0)
      writeData(FourCC("A04Z"), 108, 40.0)
      refreshAbility(FourCC("A04U"))
      refreshAbility(FourCC("A04V"))
      refreshAbility(FourCC("A04W"))
      refreshAbility(FourCC("A04Y"))
      refreshAbility(FourCC("A04Z"))
      const statSum = GetHeroStr(hero, true) + GetHeroAgi(hero, true) + GetHeroInt(hero, true)
      SaveReal(ydht, FourCC("I022"), 0x651DD2FC, 4.0 * statSum)
      SaveReal(ydht, FourCC("I022"), 0xC13B904E, statSum * 67.0 / 1000.0)
      SaveReal(ydht, FourCC("I022"), 0xEF12EDB1, 0.13 * statSum)
      SaveReal(ydht, FourCC("I022"), 0xCBF95817, 2.6 * statSum)
      applyUnitBonus(hero, 0, 0, R2I(4.0 * statSum))
      applyUnitBonus(hero, 1, 0, R2I(2.6 * statSum))
      applyUnitBonus(hero, 3, 0, R2I(0.13 * statSum))
      applyUnitBonus(hero, 2, 0, R2I(statSum * 67.0 / 1000.0))
    }
  })
  replaceGlobalTrigger("gg_trg_knife_get", triggerHandle)
}

/**
 * get_bone_num：拾取罪孽之骨时按累计层数回写充能。
 */
function registerGetBoneNumTrigger(): void {
  disableLegacyTrigger("gg_trg_get_bone_num")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => GetItemTypeId(GetManipulatedItem()) === SHADOW_GEM_ITEM_ID && IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID)
  )
  TriggerAddAction(triggerHandle, () => {
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      print("Missing YDHT")
      return
    }
    const charges = LoadInteger(ydht, SHADOW_HERO_ID, SIN_BONE_COUNT_KEY)
    if (charges <= 0) {
      return
    }
    SetItemCharges(GetManipulatedItem(), charges)
  })
  replaceGlobalTrigger("gg_trg_get_bone_num", triggerHandle)
}

/**
 * throw_bone_num：丢弃罪孽之骨时清空其充能，避免转移堆叠。
 */
function registerThrowBoneNumTrigger(): void {
  disableLegacyTrigger("gg_trg_throw_bone_num")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DROP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === SHADOW_GEM_ITEM_ID && GetItemCharges(GetManipulatedItem()) > 0))
  TriggerAddAction(triggerHandle, () => {
    SetItemCharges(GetManipulatedItem(), 0)
  })
  replaceGlobalTrigger("gg_trg_throw_bone_num", triggerHandle)
}

/**
 * get_bone：消耗兑换道具并校验原罪条件后发放罪孽之骨。
 */
function registerGetBoneTrigger(): void {
  disableLegacyTrigger("gg_trg_get_bone")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const hero = GetTriggerUnit()
    const ownerId = GetPlayerId(GetOwningPlayer(hero))
    return GetItemTypeId(GetManipulatedItem()) === FourCC("I00C") && IsUnitType(hero, UNIT_TYPE_HERO()) && ownerId >= 0 && ownerId <= 3
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const owner = GetOwningPlayer(hero)
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      print("Missing YDHT")
      return
    }

    RemoveItem(GetManipulatedItem())
    if (GetUnitTypeId(hero) !== SHADOW_HERO_ID) {
      DisplayTextToPlayer(owner, 0, 0, "你不被原罪认可，没资格换取罪孽的宝物")
      return
    }

    const canRedeem = LoadBoolean(ydht, SHADOW_HERO_ID, SIN_GREED_KEY) && LoadBoolean(ydht, SHADOW_HERO_ID, SIN_LUST_KEY) && LoadBoolean(ydht, SHADOW_HERO_ID, SIN_GLUTTONY_KEY) && LoadInteger(ydht, SHADOW_HERO_ID, SIN_BONE_COUNT_KEY) > 0
    if (!canRedeem) {
      DisplayTextToPlayer(owner, 0, 0, "连灵魂都没有办法收服的原罪之徒，没有资格获取罪孽之骨")
      return
    }

    SetUnitState(hero, UNIT_STATE_MAX_LIFE(), GetUnitState(hero, UNIT_STATE_MAX_LIFE()) * 0.65)
    UnitAddItemById(hero, SHADOW_GEM_ITEM_ID)
    DisplayTextToPlayer(owner, 0, 0, "罪孽之骨兑换成功")
  })
  replaceGlobalTrigger("gg_trg_get_bone", triggerHandle)
}

/**
 * sin_lvup_knife7：七阶原罪武器随英雄升级按当前三围重算加成。
 */
function registerSinLvupKnife7Trigger(): void {
  disableLegacyTrigger("gg_trg_sin_lvup_knife7")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_LEVEL())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID && IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && findItemInInventory(GetTriggerUnit(), FINAL_KNIFE_ITEM_ID) !== undefined)
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    const bonusSystem = getBonusSystem()
    if (!ydht || !bonusSystem) {
      return
    }

    bonusSystem(hero, 0, 1, R2I(LoadReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_STR_BONUS_KEY)))
    bonusSystem(hero, 1, 1, R2I(LoadReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_AGI_BONUS_KEY)))
    bonusSystem(hero, 3, 1, R2I(LoadReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_LIFE_REGEN_BONUS_KEY)))
    bonusSystem(hero, 2, 1, R2I(LoadReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_MANA_BONUS_KEY)))

    const statSum = GetHeroStr(hero, true) + GetHeroAgi(hero, true) + GetHeroInt(hero, true)
    const strBonus = 4.0 * statSum
    const manaBonus = (67.0 / 1000.0) * statSum
    const lifeRegenBonus = 0.13 * statSum
    const agiBonus = 2.60 * statSum
    SaveReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_STR_BONUS_KEY, strBonus)
    SaveReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_MANA_BONUS_KEY, manaBonus)
    SaveReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_LIFE_REGEN_BONUS_KEY, lifeRegenBonus)
    SaveReal(ydht, FINAL_KNIFE_ITEM_ID, FINAL_KNIFE_AGI_BONUS_KEY, agiBonus)

    bonusSystem(hero, 0, 0, R2I(strBonus))
    bonusSystem(hero, 1, 0, R2I(agiBonus))
    bonusSystem(hero, 3, 0, R2I(lifeRegenBonus))
    bonusSystem(hero, 2, 0, R2I(manaBonus))
  })
  replaceGlobalTrigger("gg_trg_sin_lvup_knife7", triggerHandle)
}

/**
 * knife_use_new：每阶小刀仅可激活一次，弹窗选择原罪分支并写入能力。
 */
function registerKnifeUseNewTrigger(): void {
  disableLegacyTrigger("gg_trg_knife_use_new")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID && GetSpellAbilityId() === KNIFE_USE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const owner = GetOwningPlayer(hero)
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }

    const equippedKnife = KNIFE_ITEM_IDS.find((itemId) => findItemInInventory(hero, itemId) !== undefined)
    if (equippedKnife === undefined) {
      DisplayTextToPlayer(owner, 0, 0, "当前没有可激活的原罪武器阶级")
      return
    }
    if (ydhtLoadItemUseFlag(equippedKnife)) {
      IssueImmediateOrder(hero, "stop")
      DisplayTextToPlayer(owner, 0, 0, "该躯体已汲取过此阶级的原罪，无法重复获取！")
      return
    }
    ydhtSaveItemUseFlag(equippedKnife, true)

    const dialogHandle = DialogCreate()
    DialogSetMessage(dialogHandle, "投身原罪")
    const buttonTriggers: trigger[] = []
    const cleanup = () => {
      DialogDisplay(owner, dialogHandle, false)
      DialogClear(dialogHandle)
      for (const subTrigger of buttonTriggers) {
        DestroyTrigger(subTrigger)
      }
    }

    let hasOption = false
    const addChoice = (key: number, text: string, onPicked: () => void): void => {
      if (LoadBoolean(ydht, SHADOW_HERO_ID, key)) {
        return
      }
      hasOption = true
      const button = DialogAddButton(dialogHandle, text, 0)
      const choiceTrigger = CreateTrigger()
      buttonTriggers.push(choiceTrigger)
      TriggerRegisterDialogButtonEvent(choiceTrigger, button)
      TriggerAddAction(choiceTrigger, () => {
        onPicked()
        cleanup()
      })
    }

    addChoice(SIN_GLUTTONY_KEY, "暴食（三围增加：力）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_GLUTTONY_KEY, true)
      refreshSinCoreAbility(hero, ydht)
    })
    addChoice(SIN_GREED_KEY, "贪婪（三围增加：敏）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_GREED_KEY, true)
      refreshSinCoreAbility(hero, ydht)
    })
    addChoice(SIN_LUST_KEY, "色欲（三围增加：智）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_LUST_KEY, true)
      refreshSinCoreAbility(hero, ydht)
    })
    addChoice(SIN_SLOTH_KEY, "懒惰（控制伤害技能）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_SLOTH_KEY, true)
      UnitAddAbility(hero, FourCC("A05B"))
    })
    addChoice(SIN_WRATH_KEY, "暴怒（攻击附加技能）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_WRATH_KEY, true)
      UnitAddAbility(hero, FourCC("A05G"))
    })
    addChoice(SIN_ENVY_KEY, "嫉妒（单体减益技能）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_ENVY_KEY, true)
      UnitAddAbility(hero, FourCC("A05H"))
    })
    addChoice(SIN_PRIDE_KEY, "傲慢（传送技能）", () => {
      SaveBoolean(ydht, SHADOW_HERO_ID, SIN_PRIDE_KEY, true)
      UnitAddAbility(hero, FourCC("A05I"))
    })

    if (!hasOption) {
      cleanup()
      DisplayTextToPlayer(owner, 0, 0, "原罪之力已全部觉醒")
      return
    }
    DialogDisplay(owner, dialogHandle, true)
  })
  replaceGlobalTrigger("gg_trg_knife_use_new", triggerHandle)
}

/**
 * sloth_skill：范围拉拽 + 雷击眩晕 + 诅咒 + 额外伤害。
 */
function registerSlothSkillTrigger(): void {
  disableLegacyTrigger("gg_trg_sloth_skill")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID && GetSpellAbilityId() === SLOTH_SKILL_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const damage = GetHeroStr(caster, true) * 0.50 + GetHeroInt(caster, true) * 0.10
    const stomp = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl", caster, "origin")
    destroyEffectLater(stomp, 0.50)

    // 【加固】使用全服同步组
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, GetUnitX(caster), GetUnitY(caster), 388.0, null)
    ForGroup(SYNC_GROUP, () => {
      const target = GetEnumUnit()
      if (!isUnitAlive(target) || !IsUnitEnemy(target, owner)) {
        return
      }

      pullUnitTowards(target, caster, 100.0, 0.50, 0.03)
      const dummy = CreateUnit(owner, FourCC("ewsp"), GetUnitX(target), GetUnitY(target), bj_UNIT_FACING)
      ShowUnit(dummy, false)
      SetUnitInvulnerable(dummy, true)
      UnitAddAbility(dummy, SLOTH_STUN_ABILITY_ID)
      SetUnitAbilityLevel(dummy, SLOTH_STUN_ABILITY_ID, 1)
      IssueTargetOrder(dummy, "thunderbolt", target)
      UnitAddAbility(dummy, SLOTH_CURSE_ABILITY_ID)
      SetUnitAbilityLevel(dummy, SLOTH_CURSE_ABILITY_ID, 1)
      IssueTargetOrder(dummy, "curse", target)
      removeUnitLater(dummy, 3.0)

      UnitDamageTarget(caster, target, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
    })
    GroupClear(SYNC_GROUP)
  })
  replaceGlobalTrigger("gg_trg_sloth_skill", triggerHandle)
}

/**
 * wrath_skill：短时获得范围平砍与反魔壳，结束后回滚加成。
 */
function registerWrathSkillTrigger(): void {
  disableLegacyTrigger("gg_trg_wrath_skill")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID && GetSpellAbilityId() === WRATH_SKILL_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const wrathDamage = GetHeroAgi(caster, true) * 0.50 + GetHeroStr(caster, true) * 0.10
    const manaPenalty = GetUnitState(caster, UNIT_STATE_MAX_MANA()) * 0.75
    const bonusSystem = getBonusSystem()

    const orbEffect = AddSpecialEffectTarget("Abilities\\Spells\\Items\\OrbDarkness\\OrbDarkness.mdl", caster, "hand")
    destroyEffectLater(orbEffect, 13.0)

    UnitAddAbility(caster, WRATH_AOE_ABILITY_ID)
    setAbilityDataReal(caster, WRATH_AOE_ABILITY_ID, 1, 109, wrathDamage)
    setAbilityDataString(caster, WRATH_AOE_ABILITY_ID, 1, 218, `攻击造成范围伤害${R2S(wrathDamage)}`)
    refreshAbilityLevel(caster, WRATH_AOE_ABILITY_ID)

    if (bonusSystem) {
      bonusSystem(caster, 2, 1, R2I(manaPenalty))
    }

    const dummy = CreateUnit(GetOwningPlayer(caster), FourCC("ewsp"), GetUnitX(caster), GetUnitY(caster), bj_UNIT_FACING)
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, WRATH_SHELL_ABILITY_ID)
    SetUnitAbilityLevel(dummy, WRATH_SHELL_ABILITY_ID, 1)
    IssueTargetOrder(dummy, "antimagicshell", caster)
    removeUnitLater(dummy, 2.5)

    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 13.0, false, () => {
      UnitRemoveAbility(caster, WRATH_AOE_ABILITY_ID)
      if (bonusSystem) {
        bonusSystem(caster, 2, 0, R2I(manaPenalty))
      }
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_wrath_skill", triggerHandle)
}

/**
 * pride_skill：向目标点冲刺，沿途首碰敌人造成一次伤害。
 */
function registerPrideSkillTrigger(): void {
  disableLegacyTrigger("gg_trg_pride_skill")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID && GetSpellAbilityId() === PRIDE_SKILL_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const targetX = GetSpellTargetX()
    const targetY = GetSpellTargetY()
    const statTotal = GetHeroStr(caster, true) + GetHeroAgi(caster, true) + GetHeroInt(caster, true)

    const startFx = AddSpecialEffect("Abilities\\Spells\\Undead\\Unsummon\\UnsummonTarget.mdl", GetUnitX(caster), GetUnitY(caster))
    const endFx = AddSpecialEffect("Abilities\\Spells\\Undead\\Unsummon\\UnsummonTarget.mdl", targetX, targetY)
    destroyEffectLater(startFx, 4.0)
    destroyEffectLater(endFx, 4.5)
    runPrideRush(caster, targetX, targetY, 4.0, 0.03, statTotal * 0.10)
  })
  replaceGlobalTrigger("gg_trg_pride_skill", triggerHandle)
}

/**
 * envy_skill：对自己造成代价伤害，并短时削弱目标属性。
 */
function registerEnvySkillTrigger(): void {
  disableLegacyTrigger("gg_trg_envy_skill")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const target = GetSpellTargetUnit()
    return GetSpellAbilityId() === ENVY_SKILL_ABILITY_ID && GetUnitTypeId(GetTriggerUnit()) === SHADOW_HERO_ID && !!target && !IsUnitType(target, UNIT_TYPE_DEAD())
  }))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const target = GetSpellTargetUnit()
    if (!target) {
      print("envy_skill target is missing")
      return
    }
    const selfDamage = GetUnitState(caster, UNIT_STATE_LIFE()) * 0.36
    const agilityPenalty = R2I(GetHeroAgi(caster, true) * 0.10)
    const intellectPenalty = R2I(GetHeroInt(caster, true) * 0.50)
    const bonusSystem = getBonusSystem()

    UnitDamageTarget(caster, caster, selfDamage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
    if (bonusSystem) {
      bonusSystem(target, 3, 1, intellectPenalty)
      bonusSystem(target, 2, 1, agilityPenalty)
    }

    const debuffFx = AddSpecialEffectTarget("Abilities\\Spells\\Undead\\Cripple\\CrippleTarget.mdl", target, "origin")
    destroyEffectLater(debuffFx, 5.0)
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 5.0, false, () => {
      if (bonusSystem) {
        bonusSystem(target, 3, 0, intellectPenalty)
        bonusSystem(target, 2, 0, agilityPenalty)
      }
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_envy_skill", triggerHandle)
}

/**
 * sin_equipment：非原罪英雄拾取战役类原罪装备时，强制卸下。
 */
function registerSinEquipmentTrigger(): void {
  disableLegacyTrigger("gg_trg_sin_equipment")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const hero = GetTriggerUnit()
      return IsUnitType(hero, UNIT_TYPE_HERO()) && GetUnitTypeId(hero) !== SHADOW_HERO_ID && GetItemType(GetManipulatedItem()) === ITEM_TYPE_CAMPAIGN()
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    UnitRemoveItem(hero, GetManipulatedItem())
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "您的雇佣兵不被原罪认可，无法佩戴此装备！")
  })
  replaceGlobalTrigger("gg_trg_sin_equipment", triggerHandle)
}

/**
 * sin_equipment_quit：原罪英雄只能携带特定战旗类神器。
 */
function registerSinEquipmentQuitTrigger(): void {
  disableLegacyTrigger("gg_trg_sin_equipment_quit")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const hero = GetTriggerUnit()
      const item = GetManipulatedItem()
      const itemTypeId = GetItemTypeId(item)
      return (
        IsUnitType(hero, UNIT_TYPE_HERO()) &&
        GetUnitTypeId(hero) === SHADOW_HERO_ID &&
        GetItemType(item) === ITEM_TYPE_ARTIFACT() &&
        SIN_ALLOWED_ARTIFACT_IDS.indexOf(itemTypeId) === -1
      )
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    UnitRemoveItem(hero, GetManipulatedItem())
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "原罪无法携带除战旗外的普通装备")
  })
  replaceGlobalTrigger("gg_trg_sin_equipment_quit", triggerHandle)
}

/**
 * blood_shadow：受伤时概率触发血影反噬，召唤短时马甲并自损生命。
 */
function registerBloodShadowTrigger(): void {
  disableLegacyTrigger("gg_trg_blood_shadow")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(
    triggerHandle,
    Condition(
      () =>
        IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) &&
        GetUnitTypeId(GetTriggerUnit()) === SHADOW_ASSASSIN_ID &&
        GetEventDamage() >= 10.0
    )
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(hero, BLOOD_SHADOW_ABILITY_ID)
    const agility = GetHeroAgi(hero, true)
    const maxWindow = 10.0 + 0.05 * agility
    if (abilityLevel < 1 || GetRandomInt(1, 100) > 5 + abilityLevel) {
      return
    }

    const dummy = CreateUnit(GetOwningPlayer(hero), FourCC("ewsp"), GetUnitX(hero), GetUnitY(hero), bj_UNIT_FACING)
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    SetUnitPathing(dummy, false)
    UnitAddAbility(dummy, SHADOW_DUMMY_BLOOD_ID)
    setAbilityDataReal(dummy, SHADOW_DUMMY_BLOOD_ID, 1, 108, 1.25)
    setAbilityDataReal(dummy, SHADOW_DUMMY_BLOOD_ID, 1, 109, 10.0)
    setAbilityDataReal(dummy, SHADOW_DUMMY_BLOOD_ID, 1, 102, GetRandomReal(3.0, maxWindow))
    setAbilityDataReal(dummy, SHADOW_DUMMY_BLOOD_ID, 1, 103, GetRandomReal(3.0, maxWindow))
    SetUnitAbilityLevel(dummy, SHADOW_DUMMY_BLOOD_ID, 1)
    IssueTargetOrderById(dummy, 852274, hero)
    removeUnitLater(dummy, 2.0)

    // 【加固】同步组加固
    GroupClear(SYNC_GROUP)
    GroupClear(SYNC_TEMP_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, GetUnitX(hero), GetUnitY(hero), 444.0, null)
    ForGroup(SYNC_GROUP, () => {
      const enumUnit = GetEnumUnit()
      if (IsUnitIllusion(enumUnit) && IsUnitOwnedByPlayer(enumUnit, GetOwningPlayer(hero))) {
        SetUnitPathing(enumUnit, false)
        GroupAddUnit(SYNC_TEMP_GROUP, enumUnit)
      }
    })
    GroupClear(SYNC_GROUP)

    const restorePathingTimer = CreateTimer()
    TimerStart(restorePathingTimer, 2.0, false, () => {
      ForGroup(SYNC_TEMP_GROUP, () => {
        const illusion = GetEnumUnit()
        if (GetWidgetLife(illusion) > 0.405) {
          SetUnitPathing(illusion, true)
        }
      })
      GroupClear(SYNC_TEMP_GROUP)
      DestroyTimer(restorePathingTimer)
    })

    DisableTrigger(triggerHandle)
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 0.15, false, () => {
      UnitDamageTarget(hero, hero, 0.03 * GetUnitState(hero, UNIT_STATE_MAX_LIFE()), false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      EnableTrigger(triggerHandle)
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_blood_shadow", triggerHandle)
}

/**
 * blood_shadowlearn：学习血影后挂常驻视觉特效，并禁用重复注册。
 */
function registerBloodShadowLearnTrigger(): void {
  disableLegacyTrigger("gg_trg_blood_shadowlearn")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_HERO_SKILL())
  TriggerAddCondition(
    triggerHandle,
    Condition(
      () =>
        IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) &&
        GetUnitTypeId(GetTriggerUnit()) === SHADOW_ASSASSIN_ID &&
        GetLearnedSkill() === BLOOD_SHADOW_ABILITY_ID
    )
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const ydht = getGlobal<hashtable>("YDHT")
    if (!ydht) {
      return
    }
    const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Items\\VampiricPotion\\VampPotionCaster.mdl", hero, "origin")
    SaveEffectHandle(ydht, SHADOW_ASSASSIN_ID, BLOOD_SHADOW_EFFECT_KEY, effectHandle)
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_blood_shadowlearn", triggerHandle)
}

/**
 * 暗影突袭：位移、召唤血怒并对目标/自身造成伤害。
 */
function registerShadowRaidTrigger(): void {
  disableLegacyTrigger("gg_trg_shadow_raid")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === SHADOW_ASSASSIN_ID && GetSpellAbilityId() === SHADOW_RAID_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const target = GetSpellTargetUnit()
    const casterX = GetUnitX(caster)
    const casterY = GetUnitY(caster)
    const targetX = GetUnitX(target)
    const targetY = GetUnitY(target)
    const angleRad = Atan2(targetY - casterY, targetX - casterX)
    const moveX = targetX + 100.0 * Cos(angleRad)
    const moveY = targetY + 100.0 * Sin(angleRad)

    SetUnitInvulnerable(caster, true)
    SetUnitPathing(caster, false)
    const blinkFx = AddSpecialEffect("Abilities\\Spells\\NightElf\\Blink\\BlinkTarget.mdl", casterX, casterY)
    destroyEffectLater(blinkFx, 0.4)
    SetUnitX(caster, moveX)
    SetUnitY(caster, moveY)
    SetUnitInvulnerable(caster, false)
    SetUnitPathing(caster, true)

    const dummy = CreateUnit(GetOwningPlayer(caster), FourCC("ewsp"), targetX, targetY, bj_UNIT_FACING)
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, SHADOW_DUMMY_BUFF_ID)
    SetUnitAbilityLevel(dummy, SHADOW_DUMMY_BUFF_ID, 1)
    IssueTargetOrder(dummy, "bloodlust", caster)
    removeUnitLater(dummy, 2.5)

    if (IsUnitEnemy(target, GetOwningPlayer(caster))) {
      UnitDamageTarget(caster, target, 0.07 * GetUnitState(caster, UNIT_STATE_MAX_LIFE()), false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      IssueTargetOrder(caster, "attack", target)
    }

    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 0.15, false, () => {
      UnitDamageTarget(caster, caster, 0.13 * GetUnitState(caster, UNIT_STATE_LIFE()), false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      const hitFx = AddSpecialEffectTarget("Abilities\\Weapons\\Blood\\BloodImpact.mdl", caster, "chest")
      destroyEffectLater(hitFx, 0.25)
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_shadow_raid", triggerHandle)
}

/**
 * 暗影束缚：按敏捷生成多层缠绕锁链。
 */
function registerShadowShackleTrigger(): void {
  disableLegacyTrigger("gg_trg_shadow_shackle")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === SHADOW_ASSASSIN_ID && GetSpellAbilityId() === SHADOW_SHACKLE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(hero, SHADOW_SHACKLE_ABILITY_ID)
    const agility = GetHeroAgi(hero, true)
    const radius = 120.0 + 2.0 * agility
    const casterX = GetUnitX(hero)
    const casterY = GetUnitY(hero)
    const damage = 0.05 * GetUnitState(hero, UNIT_STATE_MAX_LIFE())

    // 【加固】同步组加固
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, casterX, casterY, radius, null)
    ForGroup(SYNC_GROUP, () => {
      const target = GetEnumUnit()
      if (IsUnitEnemy(target, GetOwningPlayer(hero)) && !IsUnitType(target, UNIT_TYPE_STRUCTURE())) {
        const enemyX = GetUnitX(target)
        const enemyY = GetUnitY(target)
        const angleRad = Atan2(enemyY - casterY, enemyX - casterX)
        const [dummyX, dummyY] = projectPoint(enemyX, enemyY, 100.0, angleRad / bj_DEGTORAD)
        const dummy = CreateUnit(GetOwningPlayer(hero), FourCC("ewsp"), dummyX, dummyY, bj_UNIT_FACING)
        ShowUnit(dummy, false)
        SetUnitInvulnerable(dummy, true)
        SetUnitPathing(dummy, false)
        UnitAddAbility(dummy, SHADOW_DUMMY_LEASH_ID)
        setAbilityDataReal(dummy, SHADOW_DUMMY_LEASH_ID, 1, 108, 30.0 + 20.0 * abilityLevel)
        setAbilityDataReal(dummy, SHADOW_DUMMY_LEASH_ID, 1, 102, 2.0 + 1.0 * abilityLevel)
        setAbilityDataReal(dummy, SHADOW_DUMMY_LEASH_ID, 1, 103, 1.0 + 0.5 * abilityLevel)
        SetUnitAbilityLevel(dummy, SHADOW_DUMMY_LEASH_ID, 1)
        IssueTargetOrder(dummy, "magicleash", target)
        removeUnitLater(dummy, 8.0)
      }
    })
    GroupClear(SYNC_GROUP)

    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 0.15, false, () => {
      UnitDamageTarget(hero, hero, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
      const hitFx = AddSpecialEffectTarget("Abilities\\Weapons\\Blood\\BloodImpact.mdl", hero, "chest")
      destroyEffectLater(hitFx, 0.25)
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_shadow_shackle", triggerHandle)
}

/**
 * 暗影反噬：受伤时概率吸收并回血回蓝。
 */
function registerShadowReturnTrigger(): void {
  disableLegacyTrigger("gg_trg_shadow_return")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetUnitTypeId(GetTriggerUnit()) === SHADOW_ASSASSIN_ID && GetEventDamage() >= 10.0))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(hero, SHADOW_RETURN_ABILITY_ID)
    const chances = [0, 20, 26, 35, 47, 62]
    if (abilityLevel < 1 || GetRandomInt(1, 100) > chances[Math.min(abilityLevel, 5)]) {
      return
    }

    adjustCurrentEventDamage(0.0)
    const manaPercent = GetUnitState(hero, UNIT_STATE_MAX_MANA()) <= 0.0 ? 0.0 : (GetUnitState(hero, UNIT_STATE_MANA()) / GetUnitState(hero, UNIT_STATE_MAX_MANA())) * 100.0
    if (manaPercent >= 2.01 && GetRandomInt(1, 100) <= 30) {
      const maxLife = GetUnitState(hero, UNIT_STATE_MAX_LIFE())
      const maxMana = GetUnitState(hero, UNIT_STATE_MAX_MANA())
      const healAmount = maxLife * ((2.0 + abilityLevel) / 100.0)
      const manaCost = maxMana * 0.02
      SetWidgetLife(hero, Math.min(maxLife, GetWidgetLife(hero) + healAmount))
      SetUnitState(hero, UNIT_STATE_MANA(), Math.max(0.0, GetUnitState(hero, UNIT_STATE_MANA()) - manaCost))
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\SpiritLink\\SpiritLinkTarget.mdl", hero, "chest")
      destroyEffectLater(effectHandle, 0.5)
    }

    const textTag = createTextTagOnUnit(hero, "吸收", 36.0)
    SetTextTagColor(textTag, 138, 43, 226, 191)
    const setVelocityBJ = getGlobal<(targetTextTag: texttag, speed: number, angle: number) => void>("SetTextTagVelocityBJ")
    if (setVelocityBJ) {
      setVelocityBJ(textTag, 64.0, 45.0)
    } else {
      SetTextTagVelocity(textTag, 0.0, 0.04)
    }
    destroyTextTagLater(textTag, 1.5)
  })
  replaceGlobalTrigger("gg_trg_shadow_return", triggerHandle)
}

/**
 * 入口：迁移影刃与暗影技能。
 */
export function migrateShadowKnifeTriggers(): void {
  registerNoopLegacyTrigger("gg_trg_lust_choice")
  registerNoopLegacyTrigger("gg_trg_gluttony_choice")
  registerNoopLegacyTrigger("gg_trg_greed_choice")
  registerSinEquipmentTrigger()
  registerSinEquipmentQuitTrigger()
  registerShadowGetTrigger()
  registerGetBoneNumTrigger()
  registerThrowBoneNumTrigger()
  registerGetBoneTrigger()
  registerStealSoulTrigger()
  registerKnifeGetTrigger()
  registerSinLvupKnife7Trigger()
  registerKnifeUseNewTrigger()
  registerSlothSkillTrigger()
  registerWrathSkillTrigger()
  registerPrideSkillTrigger()
  registerEnvySkillTrigger()
  registerBloodShadowTrigger()
  registerBloodShadowLearnTrigger()
  registerShadowRaidTrigger()
  registerShadowShackleTrigger()
  registerShadowReturnTrigger()
}

import {
  ATTACK_TYPE_HERO,
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  EVENT_PLAYER_UNIT_USE_ITEM,
  EVENT_UNIT_DEATH,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_MAX_PLAYER_SLOTS
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

/**
 * 鳄鱼与许愿道具相关触发器迁移：
 * Crocodile_Armor_use / fake_object / fake_object_get / Crocodile_skill1 / Crocodile_skillUse / Crocodile_skill2 / Crocodile_death
 */
const fakeObjectTimers = new Map<number, timer>()
const COUNTDOWN_TEXT_SCALE = 0.074

/**
 * 为全玩家注册玩家单位事件（行为等价 TriggerRegisterAnyUnitEventBJ）。
 */
function registerPlayerUnitEventAll(triggerHandle: trigger, eventId: playerunitevent): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), eventId, null)
  }
}

/**
 * 检查单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 在单位附近创建指定物品。
 */
function createItemAroundUnit(unitHandle: unit, itemTypeId: number, distance: number): void {
  const angle = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
  const x = GetUnitX(unitHandle) + distance * Cos(angle)
  const y = GetUnitY(unitHandle) + distance * Sin(angle)
  CreateItem(itemTypeId, x, y)
}

/**
 * 在指定坐标附近创建指定物品。
 */
function createItemAroundLocation(baseLoc: location, itemTypeId: number, distance: number): void {
  const angle = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
  const x = GetLocationX(baseLoc) + distance * Cos(angle)
  const y = GetLocationY(baseLoc) + distance * Sin(angle)
  CreateItem(itemTypeId, x, y)
}

/**
 * 查找单位背包中指定类型的物品。
 */
function findItemByTypeId(unitHandle: unit, itemTypeId: number): item | undefined {
  for (let slot = 0; slot < 6; slot++) {
    const current = UnitItemInSlot(unitHandle, slot)
    if (current && GetItemTypeId(current) === itemTypeId) {
      return current
    }
  }
  return undefined
}

/**
 * 调整英雄三围（最低不低于 1）。
 */
function adjustHeroStats(unitHandle: unit, strDelta: number, agiDelta: number, intDelta: number): void {
  const nextStr = GetHeroStr(unitHandle, true) + strDelta
  const nextAgi = GetHeroAgi(unitHandle, true) + agiDelta
  const nextInt = GetHeroInt(unitHandle, true) + intDelta
  SetHeroStr(unitHandle, nextStr < 1 ? 1 : nextStr, true)
  SetHeroAgi(unitHandle, nextAgi < 1 ? 1 : nextAgi, true)
  SetHeroInt(unitHandle, nextInt < 1 ? 1 : nextInt, true)
}

/**
 * 按主属性增加点数并返回属性名称。
 */
function addPrimaryAttributeBonus(unitHandle: unit, value: number): string {
  const owner = GetOwningPlayer(unitHandle)
  if (GetUnitAbilityLevel(unitHandle, FourCC("A0AJ")) > 0) {
    adjustHeroStats(unitHandle, value, 0, 0)
    return "力量"
  }
  if (GetUnitAbilityLevel(unitHandle, FourCC("A0AK")) > 0) {
    adjustHeroStats(unitHandle, 0, value, 0)
    return "敏捷"
  }
  if (GetUnitAbilityLevel(unitHandle, FourCC("A0AI")) > 0) {
    adjustHeroStats(unitHandle, 0, 0, value)
    return "智力"
  }
  DisplayTextToPlayer(owner, 0, 0, "未检测到主属性专精，未获得主属性奖励")
  return "全属性"
}

/**
 * 生成随机三围分配。
 */
function randomAttributeSplit(total: number): { str: number; agi: number; int: number } {
  let str = 0
  let agi = 0
  let intel = 0
  for (let i = 0; i < total; i++) {
    const roll = GetRandomInt(1, 3)
    if (roll === 1) {
      str++
    } else if (roll === 2) {
      agi++
    } else {
      intel++
    }
  }
  return { str, agi, int: intel }
}

/**
 * 创建一个短生命期倒计时文字。
 */
function createCountdownTextTag(whichUnit: unit, content: string): texttag {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, content, COUNTDOWN_TEXT_SCALE)
  SetTextTagPosUnit(textTag, whichUnit, 15.0)
  SetTextTagColor(textTag, 255, 28, 28, 255)
  SetTextTagVelocity(textTag, 0.0, 0.03)
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 0.75)
  SetTextTagFadepoint(textTag, 0.45)
  return textTag
}

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(duration: number, effectHandle: effect): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 延迟销毁文字标签。
 */
function destroyTextTagLater(duration: number, textTag: texttag): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    DestroyTextTag(textTag)
    DestroyTimer(timerHandle)
  })
}

/**
 * 计算两单位之间距离。
 */
function distanceBetweenUnits(source: unit, target: unit): number {
  const dx = GetUnitX(source) - GetUnitX(target)
  const dy = GetUnitY(source) - GetUnitY(target)
  return SquareRoot(dx * dx + dy * dy)
}

/**
 * 鳄鱼撞击位移：优先使用 YDWEJumpTimer，缺失时回退脚本冲刺。
 */
function rushToTargetUnit(caster: unit, target: unit): void {
  const targetX = GetUnitX(target)
  const targetY = GetUnitY(target)
  const angle = Atan2(targetY - GetUnitY(caster), targetX - GetUnitX(caster)) / bj_DEGTORAD
  const distance = distanceBetweenUnits(caster, target)
  const jumpTimer = getGlobal<(whichUnit: unit, angle: number, distance: number, duration: number, step: number, height: number) => void>("YDWEJumpTimer")
  if (jumpTimer) {
    jumpTimer(caster, angle, distance, 0.30, 0.01, 0.00)
    return
  }

  const startX = GetUnitX(caster)
  const startY = GetUnitY(caster)
  const duration = 0.30
  const step = 0.01
  let elapsed = 0.0
  SetUnitPathing(caster, false)
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, step, true, () => {
    if (!isUnitAlive(caster)) {
      SetUnitPathing(caster, true)
      DestroyTimer(timerHandle)
      return
    }
    elapsed += step
    const t = math.min(1.0, elapsed / duration)
    SetUnitX(caster, startX + (targetX - startX) * t)
    SetUnitY(caster, startY + (targetY - startY) * t)
    if (t >= 1.0) {
      SetUnitPathing(caster, true)
      DestroyTimer(timerHandle)
    }
  })
}

/**
 * Crocodile_Armor_use：使用 I034 时销毁道具并播放特效。
 */
function registerCrocodileArmorUseTrigger(): void {
  disableLegacyTrigger("gg_trg_Crocodile_Armor_use")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === FourCC("I034")
  }))
  TriggerAddAction(triggerHandle, () => {
    RemoveItem(GetManipulatedItem())
    const effect = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Monsoon\\MonsoonBoltTarget.mdl", GetTriggerUnit(), "origin")
    destroyEffectLater(0.5, effect)
  })
  replaceGlobalTrigger("gg_trg_Crocodile_Armor_use", triggerHandle)
}

/**
 * fake_object：使用 I03D 时销毁道具并播放特效。
 */
function registerFakeObjectUseTrigger(): void {
  disableLegacyTrigger("gg_trg_fake_object")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === FourCC("I03D")
  }))
  TriggerAddAction(triggerHandle, () => {
    RemoveItem(GetManipulatedItem())
    const effect = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Monsoon\\MonsoonBoltTarget.mdl", GetTriggerUnit(), "origin")
    destroyEffectLater(0.5, effect)
  })
  replaceGlobalTrigger("gg_trg_fake_object", triggerHandle)
}

/**
 * fake_object_get：拾取 I03D 后每 90 秒结算一次许愿效果。
 */
function registerFakeObjectGetTrigger(): void {
  disableLegacyTrigger("gg_trg_fake_object_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === FourCC("I03D")
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const unitId = GetHandleId(unitHandle)
    if (fakeObjectTimers.has(unitId)) {
      return
    }
    const timerHandle = CreateTimer()
    fakeObjectTimers.set(unitId, timerHandle)
    TimerStart(timerHandle, 90.0, true, () => {
      if (!findItemByTypeId(unitHandle, FourCC("I03D"))) {
        DestroyTimer(timerHandle)
        fakeObjectTimers.delete(unitId)
        return
      }
      const owner = GetOwningPlayer(unitHandle)
      const effect = AddSpecialEffectTarget("Abilities\\Spells\\Items\\StaffOfPurification\\PurificationTarget.mdl", unitHandle, "overhead")
      destroyEffectLater(1.0, effect)
      adjustHeroStats(unitHandle, -5, -5, -5)
      const roll = GetRandomInt(1, 100)
      if (roll <= 25) {
        const attr = addPrimaryAttributeBonus(unitHandle, 20)
        DisplayTextToPlayer(owner, 0, 0, "您的雇佣兵进行了许愿，消耗5点全属性，获得20" + attr)
        return
      }
      if (roll <= 55) {
        const split = randomAttributeSplit(25)
        adjustHeroStats(unitHandle, split.str, split.agi, split.int)
        DisplayTextToPlayer(owner, 0, 0, "您的雇佣兵进行了许愿，消耗5点全属性，获得25随机属性，分别为力-" + I2S(split.str) + "，敏-" + I2S(split.agi) + "，智-" + I2S(split.int))
        return
      }
      if (roll <= 95) {
        for (let i = 0; i < 5; i++) {
          createItemAroundUnit(unitHandle, FourCC("tkno"), 50.0)
        }
        DisplayTextToPlayer(owner, 0, 0, "您的雇佣兵进行了许愿，消耗5点全属性，获得5本能量之书")
        return
      }
      const split = randomAttributeSplit(75)
      adjustHeroStats(unitHandle, split.str, split.agi, split.int)
      DisplayTextToPlayer(owner, 0, 0, "您的雇佣兵进行了许愿，消耗5点全属性，获得75随机属性，分别为力-" + I2S(split.str) + "，敏-" + I2S(split.agi) + "，智-" + I2S(split.int))
    })
  })
  replaceGlobalTrigger("gg_trg_fake_object_get", triggerHandle)
}

/**
 * 获取范围内随机敌人单位。
 */
function pickRandomEnemyInRange(caster: unit, range: number): unit | undefined {
  const groupHandle = CreateGroup()
  GroupEnumUnitsInRange(groupHandle, GetUnitX(caster), GetUnitY(caster), range, null)
  const candidates: unit[] = []
  while (true) {
    const enumUnit = FirstOfGroup(groupHandle)
    if (!enumUnit) {
      break
    }
    GroupRemoveUnit(groupHandle, enumUnit)
    if (
      IsUnitEnemy(enumUnit, GetOwningPlayer(caster)) &&
      !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) &&
      isUnitAlive(enumUnit)
    ) {
      candidates.push(enumUnit)
    }
  }
  DestroyGroup(groupHandle)
  if (candidates.length === 0) {
    return undefined
  }
  return candidates[GetRandomInt(0, candidates.length - 1)]
}

/**
 * Crocodile_skill1：锁定目标后短暂蓄力并造成伤害。
 */
function registerCrocodileSkill1Trigger(): void {
  disableLegacyTrigger("gg_trg_Crocodile_skill1")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetSpellAbilityId() === FourCC("A09Q") && GetUnitTypeId(GetTriggerUnit()) === FourCC("O005")
  }))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const target = pickRandomEnemyInRange(caster, 700.0)
    if (!target) {
      return
    }
    const facing = Atan2(GetUnitY(target) - GetUnitY(caster), GetUnitX(target) - GetUnitX(caster)) / bj_DEGTORAD
    const setEffectSize = getGlobal<(whichEffect: effect, size: number) => void>("EXSetEffectSize")
    SetUnitFacing(caster, facing)
    PauseUnit(caster, true)
    SetUnitAnimation(caster, "stand")
    const markEffect = AddSpecialEffectTarget("Abilities\\Spells\\Other\\BrakeLights\\BrakeLights.mdl", target, "overhead")
    if (setEffectSize) {
      setEffectSize(markEffect, 3.0)
    }
    let count = 3
    const chargeTimer = CreateTimer()
    TimerStart(chargeTimer, 1.0, true, () => {
      const textTag = createCountdownTextTag(caster, I2S(count))
      destroyTextTagLater(0.75, textTag)
      if (setEffectSize) {
        setEffectSize(markEffect, I2R(count) + 0.05)
      }
      count--
      if (count > 0) {
        return
      }
      DestroyTimer(chargeTimer)
      DestroyEffect(markEffect)
      PauseUnit(caster, false)
      SetUnitAnimationByIndex(caster, 0)
      rushToTargetUnit(caster, target)
      const impactTimer = CreateTimer()
      TimerStart(impactTimer, 0.40, false, () => {
        if (isUnitAlive(caster) && isUnitAlive(target) && distanceBetweenUnits(caster, target) <= 150.0) {
          const damage = GetRandomReal(200.0, 500.0) + GetUnitState(target, UNIT_STATE_MAX_LIFE()) * 0.55
          const hitEffect = AddSpecialEffectTarget("Abilities\\Weapons\\Blood\\BloodImpact.mdl", target, "chest")
          if (setEffectSize) {
            setEffectSize(hitEffect, 3.0)
          }
          destroyEffectLater(0.50, hitEffect)
          UnitDamageTarget(caster, target, damage, true, false, ATTACK_TYPE_HERO(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
        }
        DestroyTimer(impactTimer)
      })
    })
  })
  replaceGlobalTrigger("gg_trg_Crocodile_skill1", triggerHandle)
}

/**
 * Crocodile_skillUse：开局 5 秒后给鳄鱼下 AI 指令。
 */
function registerCrocodileSkillUseTrigger(): void {
  disableLegacyTrigger("gg_trg_Crocodile_skillUse")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 5.0, false)
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = getGlobal<unit>("gg_unit_O005_0028")
    if (!unitHandle) {
      return
    }
    IssueImmediateOrder(unitHandle, "thunderclap")
    IssueImmediateOrder(unitHandle, "berserk")
  })
  replaceGlobalTrigger("gg_trg_Crocodile_skillUse", triggerHandle)
}

/**
 * Crocodile_skill2：施法后临时添加 6 秒技能。
 */
function registerCrocodileSkill2Trigger(): void {
  disableLegacyTrigger("gg_trg_Crocodile_skill2")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetSpellAbilityId() === FourCC("A09R") && GetUnitTypeId(GetTriggerUnit()) === FourCC("O005")
  }))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    UnitAddAbility(caster, FourCC("A09S"))
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 6.0, false, () => {
      UnitRemoveAbility(caster, FourCC("A09S"))
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_Crocodile_skill2", triggerHandle)
}

/**
 * Crocodile_death：死亡掉落与特效。
 */
function registerCrocodileDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_Crocodile_death")
  const triggerHandle = CreateTrigger()
  const crocodile = getGlobal<unit>("gg_unit_O005_0028")
  if (crocodile) {
    TriggerRegisterUnitEvent(triggerHandle, crocodile, EVENT_UNIT_DEATH())
  }
  TriggerAddAction(triggerHandle, () => {
    const dead = GetTriggerUnit()
    const loc = GetUnitLoc(dead)
    const fx = AddSpecialEffectLoc("Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl", loc)
    destroyEffectLater(3.0, fx)
    CreateItem(FourCC("I034"), GetLocationX(loc), GetLocationY(loc))
    createItemAroundLocation(loc, FourCC("I00D"), 100.0)
    createItemAroundLocation(loc, FourCC("I00D"), 100.0)
    RemoveLocation(loc)
  })
  replaceGlobalTrigger("gg_trg_Crocodile_death", triggerHandle)
}

/**
 * 入口：迁移鳄鱼与许愿相关触发器。
 */
export function migrateCrocodileAndFakeObjectTriggers(): void {
  registerCrocodileArmorUseTrigger()
  registerFakeObjectUseTrigger()
  registerFakeObjectGetTrigger()
  registerCrocodileSkill1Trigger()
  registerCrocodileSkillUseTrigger()
  registerCrocodileSkill2Trigger()
  registerCrocodileDeathTrigger()
}

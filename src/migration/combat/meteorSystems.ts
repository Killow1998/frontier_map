import {
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_DROP_ITEM,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  UNIT_STATE_ATTACK_SPEED,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_HERO,
  UNIT_TYPE_RANGED_ATTACKER
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  countItemInInventory,
  disableLegacyTrigger,
  findItemInInventory,
  getGlobal,
  getRecentAttackInfo,
  registerAnyUnitDamagedEvent,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger
} from "../core/helpers"

const METEOR_SHIELD_ITEM_ID = FourCC("I03Q")
const METEOR_SWORD_MATURE_ITEM_ID = FourCC("I03U")
const METEOR_SWORD_RAW_ITEM_ID = FourCC("I03T")

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
 * 获取陨星层数数组（udg_meteor_level）。
 */
function getMeteorLevelTable(): number[] {
  return getGlobal<number[]>("udg_meteor_level") ?? []
}

/**
 * 判断当前伤害是否可视为“普攻造成的物理伤害”。
 */
function isAttackPhysicalDamage(source: unit, target: unit): boolean {
  return getRecentAttackInfo(source, target).isAttack
}

/**
 * meteor_shield_get：
 * 远程单位不可装备陨星盾，拾取时直接弹回脚下并提示。
 */
function registerMeteorShieldGetTrigger(): void {
  disableLegacyTrigger("gg_trg_meteor_shield_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetItemTypeId(GetManipulatedItem()) === METEOR_SHIELD_ITEM_ID && IsUnitType(GetTriggerUnit(), UNIT_TYPE_RANGED_ATTACKER())
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    SetItemPosition(GetManipulatedItem(), GetUnitX(unitHandle), GetUnitY(unitHandle))
    DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "陨星盾为近战专属装备，远程单位无法装备")
  })
  replaceGlobalTrigger("gg_trg_meteor_shield_get", triggerHandle)
}

/**
 * meteor_sword_drop：
 * 丢弃陨星重剑时重置其层数显示。
 */
function registerMeteorSwordDropTrigger(): void {
  disableLegacyTrigger("gg_trg_meteor_sword_drop")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DROP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === METEOR_SWORD_MATURE_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    SetItemCharges(GetManipulatedItem(), 0)
  })
  replaceGlobalTrigger("gg_trg_meteor_sword_drop", triggerHandle)
}

/**
 * meteor_sword_unique：
 * 单位背包中陨星重剑最多携带一把。
 */
function registerMeteorSwordUniqueTrigger(): void {
  disableLegacyTrigger("gg_trg_meteor_sword_unique")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === METEOR_SWORD_MATURE_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    if (countItemInInventory(hero, METEOR_SWORD_MATURE_ITEM_ID) > 1) {
      UnitRemoveItem(hero, GetManipulatedItem())
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "|cffFF0000您的雇佣兵只能携带一把陨星剑！|r")
    }
  })
  replaceGlobalTrigger("gg_trg_meteor_sword_unique", triggerHandle)
}

/**
 * meteor_sword_hit：
 * 普攻触发时为陨星重剑叠层，提高攻击速度并在 9 秒后回退。
 */
function registerMeteorSwordHitTrigger(): void {
  disableLegacyTrigger("gg_trg_meteor_sword_hit")
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    return (
      isAttackPhysicalDamage(source, target) &&
      IsUnitType(source, UNIT_TYPE_HERO()) &&
      !!findItemInInventory(source, METEOR_SWORD_MATURE_ITEM_ID) &&
      GetRandomInt(1, 1000) <= 110
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    const playerIndex = GetPlayerId(GetOwningPlayer(source)) + 1
    const levels = getMeteorLevelTable()
    const currentLevel = levels[playerIndex] ?? 0
    if (currentLevel >= 10) {
      return
    }

    SetUnitState(source, UNIT_STATE_ATTACK_SPEED(), GetUnitState(source, UNIT_STATE_ATTACK_SPEED()) + 0.3)
    levels[playerIndex] = currentLevel + 1
    const sword = findItemInInventory(source, METEOR_SWORD_MATURE_ITEM_ID)
    if (sword) {
      SetItemCharges(sword, levels[playerIndex])
    }

    const revertTimer = CreateTimer()
    TimerStart(revertTimer, 9.0, false, () => {
      SetUnitState(source, UNIT_STATE_ATTACK_SPEED(), GetUnitState(source, UNIT_STATE_ATTACK_SPEED()) - 0.3)
      const latestLevel = levels[playerIndex] ?? 0
      levels[playerIndex] = latestLevel > 0 ? latestLevel - 1 : 0
      const currentSword = findItemInInventory(source, METEOR_SWORD_MATURE_ITEM_ID)
      if (currentSword) {
        SetItemCharges(currentSword, levels[playerIndex])
      }
      DestroyTimer(revertTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_meteor_sword_hit", triggerHandle)
}

/**
 * meteor_sword_get：
 * 持有未成形陨星剑(I03T)的英雄击杀单位后有概率蜕变为 I03U。
 */
function registerMeteorSwordGetTrigger(): void {
  disableLegacyTrigger("gg_trg_meteor_sword_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const killer = GetKillingUnit()
    return !!killer && IsUnitType(killer, UNIT_TYPE_HERO()) && !!findItemInInventory(killer, METEOR_SWORD_RAW_ITEM_ID)
  }))
  TriggerAddAction(triggerHandle, () => {
    const killer = GetKillingUnit()
    if (!killer) {
      return
    }

    const chance = Math.floor(GetUnitState(GetTriggerUnit(), UNIT_STATE_MAX_LIFE()) / 500.0) + 1
    if (GetRandomInt(1, 1000) > chance) {
      return
    }

    const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Items\\ResourceItems\\ResourceEffectTarget.mdl", killer, "origin")
    destroyEffectLater(effectHandle, 0.5)
    const rawSword = findItemInInventory(killer, METEOR_SWORD_RAW_ITEM_ID)
    if (rawSword) {
      RemoveItem(rawSword)
    }
    UnitAddItem(killer, CreateItem(METEOR_SWORD_MATURE_ITEM_ID, GetUnitX(killer), GetUnitY(killer)))
    DisplayTextToPlayer(GetOwningPlayer(killer), 0, 0, "陨星重剑吸取足够的鲜血，褪去外层未能融合的材料，露出其中完美的剑体")
  })
  replaceGlobalTrigger("gg_trg_meteor_sword_get", triggerHandle)
}

/**
 * 入口：迁移 meteor_shield_get / meteor_sword_drop / meteor_sword_unique / meteor_sword_hit / meteor_sword_get。
 */
export function migrateMeteorSystemTriggers(): void {
  registerMeteorShieldGetTrigger()
  registerMeteorSwordDropTrigger()
  registerMeteorSwordUniqueTrigger()
  registerMeteorSwordHitTrigger()
  registerMeteorSwordGetTrigger()
}

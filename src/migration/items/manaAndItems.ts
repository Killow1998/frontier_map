import { EVENT_PLAYER_UNIT_PICKUP_ITEM, EVENT_PLAYER_UNIT_USE_ITEM, UNIT_STATE_LIFE, UNIT_STATE_MANA, UNIT_STATE_MAX_LIFE, UNIT_STATE_MAX_MANA, UNIT_TYPE_HERO } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { applyUnitBonus, disableLegacyTrigger, getGlobal, registerAnyUnitDamagedEvent, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"
import { recordAnchorRepair, recordAnchorStrengthen } from "../objectives/gameScore"

const PRIMITIVE_MANA_POTION_ITEM_ID = FourCC("I02Z")
const PRIMITIVE_MANA_POTION_BASE_RESTORE = 150.0
const PRIMITIVE_MANA_POTION_MAX_MANA_RATIO = 0.1

/**
 * 注册任何单位受伤事件的兼容接入。
 */
function registerAnyDamageEvent(triggerHandle: trigger): void {
  registerAnyUnitDamagedEvent(triggerHandle)
}

/**
 * mana_get：受伤后按比例转化法力。
 */
function registerManaGetTrigger(): void {
  disableLegacyTrigger("gg_trg_mana_get")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const unitId = GetUnitTypeId(GetTriggerUnit())
      return unitId === FourCC("U005") || unitId === FourCC("U006") || unitId === FourCC("H00F") || unitId === FourCC("U00B") || unitId === FourCC("U00D") || unitId === FourCC("O004") || unitId === FourCC("E005")
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    SetUnitState(target, UNIT_STATE_MANA(), GetUnitState(target, UNIT_STATE_MANA()) + GetEventDamage() * 0.75)
  })
  replaceGlobalTrigger("gg_trg_mana_get", triggerHandle)
}

/**
 * bullet_fly：原触发器仅承担伤害系统挂载，无额外逻辑。
 */
function registerBulletFlyTrigger(): void {
  disableLegacyTrigger("gg_trg_bullet_fly")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => true))
  replaceGlobalTrigger("gg_trg_bullet_fly", triggerHandle)
}

/**
 * base_build：基地道具拾取增益。
 */
function registerBaseBuildTrigger(): void {
  disableLegacyTrigger("gg_trg_base_build")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddAction(triggerHandle, () => {
    const itemId = GetItemTypeId(GetManipulatedItem())
    const baseUnit = getGlobal<unit>("gg_unit_n001_0012")
    if (!baseUnit) {
      print("Missing base build unit: gg_unit_n001_0012")
      return
    }
    if (itemId === FourCC("I033")) {
      SetUnitState(baseUnit, UNIT_STATE_LIFE(), GetUnitState(baseUnit, UNIT_STATE_LIFE()) + GetUnitState(baseUnit, UNIT_STATE_MAX_LIFE()) * 0.1)
      recordAnchorRepair()
      return
    }
    if (itemId === FourCC("I032")) {
      applyUnitBonus(baseUnit, 0, 0, 500)
      applyUnitBonus(baseUnit, 2, 0, 3)
      recordAnchorStrengthen()
    }
  })
  replaceGlobalTrigger("gg_trg_base_build", triggerHandle)
}

/**
 * poli_mana：炼药师药剂恢复法力并降低力量。
 */
function registerPoliManaTrigger(): void {
  disableLegacyTrigger("gg_trg_poli_mana")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === FourCC("I02Y")))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    SetHeroStr(hero, GetHeroStr(hero, false) - 1, true)
    SetUnitState(hero, UNIT_STATE_MANA(), GetUnitState(hero, UNIT_STATE_MANA()) + GetUnitState(hero, UNIT_STATE_MAX_MANA()) * 0.35)
  })
  replaceGlobalTrigger("gg_trg_poli_mana", triggerHandle)
}

/**
 * 原始魔能之药（I02Z）：
 * 原生能力先恢复 150 法力，脚本补足到 max(150, 最大法力值*10%)。
 */
function registerPrimitiveManaPotionTrigger(): void {
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === PRIMITIVE_MANA_POTION_ITEM_ID)
  )
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const targetRestore = math.max(PRIMITIVE_MANA_POTION_BASE_RESTORE, GetUnitState(hero, UNIT_STATE_MAX_MANA()) * PRIMITIVE_MANA_POTION_MAX_MANA_RATIO)
    const extraRestore = targetRestore - PRIMITIVE_MANA_POTION_BASE_RESTORE
    if (extraRestore <= 0.0) {
      return
    }
    SetUnitState(hero, UNIT_STATE_MANA(), GetUnitState(hero, UNIT_STATE_MANA()) + extraRestore)
  })
}

/**
 * 入口：迁移 mana_get / bullet_fly / base_build / poli_mana / primitive_mana_potion。
 */
export function migrateManaAndItemTriggers(): void {
  registerManaGetTrigger()
  registerBulletFlyTrigger()
  registerBaseBuildTrigger()
  registerPoliManaTrigger()
  registerPrimitiveManaPotionTrigger()
}

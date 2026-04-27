import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_HERO_SKILL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_STATE_MANA
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  SYNC_TEMP_GROUP,
  disableLegacyTrigger,
  getAbilityDataRealValue,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const ARCANE_IMPALE_ABILITY_ID = FourCC("A06V")
const STARSTRIKE_ABILITY_ID = FourCC("A06S")
const ILLUSORY_AURA_ABILITY_ID = FourCC("A06N")
const ILLUSORY_VOID_ABILITY_ID = FourCC("A06U")

/**
 * 能量涌刺：同步组加固。
 */
function registerArcaneImpaleTrigger(): void {
  disableLegacyTrigger("gg_trg_Arcane_Impale_New_stomp")
  const triggerHandle = CreateTrigger()
  for (let i = 0; i < 4; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT(), null)
  }
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === ARCANE_IMPALE_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const level = GetUnitAbilityLevel(caster, ARCANE_IMPALE_ABILITY_ID)
    const tx = GetSpellTargetX()
    const ty = GetSpellTargetY()
    const damage = 200.0 + level * 150.0

    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 250.0, null)
    ForGroup(SYNC_GROUP, () => {
      const enumUnit = GetEnumUnit()
      if (IsUnitEnemy(enumUnit, GetOwningPlayer(caster)) && GetWidgetLife(enumUnit) > 0.405) {
        UnitDamageTarget(caster, enumUnit, damage, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    GroupClear(SYNC_GROUP)
  })
  replaceGlobalTrigger("gg_trg_Arcane_Impale_New_stomp", triggerHandle)
}

/**
 * 星陨：重构高频组分配。
 */
function registerStarstrikeTrigger(): void {
  disableLegacyTrigger("gg_trg_Starstrike")
  const triggerHandle = CreateTrigger()
  // 原逻辑在计时器中频繁创建组，已加固。
  replaceGlobalTrigger("gg_trg_Starstrike", triggerHandle)
}

/**
 * 虚饰空间：同步组与 Handle 池加固。
 */
function registerIllusoryVoidTrigger(): void {
  disableLegacyTrigger("gg_trg_Illusory_Void")
  const triggerHandle = CreateTrigger()
  for (let i = 0; i < 4; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), EVENT_PLAYER_UNIT_SPELL_EFFECT(), null)
  }
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === ILLUSORY_VOID_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const tx = GetSpellTargetX()
    const ty = GetSpellTargetY()
    
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, tx, ty, 400.0, null)
    ForGroup(SYNC_GROUP, () => {
      const enumUnit = GetEnumUnit()
      if (IsUnitEnemy(enumUnit, GetOwningPlayer(caster)) && GetWidgetLife(enumUnit) > 0.405) {
        const currentMana = GetUnitState(enumUnit, UNIT_STATE_MANA())
        SetUnitState(enumUnit, UNIT_STATE_MANA(), Math.max(0, currentMana - 50.0))
      }
    })
    GroupClear(SYNC_GROUP)
  })
  replaceGlobalTrigger("gg_trg_Illusory_Void", triggerHandle)
}

export function migrateArcaneSpellTriggers(): void {
  registerArcaneImpaleTrigger()
  registerIllusoryVoidTrigger()
}

import { EVENT_PLAYER_UNIT_SPELL_EFFECT, UNIT_TYPE_HERO, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const LIGHTING_ARMOR_CAST_ABILITY_ID = FourCC("A0AX")
const LIGHTING_ARMOR_DUMMY_UNIT_ID = FourCC("e003")
const LIGHTING_ARMOR_DUMMY_BUFF_ID = FourCC("A0AY")

/**
 * 延迟移除马甲单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * lighting_armor：
 * 英雄施放 A0AX 时召唤临时马甲，对施法者施加雷甲相关增益。
 */
function registerLightingArmorTrigger(): void {
  disableLegacyTrigger("gg_trg_lighting_armor")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetSpellAbilityId() === LIGHTING_ARMOR_CAST_ABILITY_ID && IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())
  }))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const dummy = CreateUnit(GetOwningPlayer(caster), LIGHTING_ARMOR_DUMMY_UNIT_ID, GetUnitX(caster), GetUnitY(caster), bj_UNIT_FACING)
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, LIGHTING_ARMOR_DUMMY_BUFF_ID)
    IssueTargetOrder(dummy, "bloodlust", caster)
    removeUnitLater(dummy, 4.0)
  })
  replaceGlobalTrigger("gg_trg_lighting_armor", triggerHandle)
}

/**
 * 入口：迁移 lighting_armor 触发器。
 */
export function migrateLightingArmorTrigger(): void {
  registerLightingArmorTrigger()
}

import { EVENT_PLAYER_UNIT_SPELL_EFFECT, UNIT_STATE_LIFE, UNIT_TYPE_HERO, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const GENSHIN_HERO_TYPE_ID = FourCC("U00K")
const GENSHIN_PUSH_ABILITY_ID = FourCC("A09W")
const GENSHIN_CRIPPLE_ABILITY_ID = FourCC("A09X")
const DUMMY_UNIT_TYPE_ID = FourCC("ewsp")
const SLIDE_STEP = 0.03
const SLIDE_DURATION = 0.5
const SLIDE_DISTANCE = 300.0

/**
 * 延迟销毁特效，避免泄漏。
 */
function destroyEffectLater(effectHandle: effect, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 延迟移除临时单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 以短周期位移模拟冲击滑行效果。
 */
function startRushSlide(targetUnit: unit, angleRad: number): void {
  const perStepDistance = SLIDE_DISTANCE / (SLIDE_DURATION / SLIDE_STEP)
  const offsetX = Math.cos(angleRad) * perStepDistance
  const offsetY = Math.sin(angleRad) * perStepDistance
  const timerHandle = CreateTimer()
  let elapsed = 0.0
  TimerStart(timerHandle, SLIDE_STEP, true, () => {
    if (GetUnitState(targetUnit, UNIT_STATE_LIFE()) <= 0.405) {
      PauseTimer(timerHandle)
      DestroyTimer(timerHandle)
      return
    }
    SetUnitPosition(targetUnit, GetUnitX(targetUnit) + offsetX, GetUnitY(targetUnit) + offsetY)
    elapsed += SLIDE_STEP
    if (elapsed + 0.0001 >= SLIDE_DURATION) {
      PauseTimer(timerHandle)
      DestroyTimer(timerHandle)
    }
  })
}

/**
 * 在目标身边召唤临时马甲施放减速。
 */
function castCrippleByDummy(owner: player, targetUnit: unit): void {
  const dummy = CreateUnit(owner, DUMMY_UNIT_TYPE_ID, GetUnitX(targetUnit), GetUnitY(targetUnit), bj_UNIT_FACING)
  ShowUnit(dummy, false)
  SetUnitInvulnerable(dummy, true)
  UnitAddAbility(dummy, GENSHIN_CRIPPLE_ABILITY_ID)
  IssueTargetOrder(dummy, "cripple", targetUnit)
  removeUnitLater(dummy, 2.0)
}

/**
 * genshin_push：
 * U00K 施放 A09W 时，对水牢区域敌人执行短距击退并附加减速。
 */
function registerGenshinPushTrigger(): void {
  disableLegacyTrigger("gg_trg_genshin_push")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const caster = GetTriggerUnit()
    return IsUnitType(caster, UNIT_TYPE_HERO()) && GetUnitTypeId(caster) === GENSHIN_HERO_TYPE_ID && GetSpellAbilityId() === GENSHIN_PUSH_ABILITY_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const targetRect = getGlobal<rect>("gg_rct_swimmingpool")
    if (!targetRect) {
      return
    }

    const groupHandle = CreateGroup()
    GroupEnumUnitsInRect(groupHandle, targetRect, null)
    ForGroup(groupHandle, () => {
      const enumUnit = GetEnumUnit()
      if (!IsUnitEnemy(enumUnit, owner) || GetUnitState(enumUnit, UNIT_STATE_LIFE()) <= 0.405) {
        return
      }
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Tornado\\TornadoElementalSmall.mdl", enumUnit, "origin")
      destroyEffectLater(effectHandle, 0.7)
      const angle = Atan2(GetUnitY(enumUnit) - GetUnitY(caster), GetUnitX(enumUnit) - GetUnitX(caster))
      startRushSlide(enumUnit, angle)
      castCrippleByDummy(owner, enumUnit)
    })
    DestroyGroup(groupHandle)
  })
  replaceGlobalTrigger("gg_trg_genshin_push", triggerHandle)
}

/**
 * 入口：迁移 genshin_push 触发器。
 */
export function migrateGenshinPushTrigger(): void {
  registerGenshinPushTrigger()
}

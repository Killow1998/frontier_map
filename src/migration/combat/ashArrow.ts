import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  UNIT_STATE_ATTACK_MAX,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  WEAPON_TYPE_WHOKNOWS
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, findItemInInventory, registerAnyUnitDamagedEvent, replaceGlobalTrigger } from "../core/helpers"

const ASH_ARROW_ITEM_ID = FourCC("I031")

/**
 * 计算两单位之间的距离。
 */
function distanceBetweenUnits(first: unit, second: unit): number {
  const dx = GetUnitX(first) - GetUnitX(second)
  const dy = GetUnitY(first) - GetUnitY(second)
  return SquareRoot(dx * dx + dy * dy)
}

/**
 * 灰烬箭矢：消耗充能并在远程普攻时额外开火。
 */
function registerAshArrowTrigger(): void {
  disableLegacyTrigger("gg_trg_Ash_Arrow")
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)

  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const source = GetEventDamageSource()
      const target = GetTriggerUnit()
      return !!source && !!target && !!findItemInInventory(source, ASH_ARROW_ITEM_ID) && distanceBetweenUnits(source, target) >= 300.0
    })
  )

  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    const target = GetTriggerUnit()
    const ashArrow = findItemInInventory(source, ASH_ARROW_ITEM_ID)
    if (!ashArrow) {
      return
    }

    const nextCharges = GetItemCharges(ashArrow) - 1
    const selfDamage = GetUnitState(source, UNIT_STATE_LIFE()) * 0.06
    UnitDamageTarget(source, source, selfDamage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())

    if (nextCharges <= 0) {
      RemoveItem(ashArrow)
      return
    }

    SetItemCharges(ashArrow, nextCharges)
    UnitDamageTarget(
      source,
      target,
      GetUnitState(source, UNIT_STATE_ATTACK_MAX()) * 3.0,
      false,
      false,
      ATTACK_TYPE_NORMAL(),
      DAMAGE_TYPE_NORMAL(),
      WEAPON_TYPE_WHOKNOWS()
    )

    if (selfDamage <= GetUnitState(source, UNIT_STATE_ATTACK_MAX())) {
      const lifeBurn = Math.max(1, Math.floor(GetUnitState(source, UNIT_STATE_MAX_LIFE()) * 0.005))
      const manaBurn = Math.max(1, Math.floor(GetUnitState(source, UNIT_STATE_MAX_MANA()) * 0.005))
      SetUnitState(source, UNIT_STATE_MAX_LIFE(), Math.max(1.0, GetUnitState(source, UNIT_STATE_MAX_LIFE()) - lifeBurn))
      SetUnitState(source, UNIT_STATE_MAX_MANA(), Math.max(0.0, GetUnitState(source, UNIT_STATE_MAX_MANA()) - manaBurn))
      DisplayTextToPlayer(
        GetOwningPlayer(source),
        0,
        0,
        GetUnitName(source) + "强行发动灰烬箭矢，额外燃烧了" + I2S(lifeBurn) + "点生命上限与" + I2S(manaBurn) + "点魔法上限"
      )
    }

    DisableTrigger(triggerHandle)
    const reenableTimer = CreateTimer()
    TimerStart(reenableTimer, 1.0, false, () => {
      EnableTrigger(triggerHandle)
      DestroyTimer(reenableTimer)
    })
  })

  replaceGlobalTrigger("gg_trg_Ash_Arrow", triggerHandle)
}

/**
 * 入口：迁移 Ash_Arrow 触发器。
 */
export function migrateAshArrowTrigger(): void {
  registerAshArrowTrigger()
}

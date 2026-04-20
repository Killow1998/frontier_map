import { EVENT_PLAYER_UNIT_DEATH, UNIT_STATE_MAX_LIFE } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, findItemInInventory, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const DEATH_CLAW_ITEM_ID = FourCC("I000")

/**
 * death_claw：
 * 持有 I000 的单位死亡时扣除 100 点最大生命，并把爪子抛回尸体位置。
 */
function registerDeathClawTrigger(): void {
  disableLegacyTrigger("gg_trg_death_claw")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const deadUnit = GetTriggerUnit()
    return !!findItemInInventory(deadUnit, DEATH_CLAW_ITEM_ID) && !IsUnitIllusion(deadUnit)
  }))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const nextMaxLife = GetUnitState(deadUnit, UNIT_STATE_MAX_LIFE()) - 100.0
    SetUnitState(deadUnit, UNIT_STATE_MAX_LIFE(), nextMaxLife > 1.0 ? nextMaxLife : 1.0)

    const deathClaw = findItemInInventory(deadUnit, DEATH_CLAW_ITEM_ID)
    if (!deathClaw) {
      return
    }
    const x = GetUnitX(deadUnit)
    const y = GetUnitY(deadUnit)
    for (let i = 0; i < 6; i++) {
      SetItemPosition(deathClaw, x, y)
    }
  })
  replaceGlobalTrigger("gg_trg_death_claw", triggerHandle)
}

/**
 * 入口：迁移 death_claw 触发器。
 */
export function migrateDeathClawTrigger(): void {
  registerDeathClawTrigger()
}

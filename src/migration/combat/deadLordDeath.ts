import { EVENT_PLAYER_UNIT_DEATH, bj_DEGTORAD } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, isHumanMercenaryPlayer, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const DEAD_LORD_TYPE_ID = FourCC("n00Z")
const GOLD_STONE_ITEM_ID = FourCC("I00D")
const TIME_SHIELD_ITEM_ID = FourCC("I02U")

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
 * 在单位周围生成物品。
 */
function createItemAround(unitHandle: unit, itemTypeId: number, distance: number): void {
  const angle = GetRandomReal(0.0, 360.0)
  const rad = angle * bj_DEGTORAD
  const x = GetUnitX(unitHandle) + distance * Math.cos(rad)
  const y = GetUnitY(unitHandle) + distance * Math.sin(rad)
  CreateItem(itemTypeId, x, y)
}

/**
 * dead_lord_death：
 * n00Z 被玩家击杀后掉落双碎石与时间护盾，并播放驱散特效。
 */
function registerDeadLordDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_dead_lord_death")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const killer = GetKillingUnit()
    return !!killer && isHumanMercenaryPlayer(GetOwningPlayer(killer)) && GetUnitTypeId(GetTriggerUnit()) === DEAD_LORD_TYPE_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const effectHandle = AddSpecialEffect("Abilities\\Spells\\Human\\DispelMagic\\DispelMagicTarget.mdl", GetUnitX(deadUnit), GetUnitY(deadUnit))
    destroyEffectLater(effectHandle, 2.0)
    createItemAround(deadUnit, GOLD_STONE_ITEM_ID, 256.0)
    createItemAround(deadUnit, GOLD_STONE_ITEM_ID, 256.0)
    CreateItem(TIME_SHIELD_ITEM_ID, GetUnitX(deadUnit), GetUnitY(deadUnit))
  })
  replaceGlobalTrigger("gg_trg_dead_lord_death", triggerHandle)
}

/**
 * 入口：迁移 dead_lord_death 触发器。
 */
export function migrateDeadLordDeathTrigger(): void {
  registerDeadLordDeathTrigger()
}

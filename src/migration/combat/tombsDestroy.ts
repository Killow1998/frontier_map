import { EVENT_PLAYER_UNIT_DEATH, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, displayTextToMercenaryPlayers, isHumanMercenaryPlayer, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const TOMB_SOLDIER_TYPE_ID = FourCC("u00H")
const TOMB_LORD_BODY_TYPE_ID = FourCC("u00G")
const DEAD_SOLDIER_TYPE_ID = FourCC("n00Y")
const DEAD_LORD_TYPE_ID = FourCC("n00Z")
const TOMB_TOKEN_ITEM_ID = FourCC("I02R")

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
 * tombs_destory：
 * 墓区怪物死亡后按类型触发掉落与复生逻辑。
 */
function registerTombsDestroyTrigger(): void {
  disableLegacyTrigger("gg_trg_tombs_destory")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const deadUnit = GetTriggerUnit()
    const killer = GetKillingUnit()
    if (!killer || !isHumanMercenaryPlayer(GetOwningPlayer(killer))) {
      return false
    }
    const deadTypeId = GetUnitTypeId(deadUnit)
    return deadTypeId === TOMB_SOLDIER_TYPE_ID || deadTypeId === TOMB_LORD_BODY_TYPE_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const deadTypeId = GetUnitTypeId(deadUnit)
    const deadX = GetUnitX(deadUnit)
    const deadY = GetUnitY(deadUnit)

    if (deadTypeId === TOMB_SOLDIER_TYPE_ID) {
      if (GetRandomInt(1, 100) <= 15) {
        CreateItem(TOMB_TOKEN_ITEM_ID, deadX, deadY)
      }
      const soldier = CreateUnit(Player(10), DEAD_SOLDIER_TYPE_ID, deadX, deadY, bj_UNIT_FACING)
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\Voodoo\\VoodooAura.mdl", soldier, "origin")
      destroyEffectLater(effectHandle, 1.0)
      return
    }

    if (GetRandomInt(1, 100) <= 30) {
      CreateItem(TOMB_TOKEN_ITEM_ID, deadX, deadY)
    }
    const lord = CreateUnit(Player(10), DEAD_LORD_TYPE_ID, deadX, deadY, bj_UNIT_FACING)
    displayTextToMercenaryPlayers("谁敢打扰逝者的安眠！！！")
    SetUnitInvulnerable(lord, true)
    SetUnitAnimation(lord, "birth")
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 2.5, false, () => {
      SetUnitInvulnerable(lord, false)
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_tombs_destory", triggerHandle)
}

/**
 * 入口：迁移 tombs_destory 触发器。
 */
export function migrateTombsDestroyTrigger(): void {
  registerTombsDestroyTrigger()
}

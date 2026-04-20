import { EVENT_PLAYER_UNIT_DEATH, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, isHumanMercenaryPlayer, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const DEAD_SOLDIER_TYPE_ID = FourCC("n00Y")
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
 * 在矩形中随机生成坐标。
 */
function randomPointInRect(targetRect: rect): [number, number] {
  const x = GetRandomReal(GetRectMinX(targetRect), GetRectMaxX(targetRect))
  const y = GetRandomReal(GetRectMinY(targetRect), GetRectMaxY(targetRect))
  return [x, y]
}

/**
 * dead_soldier_rebirth：
 * n00Y 被玩家击杀后，低概率掉落墓区代币，并在延迟后于墓区随机复生。
 */
function registerDeadSoldierRebirthTrigger(): void {
  disableLegacyTrigger("gg_trg_dead_soldier_rebirth")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const killer = GetKillingUnit()
    return (
      !!killer &&
      isHumanMercenaryPlayer(GetOwningPlayer(killer)) &&
      GetUnitTypeId(GetTriggerUnit()) === DEAD_SOLDIER_TYPE_ID
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    if (GetRandomInt(1, 100) <= 6) {
      CreateItem(TOMB_TOKEN_ITEM_ID, GetUnitX(deadUnit), GetUnitY(deadUnit))
    }

    const tombArea = getGlobal<rect>("gg_rct_tombs_area")
    if (!tombArea) {
      return
    }
    const respawnTimer = CreateTimer()
    TimerStart(respawnTimer, GetRandomReal(72.0, 103.0), false, () => {
      const [spawnX, spawnY] = randomPointInRect(tombArea)
      const rebornUnit = CreateUnit(Player(10), DEAD_SOLDIER_TYPE_ID, spawnX, spawnY, bj_UNIT_FACING)
      const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Orc\\Voodoo\\VoodooAura.mdl", rebornUnit, "origin")
      destroyEffectLater(effectHandle, 1.0)
      DestroyTimer(respawnTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_dead_soldier_rebirth", triggerHandle)
}

/**
 * 入口：迁移 dead_soldier_rebirth 触发器。
 */
export function migrateDeadSoldierRebirthTrigger(): void {
  registerDeadSoldierRebirthTrigger()
}

import {
  EVENT_UNIT_DEATH,
  EVENT_PLAYER_UNIT_CONSTRUCT_FINISH,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  EVENT_PLAYER_UNIT_USE_ITEM,
  PLAYER_NEUTRAL_AGGRESSIVE,
  UNIT_STATE_ATTACK_SPACE,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  findItemInInventory,
  getGlobal,
  replaceGlobalTrigger,
  setGlobal,
  toSyncInt
} from "../core/helpers"

const SIGNAL_TOWER_UNIT_ID = FourCC("o003")

/**
 * 穿云之信：销毁所有信号塔。
 */
function destroyAllSignalTowersSync(): void {
  GroupClear(SYNC_GROUP)
  const world = GetWorldBounds()
  GroupEnumUnitsInRect(SYNC_GROUP, world, null)
  ForGroup(SYNC_GROUP, () => {
    const u = GetEnumUnit()
    if (GetUnitTypeId(u) === SIGNAL_TOWER_UNIT_ID) {
      RemoveUnit(u)
    }
  })
  GroupClear(SYNC_GROUP)
  RemoveRect(world)
}

function registerTowerTaskTrigger(): void {
  disableLegacyTrigger("gg_trg_tower_to_build")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
     const builder = getGlobal<unit>("udg_Tower_Builder")
     if (!builder) return
     
     SetUnitPathing(builder, false)
     
     const deathTrigger = CreateTrigger()
     TriggerRegisterUnitEvent(deathTrigger, builder, EVENT_UNIT_DEATH())
     TriggerAddAction(deathTrigger, () => {
        if (getGlobal<boolean>("udg_build_finish")) return
        destroyAllSignalTowersSync()
        displayTextToMercenaryPlayers("|cffff0000[任务失败] 建造专家已阵亡，信号塔计划被迫终止！|r")
        DestroyTrigger(deathTrigger)
     })
  })
  
  replaceGlobalTrigger("gg_trg_tower_to_build", triggerHandle)
}

export function migrateTaskTriggers(): void {
  registerTowerTaskTrigger()
}

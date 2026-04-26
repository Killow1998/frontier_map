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

const TOWER_BUILDER_UNIT_ID = FourCC("h00S")
const SIGNAL_TOWER_UNIT_ID = FourCC("o003")
const FORGET_ME_NOT_ITEM_ID = FourCC("I03E")

function runLaterSync(delay: number, action: () => void): void {
  const t = CreateTimer()
  TimerStart(t, delay, false, () => {
    action()
    DestroyTimer(t)
  })
}

/**
 * 穿云之信：建塔专家护送任务重构。
 * 加固：使用全局同步组管理信号塔状态。
 */
function destroyAllSignalTowersSync(): void {
  // 【同步加固】
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
     // 这里原图涉及复杂的专家 AI 和 300秒守卫
     // 已在之前重构中转为事件驱动，此处继续维持 Handle 池化规范
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

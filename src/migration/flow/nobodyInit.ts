import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger, setGlobal } from "../core/helpers"

const NOBODY_INIT_DONE_GLOBAL = "udg_migration_nobody_init_done"

/**
 * 在矩形内随机位置创建单位。
 */
function createUnitInRectRandom(owner: player, unitId: number, whereRect: rect): unit {
  const x = GetRandomReal(GetRectMinX(whereRect), GetRectMaxX(whereRect))
  const y = GetRandomReal(GetRectMinY(whereRect), GetRectMaxY(whereRect))
  return CreateUnit(owner, unitId, x, y, GetRandomReal(0.0, 360.0))
}

/**
 * 在矩形中心创建单位。
 */
function createUnitAtRectCenter(owner: player, unitId: number, whereRect: rect): unit {
  return CreateUnit(owner, unitId, GetRectCenterX(whereRect), GetRectCenterY(whereRect), GetRandomReal(0.0, 360.0))
}

/**
 * 批量在矩形随机位置创建单位。
 */
function createUnitBatchRandom(owner: player, unitId: number, whereRect: rect, count: number): void {
  for (let i = 0; i < count; i++) {
    createUnitInRectRandom(owner, unitId, whereRect)
  }
}

/**
 * nobody_init：
 * 地图开局野怪与中立首领批量生成。
 */
function registerNobodyInitTrigger(): void {
  disableLegacyTrigger("gg_trg_nobody_init")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 1.0, false)
  TriggerAddAction(triggerHandle, () => {
    if (getGlobal<boolean>(NOBODY_INIT_DONE_GLOBAL) === true) {
      return
    }
    setGlobal(NOBODY_INIT_DONE_GLOBAL, true)

    const p10 = Player(10)

    const rect01 = getGlobal<rect>("gg_rct________________01")
    const rect0 = getGlobal<rect>("gg_rct_________________________0")
    const rect02 = getGlobal<rect>("gg_rct_____________02")
    const rect5124 = getGlobal<rect>("gg_rct___________________5124")
    const rect11 = getGlobal<rect>("gg_rct________area_11")
    const rectBugs = getGlobal<rect>("gg_rct_bugs_area")
    const rectNiriu = getGlobal<rect>("gg_rct_niriu_area")
    const rectBoss = getGlobal<rect>("gg_rct______________________u")
    const rectFrozen = getGlobal<rect>("gg_rct_frozenArea")
    const rectVolcano = getGlobal<rect>("gg_rct_volcanoArea")
    const rectWater = getGlobal<rect>("gg_rct_water_prison")
    const rectTurtle = getGlobal<rect>("gg_rct_turtle_fucker")

    if (!rect01 || !rect0 || !rect02 || !rect5124 || !rect11 || !rectBugs || !rectNiriu || !rectBoss || !rectFrozen || !rectVolcano || !rectWater || !rectTurtle) {
      return
    }

    createUnitInRectRandom(p10, FourCC("n004"), rect01)
    createUnitBatchRandom(p10, FourCC("n003"), rect01, GetRandomInt(4, 7))
    createUnitBatchRandom(p10, FourCC("n007"), rect0, GetRandomInt(5, 7))

    createUnitInRectRandom(p10, FourCC("n005"), rect02)
    createUnitBatchRandom(p10, FourCC("n006"), rect02, GetRandomInt(4, 5))

    createUnitBatchRandom(p10, FourCC("n009"), rect5124, 7)
    createUnitBatchRandom(p10, FourCC("n010"), rect11, 8)

    createUnitAtRectCenter(p10, FourCC("n014"), rectBugs)
    createUnitBatchRandom(p10, FourCC("n015"), rectBugs, 3)

    for (let i = 0; i < 3; i++) {
      createUnitInRectRandom(p10, FourCC("n018"), rectNiriu)
      createUnitInRectRandom(p10, FourCC("n017"), rectNiriu)
    }

    const boss = createUnitAtRectCenter(p10, FourCC("n000"), rectBoss)
    const bossGroup = getGlobal<group>("udg_boss")
    if (bossGroup) {
      GroupAddUnit(bossGroup, boss)
    }

    createUnitBatchRandom(p10, FourCC("e007"), rectFrozen, 7)
    createUnitBatchRandom(p10, FourCC("e008"), rectVolcano, 7)
    createUnitBatchRandom(p10, FourCC("n016"), rectWater, 7)
    createUnitAtRectCenter(p10, FourCC("n01A"), rectTurtle)
  })
  replaceGlobalTrigger("gg_trg_nobody_init", triggerHandle)
}

/**
 * 入口：迁移 nobody_init 触发器。
 */
export function migrateNobodyInitTrigger(): void {
  registerNobodyInitTrigger()
}

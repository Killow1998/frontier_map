import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  getGlobal,
  isHumanMercenaryPlayer,
  overrideCurrentEventDamage,
  registerAnyUnitDamagedEvent,
  registerPlayerChatEventAll,
  replaceGlobalTrigger,
  setGlobal
} from "../core/helpers"

const GOLDEN_STONE_NODE_ID = FourCC("u00O")
const SLIVER_TREE_NODE_ID = FourCC("u00N")
const GATHER_EXPERT_UNIT_ID = FourCC("h003")
const GOLDEN_GUARD_UNIT_ID = FourCC("n01G")
const SLIVER_GUARD_UNIT_ID = FourCC("n01F")
const TIMED_LIFE_BUFF_ID = FourCC("BHwe")
let hasWarnedMissingNodeDamageOverride = false

/**
 * 兼容注册任意单位受伤事件。
 */
function registerAnyDamageEvent(triggerHandle: trigger): void {
  registerAnyUnitDamagedEvent(triggerHandle)
}

/**
 * 在同一个受伤事件内将资源点伤害改写为固定值。
 */
function normalizeNodeDamage(desiredDamage: number): void {
  if (overrideCurrentEventDamage(desiredDamage)) {
    return
  }
  if (!hasWarnedMissingNodeDamageOverride) {
    hasWarnedMissingNodeDamageOverride = true
    print("[migration] Missing EXSetEventDamage/BlzSetEventDamage; resource node damage rewrite skipped")
  }
}

/**
 * 增加资源全局值。
 */
function addResource(globalName: string, amount: number): void {
  setGlobal(globalName, getResourceValue(globalName) + amount)
}

/**
 * 在指定矩形随机刷出短时护卫。
 */
function spawnTimedGuard(rectGlobalName: string, guardUnitId: number, owner: player): boolean {
  const spawnRect = getGlobal<rect>(rectGlobalName)
  if (!spawnRect) {
    print(`Missing resource rect: ${rectGlobalName}`)
    return false
  }
  const x = GetRandomReal(GetRectMinX(spawnRect), GetRectMaxX(spawnRect))
  const y = GetRandomReal(GetRectMinY(spawnRect), GetRectMaxY(spawnRect))
  const guard = CreateUnit(owner, guardUnitId, x, y, 0.0)
  UnitApplyTimedLife(guard, TIMED_LIFE_BUFF_ID, 12.0)
  return true
}

/**
 * 读取资源全局变量，避免重复散落访问逻辑。
 */
function getResourceValue(globalName: string): number {
  return getGlobal<number>(globalName) ?? 0
}

/**
 * 注册 `-res` 聊天指令：显示当前队伍资源。
 */
function registerShowResourceTrigger(): void {
  disableLegacyTrigger("gg_trg_show_resource")
  const triggerHandle = CreateTrigger()
  registerPlayerChatEventAll(triggerHandle, "-res", true)
  TriggerAddCondition(triggerHandle, Condition(() => isHumanMercenaryPlayer(GetTriggerPlayer())))
  TriggerAddAction(triggerHandle, () => {
    const treeNum = getResourceValue("udg_tree_num")
    const stoneNum = getResourceValue("udg_stone_num")
    DisplayTextToPlayer(GetTriggerPlayer(), 0, 0, "你们队伍当前拥有资源如下：" + "银树木材：" + I2S(treeNum) + "  金石矿材：" + I2S(stoneNum))
  })
  replaceGlobalTrigger("gg_trg_show_resource", triggerHandle)
}

/**
 * golden_stone：金石采集点受伤时判定矿材掉落与护卫惊扰。
 */
function registerGoldenStoneTrigger(): void {
  disableLegacyTrigger("gg_trg_golden_stone")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === GOLDEN_STONE_NODE_ID))
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    normalizeNodeDamage(1.0)
    if (!source) {
      return
    }

    if (GetUnitTypeId(source) !== GATHER_EXPERT_UNIT_ID) {
      if (GetRandomInt(1, 100) <= 2) {
        addResource("udg_stone_num", 1)
        DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "哇哦，在您的雇佣兵大力开采下，获得了一块金石矿材，或许雇佣采集专家来效率更高")
      }
      if (GetRandomInt(1, 100) <= 50) {
        if (spawnTimedGuard("gg_rct_golden", GOLDEN_GUARD_UNIT_ID, GetOwningPlayer(GetTriggerUnit()))) {
          DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "坏了，在您的雇佣兵大力开采下，惊扰金石的守护护卫，他们要发起进攻了")
        }
      }
      return
    }

    if (GetRandomInt(1, 100) <= 15) {
      addResource("udg_stone_num", 1)
      DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "诶呀，采集专家的效率就是不一样，您获得了一块金石矿材")
    }
    if (GetRandomInt(1, 1000) <= 25) {
      if (spawnTimedGuard("gg_rct_golden", GOLDEN_GUARD_UNIT_ID, GetOwningPlayer(GetTriggerUnit()))) {
        DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "难道采集专家的技术还是太差了，怎么也能把金石护卫惊扰到")
      }
    }
  })
  replaceGlobalTrigger("gg_trg_golden_stone", triggerHandle)
}

/**
 * sliver_tree：银树采集点受伤时判定木材掉落与护卫惊扰。
 */
function registerSliverTreeTrigger(): void {
  disableLegacyTrigger("gg_trg_sliver_tree")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SLIVER_TREE_NODE_ID))
  TriggerAddAction(triggerHandle, () => {
    const source = GetEventDamageSource()
    normalizeNodeDamage(1.0)
    if (!source) {
      return
    }

    if (GetUnitTypeId(source) !== GATHER_EXPERT_UNIT_ID) {
      if (GetRandomInt(1, 100) <= 2) {
        addResource("udg_tree_num", 1)
        DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "哇哦，在您的雇佣兵大力开采下，获得了一块银树木材，或许雇佣采集专家来效率更高")
      }
      if (GetRandomInt(1, 100) <= 50) {
        if (spawnTimedGuard("gg_rct_sliver", SLIVER_GUARD_UNIT_ID, GetOwningPlayer(GetTriggerUnit()))) {
          DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "坏了，在您的雇佣兵大力开采下，惊扰银树的守护护卫，他们要发起进攻了")
        }
      }
      return
    }

    if (GetRandomInt(1, 100) <= 15) {
      addResource("udg_tree_num", 1)
      DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "诶呀，采集专家的效率就是不一样，您获得了一块银树木材")
    }
    if (GetRandomInt(1, 1000) <= 25) {
      if (spawnTimedGuard("gg_rct_sliver", SLIVER_GUARD_UNIT_ID, GetOwningPlayer(GetTriggerUnit()))) {
        DisplayTextToPlayer(GetOwningPlayer(source), 0, 0, "难道采集专家的技术还是太差了，怎么也能把银树护卫惊扰到")
      }
    }
  })
  replaceGlobalTrigger("gg_trg_sliver_tree", triggerHandle)
}

/**
 * 入口：迁移 show_resource 触发器。
 */
export function migrateShowResourceTrigger(): void {
  registerShowResourceTrigger()
  registerGoldenStoneTrigger()
  registerSliverTreeTrigger()
}

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
  setGlobal(globalName, (getGlobal<number>(globalName) ?? 0) + amount)
}

/**
 * 在采集点周围固定偏移处刷出短时护卫（确定性方案，防止 RNG 分车）。
 */
function spawnTimedGuardSync(node: unit, guardUnitId: number, owner: player): boolean {
  if (!node) return false
  
  // 使用固定偏移量而非 GetRandomReal
  // 确保所有客户端生成的 Handle (单位) 坐标完全一致
  const x = GetUnitX(node) + 128.0
  const y = GetUnitY(node) + 128.0
  const guard = CreateUnit(owner, guardUnitId, x, y, 0.0)
  
  if (guard) {
    UnitApplyTimedLife(guard, TIMED_LIFE_BUFF_ID, 12.0)
    return true
  }
  return false
}

/**
 * 注册 -res 聊天指令：显示当前队伍资源。
 */
function registerShowResourceTrigger(): void {
  disableLegacyTrigger("gg_trg_show_resource")
  const triggerHandle = CreateTrigger()
  registerPlayerChatEventAll(triggerHandle, "-res", true)
  TriggerAddCondition(triggerHandle, Condition(() => isHumanMercenaryPlayer(GetTriggerPlayer())))
  TriggerAddAction(triggerHandle, () => {
    const treeNum = getGlobal<number>("udg_tree_num") ?? 0
    const stoneNum = getGlobal<number>("udg_stone_num") ?? 0
    DisplayTextToPlayer(GetTriggerPlayer(), 0, 0, "|cff00FFFF[队伍资源]|r 银树木材：" + I2S(treeNum) + "  金石矿材：" + I2S(stoneNum))
  })
  replaceGlobalTrigger("gg_trg_show_resource", triggerHandle)
}

/**
 * 金石采集逻辑加固。
 */
function registerGoldenStoneTrigger(): void {
  disableLegacyTrigger("gg_trg_golden_stone")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === GOLDEN_STONE_NODE_ID))
  TriggerAddAction(triggerHandle, () => {
    const node = GetTriggerUnit()
    const source = GetEventDamageSource()
    normalizeNodeDamage(1.0)
    if (!source) return

    const owner = GetOwningPlayer(source)
    const isExpert = GetUnitTypeId(source) === GATHER_EXPERT_UNIT_ID

    if (!isExpert) {
      // 这里的随机数消耗在受伤同步帧执行
      if (GetRandomInt(1, 100) <= 2) {
        addResource("udg_stone_num", 1)
        DisplayTextToPlayer(owner, 0, 0, "|cff00FF00[采集] 获得金石矿材！若是专家开采效率会更高。|r")
      }
      if (GetRandomInt(1, 100) <= 50) {
        if (spawnTimedGuardSync(node, GOLDEN_GUARD_UNIT_ID, GetOwningPlayer(node))) {
          DisplayTextToPlayer(owner, 0, 0, "|cffFF0000[警告] 采集动作惊扰了金石护卫！|r")
        }
      }
    } else {
      if (GetRandomInt(1, 100) <= 15) {
        addResource("udg_stone_num", 1)
        DisplayTextToPlayer(owner, 0, 0, "|cff00FF00[采集] 专家精准开采，获得金石矿材。|r")
      }
      if (GetRandomInt(1, 1000) <= 25) {
        if (spawnTimedGuardSync(node, GOLDEN_GUARD_UNIT_ID, GetOwningPlayer(node))) {
          DisplayTextToPlayer(owner, 0, 0, "|cffFF0000[警告] 连采集专家也惊扰了护卫！|r")
        }
      }
    }
  })
  replaceGlobalTrigger("gg_trg_golden_stone", triggerHandle)
}

/**
 * 银树采集逻辑加固。
 */
function registerSliverTreeTrigger(): void {
  disableLegacyTrigger("gg_trg_sliver_tree")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === SLIVER_TREE_NODE_ID))
  TriggerAddAction(triggerHandle, () => {
    const node = GetTriggerUnit()
    const source = GetEventDamageSource()
    normalizeNodeDamage(1.0)
    if (!source) return

    const owner = GetOwningPlayer(source)
    const isExpert = GetUnitTypeId(source) === GATHER_EXPERT_UNIT_ID

    if (!isExpert) {
      if (GetRandomInt(1, 100) <= 2) {
        addResource("udg_tree_num", 1)
        DisplayTextToPlayer(owner, 0, 0, "|cff00FF00[采集] 获得银树木材！|r")
      }
      if (GetRandomInt(1, 100) <= 50) {
        if (spawnTimedGuardSync(node, SLIVER_GUARD_UNIT_ID, GetOwningPlayer(node))) {
          DisplayTextToPlayer(owner, 0, 0, "|cffFF0000[警告] 惊扰了银树护卫！|r")
        }
      }
    } else {
      if (GetRandomInt(1, 100) <= 15) {
        addResource("udg_tree_num", 1)
        DisplayTextToPlayer(owner, 0, 0, "|cff00FF00[采集] 专家精准开采，获得银树木材。|r")
      }
      if (GetRandomInt(1, 1000) <= 25) {
        if (spawnTimedGuardSync(node, SLIVER_GUARD_UNIT_ID, GetOwningPlayer(node))) {
          DisplayTextToPlayer(owner, 0, 0, "|cffFF0000[警告] 银树护卫出现了！|r")
        }
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

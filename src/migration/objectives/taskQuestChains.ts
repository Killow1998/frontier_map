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
  bj_MAX_PLAYER_SLOTS,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { applyUnitBonus, disableLegacyTrigger, findItemInInventory, getGlobal, isHumanMercenaryPlayer, registerPlayerUnitEventAll, replaceGlobalTrigger, setGlobal } from "../core/helpers"
import { recordQuestCompletion } from "./gameScore"

const EMERALD_FRAGMENT_ITEM_ID = FourCC("I03B")
const EMERALD_ITEM_ID = FourCC("I03Z")

const TOWER_BLUEPRINT_ITEM_ID = FourCC("I03X")
const TOWER_ORDER_ITEM_ID = FourCC("I03Y")
const TOWER_BUILDER_UNIT_ID = FourCC("h00S")
const SIGNAL_TOWER_UNIT_ID = FourCC("h00Q")

const VTU_REVENGE_ITEM_ID = FourCC("I03W")
const VTU_SOUP_ITEM_ID = FourCC("I02Q")
const VTU_REWARD_ITEM_ID = FourCC("I03E")

const PRIEST_RING_ITEM_ID = FourCC("I00G")
const PRIEST_CONTRACT_ITEM_ID = FourCC("I00B")
const PRIEST_REWARD_ITEM_ID = FourCC("I03C")

const FAKE_ICE_ITEM_ID = FourCC("I039")
const FAKE_FIRE_ITEM_ID = FourCC("I03A")
const FAKE_EMERALD_ITEM_ID = FourCC("I03Z")
const FAKE_REWARD_ITEM_ID = FourCC("I03D")

const SWIMMINGPOOL_BOSS_UNIT_ID = FourCC("U00K")
const TOWER_BUILD_ALERT_EFFECT_MODEL = "Abilities\\Spells\\Other\\TalkToMe\\TalkToMe.mdl"

const TECH_PLAYER7_IDS = [FourCC("R000"), FourCC("R004")]
const TECH_PLAYER8_IDS = [FourCC("R001"), FourCC("R005")]
const TECH_PLAYER9_IDS = [FourCC("R002"), FourCC("R003")]

/**
 * 任务消息类型常量键。
 */
type QuestMessageTypeKey =
  | "bj_QUESTMESSAGE_DISCOVERED"
  | "bj_QUESTMESSAGE_UPDATED"
  | "bj_QUESTMESSAGE_COMPLETED"
  | "bj_QUESTMESSAGE_FAILED"

/**
 * 纯原生检查：单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 判定是否为 1~4 号玩家控制的存活英雄。
 */
function isMercenaryHero(unitHandle: unit): boolean {
  return isHumanMercenaryPlayer(GetOwningPlayer(unitHandle)) && IsUnitType(unitHandle, UNIT_TYPE_HERO()) && isUnitAlive(unitHandle)
}

/**
 * 延迟执行一次动作。
 */
function runLater(delay: number, action: () => void): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    action()
    DestroyTimer(timerHandle)
  })
}

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(effectHandle: effect, delay: number): void {
  runLater(delay, () => DestroyEffect(effectHandle))
}

/**
 * 在背包中移除一件指定类型物品。
 */
function removeInventoryItem(unitHandle: unit, itemTypeId: number): boolean {
  const itemHandle = findItemInInventory(unitHandle, itemTypeId)
  if (!itemHandle) {
    return false
  }
  RemoveItem(itemHandle)
  return true
}

/**
 * 统计背包内指定物品数量。
 */
function countInventoryItem(unitHandle: unit, itemTypeId: number): number {
  let count = 0
  for (let slot = 0; slot < 6; slot++) {
    const itemHandle = UnitItemInSlot(unitHandle, slot)
    if (itemHandle && GetItemTypeId(itemHandle) === itemTypeId) {
      count++
    }
  }
  return count
}

/**
 * 在背包内移除指定数量的某类物品。
 */
function removeInventoryItemCount(unitHandle: unit, itemTypeId: number, amount: number): void {
  let remaining = amount
  for (let slot = 0; slot < 6 && remaining > 0; slot++) {
    const itemHandle = UnitItemInSlot(unitHandle, slot)
    if (itemHandle && GetItemTypeId(itemHandle) === itemTypeId) {
      RemoveItem(itemHandle)
      remaining--
    }
  }
}

/**
 * 广播任务消息（兼容 QuestMessageBJ 缺失场景）。
 */
function pushQuestMessage(messageTypeKey: QuestMessageTypeKey, text: string): void {
  const questMessageBJ = getGlobal<(whichPlayers: force, messageType: number, message: string) => void>("QuestMessageBJ")
  const getPlayersAll = getGlobal<() => force>("GetPlayersAll")
  const messageType = getGlobal<number>(messageTypeKey)
  if (messageTypeKey === "bj_QUESTMESSAGE_COMPLETED") {
    recordQuestCompletion()
  }
  if (questMessageBJ && getPlayersAll && messageType !== undefined) {
    questMessageBJ(getPlayersAll(), messageType, text)
    return
  }
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    DisplayTextToPlayer(Player(i), 0, 0, text)
  }
}

/**
 * 闪烁任务按钮（存在函数时执行）。
 */
function flashQuestDialogButton(): void {
  const flashQuest = getGlobal<() => void>("FlashQuestDialogButton")
  flashQuest?.()
}

/**
 * 以原生 Quest API 创建任务，避免对 bj_QUESTTYPE 常量名的运行时依赖。
 */
function createQuestEntry(required: boolean, discovered: boolean, title: string, description: string, iconPath: string): quest {
  const questHandle = CreateQuest()
  QuestSetTitle(questHandle, title)
  QuestSetDescription(questHandle, description)
  QuestSetIconPath(questHandle, iconPath)
  QuestSetRequired(questHandle, required)
  QuestSetDiscovered(questHandle, discovered)
  return questHandle
}

/**
 * 创建可选隐藏任务。
 */
function createOptionalUndiscoveredQuest(title: string, description: string, iconPath: string): quest | undefined {
  return createQuestEntry(false, false, title, description, iconPath)
}

/**
 * Quest API 兼容封装。
 */
function setQuestEnabled(questHandle: quest | undefined, enabled: boolean): void {
  if (!questHandle) {
    return
  }
  QuestSetEnabled(questHandle, enabled)
}

function setQuestDescription(questHandle: quest | undefined, description: string): void {
  if (!questHandle) {
    return
  }
  QuestSetDescription(questHandle, description)
}

function setQuestDiscovered(questHandle: quest | undefined, discovered: boolean): void {
  if (!questHandle) {
    return
  }
  QuestSetDiscovered(questHandle, discovered)
}

function setQuestCompleted(questHandle: quest | undefined, completed: boolean): void {
  if (!questHandle) {
    return
  }
  QuestSetCompleted(questHandle, completed)
}

function setQuestFailed(questHandle: quest | undefined, failed: boolean): void {
  if (!questHandle) {
    return
  }
  QuestSetFailed(questHandle, failed)
}

/**
 * 创建并启用一个任务条目。
 */
function createAndEnableQuest(required: boolean, discovered: boolean, title: string, description: string, iconPath: string): void {
  const questHandle = createQuestEntry(required, discovered, title, description, iconPath)
  setQuestEnabled(questHandle, true)
}

/**
 * 向所有玩家广播文本。
 */
function broadcastAllPlayers(message: string): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    DisplayTextToPlayer(Player(i), 0, 0, message)
  }
}

/**
 * 用小地图 ping 与感叹号特效标记建造点。
 */
function alertTowerBuildPoint(buildRect: rect): void {
  const x = GetRectCenterX(buildRect)
  const y = GetRectCenterY(buildRect)
  PingMinimapEx(x, y, 9.0, 255, 220, 0, false)

  let elapsed = 0.0
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, 1.5, true, () => {
    const effectHandle = AddSpecialEffect(TOWER_BUILD_ALERT_EFFECT_MODEL, x, y)
    destroyEffectLater(effectHandle, 1.2)
    elapsed += 1.5
    if (elapsed >= 12.0) {
      DestroyTimer(timerHandle)
    }
  })
}

/**
 * 将勿忘我物编名称改为“愿忘”（对齐原触发器 EXSetItemDataString）。
 */
function renameNotForgetMeItemToYuanWang(): void {
  const exSetItemDataString = getGlobal<(itemCode: number, dataType: number, value: string) => boolean>("EXSetItemDataString")
  exSetItemDataString?.(VTU_REWARD_ITEM_ID, 4, "愿忘")
}

/**
 * 注册进入矩形事件（优先 TriggerRegisterEnterRectSimple，不存在则回退 Region 方案）。
 */
function registerEnterRectEvent(triggerHandle: trigger, whereRect: rect): void {
  const registerEnterRectSimple = getGlobal<(whichTrigger: trigger, whichRect: rect) => event>("TriggerRegisterEnterRectSimple")
  if (registerEnterRectSimple) {
    registerEnterRectSimple(triggerHandle, whereRect)
    return
  }
  const regionHandle = CreateRegion()
  RegionAddRect(regionHandle, whereRect)
  TriggerRegisterEnterRegion(triggerHandle, regionHandle, null)
}

/**
 * IsUnitDetected 兼容封装。
 */
function isUnitDetectedByPlayer(unitHandle: unit, whichPlayer: player): boolean {
  const isUnitDetected = getGlobal<(whichUnit: unit, checker: player) => boolean>("IsUnitDetected")
  if (!isUnitDetected) {
    return true
  }
  return isUnitDetected(unitHandle, whichPlayer)
}

/**
 * 向英雄组发放统一奖励。
 */
function awardHeroSelectGroup(xp: number, allStats: number): void {
  const heroGroup = getGlobal<group>("udg_hero_select")
  if (!heroGroup) {
    return
  }
  ForGroup(heroGroup, () => {
    const hero = GetEnumUnit()
    if (!hero) {
      return
    }
    AddHeroXP(hero, xp, true)
    SetHeroStr(hero, GetHeroStr(hero, false) + allStats, true)
    SetHeroAgi(hero, GetHeroAgi(hero, false) + allStats, true)
    SetHeroInt(hero, GetHeroInt(hero, false) + allStats, true)
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, GetUnitName(hero) + "获得" + I2S(allStats) + "点全属性和大量经验")
  })
}

/**
 * 炸毁地图上所有 h00Q 信号塔。
 */
function destroyAllSignalTowers(): void {
  const groupHandle = CreateGroup()
  GroupEnumUnitsInRect(groupHandle, GetWorldBounds(), null)
  const explodeUnitBJ = getGlobal<(whichUnit: unit) => void>("ExplodeUnitBJ")
  ForGroup(groupHandle, () => {
    const enumUnit = GetEnumUnit()
    if (!enumUnit) {
      return
    }
    if (IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) && GetUnitTypeId(enumUnit) === SIGNAL_TOWER_UNIT_ID) {
      if (explodeUnitBJ) {
        explodeUnitBJ(enumUnit)
      } else {
        KillUnit(enumUnit)
      }
    }
  })
  DestroyGroup(groupHandle)
}

/**
 * 在信号塔周围生成 12 道炽光特效。
 */
function createSignalTowerFlareEffects(tower: unit): void {
  const centerX = GetUnitX(tower)
  const centerY = GetUnitY(tower)
  for (let i = 1; i <= 12; i++) {
    const degrees = 30 * i
    const radians = (degrees * math.pi) / 180
    const x = centerX + 128 * math.cos(radians)
    const y = centerY + 128 * math.sin(radians)
    const effectHandle = AddSpecialEffect("Abilities\\Spells\\Human\\Flare\\FlareCaster.mdl", x, y)
    destroyEffectLater(effectHandle, 2.0)
  }
}

/**
 * 缩减英雄属性，最小保留 1 点。
 */
function reduceHeroPrimaryStats(hero: unit, amount: number): void {
  const nextStr = GetHeroStr(hero, false) > amount ? GetHeroStr(hero, false) - amount : 1
  const nextAgi = GetHeroAgi(hero, false) > amount ? GetHeroAgi(hero, false) - amount : 1
  const nextInt = GetHeroInt(hero, false) > amount ? GetHeroInt(hero, false) - amount : 1
  SetHeroStr(hero, nextStr, true)
  SetHeroAgi(hero, nextAgi, true)
  SetHeroInt(hero, nextInt, true)
}

/**
 * 判断单位是否位于指定矩形内。
 */
function isUnitInRect(targetRect: rect, unitHandle: unit): boolean {
  const x = GetUnitX(unitHandle)
  const y = GetUnitY(unitHandle)
  return x >= GetRectMinX(targetRect) && x <= GetRectMaxX(targetRect) && y >= GetRectMinY(targetRect) && y <= GetRectMaxY(targetRect)
}

/**
 * 迁移 emerald_get：
 * 同英雄背包存在 3 个碎片(I03B)时自动融合为绿宝石(I03Z)。
 */
function registerEmeraldGetTrigger(): void {
  disableLegacyTrigger("gg_trg_emerald_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === EMERALD_FRAGMENT_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    if (countInventoryItem(hero, EMERALD_FRAGMENT_ITEM_ID) < 3) {
      return
    }
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "您的雇佣兵将三块碎片两两对准缺口，融合成一块完整的绿宝石")
    removeInventoryItemCount(hero, EMERALD_FRAGMENT_ITEM_ID, 3)
    UnitAddItem(hero, CreateItem(EMERALD_ITEM_ID, GetUnitX(hero), GetUnitY(hero)))
  })
  replaceGlobalTrigger("gg_trg_emerald_get", triggerHandle)
}

/**
 * 迁移 tower_to_build：
 * 原图仅保留全局声明，未存在可执行初始化/动作，故显式空壳接管。
 */
function registerTowerToBuildPlaceholderTrigger(): void {
  disableLegacyTrigger("gg_trg_tower_to_build")
  const triggerHandle = CreateTrigger()
  replaceGlobalTrigger("gg_trg_tower_to_build", triggerHandle)
}

/**
 * tower_task 的上下文状态。
 */
interface TowerTaskContext {
  quest: quest | undefined
  builder?: unit
}

/**
 * 创建 tower_task 的“建造完成”监听。
 */
function createTowerConstructFinishTrigger(context: TowerTaskContext): trigger {
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_CONSTRUCT_FINISH())
  TriggerAddAction(triggerHandle, () => {
    const builtUnit = GetTriggerUnit()
    if (!builtUnit || !IsUnitType(builtUnit, UNIT_TYPE_STRUCTURE()) || GetUnitTypeId(builtUnit) !== SIGNAL_TOWER_UNIT_ID) {
      return
    }
    SetUnitInvulnerable(builtUnit, true)
    UnitShareVision(builtUnit, Player(0), true)
    UnitShareVision(builtUnit, Player(1), true)
    UnitShareVision(builtUnit, Player(2), true)
    UnitShareVision(builtUnit, Player(3), true)
    createSignalTowerFlareEffects(builtUnit)
    setQuestCompleted(context.quest, true)
    pushQuestMessage("bj_QUESTMESSAGE_COMPLETED", "[穿云之信]——魔法信号塔已建成，我们已经向友军请求支援，希望他们能尽快驰援！神，请祝福我们")
    awardHeroSelectGroup(0, 20)
    setGlobal("udg_build_finish", true)

    const baseRect = getGlobal<rect>("gg_rct_base_area")
    if (context.builder && baseRect) {
      SetUnitMoveSpeed(context.builder, 522.0)
      IssuePointOrder(context.builder, "move", GetRectCenterX(baseRect), GetRectCenterY(baseRect))
      const cleanTimer = CreateTimer()
      TimerStart(cleanTimer, 1.0, true, () => {
        if (!context.builder) {
          DestroyTimer(cleanTimer)
          return
        }
        if (isUnitInRect(baseRect, context.builder)) {
          RemoveUnit(context.builder)
          DestroyTimer(cleanTimer)
        }
      })
    }
    DestroyTrigger(triggerHandle)
  })
  return triggerHandle
}

/**
 * 迁移 tower_task：
 * 侦察兵发现 -> 蓝图上交 -> 材料交付 -> 建造守护 -> 成败结算。
 */
function registerTowerTaskTrigger(): void {
  disableLegacyTrigger("gg_trg_tower_task")
  const rootTrigger = CreateTrigger()
  TriggerAddAction(rootTrigger, () => {
    setGlobal("udg_build_finish", false)
    const context: TowerTaskContext = {
      quest: createOptionalUndiscoveredQuest(
        "穿云之信",
        "派出的传信兵均无消息，敌军已经明察营地虚实，我们如何才能破局",
        "ReplaceableTextures\\CommandButtons\\BTNHumanWatchTower.blp"
      )
    }
    setQuestEnabled(context.quest, true)

    const scoutUnit = getGlobal<unit>("gg_unit_n01E_0019")
    if (scoutUnit) {
      const scoutDeathTrigger = CreateTrigger()
      TriggerRegisterUnitEvent(scoutDeathTrigger, scoutUnit, EVENT_UNIT_DEATH())
      TriggerAddAction(scoutDeathTrigger, () => {
        flashQuestDialogButton()
        pushQuestMessage("bj_QUESTMESSAGE_DISCOVERED", "[穿云之信]——雇佣兵有些发现，需要向牧师汇报")
        broadcastAllPlayers("这里怎么会有敌军的探子！！")
        runLater(3.0, () => broadcastAllPlayers("原来我们营地实力空虚的消息早已被对方探查得一干二净，怪不得最近前来骚扰的敌军愈发强势"))
        runLater(6.0, () => broadcastAllPlayers("这里怎么有一座残破的高塔，搜索一下看看"))
        setQuestDiscovered(context.quest, true)
        DestroyTrigger(scoutDeathTrigger)
      })
    }

    const blueprintPickupTrigger = CreateTrigger()
    registerPlayerUnitEventAll(blueprintPickupTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM())
    TriggerAddCondition(blueprintPickupTrigger, Condition(() => GetItemTypeId(GetManipulatedItem()) === TOWER_BLUEPRINT_ITEM_ID))
    TriggerAddAction(blueprintPickupTrigger, () => {
      flashQuestDialogButton()
      pushQuestMessage("bj_QUESTMESSAGE_UPDATED", "[穿云之信]——似乎这份蓝图能解决燃眉之急")
      setQuestDescription(context.quest, "将蓝图携带给牧师，等待下一步指示")
      runLater(3.0, () => broadcastAllPlayers("看看牧师能否解读其中的奥秘"))
      DestroyTrigger(blueprintPickupTrigger)
    })

    const baseRect = getGlobal<rect>("gg_rct_base_area")
    const buildRect = getGlobal<rect>("gg_rct_to_build_tower")
    if (!baseRect || !buildRect) {
      return
    }

    const blueprintReadTrigger = CreateTrigger()
    registerEnterRectEvent(blueprintReadTrigger, baseRect)
    TriggerAddAction(blueprintReadTrigger, () => {
      const hero = GetTriggerUnit()
      const priest = getGlobal<unit>("gg_unit_H002_0119")
      if (!isMercenaryHero(hero) || !findItemInInventory(hero, TOWER_BLUEPRINT_ITEM_ID) || !priest || !isUnitAlive(priest)) {
        return
      }
      flashQuestDialogButton()
      pushQuestMessage("bj_QUESTMESSAGE_UPDATED", "[穿云之信]——派蒙正在仔细阅读高塔蓝图")
      broadcastAllPlayers("随军牧师【派蒙】:敌军的进攻只会愈发猛烈，我们难以抵挡")
      runLater(3.0, () => broadcastAllPlayers("随军牧师【派蒙】:幸好你们找到了这份蓝图，蓝图介绍了如何建造魔法信号塔，我们可以借助它求援"))
      runLater(6.0, () => {
        broadcastAllPlayers("随军牧师【派蒙】:建造魔法信号塔需要30份银树木材和20份金石矿材，需要你们前往野外采集，更好的选择是雇佣采集专家采集")
        setQuestDescription(context.quest, "我们需要前往野外采集30份银树木材和20份金石矿材，可以在营地中雇佣采集专家提高采集效率|n收集完材料后，携带蓝图找到牧师，他会找到能人巧匠来完成建造任务|n任务完成之前，牧师不能死！|n查看队伍材料指令：-res")
      })

      const materialSubmitTrigger = CreateTrigger()
      registerEnterRectEvent(materialSubmitTrigger, baseRect)
      TriggerAddAction(materialSubmitTrigger, () => {
        const submitter = GetTriggerUnit()
        const currentPriest = getGlobal<unit>("gg_unit_H002_0119")
        const treeNum = getGlobal<number>("udg_tree_num") ?? 0
        const stoneNum = getGlobal<number>("udg_stone_num") ?? 0
        if (!isMercenaryHero(submitter) || !findItemInInventory(submitter, TOWER_BLUEPRINT_ITEM_ID) || !currentPriest || !isUnitAlive(currentPriest) || treeNum < 30 || stoneNum < 20) {
          return
        }
        removeInventoryItem(submitter, TOWER_BLUEPRINT_ITEM_ID)
        flashQuestDialogButton()
        pushQuestMessage("bj_QUESTMESSAGE_UPDATED", "[穿云之信]——建造材料已收集完毕，等待雇佣兵开始指挥建造")
        runLater(1.0, () => {
          broadcastAllPlayers("随军牧师【派蒙】:我们必须前往河对岸建造魔法信号塔，只有这样才能更好地联系援军，所以你们一定一定要保护建造专家的安全")
          setQuestDescription(context.quest, "使用指令，派遣建造专家前往河对岸指定地点进行建造，需对其进行深度保护，以免建造失败|n查看队伍材料指令：-res")
        })
        setGlobal("udg_tree_num", treeNum - 30)
        setGlobal("udg_stone_num", stoneNum - 20)
        CreateItem(TOWER_ORDER_ITEM_ID, GetUnitX(submitter), GetUnitY(submitter))
        DestroyTrigger(materialSubmitTrigger)
      })
      DestroyTrigger(blueprintReadTrigger)
    })

    const useTowerOrderTrigger = CreateTrigger()
    registerPlayerUnitEventAll(useTowerOrderTrigger, EVENT_PLAYER_UNIT_USE_ITEM())
    TriggerAddCondition(useTowerOrderTrigger, Condition(() => GetItemTypeId(GetManipulatedItem()) === TOWER_ORDER_ITEM_ID))
    TriggerAddAction(useTowerOrderTrigger, () => {
      const commander = GetTriggerUnit()
        const randomDegrees = GetRandomReal(0, 360)
        const builderX = GetUnitX(commander) + 50 * math.cos((randomDegrees * math.pi) / 180)
        const builderY = GetUnitY(commander) + 50 * math.sin((randomDegrees * math.pi) / 180)
        context.builder = CreateUnit(Player(4), TOWER_BUILDER_UNIT_ID, builderX, builderY, bj_UNIT_FACING)
        broadcastAllPlayers("玩家5【建造专家】已出发！请全员前往河对岸守护魔法信号塔建造进程！")
        alertTowerBuildPoint(buildRect)
        IssueBuildOrderById(context.builder, SIGNAL_TOWER_UNIT_ID, GetRectCenterX(buildRect), GetRectCenterY(buildRect))

      const constructFinishTrigger = createTowerConstructFinishTrigger(context)
      const monitorTimer = CreateTimer()
      TimerStart(monitorTimer, 1.0, true, () => {
        const buildFinished = getGlobal<boolean>("udg_build_finish") === true
        if (buildFinished) {
          DestroyTimer(monitorTimer)
          return
        }
        if (!context.builder || !isUnitAlive(context.builder)) {
          destroyAllSignalTowers()
          pushQuestMessage("bj_QUESTMESSAGE_FAILED", "[穿云之信]——不！！！！我们没机会看到高塔建成的时刻了，现在只能背水一战，希望能撑到指挥官发现我们的窘境。可是我们不能把希望寄托于这种渺茫的可能，只有死战！")
          setQuestFailed(context.quest, true)
          awardHeroSelectGroup(1500, 10)
          DestroyTrigger(constructFinishTrigger)
          DestroyTimer(monitorTimer)
        }
      })
      DestroyTrigger(useTowerOrderTrigger)
    })
  })
  replaceGlobalTrigger("gg_trg_tower_task", rootTrigger)
}

/**
 * 迁移 vtu_task：
 * 与左日萘交互的三阶段支线（复仇 -> 祝福 -> 往生）。
 */
function registerVtuTaskTrigger(): void {
  disableLegacyTrigger("gg_trg_vtu_task")
  const rootTrigger = CreateTrigger()
  TriggerAddAction(rootTrigger, () => {
    const questHandle = createOptionalUndiscoveredQuest(
      "昨日旧爱",
      "昨日的旧爱，已成枯骨|n可她的灵魂，为何仍在滞留此地|n莫非仍有未解心愿？",
      "ReplaceableTextures\\CommandButtons\\BTNGreaterInvisibility.blp"
    )
    setQuestEnabled(questHandle, true)

    const ghost = getGlobal<unit>("gg_unit_n00W_0020")
    const targetRect = getGlobal<rect>("gg_rct_zuorinai")
    if (!ghost || !targetRect) {
      return
    }

    const discoverTrigger = CreateTrigger()
    registerEnterRectEvent(discoverTrigger, targetRect)
    TriggerAddAction(discoverTrigger, () => {
      const hero = GetTriggerUnit()
      if (!isMercenaryHero(hero)) {
        return
      }
      const owner = GetOwningPlayer(hero)
      if (!isUnitDetectedByPlayer(ghost, owner)) {
        DisplayTextToPlayer(owner, 0, 0, "这里怎么有一个房子，难不成有什么人隐居于此？")
        return
      }
      flashQuestDialogButton()
      pushQuestMessage("bj_QUESTMESSAGE_DISCOVERED", "[昨日旧爱]——左日萘【游魂】向雇佣兵发布了一项任务")
      DisplayTextToPlayer(owner, 0, 0, "左日萘：先生，您能看得见我？")
      runLater(3.0, () => DisplayTextToPlayer(owner, 0, 0, "左日萘：先生，您能帮我吗？我被那害虫掳掠至此，身死于此，不得与亲友相见，不知您能不能为我复仇"))
      setQuestDescription(questHandle, "昨日的旧爱，已成枯骨|n可她的灵魂，为何仍在滞留此地|n莫非仍有未解心愿？|n左日萘小姐表示，她希望看见那害虫的头颅，她要复仇，希望您能帮助她")
      setQuestDiscovered(questHandle, true)

      const revengeDoneTrigger = CreateTrigger()
      registerEnterRectEvent(revengeDoneTrigger, targetRect)
      TriggerAddAction(revengeDoneTrigger, () => {
        const visitor = GetTriggerUnit()
        if (!isMercenaryHero(visitor) || !findItemInInventory(visitor, VTU_REVENGE_ITEM_ID) || !isUnitDetectedByPlayer(ghost, GetOwningPlayer(visitor))) {
          return
        }
        removeInventoryItem(visitor, VTU_REVENGE_ITEM_ID)
        AddHeroXP(visitor, 3000, true)
        SetHeroStr(visitor, GetHeroStr(visitor, false) + 5, true)
        SetHeroAgi(visitor, GetHeroAgi(visitor, false) + 5, true)
        SetHeroInt(visitor, GetHeroInt(visitor, false) + 5, true)
        DisplayTextToPlayer(GetOwningPlayer(visitor), 0, 0, "左日萘为您的雇佣兵施加了祝福，雇佣兵的等级与属性获得提升")
        runLater(3.0, () => DisplayTextToPlayer(GetOwningPlayer(visitor), 0, 0, "左日萘：先生，我复仇的心愿已了，只可惜我的怨念太久太久，若是您能为我寻来能消除记忆的宝物，了却我的念想，以求往生，我将赠予你我最后的宝物。"))
        setQuestDescription(questHandle, "昨日的旧爱，已成枯骨|n可她的灵魂，为何仍在滞留此地|n莫非仍有未解心愿？|n左日萘小姐表示，她需要能使人忘记一切的宝物，希望您能为她找到")

        const finalStageTrigger = CreateTrigger()
        registerEnterRectEvent(finalStageTrigger, targetRect)
        TriggerAddAction(finalStageTrigger, () => {
          const finalHero = GetTriggerUnit()
          if (!isMercenaryHero(finalHero) || !findItemInInventory(finalHero, VTU_SOUP_ITEM_ID) || !isUnitDetectedByPlayer(ghost, GetOwningPlayer(finalHero))) {
            return
          }
          flashQuestDialogButton()
          pushQuestMessage("bj_QUESTMESSAGE_COMPLETED", "[昨日旧爱]——左日萘【游魂】：先生，感谢您的汤，这份汤很有效，这是赠与您的物品，接下来，我要喝下这份能让我往生的汤剂了，愿您能在战场上所向披靡")
          setQuestCompleted(questHandle, true)
          removeInventoryItem(finalHero, VTU_SOUP_ITEM_ID)
          const ritualEffect = AddSpecialEffect("Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualCaster.mdl", GetUnitX(ghost), GetUnitY(ghost))
          destroyEffectLater(ritualEffect, 2.0)

          let fadeStep = 0
          const fadeTimer = CreateTimer()
          TimerStart(fadeTimer, 0.25, true, () => {
            fadeStep++
            SetUnitVertexColor(ghost, 100, 100, 100, math.floor(fadeStep * 4.79))
            if (fadeStep >= 20) {
              ShowUnit(ghost, false)
              CreateItem(VTU_REWARD_ITEM_ID, GetUnitX(ghost), GetUnitY(ghost))
              DestroyTimer(fadeTimer)
            }
          })
          DestroyTrigger(finalStageTrigger)
        })
        DestroyTrigger(revengeDoneTrigger)
      })
      DestroyTrigger(discoverTrigger)
    })
  })
  replaceGlobalTrigger("gg_trg_vtu_task", rootTrigger)
}

/**
 * 迁移 ring_task：
 * 牧师遗失戒指支线（发现 -> 归还 -> 奖励契约）。
 */
function registerRingTaskTrigger(): void {
  disableLegacyTrigger("gg_trg_ring_task")
  const rootTrigger = CreateTrigger()
  TriggerAddAction(rootTrigger, () => {
    const questHandle = createOptionalUndiscoveredQuest(
      "遗失之戒",
      "派蒙曾在河滩对面的地域遗失了他的戒指，如果你能帮他找回戒指，他将奖励你",
      "ReplaceableTextures\\CommandButtons\\BTNSnapDragon.blp"
    )
    setQuestEnabled(questHandle, true)

    const baseRect = getGlobal<rect>("gg_rct_base_area")
    if (!baseRect) {
      return
    }

    const discoverTrigger = CreateTrigger()
    registerEnterRectEvent(discoverTrigger, baseRect)
    TriggerAddAction(discoverTrigger, () => {
      const hero = GetTriggerUnit()
      if (!isMercenaryHero(hero)) {
        return
      }
      flashQuestDialogButton()
      pushQuestMessage("bj_QUESTMESSAGE_DISCOVERED", "[遗失之戒]——随军牧师【派蒙】向雇佣兵发布了一项任务")
      setQuestDiscovered(questHandle, true)

      const completeTrigger = CreateTrigger()
      registerEnterRectEvent(completeTrigger, baseRect)
      TriggerAddAction(completeTrigger, () => {
        const visitor = GetTriggerUnit()
        const priest = getGlobal<unit>("gg_unit_H002_0119")
        if (!isMercenaryHero(visitor) || !priest || !isUnitAlive(priest) || !findItemInInventory(visitor, PRIEST_RING_ITEM_ID) || !findItemInInventory(priest, PRIEST_CONTRACT_ITEM_ID)) {
          return
        }
        flashQuestDialogButton()
        pushQuestMessage("bj_QUESTMESSAGE_COMPLETED", "[遗失之戒]——随军牧师【派蒙】:感谢你，尊敬的雇佣兵先生，你找到了我遗失的戒指，我将我与龙签署的契约赠予你，作为报酬")
        IssueTargetOrder(priest, "move", visitor)
        removeInventoryItem(priest, PRIEST_CONTRACT_ITEM_ID)
        removeInventoryItem(visitor, PRIEST_RING_ITEM_ID)
        UnitAddItem(visitor, CreateItem(PRIEST_REWARD_ITEM_ID, GetUnitX(visitor), GetUnitY(visitor)))
        UnitAddItem(priest, CreateItem(PRIEST_RING_ITEM_ID, GetUnitX(priest), GetUnitY(priest)))
        setQuestCompleted(questHandle, true)
        DestroyTrigger(completeTrigger)
      })
      DestroyTrigger(discoverTrigger)
    })
  })
  replaceGlobalTrigger("gg_trg_ring_task", rootTrigger)
}

/**
 * 迁移 fake_task：
 * 左门宝地探索链（发现 -> 冰火碎片 -> 绿宝石 -> 伪物奖励）。
 */
function registerFakeTaskTrigger(): void {
  disableLegacyTrigger("gg_trg_fake_task")
  const rootTrigger = CreateTrigger()
  TriggerAddAction(rootTrigger, () => {
    const questHandle = createOptionalUndiscoveredQuest(
      "伪物",
      "此地有灵，取其精华|n泉水之间，冰火交融|n绿意破碎，神人自现",
      "ReplaceableTextures\\CommandButtons\\BTNRockGolem.blp"
    )
    setQuestEnabled(questHandle, true)

    const leftGateRect = getGlobal<rect>("gg_rct_left_gate")
    if (!leftGateRect) {
      return
    }

    const discoverTrigger = CreateTrigger()
    registerEnterRectEvent(discoverTrigger, leftGateRect)
    TriggerAddAction(discoverTrigger, () => {
      if (!isMercenaryHero(GetTriggerUnit())) {
        return
      }
      flashQuestDialogButton()
      pushQuestMessage("bj_QUESTMESSAGE_DISCOVERED", "[伪物]——您的雇佣兵发现了一处宝地，需要在此进行探索")
      setQuestDiscovered(questHandle, true)

      const stageOneTrigger = CreateTrigger()
      registerPlayerUnitEventAll(stageOneTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM())
      TriggerAddAction(stageOneTrigger, () => {
        const hero = GetTriggerUnit()
        const itemTypeId = GetItemTypeId(GetManipulatedItem())
        if (!isMercenaryHero(hero) || (itemTypeId !== FAKE_ICE_ITEM_ID && itemTypeId !== FAKE_FIRE_ITEM_ID)) {
          return
        }
        pushQuestMessage("bj_QUESTMESSAGE_UPDATED", "[伪物]——是否需要将两种性质相反的力量融合起来，在哪才能实现呢？")

        const stageTwoTrigger = CreateTrigger()
        registerPlayerUnitEventAll(stageTwoTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM())
        TriggerAddAction(stageTwoTrigger, () => {
          const stageTwoHero = GetTriggerUnit()
          if (!isMercenaryHero(stageTwoHero) || GetItemTypeId(GetManipulatedItem()) !== FAKE_EMERALD_ITEM_ID) {
            return
          }
          pushQuestMessage("bj_QUESTMESSAGE_UPDATED", "[伪物]——冰火之泉之中，怎么样才能使用这块绿色的宝石呢？")

          const stageThreeTrigger = CreateTrigger()
          registerPlayerUnitEventAll(stageThreeTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM())
          TriggerAddAction(stageThreeTrigger, () => {
            const stageThreeHero = GetTriggerUnit()
            if (!isMercenaryHero(stageThreeHero) || GetItemTypeId(GetManipulatedItem()) !== FAKE_REWARD_ITEM_ID) {
              return
            }
            pushQuestMessage("bj_QUESTMESSAGE_COMPLETED", "[伪物]——您的雇佣兵击败了元蜃，获得冰火之宝")
            setQuestCompleted(questHandle, true)
            DestroyTrigger(stageThreeTrigger)
          })
          DestroyTrigger(stageTwoTrigger)
        })
        DestroyTrigger(stageOneTrigger)
      })
      DestroyTrigger(discoverTrigger)
    })
  })
  replaceGlobalTrigger("gg_trg_fake_task", rootTrigger)
}

/**
 * 迁移 tower_death：
 * 探子塔(h00P_0035)死亡时掉落蓝图(I03X)，并禁用自身触发器。
 */
function registerTowerDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_tower_death")
  const triggerHandle = CreateTrigger()
  const tower = getGlobal<unit>("gg_unit_h00P_0035")
  if (tower) {
    TriggerRegisterUnitEvent(triggerHandle, tower, EVENT_UNIT_DEATH())
  }
  TriggerAddAction(triggerHandle, () => {
    if (!tower) {
      return
    }
    CreateItem(TOWER_BLUEPRINT_ITEM_ID, GetUnitX(tower), GetUnitY(tower))
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_tower_death", triggerHandle)
}

/**
 * 迁移 task_init：
 * 初始化地图任务面板（守卫、指令、夜色、操练）。
 */
function registerTaskInitTrigger(): void {
  disableLegacyTrigger("gg_trg_task_init")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    createAndEnableQuest(
      true,
      true,
      "守卫",
      "镇守传送锚点，防止被敌人破坏！|n这是帝国与边境的连接点，若锚点被破坏，我们便如同无根之草，只能被敌人包围绞杀！",
      "ReplaceableTextures\\CommandButtons\\BTNIceCrownObelisk.blp"
    )
    createAndEnableQuest(
      true,
      true,
      "奖励点数与指令\n",
      "奖励点数系统|n击杀野怪与进攻敌军均会获得奖励点数，与等级相关，野怪提供的奖励有所衰减|n获得的奖励可在军情六处兑换相应装备和消耗品|n指令系统：|n-ms 显示雇佣兵速度|n-as 显示雇佣兵攻击速度|n-at 显示雇佣兵攻击间隔|n输入++可拉高视角|n输入--可拉低视角",
      "ReplaceableTextures\\CommandButtons\\BTNDarkPortal.blp"
    )
    createAndEnableQuest(
      true,
      true,
      "夜色",
      "在夜晚，敌人将会获得加强|n晨曦：小幅度增加攻击力、速度与魔抗|n暮色：增加攻击力、攻击速度与魔抗，小幅度增加移动速度|n极夜：大幅度增加攻击力、攻击速度与魔抗，增加移动速度",
      "ReplaceableTextures\\PassiveButtons\\PASBTNElunesBlessing.blp"
    )
    createAndEnableQuest(
      false,
      true,
      "操练",
      "营地左右各有怪物营地，雇佣兵可选择与野怪战斗，锻炼自身|n营地左右的怪物均有可能掉落升级宝石，可用于精炼装备|n越过河滩，野外会有更强大的怪物，获得宝石的概率也更高，雇佣兵谨慎前往！",
      "ReplaceableTextures\\CommandButtons\\BTNMassTeleport.blp"
    )
  })
  replaceGlobalTrigger("gg_trg_task_init", triggerHandle)
}

/**
 * 迁移 Emerald_use：
 * 在冰火泉使用绿宝石时触发召唤流程（一次性触发）。
 */
function registerEmeraldUseTrigger(): void {
  disableLegacyTrigger("gg_trg_Emerald_use")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const hero = GetTriggerUnit()
    const poolRect = getGlobal<rect>("gg_rct_swimmingpool")
    return IsUnitType(hero, UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === EMERALD_ITEM_ID && !!poolRect && isUnitInRect(poolRect, hero)
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const poolRect = getGlobal<rect>("gg_rct_swimmingpool")
    if (!poolRect) {
      return
    }
    RemoveItem(GetManipulatedItem())
    const useEffect = AddSpecialEffect("Abilities\\Spells\\Undead\\ReplenishMana\\SpiritTouchTarget.mdl", GetUnitX(hero), GetUnitY(hero))
    destroyEffectLater(useEffect, 0.5)
    DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "你的雇佣兵在泉水中捏碎了绿宝石，发生了什么？？？")
    runLater(3.0, () => {
      const reincarnEffect = AddSpecialEffect("Abilities\\Spells\\Orc\\Reincarnation\\ReincarnationTarget.mdl", GetRectCenterX(poolRect), GetRectCenterY(poolRect))
      destroyEffectLater(reincarnEffect, 3.0)
      runLater(3.0, () => {
        const doomEffect = AddSpecialEffect("Abilities\\Spells\\Other\\Doom\\DoomDeath.mdl", GetRectCenterX(poolRect), GetRectCenterY(poolRect))
        destroyEffectLater(doomEffect, 1.0)
        const summoned = CreateUnit(Player(PLAYER_NEUTRAL_AGGRESSIVE), SWIMMINGPOOL_BOSS_UNIT_ID, GetRectCenterX(poolRect), GetRectCenterY(poolRect), bj_UNIT_FACING)
        IssueImmediateOrder(summoned, "fanofknives")
      })
    })
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_Emerald_use", triggerHandle)
}

interface FireAndIceState {
  hero: unit
  timer: timer
  progress: number
}

/**
 * 迁移 fire_and_ice：
 * 英雄携带冰火碎片进入冰火泉后开始淬炼，完成后合成绿宝石碎片并随机附加加成。
 */
function registerFireAndIceTrigger(): void {
  disableLegacyTrigger("gg_trg_fire_and_ice")
  const triggerHandle = CreateTrigger()
  const poolRect = getGlobal<rect>("gg_rct_swimmingpool")
  if (poolRect) {
    registerEnterRectEvent(triggerHandle, poolRect)
  }
  TriggerAddCondition(triggerHandle, Condition(() => {
    const hero = GetTriggerUnit()
    return IsUnitType(hero, UNIT_TYPE_HERO()) && !!findItemInInventory(hero, FAKE_ICE_ITEM_ID) && !!findItemInInventory(hero, FAKE_FIRE_ITEM_ID)
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const targetRect = getGlobal<rect>("gg_rct_swimmingpool")
    if (!targetRect) {
      return
    }
    const state: FireAndIceState = {
      hero,
      timer: CreateTimer(),
      progress: 0
    }
    TimerStart(state.timer, 1.0, true, () => {
      const inPool = isUnitInRect(targetRect, state.hero)
      const hasIce = !!findItemInInventory(state.hero, FAKE_ICE_ITEM_ID)
      const hasFire = !!findItemInInventory(state.hero, FAKE_FIRE_ITEM_ID)

      if (!inPool) {
        DestroyTimer(state.timer)
        return
      }
      if (!hasIce || !hasFire) {
        state.progress = 0
        return
      }

      state.progress++
      DisplayTextToPlayer(GetOwningPlayer(state.hero), 0, 0, "冰火淬炼中—" + I2S(state.progress))
      if (state.progress < 5) {
        return
      }

      DisplayTextToPlayer(GetOwningPlayer(state.hero), 0, 0, "历经冰火之泉的淬炼，您的雇佣兵合成了绿宝石碎片")
      removeInventoryItem(state.hero, FAKE_FIRE_ITEM_ID)
      removeInventoryItem(state.hero, FAKE_ICE_ITEM_ID)
      const roll = GetRandomInt(1, 100)
      if (roll <= 47) {
        applyUnitBonus(state.hero, 0, 0, 300)
        DisplayTextToPlayer(GetOwningPlayer(state.hero), 0, 0, "历经冰火之泉的淬炼，您的雇佣兵获得了最大生命值提升——300")
      } else if (roll <= 94) {
        applyUnitBonus(state.hero, 2, 0, 7)
        DisplayTextToPlayer(GetOwningPlayer(state.hero), 0, 0, "历经冰火之泉的淬炼，您的雇佣兵获得了防御能力提升——7")
      } else {
        SetUnitState(state.hero, UNIT_STATE_ATTACK_SPACE(), GetUnitState(state.hero, UNIT_STATE_ATTACK_SPACE()) - 0.05)
        DisplayTextToPlayer(GetOwningPlayer(state.hero), 0, 0, "历经冰火之泉的淬炼，您的雇佣兵获得了攻击间隔下降——0.05")
      }
      UnitAddItem(state.hero, CreateItem(EMERALD_FRAGMENT_ITEM_ID, GetUnitX(state.hero), GetUnitY(state.hero)))
      DestroyTimer(state.timer)
    })
  })
  replaceGlobalTrigger("gg_trg_fire_and_ice", triggerHandle)
}

/**
 * 迁移 not_forget_me：
 * 愿忘(I03E)使用时递增层数并扣减三围，超阈值时概率破碎返还高额属性。
 */
function registerNotForgetMeTrigger(): void {
  disableLegacyTrigger("gg_trg_not_forget_me")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetItemTypeId(GetManipulatedItem()) === VTU_REWARD_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const itemHandle = GetManipulatedItem()
    const nextCharges = GetItemCharges(itemHandle) + 2
    SetItemCharges(itemHandle, nextCharges)

    AddHeroXP(hero, (GetHeroLevel(hero) + 1) * 47, true)
    reduceHeroPrimaryStats(hero, nextCharges)

    if (nextCharges === 10) {
      renameNotForgetMeItemToYuanWang()
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "愿忘已经到达临界状态")
    }

    if (nextCharges > 10 && GetRandomInt(1, 100) <= 34) {
      const bonusValue = math.floor((nextCharges * ((nextCharges * (nextCharges + 1)) / 2)) / 8)
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "愿忘破碎，您的雇佣兵获得了属性加成：" + I2S(bonusValue))
      SetHeroStr(hero, GetHeroStr(hero, false) + bonusValue, true)
      SetHeroAgi(hero, GetHeroAgi(hero, false) + bonusValue, true)
      SetHeroInt(hero, GetHeroInt(hero, false) + bonusValue, true)

      runLater(0.32, () => RemoveItem(itemHandle))
    }
  })
  replaceGlobalTrigger("gg_trg_not_forget_me", triggerHandle)
}

/**
 * 迁移 zuorinai：
 * 原图仅保留全局声明，未存在初始化/动作实现，显式空壳接管。
 */
function registerZuorinaiPlaceholderTrigger(): void {
  disableLegacyTrigger("gg_trg_zuorinai")
  const triggerHandle = CreateTrigger()
  replaceGlobalTrigger("gg_trg_zuorinai", triggerHandle)
}

/**
 * 迁移 tech_upgrade：
 * 每波后提升 7/8/9 号敌军科技。
 */
function registerTechUpgradeTrigger(): void {
  disableLegacyTrigger("gg_trg_tech_upgrade")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    for (const techId of TECH_PLAYER7_IDS) {
      AddPlayerTechResearched(Player(7), techId, 1)
    }
    for (const techId of TECH_PLAYER8_IDS) {
      AddPlayerTechResearched(Player(8), techId, 1)
    }
    for (const techId of TECH_PLAYER9_IDS) {
      AddPlayerTechResearched(Player(9), techId, 1)
    }
  })
  replaceGlobalTrigger("gg_trg_tech_upgrade", triggerHandle)
}

/**
 * 入口：迁移任务链与冰火泉相关触发器。
 */
export function migrateTaskQuestChainTriggers(): void {
  registerEmeraldGetTrigger()
  registerTowerDeathTrigger()
  registerTaskInitTrigger()
  registerTowerToBuildPlaceholderTrigger()
  registerTowerTaskTrigger()
  registerVtuTaskTrigger()
  registerRingTaskTrigger()
  registerFakeTaskTrigger()
  registerNotForgetMeTrigger()
  registerZuorinaiPlaceholderTrigger()
  registerEmeraldUseTrigger()
  registerFireAndIceTrigger()
  registerTechUpgradeTrigger()
}

import {
  FOG_OF_WAR_VISIBLE,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  PLAYER_STATE_GIVES_BOUNTY,
  PLAYER_STATE_RESOURCE_GOLD,
  PLAYER_STATE_RESOURCE_LUMBER,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { panCameraToRectCenterForPlayer } from "../core/camera"
import {
  countItemInInventory,
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  setGlobal
} from "../core/helpers"

const GEM_FRAGMENT_ITEM_ID = FourCC("I02R")
const GEM_RESULT_ITEM_ID = FourCC("I014")
const UPGRADE_GEM_ITEM_ID = FourCC("I00D")
const TEST_UPGRADE_GEM_COUNT = 30
const COMPLETE_EMERALD_ITEM_ID = FourCC("I03Z")
const MENGPO_SOUP_ITEM_ID = FourCC("I02Q")
const TASK_FLOW_READY_TREE_RESOURCE = 30
const TASK_FLOW_READY_STONE_RESOURCE = 20
const TEST_WILD_BOSS_DROP_ITEM_IDS = [
  FourCC("I034"), // 毁坏鳄铠（鳄鱼）
  FourCC("I03D"), // 伪物（元蜃）
  FourCC("I02U")  // 时间腐蚀之盾（亡心林夕之王）
]
const BASE_EQUIPMENT_ITEM_IDS = [
  FourCC("I005"), // 剑
  FourCC("I00U"), // 甲
  FourCC("I01L"), // 旗
  FourCC("I01J"), // 戒
  FourCC("I01S"), // 杖
  FourCC("I01Z"), // 弓
  FourCC("I010"), // 斧
  FourCC("I00H"), // 盾
  FourCC("I018")  // 盔
]
const POLISHED_EQUIPMENT_ROWS: number[][] = [
  // 剑系（含分支与后续蜕变）
  [FourCC("I005"), FourCC("I006"), FourCC("I007"), FourCC("I008"), FourCC("I009"), FourCC("I00A"), FourCC("I03T"), FourCC("I03U")],
  // 盾系（含分支）
  [FourCC("I00H"), FourCC("I00F"), FourCC("I00J"), FourCC("I00I"), FourCC("I00E"), FourCC("I03Q")],
  // 甲系（含双 lv6 分支）
  [FourCC("I00U"), FourCC("I00S"), FourCC("I00R"), FourCC("I00V"), FourCC("I00T"), FourCC("I00W"), FourCC("I042")],
  // 斧系（含 lv7 合成分支）
  [FourCC("I010"), FourCC("I00Z"), FourCC("I00X"), FourCC("I011"), FourCC("I012"), FourCC("I00Y")],
  // 战旗系（含 lv7 合成分支）
  [FourCC("I01L"), FourCC("I01M"), FourCC("I01N"), FourCC("I01O"), FourCC("I01P"), FourCC("I01Q")],
  // 弓系（含 lv4 -> lv5 分支）
  [FourCC("I01Z"), FourCC("I01X"), FourCC("I01Y"), FourCC("I021"), FourCC("I020")],
  // 盔系（含 lv4 双分支）
  [FourCC("I018"), FourCC("I015"), FourCC("I016"), FourCC("I017"), FourCC("I019"), FourCC("I01A")],
  // 罪人小刀系
  [FourCC("I023"), FourCC("I024"), FourCC("I025"), FourCC("I026"), FourCC("I027"), FourCC("I028"), FourCC("I022")],
  // 罪孽装备
  [FourCC("I02T"), FourCC("I040"), FourCC("I041")],
  // 戒指系
  [FourCC("I01J"), FourCC("I01H"), FourCC("I01K"), FourCC("I01G"), FourCC("I01I")],
  // 魔法书系
  [FourCC("I00L"), FourCC("I00M"), FourCC("I00N"), FourCC("I00O"), FourCC("I00K")],
  // 法杖系
  [FourCC("I01S"), FourCC("I01T"), FourCC("I01U"), FourCC("I01V"), FourCC("I01W")]
]
const TEST_CRAFT_MATERIAL_ITEM_IDS = [
  FourCC("I02R"), // 宝石碎片
  FourCC("I00D"), // 升级宝石
  FourCC("I014"), // 强化材料（碎片合成）
  FourCC("I035"), // 盾系分支材料
  FourCC("I036"), // 戒系分支材料
  FourCC("I037"), // 弓系分支材料
  FourCC("I038"), // 剑系分支材料
  FourCC("I01C"), // 盔系火山材料
  FourCC("I01E"), // 盔系雷霆材料
  FourCC("I01R"), // 旗系进阶材料
  FourCC("I03S"), // 进阶材料（多分支）
  FourCC("I043"), // 甲系终阶材料
  FourCC("I03F"), // 宝石兑换券
  FourCC("I00P"), // 魔法书草稿
  FourCC("I001"), // 硬币
  FourCC("I002"), // 灵魂
  FourCC("I003"), // 蚕食
  FourCC("I004"), // 复仇
  FourCC("I03R"), // 灵魂代币
  FourCC("I044"), // 蚕食代币
  FourCC("I045"), // 复仇代币
  FourCC("I046")  // 硬币代币
]
const PLAYER_GUIDE_UNIT_IDS = [
  FourCC("n00C"),
  FourCC("n00D"),
  FourCC("n00E"),
  FourCC("n00F")
]
const INIT_TEST_SANDBOX_GLOBAL = "udg_enable_migration_test_content"
let hasRegisteredGemFormula = false

/**
 * 是否启用开局测试内容（默认关闭，仅允许通过全局开关显式开启）。
 */
function isInitTestSandboxEnabled(): boolean {
  const enableFlag = getGlobal<boolean | number>(INIT_TEST_SANDBOX_GLOBAL)
  return enableFlag === true || enableFlag === 1
}

/**
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 从玩家当前单位中挑选用于引导的“小动物”单位：
 * - 优先匹配对应玩家的预设引导单位（n00C/n00D/n00E/n00F）；
 * - 其次优先营地区域内单位；
 * - 最后回退为离营地最近的非英雄、非建筑单位。
 */
function findGuideUnitForPlayer(whichPlayer: player, campRect: rect): unit | undefined {
  const playerId = GetPlayerId(whichPlayer)
  const preferredTypeId =
    playerId >= 0 && playerId < PLAYER_GUIDE_UNIT_IDS.length ? PLAYER_GUIDE_UNIT_IDS[playerId] : undefined
  const campX = GetRectCenterX(campRect)
  const campY = GetRectCenterY(campRect)
  const groupHandle = CreateGroup()
  GroupEnumUnitsOfPlayer(groupHandle, whichPlayer, Filter(() => {
    const candidate = GetFilterUnit()
    return isUnitAlive(candidate) && !IsUnitType(candidate, UNIT_TYPE_HERO()) && !IsUnitType(candidate, UNIT_TYPE_STRUCTURE())
  }))

  let preferredCandidate: unit | undefined
  let selectedInCamp: unit | undefined
  let selectedInCampDistance = 999999999.0
  let selectedNearCamp: unit | undefined
  let selectedNearCampDistance = 999999999.0
  while (true) {
    const candidate = FirstOfGroup(groupHandle)
    if (!candidate) {
      break
    }
    GroupRemoveUnit(groupHandle, candidate)
    const candidateTypeId = GetUnitTypeId(candidate)
    if (preferredTypeId !== undefined && candidateTypeId === preferredTypeId) {
      preferredCandidate = candidate
      if (rectContainsUnit(campRect, candidate)) {
        DestroyGroup(groupHandle)
        return candidate
      }
    }
    const dx = GetUnitX(candidate) - campX
    const dy = GetUnitY(candidate) - campY
    const distance = dx * dx + dy * dy
    if (rectContainsUnit(campRect, candidate) && distance < selectedInCampDistance) {
      selectedInCampDistance = distance
      selectedInCamp = candidate
    }
    if (distance < selectedNearCampDistance) {
      selectedNearCampDistance = distance
      selectedNearCamp = candidate
    }
  }
  DestroyGroup(groupHandle)
  return selectedInCamp ?? selectedNearCamp ?? preferredCandidate
}

/**
 * 为指定玩家自动选中引导单位，便于其立即移动到营地选英雄。
 */
function selectGuideUnitForPlayer(whichPlayer: player, guideUnit: unit): void {
  const selectSingle = getGlobal<(whichUnit: unit, playerHandle: player) => void>("SelectUnitForPlayerSingle")
  if (selectSingle) {
    selectSingle(guideUnit, whichPlayer)
    return
  }
  if (GetLocalPlayer() !== whichPlayer) {
    return
  }
  ClearSelection()
  SelectUnit(guideUnit, true)
}

/**
 * 创建并启动矩形可见度修正器。
 */
function startVisibleFogForPlayer(whichPlayer: player, whereRect: rect): void {
  const fog = CreateFogModifierRect(whichPlayer, FOG_OF_WAR_VISIBLE(), whereRect, false, false)
  FogModifierStart(fog)
}

/**
 * 判断单位是否在矩形中。
 */
function rectContainsUnit(whichRect: rect, whichUnit: unit): boolean {
  const x = GetUnitX(whichUnit)
  const y = GetUnitY(whichUnit)
  return x >= GetRectMinX(whichRect) && x <= GetRectMaxX(whichRect) && y >= GetRectMinY(whichRect) && y <= GetRectMaxY(whichRect)
}

/**
 * init 内部循环：保证关键单位持续回到基地，死亡后停止轮询。
 */
function registerInitGuardTimer(targetUnit: unit, baseRect: rect): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, 3.0, true, () => {
    if (!rectContainsUnit(baseRect, targetUnit)) {
      IssuePointOrder(targetUnit, "move", GetRectCenterX(baseRect), GetRectCenterY(baseRect))
    }
    if (!isUnitAlive(targetUnit)) {
      DestroyTimer(timerHandle)
    }
  })
}

/**
 * 原生实现 I02R*4 -> I014 的简易背包配方。
 */
function registerGemFormulaTrigger(): void {
  if (hasRegisteredGemFormula) {
    return
  }
  hasRegisteredGemFormula = true
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetItemTypeId(GetManipulatedItem()) === GEM_FRAGMENT_ITEM_ID && countItemInInventory(GetTriggerUnit(), GEM_FRAGMENT_ITEM_ID) >= 4
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    let removed = 0
    for (let slot = 0; slot < 6 && removed < 4; slot++) {
      const itemHandle = UnitItemInSlot(hero, slot)
      if (itemHandle && GetItemTypeId(itemHandle) === GEM_FRAGMENT_ITEM_ID) {
        RemoveItem(itemHandle)
        removed++
      }
    }
    UnitAddItem(hero, CreateItem(GEM_RESULT_ITEM_ID, GetUnitX(hero), GetUnitY(hero)))
  })
}

/**
 * 在传送锚点旁边投放测试道具：
 * - 30 个升级宝石；
 * - 全部基础装备（九大基础链起始件）；
 * - 全套关键合成材料。
 */
function spawnCraftTestItemsNearAnchor(): void {
  const anchor = getGlobal<unit>("gg_unit_n001_0012")
  if (!anchor) {
    print("Missing anchor unit: gg_unit_n001_0012")
    return
  }

  // 向锚点东侧偏移，避免与锚点本体重叠，便于测试拾取与合成。
  const centerX = GetUnitX(anchor) + 620.0
  const centerY = GetUnitY(anchor)
  const gemsPerRing = 15
  for (let i = 0; i < TEST_UPGRADE_GEM_COUNT; i++) {
    const ring = i < gemsPerRing ? 0 : 1
    const indexInRing = i % gemsPerRing
    const angleDeg = 360.0 * (indexInRing / gemsPerRing) + (ring === 1 ? 12.0 : 0.0)
    const radians = (angleDeg * math.pi) / 180.0
    const radius = ring === 0 ? 170.0 : 260.0
    const x = centerX + radius * math.cos(radians)
    const y = centerY + radius * math.sin(radians)
    CreateItem(UPGRADE_GEM_ITEM_ID, x, y)
  }

  for (let i = 0; i < BASE_EQUIPMENT_ITEM_IDS.length; i++) {
    const angleDeg = 360.0 * (i / BASE_EQUIPMENT_ITEM_IDS.length)
    const radians = (angleDeg * math.pi) / 180.0
    const radius = 360.0
    const x = centerX + radius * math.cos(radians)
    const y = centerY + radius * math.sin(radians)
    CreateItem(BASE_EQUIPMENT_ITEM_IDS[i], x, y)
  }

  const materialsPerRing = 12
  for (let i = 0; i < TEST_CRAFT_MATERIAL_ITEM_IDS.length; i++) {
    const ring = math.floor(i / materialsPerRing)
    const indexInRing = i % materialsPerRing
    const ringItemCount = math.min(materialsPerRing, TEST_CRAFT_MATERIAL_ITEM_IDS.length - ring * materialsPerRing)
    const angleDeg = 360.0 * (indexInRing / ringItemCount) + (ring % 2 === 1 ? 10.0 : 0.0)
    const radians = (angleDeg * math.pi) / 180.0
    const radius = 470.0 + ring * 95.0
    const x = centerX + radius * math.cos(radians)
    const y = centerY + radius * math.sin(radians)
    CreateItem(TEST_CRAFT_MATERIAL_ITEM_IDS[i], x, y)
  }

  // 任务链关键道具：完整绿宝石 + 孟婆汤（用于流程验证）。
  CreateItem(COMPLETE_EMERALD_ITEM_ID, centerX + 520.0, centerY + 120.0)
  CreateItem(MENGPO_SOUP_ITEM_ID, centerX + 560.0, centerY + 80.0)

  // 野外 Boss 掉落装备：集中投放到锚点附近，便于实测拾取与技能验证。
  for (let i = 0; i < TEST_WILD_BOSS_DROP_ITEM_IDS.length; i++) {
    const angleDeg = 360.0 * (i / TEST_WILD_BOSS_DROP_ITEM_IDS.length) + 25.0
    const radians = (angleDeg * math.pi) / 180.0
    const radius = 620.0
    const x = centerX + radius * math.cos(radians)
    const y = centerY + radius * math.sin(radians)
    CreateItem(TEST_WILD_BOSS_DROP_ITEM_IDS[i], x, y)
  }

  // 在锚点左侧按“每行一系”陈列已优化文案的装备链，便于对比与实机查验。
  const leftCenterX = GetUnitX(anchor) - 980.0
  const leftCenterY = GetUnitY(anchor)
  const rowSpacing = 180.0
  const colSpacing = 145.0
  const rowCount = POLISHED_EQUIPMENT_ROWS.length
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const rowItems = POLISHED_EQUIPMENT_ROWS[rowIndex]
    const rowY = leftCenterY + (((rowCount - 1) / 2) - rowIndex) * rowSpacing
    const rowWidth = (rowItems.length - 1) * colSpacing
    const rowStartX = leftCenterX - rowWidth / 2
    for (let colIndex = 0; colIndex < rowItems.length; colIndex++) {
      const x = rowStartX + colIndex * colSpacing
      CreateItem(rowItems[colIndex], x, rowY)
    }
  }
}

/**
 * 准备任务流程资源：直接补齐“银树木材/金石矿材”到可提交门槛。
 */
function prepareTaskFlowResources(): void {
  setGlobal("udg_tree_num", TASK_FLOW_READY_TREE_RESOURCE)
  setGlobal("udg_stone_num", TASK_FLOW_READY_STONE_RESOURCE)
}

/**
 * init：
 * 地图开局资源、镜头、可见度、关键单位状态与配方初始化。
 */
function registerInitTrigger(): void {
  disableLegacyTrigger("gg_trg_init")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 0.01, false)
  TriggerAddAction(triggerHandle, () => {
    const lightDayUnit = getGlobal<unit>("gg_unit_e00A_0205")
    if (lightDayUnit) {
      ShowUnit(lightDayUnit, false)
      SetUnitInvulnerable(lightDayUnit, true)
      SetWidgetLife(lightDayUnit, GetUnitState(lightDayUnit, UNIT_STATE_MAX_LIFE()) * 0.01)
      setGlobal("udg_lightdayhp", GetUnitState(lightDayUnit, UNIT_STATE_LIFE()))
    }

    displayTextToMercenaryPlayers("敌人正在整军，你们还有一坤分的整备时间！！！")

    // 默认关闭开局测试投放，避免正式局污染流程/联机不同步风险。
    setGlobal(INIT_TEST_SANDBOX_GLOBAL, 0)
    registerGemFormulaTrigger()
    if (isInitTestSandboxEnabled()) {
      spawnCraftTestItemsNearAnchor()
      prepareTaskFlowResources()
    }

    SetPlayerTechResearched(Player(4), FourCC("Rhse"), 1)
    SetPlayerState(Player(10), PLAYER_STATE_GIVES_BOUNTY(), 1)
    SetPlayerState(Player(11), PLAYER_STATE_GIVES_BOUNTY(), 1)

    const cameraRect = getGlobal<rect>("gg_rct________________0010")
    if (cameraRect) {
      for (let i = 0; i < 4; i++) {
        const playerHandle = Player(i)
        panCameraToRectCenterForPlayer(playerHandle, cameraRect)
        const guideUnit = findGuideUnitForPlayer(playerHandle, cameraRect)
        if (guideUnit) {
          selectGuideUnitForPlayer(playerHandle, guideUnit)
        }
      }
    }

    const lightArea = getGlobal<rect>("gg_rct_light_area")
    if (lightArea) {
      startVisibleFogForPlayer(Player(0), lightArea)
      startVisibleFogForPlayer(Player(1), lightArea)
      startVisibleFogForPlayer(Player(2), lightArea)
      startVisibleFogForPlayer(Player(3), lightArea)
      startVisibleFogForPlayer(Player(7), lightArea)
      startVisibleFogForPlayer(Player(8), lightArea)
      startVisibleFogForPlayer(Player(9), lightArea)
      startVisibleFogForPlayer(Player(11), lightArea)
    }

    const ydht = getGlobal<hashtable>("YDHT")
    if (ydht) {
      SaveBoolean(ydht, FourCC("I00P"), 0x641FDAD7, false)
      SaveBoolean(ydht, FourCC("I00Q"), 0xFE68AB44, false)
      SaveBoolean(ydht, FourCC("I00G"), 0x75A1C0CB, false)
    }

    const coreHero = getGlobal<unit>("gg_unit_H002_0119")
    if (coreHero) {
      SetHeroLevel(coreHero, 49, false)
      SuspendHeroXP(coreHero, true)
      UnitAddItem(coreHero, CreateItem(FourCC("I00B"), GetUnitX(coreHero), GetUnitY(coreHero)))
      for (let i = 0; i < 5; i++) {
        UnitAddItem(coreHero, CreateItem(FourCC("I00G"), GetUnitX(coreHero), GetUnitY(coreHero)))
      }
    }

    for (let i = 0; i < 4; i++) {
      const playerHandle = Player(i)
      SetPlayerState(playerHandle, PLAYER_STATE_RESOURCE_GOLD(), 250)
      SetPlayerState(playerHandle, PLAYER_STATE_RESOURCE_LUMBER(), 5)
    }

    const baseRect = getGlobal<rect>("gg_rct_base_area")
    if (coreHero && baseRect) {
      registerInitGuardTimer(coreHero, baseRect)
    }
  })
  replaceGlobalTrigger("gg_trg_init", triggerHandle)
}

/**
 * 入口：迁移 init 触发器。
 */
export function migrateInitTrigger(): void {
  registerInitTrigger()
}





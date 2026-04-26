import { EQUAL, GAME_STATE_TIME_OF_DAY, UNIT_TYPE_DEAD, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { getNightDurationByDifficulty } from "./dayNightConfig"
import {
  SYNC_GROUP_3,
  SYNC_GROUP_4,
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  replaceGlobalTrigger,
  setGlobal,
  toSyncInt
} from "../core/helpers"

const NIGHT_TOTEM_UNIT_ID = FourCC("n018")
const NIGHT_AURA_BUFF_ID = FourCC("B003")
const NIGHT_AURA_BONUS_ABILITY_ID = FourCC("A08V")

/**
 * 同步夜晚光环加成。
 * 
 * 加固：
 * 1. 使用 SYNC_GROUP_3 / 4 预分配组，杜绝 Handle ID 分叉。
 * 2. 使用 toSyncInt 确保跨端判定一致。
 */
function syncNightAura(): void {
  const ydht = getGlobal<hashtable>("udg_YDHT")
  const totem = getGlobal<unit>("udg_Night_Totem")
  const affectedGroup = getGlobal<group>("udg_Night_Affected_Group")
  const forceDay = getGlobal<boolean>("udg_force_day") === true

  if (!totem || !affectedGroup) return

  const tx = GetUnitX(totem)
  const ty = GetUnitY(totem)
  const radius = 1200.0

  // 【加固】使用全服同步池
  GroupClear(SYNC_GROUP_3)
  GroupEnumUnitsInRange(SYNC_GROUP_3, tx, ty, radius, null)

  // 1. 先找出当前在范围内的合法单位
  GroupClear(SYNC_GROUP_4)
  ForGroup(SYNC_GROUP_3, () => {
    const enumUnit = GetEnumUnit()
    if (
      GetWidgetLife(enumUnit) > 0.405 &&
      !IsUnitType(enumUnit, UNIT_TYPE_DEAD()) &&
      GetUnitAbilityLevel(enumUnit, NIGHT_AURA_BUFF_ID) > 0 &&
      !forceDay
    ) {
      GroupAddUnit(SYNC_GROUP_4, enumUnit)
    }
  })

  // 2. 遍历之前受影响的组，如果不在新组里了，则移除加成
  // 使用同步转移逻辑，避免在迭代中修改
  ForGroup(affectedGroup, () => {
    const unitInOldGroup = GetEnumUnit()
    if (!IsUnitInGroup(unitInOldGroup, SYNC_GROUP_4)) {
      UnitRemoveAbility(unitInOldGroup, NIGHT_AURA_BONUS_ABILITY_ID)
      GroupRemoveUnit(affectedGroup, unitInOldGroup)
    }
  })

  // 3. 遍历新组，如果不在旧组里，则添加加成
  ForGroup(SYNC_GROUP_4, () => {
    const unitInNewGroup = GetEnumUnit()
    if (!IsUnitInGroup(unitInNewGroup, affectedGroup)) {
      UnitAddAbility(unitInNewGroup, NIGHT_AURA_BONUS_ABILITY_ID)
      GroupAddUnit(affectedGroup, unitInNewGroup)
    }
  })

  GroupClear(SYNC_GROUP_3)
  GroupClear(SYNC_GROUP_4)
}

/**
 * 启动夜晚阶段逻辑。
 */
function startNightPhase(triggerHandle: trigger, level: number): void {
  const duration = getNightDurationByDifficulty(level)
  setGlobal("udg_Night_Phase_Active", true)
  setGlobal("udg_force_day", false)
  
  // 初始化夜之图腾
  const totemRect = getGlobal<rect>("gg_rct_____________11a")
  if (totemRect) {
    const totem = CreateUnit(Player(PLAYER_NEUTRAL_PASSIVE), NIGHT_TOTEM_UNIT_ID, GetRectCenterX(totemRect), GetRectCenterY(totemRect), 270.0)
    setGlobal("udg_Night_Totem", totem)
    SetUnitAbilityLevel(totem, NIGHT_AURA_BONUS_ABILITY_ID, level)
  }

  // 创建全员同步的受影响单位组
  const affectedGroup = CreateGroup()
  setGlobal("udg_Night_Affected_Group", affectedGroup)

  // 启动同步光环计时器
  const auraTimer = CreateTimer()
  setGlobal("udg_Night_Aura_Timer", auraTimer)
  TimerStart(auraTimer, 0.5, true, () => syncNightAura())

  // 设置时间
  SetTimeOfDayScale(0.0)
  SuspendTimeOfDay(true)
  SetTimeOfDay(0.0)

  displayTextToMercenaryPlayers("|cff0000ff黑夜降临... 潜伏在阴影中的威胁增强了。|r")

  const mainTimer = CreateTimer()
  setGlobal("udg_Night_Timer", mainTimer)
  const dialog = CreateTimerDialog(mainTimer)
  TimerDialogSetTitle(dialog, "距黎明来临还有")
  TimerDialogDisplay(dialog, true)
  setGlobal("udg_Night_Timer_Window", dialog)

  TimerStart(mainTimer, I2R(toSyncInt(duration)), false, () => {
    setGlobal("udg_Night_Phase_Active", false)
    const totem = getGlobal<unit>("udg_Night_Totem")
    if (totem) {
      RemoveUnit(totem)
      setGlobal("udg_Night_Totem", null)
    }
    
    // 清理所有加成
    const affected = getGlobal<group>("udg_Night_Affected_Group")
    if (affected) {
      ForGroup(affected, () => {
        UnitRemoveAbility(GetEnumUnit(), NIGHT_AURA_BONUS_ABILITY_ID)
      })
      DestroyGroup(affected)
      setGlobal("udg_Night_Affected_Group", null)
    }

    const timer = getGlobal<timer>("udg_Night_Aura_Timer")
    if (timer) {
      DestroyTimer(timer)
      setGlobal("udg_Night_Aura_Timer", null)
    }

    TimerDialogDisplay(dialog, false)
    DestroyTimerDialog(dialog)
    DestroyTimer(mainTimer)

    SetTimeOfDayScale(1.0)
    SuspendTimeOfDay(false)
    SetTimeOfDay(11.98)
  })
}

/**
 * 外部入口：立即开始夜晚阶段。
 */
export function beginNightPhaseNow(level: number): void {
  const triggerHandle = getGlobal<trigger>("gg_trg_night_come")
  if (triggerHandle) {
    startNightPhase(triggerHandle, level)
  }
}

function registerNightComeTrigger(): void {
  disableLegacyTrigger("gg_trg_night_come")
  const triggerHandle = CreateTrigger()
  TriggerRegisterGameStateEvent(triggerHandle, GAME_STATE_TIME_OF_DAY, EQUAL, 0.0)
  TriggerAddAction(triggerHandle, () => {
    const difficulty = getGlobal<number>("udg_difficulty_level") ?? 1
    startNightPhase(triggerHandle, difficulty)
  })
  replaceGlobalTrigger("gg_trg_night_come", triggerHandle)
}

export function migrateNightComeTrigger(): void {
  registerNightComeTrigger()
}

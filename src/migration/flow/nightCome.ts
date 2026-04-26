import { EQUAL, GAME_STATE_TIME_OF_DAY, PLAYER_NEUTRAL_PASSIVE, UNIT_TYPE_DEAD, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
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
 */
function syncNightAura(): void {
  const totem = getGlobal<unit>("udg_Night_Totem")
  const affectedGroup = getGlobal<group>("udg_Night_Affected_Group")
  const forceDay = getGlobal<boolean>("udg_force_day") === true

  if (!totem || !affectedGroup) return

  const tx = GetUnitX(totem)
  const ty = GetUnitY(totem)
  const radius = 1200.0

  GroupClear(SYNC_GROUP_3)
  GroupEnumUnitsInRange(SYNC_GROUP_3, tx, ty, radius, null)

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

  ForGroup(affectedGroup, () => {
    const u = GetEnumUnit()
    if (!IsUnitInGroup(u, SYNC_GROUP_4)) {
      UnitRemoveAbility(u, NIGHT_AURA_BONUS_ABILITY_ID)
      GroupRemoveUnit(affectedGroup, u)
    }
  })

  ForGroup(SYNC_GROUP_4, () => {
    const u = GetEnumUnit()
    if (!IsUnitInGroup(u, affectedGroup)) {
      UnitAddAbility(u, NIGHT_AURA_BONUS_ABILITY_ID)
      GroupAddUnit(affectedGroup, u)
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
  
  const totemRect = getGlobal<rect>("gg_rct_____________11a")
  if (totemRect) {
    const totem = CreateUnit(Player(PLAYER_NEUTRAL_PASSIVE), NIGHT_TOTEM_UNIT_ID, GetRectCenterX(totemRect), GetRectCenterY(totemRect), 270.0)
    setGlobal("udg_Night_Totem", totem)
    SetUnitAbilityLevel(totem, NIGHT_AURA_BONUS_ABILITY_ID, level)
  }

  const affectedGroup = CreateGroup()
  setGlobal("udg_Night_Affected_Group", affectedGroup)

  const auraTimer = CreateTimer()
  setGlobal("udg_Night_Aura_Timer", auraTimer)
  TimerStart(auraTimer, 0.5, true, () => syncNightAura())

  // 设置同步时间
  SetTimeOfDayScale(0.0)
  SuspendTimeOfDay(true)
  SetFloatGameState(GAME_STATE_TIME_OF_DAY(), 0.0)

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
    
    const affected = getGlobal<group>("udg_Night_Affected_Group")
    if (affected) {
      ForGroup(affected, () => UnitRemoveAbility(GetEnumUnit(), NIGHT_AURA_BONUS_ABILITY_ID))
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
    SetFloatGameState(GAME_STATE_TIME_OF_DAY(), 11.98)
  })
}

export function beginNightPhaseNow(level: number): void {
  const triggerHandle = getGlobal<trigger>("gg_trg_night_come")
  if (triggerHandle) {
    startNightPhase(triggerHandle, level)
  }
}

function registerNightComeTrigger(): void {
  disableLegacyTrigger("gg_trg_night_come")
  const triggerHandle = CreateTrigger()
  // 【修复】强行转换类型以适配原生接口，确保午夜事件同步注册
  TriggerRegisterGameStateEvent(triggerHandle, (GAME_STATE_TIME_OF_DAY() as any) as gamestate, EQUAL(), 0.0)
  TriggerAddAction(triggerHandle, () => {
    const difficulty = getGlobal<number>("udg_difficulty_level") ?? 1
    startNightPhase(triggerHandle, difficulty)
  })
  replaceGlobalTrigger("gg_trg_night_come", triggerHandle)
}

export function migrateNightComeTrigger(): void {
  registerNightComeTrigger()
}

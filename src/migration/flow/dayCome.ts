import { EQUAL, GAME_STATE_TIME_OF_DAY } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { getDayDurationByDifficulty } from "./dayNightConfig"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger, setGlobal } from "../core/helpers"

const DAY_TIME_FLAG_KEY = 0x767B29CC
const DAY_TIMER_GLOBAL = "udg_Day_Timer"

/**
 * 写入“时间”状态到 YDHT：true=白昼，false=黑夜。
 */
function setTimeStateIsDay(isDay: boolean): void {
  const ydht = getGlobal<hashtable>("YDHT")
  if (ydht) {
    SaveBoolean(ydht, StringHash("时间"), DAY_TIME_FLAG_KEY, isDay)
  }
}

/**
 * 兼容调用 UseTimeOfDayBJ，不存在时回退到 SuspendTimeOfDay。
 */
function setTimeFlowEnabled(enabled: boolean): void {
  const useTimeOfDayBJ = getGlobal<(enable: boolean) => void>("UseTimeOfDayBJ")
  if (useTimeOfDayBJ) {
    useTimeOfDayBJ(enabled)
  }
  // 双保险：同时直调原生接口，避免旧 BJ 包装未生效导致时间仍被冻结。
  SuspendTimeOfDay(!enabled)
}

function destroyTimerDialogSafe(dialog: timerdialog | undefined): void {
  if (!dialog) {
    return
  }
  TimerDialogDisplay(dialog, false)
  DestroyTimerDialog(dialog)
}

function destroyTimerSafe(timerHandle: timer | undefined): void {
  if (!timerHandle) {
    return
  }
  DestroyTimer(timerHandle)
}

function cleanupDayState(): void {
  const dayTimer = getGlobal<timer>(DAY_TIMER_GLOBAL)
  destroyTimerSafe(dayTimer)
  setGlobal(DAY_TIMER_GLOBAL, undefined)
}

/**
 * 清理上一段夜晚残留（夜之图腾、夜幕加成同步计时器、倒计时面板等）。
 */
function cleanupNightState(): void {
  const nightAuraTimer = getGlobal<timer>("udg_Night_Aura_Timer")
  const nightTimer = getGlobal<timer>("udg_Night_Timer")
  const nightEndTimer = getGlobal<timer>("udg_Night_Timer_End")
  const nightDialog = getGlobal<timerdialog>("udg_Night_Timer_Dialog")
  const nightTotem = getGlobal<unit>("udg_Night_Totem")
  const affectedGroup = getGlobal<group>("udg_Night_Affected_Group")

  if (nightAuraTimer) {
    DestroyTimer(nightAuraTimer)
  }
  if (affectedGroup) {
    // 仅销毁容器；每个单位的 A0AD 移除由 nightCome 的 syncNightAura 在 force_day/死亡时清空，
    // 这里作为兜底直接清空 group。
    while (true) {
      const current = FirstOfGroup(affectedGroup)
      if (!current) {
        break
      }
      GroupRemoveUnit(affectedGroup, current)
      UnitRemoveAbility(current, FourCC("A0AD"))
    }
    DestroyGroup(affectedGroup)
  }
  if (nightTotem) {
    RemoveUnit(nightTotem)
  }

  destroyTimerDialogSafe(nightDialog)
  destroyTimerSafe(nightTimer)
  destroyTimerSafe(nightEndTimer)

  setGlobal("udg_Night_Aura_Timer", undefined)
  setGlobal("udg_Night_Timer", undefined)
  setGlobal("udg_Night_Timer_End", undefined)
  setGlobal("udg_Night_Timer_Dialog", undefined)
  setGlobal("udg_Night_Totem", undefined)
  setGlobal("udg_Night_Affected_Group", undefined)
}

/**
 * day_come：
 * - 正午触发：写入白昼标记，清理上一段夜晚残留；
 * - 固定跳变模式：暂停昼夜时间流动，用真实计时器控制切入黑夜。
 */
function registerDayComeTrigger(): void {
  disableLegacyTrigger("gg_trg_day_come")
  const triggerHandle = CreateTrigger()
  // 与原图一致：12:00 进入白天阶段。
  TriggerRegisterGameStateEvent(triggerHandle, GAME_STATE_TIME_OF_DAY(), EQUAL(), 12.0)
  TriggerAddAction(triggerHandle, () => {
    DisableTrigger(triggerHandle)
    cleanupDayState()
    setTimeStateIsDay(true)
    setGlobal("udg_Night_Phase_Active", false)
    cleanupNightState()

    const difficulty = getGlobal<number>("udg_difficulty") ?? 1
    const dayDuration = getDayDurationByDifficulty(difficulty)
    SetTimeOfDayScale(0.0)
    setTimeFlowEnabled(false)
    setGlobal("udg_TimeOfDayScale", 0.0)

    const dayTimer = CreateTimer()
    setGlobal(DAY_TIMER_GLOBAL, dayTimer)
    TimerStart(dayTimer, dayDuration, false, () => {
      cleanupDayState()
      SetTimeOfDayScale(1.0)
      setTimeFlowEnabled(true)
      setGlobal("udg_TimeOfDayScale", 1.0)
      SetFloatGameState(GAME_STATE_TIME_OF_DAY(), 23.98)
      EnableTrigger(triggerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_day_come", triggerHandle)
}

/**
 * 入口：迁移 day_come 触发器。
 */
export function migrateDayComeTrigger(): void {
  registerDayComeTrigger()
}





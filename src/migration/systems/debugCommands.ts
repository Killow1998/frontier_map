import { GAME_STATE_TIME_OF_DAY } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, getGlobal, registerPlayerChatEventAll, replaceGlobalTrigger } from "../core/helpers"

interface TimedDebugTriggerConfig {
  globalName: string
  chatCommand: string
  targetTriggerGlobal: string
  disableAfter?: boolean
  requireTestSwitch?: boolean
}

interface SimpleDebugTriggerConfig {
  globalName: string
  chatCommand: string
  action: (triggerPlayer: player) => void
  requireTestSwitch?: boolean
}

const timeDebugTimerByPlayerId: Record<number, timer | undefined> = {}
const TEST_COMMAND_SWITCH_GLOBAL = "udg_enable_migration_test_content"

/**
 * 延迟执行一个回调。
 */
function runLater(delay: number, callback: () => void): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    callback()
    DestroyTimer(timerHandle)
  })
}

function isTestCommandEnabled(): boolean {
  const enabled = getGlobal<boolean | number>(TEST_COMMAND_SWITCH_GLOBAL)
  return enabled === true || enabled === 1
}

function rejectDisabledTestCommand(triggerPlayer: player): void {
  DisplayTextToPlayer(triggerPlayer, 0, 0, "测试命令未开启")
}

/**
 * 迁移一类“聊天后延迟执行目标触发器”的调试指令。
 */
function registerTimedDebugTrigger(config: TimedDebugTriggerConfig): void {
  disableLegacyTrigger(config.globalName)
  const triggerHandle = CreateTrigger()
  TriggerRegisterPlayerChatEvent(triggerHandle, Player(0), config.chatCommand, true)
  TriggerAddAction(triggerHandle, () => {
    if (config.requireTestSwitch === true && !isTestCommandEnabled()) {
      rejectDisabledTestCommand(GetTriggerPlayer())
      return
    }
    const targetTrigger = getGlobal<trigger>(config.targetTriggerGlobal)
    if (!targetTrigger) {
      print("[migration] Missing required trigger: " + config.targetTriggerGlobal)
      return
    }
    runLater(2, () => {
      TriggerExecute(targetTrigger)
    })

    if (config.disableAfter !== false) {
      DisableTrigger(triggerHandle)
    }
  })
  replaceGlobalTrigger(config.globalName, triggerHandle)
}

/**
 * 迁移一类普通调试聊天指令。
 */
function registerSimpleDebugTrigger(config: SimpleDebugTriggerConfig): void {
  disableLegacyTrigger(config.globalName)
  const triggerHandle = CreateTrigger()
  registerPlayerChatEventAll(triggerHandle, config.chatCommand, true)
  TriggerAddAction(triggerHandle, () => {
    if (config.requireTestSwitch === true && !isTestCommandEnabled()) {
      rejectDisabledTestCommand(GetTriggerPlayer())
      return
    }
    config.action(GetTriggerPlayer())
  })
  replaceGlobalTrigger(config.globalName, triggerHandle)
}

/**
 * 关闭战争迷雾与黑幕。
 */
function disableFog(): void {
  const fogMaskEnableOff = getGlobal<() => void>("FogMaskEnableOff")
  const fogEnableOff = getGlobal<() => void>("FogEnableOff")
  if (fogMaskEnableOff) {
    fogMaskEnableOff()
  }
  if (fogEnableOff) {
    fogEnableOff()
  }
}

/**
 * 兼容设置时间开关与时刻。
 */
function setTimeOfDayState(hour: number): void {
  const useTimeOfDayBJ = getGlobal<(enabled: boolean) => void>("UseTimeOfDayBJ")
  const setTimeOfDay = getGlobal<(value: number) => void>("SetTimeOfDay")
  if (useTimeOfDayBJ) {
    useTimeOfDayBJ(true)
  }
  SuspendTimeOfDay(false)
  if (setTimeOfDay) {
    setTimeOfDay(hour)
  }
}

/**
 * 输出当前真实时间与流速，便于定位“UI 显示 0:00 但时间是否实际在走”。
 */
function printTimeDebugSnapshot(receiver: player): void {
  const tod = GetFloatGameState(GAME_STATE_TIME_OF_DAY())
  const scale = GetTimeOfDayScale()
  DisplayTimedTextToPlayer(receiver, 0, 0, 2.0, `TOD=${R2S(tod)}  SCALE=${R2S(scale)}`)
}
function formatBool(value: boolean | undefined): string {
  return value === true ? "true" : "false"
}

function getTimerRemainingSeconds(timerName: string): number {
  const timerHandle = getGlobal<timer>(timerName)
  const timerGetRemaining = getGlobal<(whichTimer: timer) => number>("TimerGetRemaining")
  if (!timerHandle || !timerGetRemaining) {
    return -1.0
  }
  return timerGetRemaining(timerHandle)
}

function printDayNightDebugSnapshot(receiver: player): void {
  const tod = GetFloatGameState(GAME_STATE_TIME_OF_DAY())
  const scale = GetTimeOfDayScale()
  const difficulty = getGlobal<number>("udg_difficulty") ?? 0
  const nightActive = getGlobal<boolean>("udg_Night_Phase_Active")
  const forceDay = getGlobal<boolean>("udg_force_day")
  const dayRemaining = getTimerRemainingSeconds("udg_Day_Timer")
  const nightRemaining = getTimerRemainingSeconds("udg_Night_Timer")
  const message =
    `DN difficulty=${I2S(difficulty)} TOD=${R2S(tod)} SCALE=${R2S(scale)} ` +
    `nightActive=${formatBool(nightActive)} forceDay=${formatBool(forceDay)} ` +
    `dayLeft=${R2S(dayRemaining)} nightLeft=${R2S(nightRemaining)}`
  print(message)
  DisplayTimedTextToPlayer(receiver, 0, 0, 4.0, message)
}

/**
 * 切换时间调试输出（每秒打印一次）。
 */
function toggleTimeDebug(receiver: player): void {
  const playerId = GetPlayerId(receiver)
  const existingTimer = timeDebugTimerByPlayerId[playerId]
  if (existingTimer) {
    DestroyTimer(existingTimer)
    timeDebugTimerByPlayerId[playerId] = undefined
    DisplayTimedTextToPlayer(receiver, 0, 0, 2.0, "时间调试已关闭")
    return
  }
  const timerHandle = CreateTimer()
  timeDebugTimerByPlayerId[playerId] = timerHandle
  DisplayTimedTextToPlayer(receiver, 0, 0, 2.0, "时间调试已开启（每秒输出昼夜状态）")
  TimerStart(timerHandle, 1.0, true, () => {
    printDayNightDebugSnapshot(receiver)
  })
}

/**
 * 入口：迁移 debug_boss3~7、debug_am、debug_light、debug_lightoff、debug_success、debug_final_run。
 */
export function migrateDebugCommandsTriggers(): void {
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_boss3",
    chatCommand: "-test arrow",
    targetTriggerGlobal: "gg_trg_Arrow_Shooter",
    requireTestSwitch: true
  })
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_boss4",
    chatCommand: "-test slime",
    targetTriggerGlobal: "gg_trg_Slime",
    requireTestSwitch: true
  })
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_boss5",
    chatCommand: "-test seagod",
    targetTriggerGlobal: "gg_trg_Sea_God",
    requireTestSwitch: true
  })
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_boss6",
    chatCommand: "-test captain",
    targetTriggerGlobal: "gg_trg_Captain",
    requireTestSwitch: true
  })
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_boss7",
    chatCommand: "-test mana",
    targetTriggerGlobal: "gg_trg_Mana_ruin",
    requireTestSwitch: true
  })

  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_am",
    chatCommand: "-allmap",
    action: () => {
      disableFog()
    },
    requireTestSwitch: true
  })
  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_light",
    chatCommand: "-lighton",
    action: () => {
      setTimeOfDayState(11.98)
    },
    requireTestSwitch: true
  })
  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_lightoff",
    chatCommand: "-lightoff",
    action: () => {
      setTimeOfDayState(23.98)
    },
    requireTestSwitch: true
  })
  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_tod",
    chatCommand: "-tod",
    action: (triggerPlayer) => {
      toggleTimeDebug(triggerPlayer)
    }
  })
  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_tod_once",
    chatCommand: "-tod1",
    action: (triggerPlayer) => {
      printDayNightDebugSnapshot(triggerPlayer)
    }
  })

  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_daynight_once",
    chatCommand: "-dn1",
    action: (triggerPlayer) => {
      printDayNightDebugSnapshot(triggerPlayer)
    }
  })
  registerSimpleDebugTrigger({
    globalName: "gg_trg_debug_daynight",
    chatCommand: "-dn",
    action: (triggerPlayer) => {
      toggleTimeDebug(triggerPlayer)
    }
  })
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_success",
    chatCommand: "-test_success",
    targetTriggerGlobal: "gg_trg_mission_success",
    disableAfter: false,
    requireTestSwitch: true
  })
  registerTimedDebugTrigger({
    globalName: "gg_trg_debug_final_run",
    chatCommand: "-test final",
    targetTriggerGlobal: "gg_trg_final_round_remake",
    disableAfter: false,
    requireTestSwitch: true
  })
}



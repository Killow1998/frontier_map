import { GAME_STATE_TIME_OF_DAY, MAP_CONTROL_USER, PLAYER_SLOT_STATE_PLAYING } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, displayTextToMercenaryPlayers, getGlobal, replaceGlobalTrigger, setGlobal } from "../core/helpers"
import { beginNightPhaseNow } from "./nightCome"


const DIFFICULTY_DIALOG_TITLE = "难度选取"
const FIRST_NIGHT_TIMER_TITLE = "距黎明来临还有"

/**
 * 选择首个有效的人类玩家作为难度选择者。
 */
function pickHostPlayer(): player | undefined {
  for (let i = 0; i < 4; i++) {
    const pl = Player(i)
    if (
      GetPlayerSlotState(pl) === PLAYER_SLOT_STATE_PLAYING() &&
      GetPlayerController(pl) === MAP_CONTROL_USER()
    ) {
      return pl
    }
  }
  return undefined
}

/**
 * 应用难度并同步关键全局状态。
 */
function applyDifficulty(level: number): void {
  setGlobal("udg_difficulty", level)
  const bossProperty = getGlobal<number>("udg_boss_property") ?? 0
  if (level === 2) {
    setGlobal("udg_boss_property", (bossProperty * 14) / 10)
  } else if (level === 3) {
    setGlobal("udg_boss_property", (bossProperty * 18) / 10)
  }
  // 固定跳变模式：难度确认后立即进入第一晚，由夜晚倒计时接管。
  const useTimeOfDayBJ = getGlobal<(enable: boolean) => void>("UseTimeOfDayBJ")
  if (useTimeOfDayBJ) {
    useTimeOfDayBJ(true)
  }
  SuspendTimeOfDay(false)
  SetTimeOfDayScale(1.0)
  setGlobal("udg_TimeOfDayScale", 1.0)
  SetFloatGameState(GAME_STATE_TIME_OF_DAY(), 0.01)
  beginNightPhaseNow(level)
  ensureFirstNightCountdown(level)
}

/**
 * 难度确认后兜底首夜倒计时窗口：
 * - 若夜晚已启动但面板被异常隐藏，强制显示；
 * - 若夜晚状态异常（无面板），重建首夜流程。
 */
function ensureFirstNightCountdown(level: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, 0.10, false, () => {
    let dialog = getGlobal<timerdialog>("udg_Night_Timer_Dialog")
    if (!dialog) {
      setGlobal("udg_Night_Phase_Active", false)
      beginNightPhaseNow(level)
      dialog = getGlobal<timerdialog>("udg_Night_Timer_Dialog")
    }
    if (dialog) {
      TimerDialogSetTitle(dialog, FIRST_NIGHT_TIMER_TITLE)
      TimerDialogDisplay(dialog, true)
    }
    DestroyTimer(timerHandle)
  })
}

/**
 * 显示不同难度的说明文本。
 */
function showDifficultyHint(level: number): void {
  if (level === 1) {
    displayTextToMercenaryPlayers("您选择了难度：晨曦\n夜晚较短，夜间敌人小幅度加强")
  } else if (level === 2) {
    displayTextToMercenaryPlayers("您选择了难度：暮色\n夜晚较长，夜间敌人加强")
  } else {
    displayTextToMercenaryPlayers("您选择了难度：极夜\n夜晚极长，夜间敌人大幅度加强")
  }
}

/**
 * 注册难度选择对话框触发器。
 */
function registerDifficultySelectionTrigger(): void {
  disableLegacyTrigger("gg_trg_difficulty_selection")
  const rootTrigger = CreateTrigger()
  TriggerRegisterTimerEvent(rootTrigger, 1.0, false)
  TriggerAddAction(rootTrigger, () => {
    const hostPlayer = pickHostPlayer()
    if (!hostPlayer) {
      displayTextToMercenaryPlayers("默认选择了难度：晨曦\n夜晚较短，夜间敌人小幅度加强")
      applyDifficulty(1)
      return
    }
    const dialogHandle = DialogCreate()
    DialogSetMessage(dialogHandle, DIFFICULTY_DIALOG_TITLE)
    const dawnButton = DialogAddButton(dialogHandle, "晨曦", 0)
    const duskButton = DialogAddButton(dialogHandle, "暮色", 0)
    const darkNightButton = DialogAddButton(dialogHandle, "极夜", 0)
    DialogDisplay(hostPlayer, dialogHandle, true)
    const dawnTrigger = CreateTrigger()
    const duskTrigger = CreateTrigger()
    const darkNightTrigger = CreateTrigger()
    const cleanup = () => {
      DialogDisplay(hostPlayer, dialogHandle, false)
      DialogClear(dialogHandle)
      DestroyTrigger(dawnTrigger)
      DestroyTrigger(duskTrigger)
      DestroyTrigger(darkNightTrigger)
      DestroyTrigger(rootTrigger)
    }
    TriggerRegisterDialogButtonEvent(dawnTrigger, dawnButton)
    TriggerAddAction(dawnTrigger, () => {
      applyDifficulty(1)
      showDifficultyHint(1)
      cleanup()
    })
    TriggerRegisterDialogButtonEvent(duskTrigger, duskButton)
    TriggerAddAction(duskTrigger, () => {
      applyDifficulty(2)
      showDifficultyHint(2)
      cleanup()
    })
    TriggerRegisterDialogButtonEvent(darkNightTrigger, darkNightButton)
    TriggerAddAction(darkNightTrigger, () => {
      applyDifficulty(3)
      showDifficultyHint(3)
      cleanup()
    })
  })
  replaceGlobalTrigger("gg_trg_difficulty_selection", rootTrigger)
}

/**
 * 入口：迁移难度选择触发器。
 */
export function migrateDifficultySelectionTrigger(): void {
  registerDifficultySelectionTrigger()
}





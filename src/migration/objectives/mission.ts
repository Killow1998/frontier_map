import { EVENT_UNIT_DEATH } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, displayTextToMercenaryPlayers, getGlobal, replaceGlobalTrigger } from "../core/helpers"
import { showGameScoreSummary } from "./gameScore"

const MISSION_FAIL_TEXT =
  "你们没能守护传送锚点，孤立无援，只能在边境等待敌人的围剿，自求多福吧"
const MISSION_FAIL_TEXT_WITH_HELP =
  "即便有帝国骑士的帮助，你们没能守护传送锚点，敌人太强大了，你们只能在边境等待敌人的围剿，自求多福吧"

/**
 * 注册任务成功逻辑。
 */
function registerMissionSuccessTrigger(): void {
  disableLegacyTrigger("gg_trg_mission_success")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    showGameScoreSummary(true)
    const customVictory = getGlobal<(whichPlayer: player, showDialog: boolean, doScoreScreen: boolean) => void>("CustomVictoryBJ")
    if (customVictory) {
      for (let i = 0; i < 4; i++) {
        customVictory(Player(i), true, true)
      }
    }
  })
  replaceGlobalTrigger("gg_trg_mission_success", triggerHandle)
}

/**
 * 注册锚点死亡导致失败逻辑。
 */
function registerMissionFailTrigger(): void {
  disableLegacyTrigger("gg_trg_mission_fail")
  const triggerHandle = CreateTrigger()
  const anchorUnit = getGlobal<unit>("gg_unit_n001_0012")
  if (anchorUnit) {
    TriggerRegisterUnitEvent(triggerHandle, anchorUnit, EVENT_UNIT_DEATH())
  }
  TriggerAddAction(triggerHandle, () => {
    showGameScoreSummary(false)
    if (getGlobal<boolean>("udg_build_finish") === true) {
      displayTextToMercenaryPlayers(MISSION_FAIL_TEXT_WITH_HELP)
    } else {
      displayTextToMercenaryPlayers(MISSION_FAIL_TEXT)
    }
    const customDefeat = getGlobal<(whichPlayer: player, message: string) => void>("CustomDefeatBJ")
    if (!customDefeat) {
      return
    }
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 5.0, false, () => {
      for (let i = 0; i < 4; i++) {
        customDefeat(Player(i), MISSION_FAIL_TEXT)
      }
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_mission_fail", triggerHandle)
}

/**
 * 入口：迁移主线任务成败触发器。
 */
export function migrateMissionTriggers(): void {
  registerMissionSuccessTrigger()
  registerMissionFailTrigger()
}

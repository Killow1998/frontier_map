import { PLAYER_STATE_GIVES_BOUNTY } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

/**
 * first_enemy_start：
 * 150 秒后启动首波敌军流程，并开启入侵阵营赏金。
 */
function registerFirstEnemyStartTrigger(): void {
  disableLegacyTrigger("gg_trg_first_enemy_start")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 150.0, false)
  TriggerAddAction(triggerHandle, () => {
    const enemyComing = getGlobal<trigger>("gg_trg_enemycoming")
    if (enemyComing) {
      const timerHandle = CreateTimer()
      TimerStart(timerHandle, 2.0, false, () => {
        TriggerExecute(enemyComing)
        DestroyTimer(timerHandle)
      })
    }
    SetPlayerState(Player(7), PLAYER_STATE_GIVES_BOUNTY(), 1)
    SetPlayerState(Player(8), PLAYER_STATE_GIVES_BOUNTY(), 1)
    SetPlayerState(Player(9), PLAYER_STATE_GIVES_BOUNTY(), 1)
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_first_enemy_start", triggerHandle)
}

/**
 * 入口：迁移 first_enemy_start 触发器。
 */
export function migrateFirstEnemyStartTrigger(): void {
  registerFirstEnemyStartTrigger()
}

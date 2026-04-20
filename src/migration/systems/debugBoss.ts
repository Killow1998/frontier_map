import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

const TEST_COMMAND_SWITCH_GLOBAL = "udg_enable_migration_test_content"

interface DebugBossConfig {
  globalName: string
  chatCommand: string
  targetTriggerGlobal: string
}

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

/**
 * 注册调试 Boss 聊天触发器。
 */
function registerDebugBossTrigger(config: DebugBossConfig): void {
  disableLegacyTrigger(config.globalName)
  const triggerHandle = CreateTrigger()
  TriggerRegisterPlayerChatEvent(triggerHandle, Player(0), config.chatCommand, true)
  TriggerAddAction(triggerHandle, () => {
    if (!isTestCommandEnabled()) {
      DisplayTextToPlayer(GetTriggerPlayer(), 0, 0, "测试命令未开启")
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

    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger(config.globalName, triggerHandle)
}

/**
 * 入口：迁移 debug_boss1 / debug_boss2 触发器。
 */
export function migrateDebugBossTriggers(): void {
  registerDebugBossTrigger({
    globalName: "gg_trg_debug_boss1",
    chatCommand: "-test soul",
    targetTriggerGlobal: "gg_trg_Soul_Collector"
  })
  registerDebugBossTrigger({
    globalName: "gg_trg_debug_boss2",
    chatCommand: "-test zombie",
    targetTriggerGlobal: "gg_trg_Zombie"
  })
}

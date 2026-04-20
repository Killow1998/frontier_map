import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

const BOSS_UNIT_GLOBAL_NAMES = [
  "gg_unit_U005_0257",
  "gg_unit_U006_0255",
  "gg_unit_H00F_0256",
  "gg_unit_U00B_0258",
  "gg_unit_U00D_0259",
  "gg_unit_O004_0108",
  "gg_unit_E005_0110",
  "gg_unit_O005_0028",
  "gg_unit_U000_0120",
  "gg_unit_O001_0261",
  "gg_unit_U001_0121"
]

/**
 * boss_init：
 * 开局先隐藏并冻结各阶段 Boss，后续由波次/事件显式解锁。
 */
function registerBossInitTrigger(): void {
  disableLegacyTrigger("gg_trg_boss_init")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 0.01, false)
  TriggerAddAction(triggerHandle, () => {
    for (const globalName of BOSS_UNIT_GLOBAL_NAMES) {
      const boss = getGlobal<unit>(globalName)
      if (!boss) {
        continue
      }
      ShowUnit(boss, false)
      SetUnitInvulnerable(boss, true)
      PauseUnit(boss, true)
    }
  })
  replaceGlobalTrigger("gg_trg_boss_init", triggerHandle)
}

/**
 * 入口：迁移 boss_init 触发器。
 */
export function migrateBossInitTrigger(): void {
  registerBossInitTrigger()
}

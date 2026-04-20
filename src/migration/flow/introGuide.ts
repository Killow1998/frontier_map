import { disableLegacyTrigger, replaceGlobalTrigger } from "../core/helpers"

/**
 * _______u（简介）：
 * 原触发器仅为注释占位，不承载运行时逻辑。
 */
function registerIntroGuideTrigger(): void {
  disableLegacyTrigger("gg_trg_______u")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    // 保留空实现，等价于原始触发器的无行为占位。
  })
  replaceGlobalTrigger("gg_trg_______u", triggerHandle)
}

/**
 * 入口：迁移 _______u 触发器。
 */
export function migrateIntroGuideTrigger(): void {
  registerIntroGuideTrigger()
}

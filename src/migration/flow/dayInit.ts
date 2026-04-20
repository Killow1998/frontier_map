import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

/**
 * 兼容调用 SetTimeOfDay（旧图全局函数）。
 */
function setTimeOfDayValue(hour: number): void {
  const setTimeOfDay = getGlobal<(value: number) => void>("SetTimeOfDay")
  if (setTimeOfDay) {
    setTimeOfDay(hour)
  }
}

/**
 * day_init：
 * 初始化时把游戏时间设置到 21:00。
 */
function registerDayInitTrigger(): void {
  disableLegacyTrigger("gg_trg_day_init")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    setTimeOfDayValue(21.0)
  })
  replaceGlobalTrigger("gg_trg_day_init", triggerHandle)
}

/**
 * 入口：迁移 day_init 触发器。
 */
export function migrateDayInitTrigger(): void {
  registerDayInitTrigger()
}

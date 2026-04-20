import { getGlobal, setGlobal } from "../core/helpers"

/**
 * 昼夜流速控制器：
 * - 只负责把引擎时间流恢复到可运行初始态；
 * - 实际昼夜切换由 day_come/night_come 触发器配合 TimeOfDayScale 与倒计时面板完成。
 */
function setTimeFlowEnabled(enabled: boolean): void {
  const useTimeOfDayBJ = getGlobal<(enable: boolean) => void>("UseTimeOfDayBJ")
  if (useTimeOfDayBJ) {
    useTimeOfDayBJ(enabled)
  }
  // 双保险：即便 BJ 包装异常，也直接调用原生恢复时间流逝状态。
  SuspendTimeOfDay(!enabled)
}

/**
 * 兼容入口：初始化时恢复默认可运行流速。
 */
export function applyTimeOfDayScaleNow(): void {
  setTimeFlowEnabled(true)
  SetTimeOfDayScale(1.0)
  setGlobal("udg_TimeOfDayScale", 1.0)
}

/**
 * 初始化时间系统（回退模式）：只做一次引擎状态归一，不再启用看门狗调速。
 */
export function initializeTimeOfDayFlow(): void {
  applyTimeOfDayScaleNow()
}

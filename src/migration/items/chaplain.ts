import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

/**
 * 生成矩形内随机点坐标。
 */
function getRandomPointInRect(targetRect: rect): [number, number] {
  const x = GetRandomReal(GetRectMinX(targetRect), GetRectMaxX(targetRect))
  const y = GetRandomReal(GetRectMinY(targetRect), GetRectMaxY(targetRect))
  return [x, y]
}

/**
 * 判断坐标是否位于矩形内。
 */
function isPointInRect(targetRect: rect, x: number, y: number): boolean {
  return x >= GetRectMinX(targetRect) && x <= GetRectMaxX(targetRect) && y >= GetRectMinY(targetRect) && y <= GetRectMaxY(targetRect)
}

/**
 * chaplain：
 * 每 10 秒检测牧师英雄是否离开基地；若离开则下达回基地移动命令。
 */
function registerChaplainTrigger(): void {
  disableLegacyTrigger("gg_trg_chaplain")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 5.0, false)
  TriggerAddAction(triggerHandle, () => {
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 10.0, true, () => {
      const chaplainUnit = getGlobal<unit>("gg_unit_H002_0119")
      const baseRect = getGlobal<rect>("gg_rct_base_area")
      if (!chaplainUnit || !baseRect) {
        return
      }
      const x = GetUnitX(chaplainUnit)
      const y = GetUnitY(chaplainUnit)
      if (isPointInRect(baseRect, x, y)) {
        return
      }
      const [targetX, targetY] = getRandomPointInRect(baseRect)
      IssuePointOrder(chaplainUnit, "move", targetX, targetY)
    })
  })
  replaceGlobalTrigger("gg_trg_chaplain", triggerHandle)
}

/**
 * 入口：迁移 chaplain 触发器。
 */
export function migrateChaplainTrigger(): void {
  registerChaplainTrigger()
}

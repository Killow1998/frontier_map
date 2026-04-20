import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, isDayTimeFromHashtable, replaceGlobalTrigger } from "../core/helpers"

const PEDDLER_STEALTH_ABILITY_ID = FourCC("Apiv")

let peddlerLoopStarted = false

/**
 * peddler：
 * 原图通过 RunInitializationTriggers -> ConditionalTriggerExecute(gg_trg_peddler)
 * 启动一次 action，再进入每 10 秒循环切换商人隐身能力 Apiv（白天开启，夜晚关闭）。
 */
function registerPeddlerTrigger(): void {
  disableLegacyTrigger("gg_trg_peddler")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    if (peddlerLoopStarted) {
      return
    }
    peddlerLoopStarted = true
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 10.0, true, () => {
      const peddlerUnit = getGlobal<unit>("gg_unit_n01D_0000")
      if (!peddlerUnit) {
        return
      }
      const isDay = isDayTimeFromHashtable()
      const hasStealth = GetUnitAbilityLevel(peddlerUnit, PEDDLER_STEALTH_ABILITY_ID) > 0
      if (!isDay && hasStealth) {
        UnitRemoveAbility(peddlerUnit, PEDDLER_STEALTH_ABILITY_ID)
        return
      }
      if (isDay && !hasStealth) {
        UnitAddAbility(peddlerUnit, PEDDLER_STEALTH_ABILITY_ID)
      }
    })
  })
  replaceGlobalTrigger("gg_trg_peddler", triggerHandle)
  // 显式执行一次，避免在迁移执行路径变化时漏掉原图“初始化手动启动”语义。
  TriggerExecute(triggerHandle)
}

/**
 * 入口：迁移 peddler 触发器。
 */
export function migratePeddlerTrigger(): void {
  registerPeddlerTrigger()
}

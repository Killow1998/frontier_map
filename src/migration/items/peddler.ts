import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, isDayTimeFromHashtable, replaceGlobalTrigger } from "../core/helpers"

const PEDDLER_STEALTH_ABILITY_ID = FourCC("Apiv")

let peddlerLoopStarted = false

/**
 * peddler：
 * 每 10 秒根据昼夜切换商人隐身能力 Apiv（白天开启，夜晚关闭）。
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
}

/**
 * 入口：迁移 peddler 触发器。
 */
export function migratePeddlerTrigger(): void {
  registerPeddlerTrigger()
}

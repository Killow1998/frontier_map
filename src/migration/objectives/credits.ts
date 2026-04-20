import { EVENT_PLAYER_UNIT_DEATH, PLAYER_NEUTRAL_AGGRESSIVE } from "@eiriksgata/wc3ts/src/globals/define"
import { bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"
import { recordKillReward } from "./gameScore"

/**
 * 判断是否为 1-4 号雇佣兵玩家。
 */
function isHumanMercenaryPlayer(whichPlayer: player): boolean {
  return (
    whichPlayer === Player(0) ||
    whichPlayer === Player(1) ||
    whichPlayer === Player(2) ||
    whichPlayer === Player(3)
  )
}

/**
 * 读取奖励点数表（udg_credits）。
 */
function getCreditsTable(): number[] {
  const credits = getGlobal<number[]>("udg_credits")
  if (credits) {
    return credits
  }
  return []
}

/**
 * 注册 -cr 指令：显示当前玩家奖励点数。
 */
function registerShowCreditTrigger(): void {
  disableLegacyTrigger("gg_trg_show_credit")
  const triggerHandle = CreateTrigger()
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerChatEvent(triggerHandle, Player(i), "-cr", true)
  }
  TriggerAddCondition(triggerHandle, Condition(() => isHumanMercenaryPlayer(GetTriggerPlayer())))
  TriggerAddAction(triggerHandle, () => {
    const playerIndex = GetPlayerId(GetTriggerPlayer()) + 1
    const credits = getCreditsTable()
    const currentCredit = credits[playerIndex] ?? 0
    DisplayTextToPlayer(GetTriggerPlayer(), 0, 0, "您的雇佣兵当前奖励点数：" + I2S(currentCredit))
  })
  replaceGlobalTrigger("gg_trg_show_credit", triggerHandle)
}

/**
 * 注册击杀奖励点数逻辑（野怪与进攻方敌军）。
 */
function registerKillToGetTrigger(): void {
  disableLegacyTrigger("gg_trg_killtoget")
  const triggerHandle = CreateTrigger()
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), EVENT_PLAYER_UNIT_DEATH(), null)
  }
  TriggerAddCondition(triggerHandle, Condition(() => {
    const deadUnit = GetTriggerUnit()
    const killerUnit = GetKillingUnit()
    if (!killerUnit) {
      return false
    }
    const deadOwner = GetOwningPlayer(deadUnit)
    return (
      (deadOwner === Player(PLAYER_NEUTRAL_AGGRESSIVE) ||
        deadOwner === Player(7) ||
        deadOwner === Player(8) ||
        deadOwner === Player(9) ||
        deadOwner === Player(10) ||
        deadOwner === Player(11)) &&
      isHumanMercenaryPlayer(GetOwningPlayer(killerUnit))
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const killerUnit = GetKillingUnit()
    if (!killerUnit) {
      return
    }
    const killerPlayerId = GetPlayerId(GetOwningPlayer(killerUnit)) + 1
    const deadOwner = GetOwningPlayer(deadUnit)
    let gain = GetUnitLevel(deadUnit)
    if (
      killerPlayerId <= 4 &&
      killerPlayerId >= 0 &&
      (deadOwner === Player(PLAYER_NEUTRAL_AGGRESSIVE) || deadOwner === Player(10))
    ) {
      gain = R2I(I2R(gain) * 0.45)
      if (gain === 0) {
        gain = 1
      }
    }
    const credits = getCreditsTable()
    credits[killerPlayerId] = (credits[killerPlayerId] ?? 0) + gain
    recordKillReward(deadUnit, gain)
  })
  replaceGlobalTrigger("gg_trg_killtoget", triggerHandle)
}

/**
 * 入口：迁移奖励点数相关触发器。
 */
export function migrateCreditsTriggers(): void {
  registerShowCreditTrigger()
  registerKillToGetTrigger()
}

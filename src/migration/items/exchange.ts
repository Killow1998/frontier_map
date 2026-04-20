import { EVENT_PLAYER_UNIT_PICKUP_ITEM } from "@eiriksgata/wc3ts/src/globals/define"
import { bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

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
 * 通用兑换触发器：
 * 拾取凭证 -> 扣点 -> 发放目标道具。
 */
function registerExchangeTrigger(config: {
  triggerName: string
  pickupItemId: string
  rewardItemId: string
  cost: number
  successText: string
}): void {
  disableLegacyTrigger(config.triggerName)
  const triggerHandle = CreateTrigger()
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), EVENT_PLAYER_UNIT_PICKUP_ITEM(), null)
  }
  TriggerAddCondition(triggerHandle, Condition(() => {
    return (
      GetItemTypeId(GetManipulatedItem()) === FourCC(config.pickupItemId) &&
      isHumanMercenaryPlayer(GetOwningPlayer(GetTriggerUnit()))
    )
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const owner = GetOwningPlayer(unitHandle)
    const playerIndex = GetPlayerId(owner) + 1
    const credits = getCreditsTable()
    const current = credits[playerIndex] ?? 0
    RemoveItem(GetManipulatedItem())
    if (current >= config.cost) {
      credits[playerIndex] = current - config.cost
      DisplayTextToPlayer(owner, 0, 0, config.successText)
      UnitAddItem(unitHandle, CreateItem(FourCC(config.rewardItemId), GetUnitX(unitHandle), GetUnitY(unitHandle)))
    } else {
      DisplayTextToPlayer(owner, 0, 0, "您的奖励点数不足，当前点数为" + I2S(current) + "，所需点数为" + I2S(config.cost))
    }
  })
  replaceGlobalTrigger(config.triggerName, triggerHandle)
}

/**
 * 入口：迁移军情六处兑换触发器。
 */
export function migrateExchangeTriggers(): void {
  registerExchangeTrigger({
    triggerName: "gg_trg_get_bottle",
    pickupItemId: "I03H",
    rewardItemId: "I03G",
    cost: 12,
    successText: "兑换充能甁成功"
  })
  registerExchangeTrigger({
    triggerName: "gg_trg_get_holy_ring",
    pickupItemId: "I03M",
    rewardItemId: "I03L",
    cost: 125,
    successText: "兑换圣耀指环成功"
  })
  registerExchangeTrigger({
    triggerName: "gg_trg_get_space_tech",
    pickupItemId: "I048",
    rewardItemId: "I02S",
    cost: 300,
    successText: "兑换空间技术学习成功"
  })
}

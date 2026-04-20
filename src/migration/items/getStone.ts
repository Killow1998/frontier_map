import { EVENT_PLAYER_UNIT_PICKUP_ITEM } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, isHumanMercenaryPlayer, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const STONE_TICKET_ITEM_ID = FourCC("I03F")
const STONE_REWARD_ITEM_ID = FourCC("I00D")

/**
 * 读取奖励点数表（udg_credits）。
 */
function getCreditsTable(): number[] {
  return getGlobal<number[]>("udg_credits") ?? []
}

/**
 * 读取碎石兑换需求表（udg_credit_need）。
 */
function getCreditNeedTable(): number[] {
  return getGlobal<number[]>("udg_credit_need") ?? []
}

/**
 * get_stone：
 * 拾取 I03F 后按当前需求消耗奖励点数，兑换 I00D，并按规则提高下次需求（上限 80）。
 */
function registerGetStoneTrigger(): void {
  disableLegacyTrigger("gg_trg_get_stone")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    return GetItemTypeId(GetManipulatedItem()) === STONE_TICKET_ITEM_ID && isHumanMercenaryPlayer(GetOwningPlayer(unitHandle))
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const owner = GetOwningPlayer(unitHandle)
    const playerIndex = GetPlayerId(owner) + 1
    const credits = getCreditsTable()
    const needs = getCreditNeedTable()
    const currentCredit = credits[playerIndex] ?? 0
    const currentNeed = needs[playerIndex] ?? 0

    RemoveItem(GetManipulatedItem())
    if (currentCredit >= currentNeed) {
      credits[playerIndex] = currentCredit - currentNeed
      if (currentNeed < 80) {
        needs[playerIndex] = currentNeed * 2
      } else {
        needs[playerIndex] = 80
      }
      DisplayTextToPlayer(owner, 0, 0, "兑换成功\n")
      UnitAddItem(unitHandle, CreateItem(STONE_REWARD_ITEM_ID, GetUnitX(unitHandle), GetUnitY(unitHandle)))
      return
    }

    DisplayTextToPlayer(
      owner,
      0,
      0,
      "您的奖励点数不足，当前点数为" + I2S(currentCredit) + "，所需点数为" + I2S(currentNeed)
    )
  })
  replaceGlobalTrigger("gg_trg_get_stone", triggerHandle)
}

/**
 * 入口：迁移 get_stone 触发器。
 */
export function migrateGetStoneTrigger(): void {
  registerGetStoneTrigger()
}

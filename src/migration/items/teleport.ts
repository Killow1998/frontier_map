import { EVENT_PLAYER_UNIT_PICKUP_ITEM, EVENT_PLAYER_UNIT_SPELL_EFFECT, UNIT_TYPE_HERO } from "@eiriksgata/wc3ts/src/globals/define"
import { bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

/**
 * 为全玩家注册玩家单位事件。
 */
function registerPlayerUnitEventAll(triggerHandle: trigger, eventId: playerunitevent): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), eventId, null)
  }
}

/**
 * 在单位背包里查找指定类型物品。
 */
function findItemByTypeId(unitHandle: unit, itemTypeId: number): item | undefined {
  for (let slot = 0; slot < 6; slot++) {
    const current = UnitItemInSlot(unitHandle, slot)
    if (current && GetItemTypeId(current) === itemTypeId) {
      return current
    }
  }
  return undefined
}

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(effectHandle: effect, duration: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 空间传送技能生效：随机传送到基地区域。
 */
function registerTeleportationScrollSpellTrigger(): void {
  disableLegacyTrigger("gg_trg_teleportation_scroll")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === FourCC("A0B1")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const baseRect = getGlobal<rect>("gg_rct_base_area")
    if (!baseRect) {
      return
    }
    PauseUnit(caster, true)
    const x = GetRandomReal(GetRectMinX(baseRect), GetRectMaxX(baseRect))
    const y = GetRandomReal(GetRectMinY(baseRect), GetRectMaxY(baseRect))
    const effectIn = AddSpecialEffect("Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", x, y)
    destroyEffectLater(effectIn, 2.0)
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 2.0, false, () => {
      SetUnitPosition(caster, x, y)
      const effectOut = AddSpecialEffect("Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTarget.mdl", x, y)
      destroyEffectLater(effectOut, 1.0)
      PauseUnit(caster, false)
      DestroyTimer(timerHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_teleportation_scroll", triggerHandle)
}

/**
 * 空间卷轴合成：I038 + I03O => I03P。
 */
function registerTeleportationScrollGetTrigger(): void {
  disableLegacyTrigger("gg_trg_teleportation_scroll_get")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    const itemId = GetItemTypeId(GetManipulatedItem())
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && (itemId === FourCC("I038") || itemId === FourCC("I03O"))
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const scrollA = findItemByTypeId(unitHandle, FourCC("I038"))
    const scrollB = findItemByTypeId(unitHandle, FourCC("I03O"))
    if (scrollA && scrollB) {
      RemoveItem(scrollA)
      RemoveItem(scrollB)
      UnitAddItem(unitHandle, CreateItem(FourCC("I03P"), GetUnitX(unitHandle), GetUnitY(unitHandle)))
      DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "您的雇佣兵已获得空间符印")
    }
  })
  replaceGlobalTrigger("gg_trg_teleportation_scroll_get", triggerHandle)
}

/**
 * 空间科技学习：I03P + I02S -> 学会 A0B1。
 */
function registerTeleportationScrollEatTrigger(): void {
  disableLegacyTrigger("gg_trg_teleportation_scroll_eat")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    const itemId = GetItemTypeId(GetManipulatedItem())
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && (itemId === FourCC("I03P") || itemId === FourCC("I02S"))
  }))
  TriggerAddAction(triggerHandle, () => {
    const unitHandle = GetTriggerUnit()
    const spaceTech = findItemByTypeId(unitHandle, FourCC("I02S"))
    const mark = findItemByTypeId(unitHandle, FourCC("I03P"))
    if (spaceTech && mark) {
      RemoveItem(spaceTech)
      RemoveItem(mark)
      if (GetUnitAbilityLevel(unitHandle, FourCC("A0B1")) === 0) {
        UnitAddAbility(unitHandle, FourCC("A0B1"))
        DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "您的雇佣兵习得回家的艺术")
      } else {
        DisplayTextToPlayer(GetOwningPlayer(unitHandle), 0, 0, "您的雇佣兵学习过回家的艺术")
      }
    }
  })
  replaceGlobalTrigger("gg_trg_teleportation_scroll_eat", triggerHandle)
}

/**
 * 入口：迁移空间传送相关触发器。
 */
export function migrateTeleportationTriggers(): void {
  registerTeleportationScrollSpellTrigger()
  registerTeleportationScrollGetTrigger()
  registerTeleportationScrollEatTrigger()
}

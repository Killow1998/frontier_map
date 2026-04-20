import {
  ATTACK_TYPE_MAGIC,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_UNIT_PICKUP_ITEM,
  UNIT_STATE_LIFE,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { countItemInInventory, disableLegacyTrigger, findItemInInventory, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const FIREFLY_CLOAK_ITEM_ID = FourCC("I047")
const FIREFLY_TICK_INTERVAL = 0.5
const FIREFLY_PROC_INTERVAL = 8.0
const FIREFLY_RADIUS = 500.0

const cloakLoopActiveByUnit: Record<number, boolean> = {}

/**
 * 延迟销毁闪电特效。
 */
function destroyLightningLater(lightningHandle: lightning, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyLightning(lightningHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 启动披风周期效果：每 8 秒对周围敌人造成法术伤害并吸收等额生命。
 */
function startFireflyCloakLoop(hero: unit): void {
  const heroId = GetHandleId(hero)
  if (cloakLoopActiveByUnit[heroId]) {
    return
  }
  cloakLoopActiveByUnit[heroId] = true

  const triggerTicks = Math.floor(FIREFLY_PROC_INTERVAL / FIREFLY_TICK_INTERVAL)
  let tickCounter = 0
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, FIREFLY_TICK_INTERVAL, true, () => {
    if (!findItemInInventory(hero, FIREFLY_CLOAK_ITEM_ID)) {
      cloakLoopActiveByUnit[heroId] = false
      PauseTimer(timerHandle)
      DestroyTimer(timerHandle)
      return
    }

    tickCounter += 1
    if (tickCounter < triggerTicks) {
      return
    }
    tickCounter = 0

    if (GetUnitState(hero, UNIT_STATE_LIFE()) <= 0.405) {
      return
    }

    const heroX = GetUnitX(hero)
    const heroY = GetUnitY(hero)
    const enemyUnits: unit[] = []
    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, heroX, heroY, FIREFLY_RADIUS, null)
    ForGroup(groupHandle, () => {
      const enumUnit = GetEnumUnit()
      if (
        !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) &&
        GetUnitState(enumUnit, UNIT_STATE_LIFE()) > 0.405 &&
        IsUnitEnemy(enumUnit, GetOwningPlayer(hero))
      ) {
        enemyUnits.push(enumUnit)
      }
    })
    DestroyGroup(groupHandle)

    if (enemyUnits.length === 0) {
      return
    }

    const intelligence = GetHeroInt(hero, true)
    let damage = 50.0 * (1.0 + (5.0 * intelligence) / 1000.0)
    if (enemyUnits.length === 1) {
      damage *= 2.0
    }

    let totalDamage = 0.0
    for (const target of enemyUnits) {
      UnitDamageTarget(hero, target, damage, false, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
      totalDamage += damage
      const lightningHandle = AddLightning("DRAB", true, heroX, heroY, GetUnitX(target), GetUnitY(target))
      SetLightningColor(lightningHandle, 0.2, 1.0, 0.2, 0.7)
      destroyLightningLater(lightningHandle, 0.5)
    }

    SetWidgetLife(hero, GetUnitState(hero, UNIT_STATE_LIFE()) + totalDamage)
  })
}

/**
 * Firefly_Cloak_Equip：
 * 限制披风最多携带一件，并在穿戴后启用周期吸血链击效果。
 */
function registerFireflyCloakEquipTrigger(): void {
  disableLegacyTrigger("gg_trg_Firefly_Cloak_Equip")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetItemTypeId(GetManipulatedItem()) === FIREFLY_CLOAK_ITEM_ID && IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const itemCount = countItemInInventory(hero, FIREFLY_CLOAK_ITEM_ID)
    if (itemCount > 1) {
      UnitRemoveItem(hero, GetManipulatedItem())
      DisplayTextToPlayer(GetOwningPlayer(hero), 0, 0, "|cffFF0000萤火披风只能携带一件！|r")
      return
    }
    startFireflyCloakLoop(hero)
  })
  replaceGlobalTrigger("gg_trg_Firefly_Cloak_Equip", triggerHandle)
}

/**
 * 入口：迁移 Firefly_Cloak_Equip 触发器。
 */
export function migrateFireflyCloakEquipTrigger(): void {
  registerFireflyCloakEquipTrigger()
}

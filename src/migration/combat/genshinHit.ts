import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_HERO,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

const GENSHIN_HERO_TYPE_ID = FourCC("U00K")
const GOLD_STONE_ITEM_ID = FourCC("I00D")
const WATER_TOKEN_ITEM_ID = FourCC("I03D")
const ACTIVE_THRESHOLD = 9
const ACTIVE_INTERVAL = 1.0

const genshinActiveByUnit: Record<number, boolean> = {}

/**
 * 延迟销毁特效，避免句柄泄漏。
 */
function destroyEffectLater(effectHandle: effect, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 在单位周围生成物品。
 */
function createItemAround(unitHandle: unit, itemTypeId: number, distance: number): void {
  const angle = GetRandomReal(0.0, 360.0)
  const rad = angle * bj_DEGTORAD
  const x = GetUnitX(unitHandle) + distance * Math.cos(rad)
  const y = GetUnitY(unitHandle) + distance * Math.sin(rad)
  CreateItem(itemTypeId, x, y)
}

/**
 * 施放核心连击：隐身突进 -> 近身打击 -> 回到水牢中央。
 */
function startBlinkStrike(caster: unit, target: unit, swimmingRect: rect): void {
  const preTimer = CreateTimer()
  TimerStart(preTimer, 0.7, false, () => {
    const preEffect = AddSpecialEffect("Abilities\\Spells\\NightElf\\Blink\\BlinkCaster.mdl", GetUnitX(caster), GetUnitY(caster))
    destroyEffectLater(preEffect, 0.7)
    SetUnitVertexColor(caster, 255, 255, 255, 100)
    SetUnitPathing(caster, false)

    const strikeTimer = CreateTimer()
    TimerStart(strikeTimer, 0.4, false, () => {
      SetUnitPosition(caster, GetUnitX(target), GetUnitY(target))
      SetUnitAnimation(caster, "attack")
      const damage =
        GetRandomReal(121.0, 554.0) +
        (GetUnitState(caster, UNIT_STATE_MAX_LIFE()) - GetUnitState(caster, UNIT_STATE_LIFE())) * 0.05
      UnitDamageTarget(caster, target, damage, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())

      const blood = AddSpecialEffectTarget("Abilities\\Weapons\\Blood\\BloodImpact.mdl", target, "breast")
      destroyEffectLater(blood, 1.0)

      const currentLife = GetUnitState(caster, UNIT_STATE_LIFE())
      const maxLife = GetUnitState(caster, UNIT_STATE_MAX_LIFE())
      SetWidgetLife(caster, currentLife + (maxLife - currentLife) * 0.11)
      const healEffect = AddSpecialEffectTarget("Abilities\\Spells\\Undead\\ReplenishHealth\\ReplenishHealthCasterOverhead.mdl", caster, "overhead")
      destroyEffectLater(healEffect, 1.0)

      const hitEffect = AddSpecialEffect("Abilities\\Spells\\NightElf\\Blink\\BlinkTarget.mdl", GetUnitX(target), GetUnitY(target))
      destroyEffectLater(hitEffect, 0.7)

      const backTimer = CreateTimer()
      TimerStart(backTimer, 0.4, false, () => {
        const centerX = (GetRectMinX(swimmingRect) + GetRectMaxX(swimmingRect)) * 0.5
        const centerY = (GetRectMinY(swimmingRect) + GetRectMaxY(swimmingRect)) * 0.5
        const leaveEffect = AddSpecialEffect("Abilities\\Spells\\NightElf\\Blink\\BlinkCaster.mdl", GetUnitX(caster), GetUnitY(caster))
        destroyEffectLater(leaveEffect, 0.7)
        SetUnitPosition(caster, centerX, centerY)
        const returnEffect = AddSpecialEffect("Abilities\\Spells\\NightElf\\Blink\\BlinkTarget.mdl", centerX, centerY)
        destroyEffectLater(returnEffect, 0.7)
        SetUnitAnimation(caster, "stand")
        SetUnitVertexColor(caster, 255, 255, 255, 255)
        SetUnitPathing(caster, true)
        DestroyTimer(backTimer)
      })

      DestroyTimer(strikeTimer)
    })

    DestroyTimer(preTimer)
  })
}

/**
 * 每秒轮询一次：死亡则掉落并结束，存活则周期锁定敌人并执行突袭连击。
 */
function startGenshinLoop(unitHandle: unit, swimmingRect: rect): void {
  const unitId = GetHandleId(unitHandle)
  if (genshinActiveByUnit[unitId]) {
    return
  }
  genshinActiveByUnit[unitId] = true

  let tickCounter = 0
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, ACTIVE_INTERVAL, true, () => {
    if (GetUnitState(unitHandle, UNIT_STATE_LIFE()) <= 0.405) {
      const deathEffect = AddSpecialEffect("Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl", GetUnitX(unitHandle), GetUnitY(unitHandle))
      destroyEffectLater(deathEffect, 2.0)
      createItemAround(unitHandle, GOLD_STONE_ITEM_ID, 256.0)
      createItemAround(unitHandle, GOLD_STONE_ITEM_ID, 256.0)
      CreateItem(WATER_TOKEN_ITEM_ID, GetUnitX(unitHandle), GetUnitY(unitHandle))
      genshinActiveByUnit[unitId] = false
      PauseTimer(timerHandle)
      DestroyTimer(timerHandle)
      return
    }

    tickCounter += 1
    const owner = GetOwningPlayer(unitHandle)
    const allUnits = CreateGroup()
    const enemyUnits: unit[] = []
    GroupEnumUnitsInRect(allUnits, swimmingRect, null)
    ForGroup(allUnits, () => {
      const enumUnit = GetEnumUnit()
      if (IsUnitEnemy(enumUnit, owner) && GetUnitState(enumUnit, UNIT_STATE_LIFE()) > 0.405) {
        enemyUnits.push(enumUnit)
      }
    })

    if (tickCounter >= ACTIVE_THRESHOLD && enemyUnits.length > 0) {
      const randomIndex = GetRandomInt(0, enemyUnits.length - 1)
      const randomTarget = enemyUnits[randomIndex]
      tickCounter = 0
      const markEffect = AddSpecialEffectTarget("Abilities\\Spells\\Other\\TalkToMe\\TalkToMe.mdl", randomTarget, "overhead")
      destroyEffectLater(markEffect, 0.7)
      startBlinkStrike(unitHandle, randomTarget, swimmingRect)
    }
    DestroyGroup(allUnits)
  })
}

/**
 * genshin_hit：
 * U00K 进入水牢后启动 AI 连击轮询，按周期随机突袭敌人，死亡时掉落奖励并结束。
 */
function registerGenshinHitTrigger(): void {
  disableLegacyTrigger("gg_trg_genshin_hit")
  const triggerHandle = CreateTrigger()
  const swimmingRect = getGlobal<rect>("gg_rct_swimmingpool")
  if (!swimmingRect) {
    replaceGlobalTrigger("gg_trg_genshin_hit", triggerHandle)
    return
  }
  const regionHandle = CreateRegion()
  RegionAddRect(regionHandle, swimmingRect)
  TriggerRegisterEnterRegion(triggerHandle, regionHandle, null)
  TriggerAddCondition(triggerHandle, Condition(() => {
    const unitHandle = GetTriggerUnit()
    return IsUnitType(unitHandle, UNIT_TYPE_HERO()) && GetUnitTypeId(unitHandle) === GENSHIN_HERO_TYPE_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    const swimmingRect = getGlobal<rect>("gg_rct_swimmingpool")
    if (!swimmingRect) {
      return
    }
    startGenshinLoop(GetTriggerUnit(), swimmingRect)
  })
  replaceGlobalTrigger("gg_trg_genshin_hit", triggerHandle)
}

/**
 * 入口：迁移 genshin_hit 触发器。
 */
export function migrateGenshinHitTrigger(): void {
  registerGenshinHitTrigger()
}

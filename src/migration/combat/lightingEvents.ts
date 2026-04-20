import {
  ATTACK_TYPE_MAGIC,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_UNIT_ATTACKED,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  setGlobal
} from "../core/helpers"

const LIGHTING_CORE_ITEM_ID = FourCC("I043")
const LIGHTING_ARMOR_BUFF_ID = FourCC("B017")
const LIGHTING_DROP_MESSAGE = "远处有巨大的雷声，莫非发生了什么变故"

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
 * 在目标矩形中随机返回一个坐标点。
 */
function randomPointInRect(targetRect: rect): [number, number] {
  const x = GetRandomReal(GetRectMinX(targetRect), GetRectMaxX(targetRect))
  const y = GetRandomReal(GetRectMinY(targetRect), GetRectMaxY(targetRect))
  return [x, y]
}

/**
 * 执行雷核生成判定（lighting_get 与 lighting_get_trig 共用逻辑）。
 */
function executeLightingDropRoll(): void {
  const currentRate = getGlobal<number>("udg_lighting_get_rate") ?? 0
  if (GetRandomInt(1, 800) <= 7 + currentRate) {
    const lightningRect = getGlobal<rect>("gg_rct_____________1112")
    if (lightningRect) {
      const [x, y] = randomPointInRect(lightningRect)
      CreateItem(LIGHTING_CORE_ITEM_ID, x, y)
      displayTextToMercenaryPlayers(LIGHTING_DROP_MESSAGE)
    }
    setGlobal("udg_lighting_get_rate", 0)
    return
  }
  setGlobal("udg_lighting_get_rate", currentRate + 3)
}

/**
 * lighting_get：
 * 每 60 秒执行一次雷核掉落概率递增判定。
 */
function registerLightingGetTrigger(): void {
  disableLegacyTrigger("gg_trg_lighting_get")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 60.0, true)
  TriggerAddAction(triggerHandle, () => {
    executeLightingDropRoll()
  })
  replaceGlobalTrigger("gg_trg_lighting_get", triggerHandle)
}

/**
 * lighting_get_trig：
 * 供其他触发器手动 TriggerExecute 的雷核生成入口。
 */
function registerLightingGetTrigTrigger(): void {
  disableLegacyTrigger("gg_trg_lighting_get_trig")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    executeLightingDropRoll()
  })
  replaceGlobalTrigger("gg_trg_lighting_get_trig", triggerHandle)
}

/**
 * lighting_armor_attack：
 * 被 B017 雷甲覆盖的单位受击时，概率在攻击者附近落雷并对周围敌人造成闪电伤害。
 */
function registerLightingArmorAttackTrigger(): void {
  disableLegacyTrigger("gg_trg_lighting_armor_attack")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_ATTACKED())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitAbilityLevel(GetTriggerUnit(), LIGHTING_ARMOR_BUFF_ID) > 0))
  TriggerAddAction(triggerHandle, () => {
    const attackedUnit = GetTriggerUnit()
    const attacker = GetAttacker()
    if (!attacker) {
      return
    }

    const angle = GetRandomReal(0.0, 360.0) * bj_DEGTORAD
    const strikeX = GetUnitX(attacker) + 50.0 * Math.cos(angle)
    const strikeY = GetUnitY(attacker) + 50.0 * Math.sin(angle)
    const damage = 100.0 + 0.05 * GetUnitState(attackedUnit, UNIT_STATE_MAX_LIFE())

    if (GetRandomInt(1, 1000) > 520) {
      return
    }

    const effectHandle = AddSpecialEffect("Doodads\\Cinematic\\Lightningbolt\\Lightningbolt.mdl", strikeX, strikeY)
    destroyEffectLater(effectHandle, 0.3)

    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, strikeX, strikeY, 125.0, null)
    ForGroup(groupHandle, () => {
      const enumUnit = GetEnumUnit()
      if (IsUnitEnemy(enumUnit, GetOwningPlayer(attackedUnit)) && GetUnitState(enumUnit, UNIT_STATE_LIFE()) > 0.405) {
        UnitDamageTarget(attackedUnit, enumUnit, damage, false, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    DestroyGroup(groupHandle)
  })
  replaceGlobalTrigger("gg_trg_lighting_armor_attack", triggerHandle)
}

/**
 * 入口：迁移 lighting_get / lighting_get_trig / lighting_armor_attack。
 */
export function migrateLightingEventTriggers(): void {
  registerLightingGetTrigger()
  registerLightingGetTrigTrigger()
  registerLightingArmorAttackTrigger()
}

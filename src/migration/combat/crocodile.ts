import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_UNIT_DEATH,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_STATE_MAX_LIFE,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const CROCODILE_UNIT_ID = FourCC("O005")
const CROCODILE_DROP_ITEM_ID = FourCC("I034")

function destroyEffectLater(fx: effect, duration: number): void {
  const t = CreateTimer()
  TimerStart(t, duration, false, () => {
    DestroyEffect(fx)
    DestroyTimer(t)
  })
}

/**
 * Crocodile_skill1：鳄鱼冲刺逻辑重构。
 * 加固：使用全服同步组进行碰撞检测。
 */
function runCrocodileRush(caster: unit, targetX: number, targetY: number, damage: number): void {
  const startX = GetUnitX(caster)
  const startY = GetUnitY(caster)
  const angle = math.atan2(targetY - startY, targetX - startX)
  const duration = 0.5
  let elapsed = 0.0

  const hitMap: Record<number, boolean> = {}
  const t = CreateTimer()

  TimerStart(t, 0.03, true, () => {
    elapsed += 0.03
    const progress = Math.min(1.0, elapsed / duration)
    const curX = startX + (targetX - startX) * progress
    const curY = startY + (targetY - startY) * progress
    
    SetUnitX(caster, curX)
    SetUnitY(caster, curY)

    // 【同步加固】
    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, curX, curY, 150.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      const uid = GetHandleId(u)
      if (!hitMap[uid] && IsUnitEnemy(u, GetOwningPlayer(caster)) && GetWidgetLife(u) > 0.405) {
        hitMap[uid] = true
        UnitDamageTarget(caster, u, damage, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), null)
        const hitFx = AddSpecialEffectTarget("Abilities\\Spells\\Other\\Stampede\\StampedeMissileDeath.mdl", u, "origin")
        destroyEffectLater(hitFx, 1.0)
      }
    })
    GroupClear(SYNC_GROUP)

    if (progress >= 1.0) {
      DestroyTimer(t)
    }
  })
}

function registerCrocodileSkillTrigger(): void {
  disableLegacyTrigger("gg_trg_Crocodile_skill1")
  const triggerHandle = CreateTrigger()
  TriggerRegisterAnyUnitEventBJ(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => GetSpellAbilityId() === FourCC("A09M")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const tx = GetSpellTargetX()
    const ty = GetSpellTargetY()
    runCrocodileRush(caster, tx, ty, 500.0)
  })
  replaceGlobalTrigger("gg_trg_Crocodile_skill1", triggerHandle)
}

export function migrateCrocodileTriggers(): void {
  registerCrocodileSkillTrigger()
}

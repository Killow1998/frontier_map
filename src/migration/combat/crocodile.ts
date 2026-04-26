import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_UNIT_DEATH,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_STATE_MAX_LIFE,
  WEAPON_TYPE_WHOKNOWS,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  getGlobal,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const CROCODILE_UNIT_ID = FourCC("O005")

function destroyEffectLater(fx: effect, duration: number): void {
  const t = CreateTimer()
  TimerStart(t, duration, false, () => {
    DestroyEffect(fx)
    DestroyTimer(t)
  })
}

/**
 * 冲刺逻辑重构。
 */
function runCrocodileRush(caster: unit, targetX: number, targetY: number, damage: number): void {
  const startX = GetUnitX(caster)
  const startY = GetUnitY(caster)
  // 【同步加固】使用 Lua 5.3 标准的 math.atan
  const angle = math.atan(targetY - startY, targetX - startX)
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

    GroupClear(SYNC_GROUP)
    GroupEnumUnitsInRange(SYNC_GROUP, curX, curY, 150.0, null)
    ForGroup(SYNC_GROUP, () => {
      const u = GetEnumUnit()
      const uid = GetHandleId(u)
      if (!hitMap[uid] && IsUnitEnemy(u, GetOwningPlayer(caster)) && GetWidgetLife(u) > 0.405) {
        hitMap[uid] = true
        UnitDamageTarget(caster, u, damage, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
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
  
  // 使用同步加固的玩家事件监听
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  
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

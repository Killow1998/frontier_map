import { ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, UNIT_STATE_LIFE, WEAPON_TYPE_WHOKNOWS } from "@eiriksgata/wc3ts/src/globals/define"
import { disableLegacyTrigger, getGlobal, isHumanMercenaryPlayer, replaceGlobalTrigger } from "../core/helpers"

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(effectHandle: effect, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * swimming：
 * 5 秒后启动水牢环境伤害循环，每 0.5 秒对玩家单位造成溺水伤害。
 */
function registerSwimmingTrigger(): void {
  disableLegacyTrigger("gg_trg_swimming")
  const triggerHandle = CreateTrigger()
  TriggerRegisterTimerEvent(triggerHandle, 5.0, false)
  TriggerAddAction(triggerHandle, () => {
    const timerHandle = CreateTimer()
    TimerStart(timerHandle, 0.5, true, () => {
      const swimmingRect = getGlobal<rect>("gg_rct_swimmingpool")
      const damageSource = getGlobal<unit>("gg_unit_e00A_0205")
      if (!swimmingRect || !damageSource || GetUnitState(damageSource, UNIT_STATE_LIFE()) <= 0.405) {
        return
      }

      const groupHandle = CreateGroup()
      GroupEnumUnitsInRect(groupHandle, swimmingRect, null)
      ForGroup(groupHandle, () => {
        const unitHandle = GetEnumUnit()
        if (!isHumanMercenaryPlayer(GetOwningPlayer(unitHandle))) {
          return
        }
        const effectHandle = AddSpecialEffectTarget("Abilities\\Weapons\\SteamMissile\\SteamMissile.mdl", unitHandle, "overhead")
        destroyEffectLater(effectHandle, 0.3)
        UnitDamageTarget(
          damageSource,
          unitHandle,
          100.0,
          false,
          false,
          ATTACK_TYPE_NORMAL(),
          DAMAGE_TYPE_NORMAL(),
          WEAPON_TYPE_WHOKNOWS()
        )
      })
      DestroyGroup(groupHandle)
    })
  })
  replaceGlobalTrigger("gg_trg_swimming", triggerHandle)
}

/**
 * 入口：迁移 swimming 触发器。
 */
export function migrateSwimmingTrigger(): void {
  registerSwimmingTrigger()
}

import { ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, EVENT_PLAYER_UNIT_SPELL_EFFECT, UNIT_STATE_MAX_LIFE, UNIT_TYPE_HERO, UNIT_TYPE_STRUCTURE, WEAPON_TYPE_WHOKNOWS, bj_DEGTORAD, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

const COUNTDOWN_TEXT_SCALE = 0.074

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
 * 延迟销毁文字标签。
 */
function destroyTextTagLater(textTag: texttag, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    DestroyTextTag(textTag)
    DestroyTimer(timerHandle)
  })
}

/**
 * 沿指定方向创建路径指示器（用于读条阶段预警轨迹）。
 */
function createLinearTelegraph(
  startX: number,
  startY: number,
  angleDegrees: number,
  distance: number,
  segments: number,
  model: string,
  duration: number
): void {
  for (let i = 0; i <= segments; i++) {
    const ratio = i / math.max(1, segments)
    const x = startX + distance * ratio * Cos(angleDegrees * bj_DEGTORAD)
    const y = startY + distance * ratio * Sin(angleDegrees * bj_DEGTORAD)
    const telegraphFx = AddSpecialEffect(model, x, y)
    destroyEffectLater(telegraphFx, duration)
  }
}

/**
 * 创建单位头顶倒计时文字。
 */
function createCountdownTextTag(whichUnit: unit, text: string): texttag {
  const textTag = CreateTextTag()
  SetTextTagText(textTag, text, COUNTDOWN_TEXT_SCALE)
  SetTextTagPosUnit(textTag, whichUnit, 15.0)
  SetTextTagColor(textTag, 255, 28, 28, 255)
  SetTextTagPermanent(textTag, false)
  SetTextTagLifespan(textTag, 0.75)
  SetTextTagFadepoint(textTag, 0.45)
  return textTag
}

/**
 * 处理带倒计时的施法流程。
 */
function runCountDown(
  initialCount: number,
  interval: number,
  onTick: (remaining: number) => boolean
): void {
  let remaining = initialCount
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, interval, true, () => {
    const shouldStop = onTick(remaining)
    if (shouldStop || remaining <= 0) {
      DestroyTimer(timerHandle)
      return
    }
    remaining--
  })
}

/**
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405
}

/**
 * 缺少 YDWEJumpTimer 时的抛物跳跃回退（避免“走过去”的观感）。
 */
function startLeapFallback(whichUnit: unit, targetX: number, targetY: number, duration: number, step: number): void {
  const startX = GetUnitX(whichUnit)
  const startY = GetUnitY(whichUnit)
  const flyAbilityId = FourCC("Amrf")
  if (GetUnitAbilityLevel(whichUnit, flyAbilityId) <= 0) {
    UnitAddAbility(whichUnit, flyAbilityId)
    UnitRemoveAbility(whichUnit, flyAbilityId)
  }
  PauseUnit(whichUnit, true)
  SetUnitPathing(whichUnit, false)
  SetUnitAnimation(whichUnit, "attack")
  let elapsed = 0.0
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, step, true, () => {
    if (!isUnitAlive(whichUnit)) {
      SetUnitFlyHeight(whichUnit, 0.0, 0.0)
      SetUnitPathing(whichUnit, true)
      PauseUnit(whichUnit, false)
      DestroyTimer(timerHandle)
      return
    }
    elapsed += step
    const t = math.min(1.0, elapsed / math.max(0.03, duration))
    SetUnitX(whichUnit, startX + (targetX - startX) * t)
    SetUnitY(whichUnit, startY + (targetY - startY) * t)
    SetUnitFlyHeight(whichUnit, 420.0 * 4.0 * t * (1.0 - t), 0.0)
    if (t >= 1.0) {
      SetUnitFlyHeight(whichUnit, 0.0, 0.0)
      SetUnitPathing(whichUnit, true)
      PauseUnit(whichUnit, false)
      SetUnitAnimation(whichUnit, "stand")
      DestroyTimer(timerHandle)
    }
  })
}

/**
 * 用脚本模拟弹道单位的命中判定：由施法者直接结算伤害，马甲仅用于表现。
 */
function startProjectileDamageSimulation(
  caster: unit,
  projectile: unit,
  owner: player,
  damage: number,
  duration: number,
  step: number,
  hitRadius: number,
  angleDegrees: number,
  travelDistance: number,
  simulateMovement: boolean
): void {
  const hitSet: Record<number, true> = {}
  let elapsed = 0.0
  const totalSteps = math.max(1, R2I(duration / step))
  const perStepDistance = travelDistance / totalSteps
  const angleRad = angleDegrees * bj_DEGTORAD
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, step, true, () => {
    elapsed += step
    if (elapsed >= duration || !isUnitAlive(caster) || !isUnitAlive(projectile)) {
      DestroyTimer(timerHandle)
      return
    }
    if (simulateMovement) {
      SetUnitX(projectile, GetUnitX(projectile) + perStepDistance * Cos(angleRad))
      SetUnitY(projectile, GetUnitY(projectile) + perStepDistance * Sin(angleRad))
    }
    const groupHandle = CreateGroup()
    GroupEnumUnitsInRange(groupHandle, GetUnitX(projectile), GetUnitY(projectile), hitRadius, null)
    ForGroup(groupHandle, () => {
      const target = GetEnumUnit()
      const targetId = GetHandleId(target)
      if (!targetId || hitSet[targetId]) {
        return
      }
      if (!IsUnitEnemy(target, owner) || IsUnitType(target, UNIT_TYPE_STRUCTURE()) || !isUnitAlive(target)) {
        return
      }
      hitSet[targetId] = true
      UnitDamageTarget(caster, target, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
    })
    DestroyGroup(groupHandle)
  })
}

/**
 * 施法弹幕：三向火焰推进。
 */
function registerFireBlastTrigger(): void {
  disableLegacyTrigger("gg_trg_fire_blast")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A074")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const centerX = GetUnitX(caster)
    const centerY = GetUnitY(caster)
    const facing = GetUnitFacing(caster)
    const damage = GetHeroInt(caster, true) * 4.44
    const lightningAngles = [0, 45, -45]
    const lightningHandles: lightning[] = []

    PauseUnit(caster, true)
    SetUnitAnimation(caster, "stand")
    SetUnitAnimation(caster, "channel")

    for (const angleDelta of lightningAngles) {
      const angleRad = (facing + angleDelta) * bj_DEGTORAD
      const endX = centerX + 777.0 * Cos(angleRad)
      const endY = centerY + 777.0 * Sin(angleRad)
      const lightningHandle = AddLightning("MFPB", true, centerX, centerY, endX, endY)
      lightningHandles.push(lightningHandle)
      createLinearTelegraph(centerX, centerY, facing + angleDelta, 777.0, 10, "Abilities\\Spells\\Other\\BrakeLights\\BrakeLights.mdl", 6.2)
    }

    runCountDown(5, 1.0, (remaining) => {
      const textTag = createCountdownTextTag(caster, I2S(remaining))
      destroyTextTagLater(textTag, 0.75)
      if (remaining > 0) {
        return false
      }

      for (const lightningHandle of lightningHandles) {
        DestroyLightning(lightningHandle)
      }

      const patternRushSlide = getGlobal<
        (whichUnit: unit, angle: number, distance: number, duration: number, step: number, damageValue: number, flagA: boolean, flagB: boolean, flagC: boolean, attachment: string, modelA: string, modelB: string) => void
      >("YDWETimerPatternRushSlide")
      const removeUnitLater = getGlobal<(seconds: number, targetUnit: unit) => void>("YDWETimerRemoveUnit")

      for (const angleDelta of lightningAngles) {
        const angle = facing + angleDelta
        const projectile = CreateUnit(owner, FourCC("u003"), centerX, centerY, angle)
        if (patternRushSlide) {
          patternRushSlide(
            projectile,
            angle,
            777.0,
            4.0,
            0.03,
            0.0,
            false,
            true,
            true,
            "origin",
            "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl",
            "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl"
          )
        }
        startProjectileDamageSimulation(caster, projectile, owner, damage, 4.0, 0.03, 120.0, angle, 777.0, !patternRushSlide)

        if (removeUnitLater) {
          removeUnitLater(4.0, projectile)
        } else {
          const removeTimer = CreateTimer()
          TimerStart(removeTimer, 4.0, false, () => {
            RemoveUnit(projectile)
            DestroyTimer(removeTimer)
          })
        }
      }

      SetUnitAnimation(caster, "stand")
      PauseUnit(caster, false)
      return true
    })
  })
  replaceGlobalTrigger("gg_trg_fire_blast", triggerHandle)
}

/**
 * slime_hit：冲锋后落点范围伤害。
 */
function registerSlimeHitTrigger(): void {
  disableLegacyTrigger("gg_trg_slime_hit")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A07R")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const target = GetSpellTargetUnit()
    if (!target) {
      print("slime_hit target is missing")
      return
    }
    const targetX = GetUnitX(target)
    const targetY = GetUnitY(target)
    const damage = GetUnitState(caster, UNIT_STATE_MAX_LIFE()) * 0.65

    const clapFx = AddSpecialEffect("Abilities\\Spells\\Human\\ThunderClap\\ThunderClapCaster.mdl", targetX, targetY)
    destroyEffectLater(clapFx, 0.30)
    const effectHandle = AddSpecialEffect("Abilities\\Spells\\Other\\TalkToMe\\TalkToMe.mdl", targetX, targetY)
    destroyEffectLater(effectHandle, 5.1)
    for (let index = 0; index <= 12; index++) {
      const angleRad = 30.0 * index * bj_DEGTORAD
      const fx = AddSpecialEffect("Doodads\\Cinematic\\GlowingRunes\\GlowingRunes6.mdl", targetX + 250.0 * Cos(angleRad), targetY + 250.0 * Sin(angleRad))
      destroyEffectLater(fx, 5.1)
    }

    PauseUnit(caster, true)
    SetUnitInvulnerable(caster, true)
    SetUnitAnimation(caster, "attack")

    runCountDown(3, 1.0, (remaining) => {
      const textTag = createCountdownTextTag(caster, I2S(remaining))
      destroyTextTagLater(textTag, 0.75)
      if (remaining > 0) {
        return false
      }

      SetUnitAnimation(caster, "stand")
      PauseUnit(caster, false)
      SetUnitInvulnerable(caster, false)
      startLeapFallback(caster, targetX, targetY, 2.0, 0.03)

      const impactTimer = CreateTimer()
      TimerStart(impactTimer, 2.0, false, () => {
        const impactFx = AddSpecialEffect("Abilities\\Spells\\Human\\ThunderClap\\ThunderClapCaster.mdl", targetX, targetY)
        destroyEffectLater(impactFx, 0.3)
        const groupHandle = CreateGroup()
        GroupEnumUnitsInRange(groupHandle, targetX, targetY, 250.0, null)
        ForGroup(groupHandle, () => {
          const enumUnit = GetEnumUnit()
          if (IsUnitEnemy(enumUnit, owner) && !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) && GetWidgetLife(enumUnit) > 0.405) {
            UnitDamageTarget(caster, enumUnit, damage, false, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
          }
        })
        DestroyGroup(groupHandle)
        DestroyTimer(impactTimer)
      })

      return true
    })
  })
  replaceGlobalTrigger("gg_trg_slime_hit", triggerHandle)
}

/**
 * fire_arrow：持续追踪弹射箭。
 */
function registerFireArrowTrigger(): void {
  disableLegacyTrigger("gg_trg_fire_arrow")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === FourCC("A07J")))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const owner = GetOwningPlayer(caster)
    const centerX = GetUnitX(caster)
    const centerY = GetUnitY(caster)
    const facing = GetUnitFacing(caster)
    const damage = GetHeroInt(caster, true) * 7.77
    const patternRushSlide = getGlobal<
      (whichUnit: unit, angle: number, distance: number, duration: number, step: number, damageValue: number, flagA: boolean, flagB: boolean, flagC: boolean, attachment: string, modelA: string, modelB: string) => void
    >("YDWETimerPatternRushSlide")
    const removeUnitLater = getGlobal<(seconds: number, targetUnit: unit) => void>("YDWETimerRemoveUnit")

    PauseUnit(caster, true)
    SetUnitAnimation(caster, "stand")
    SetUnitAnimation(caster, "ready")
    createLinearTelegraph(centerX, centerY, facing, 800.0, 10, "Abilities\\Spells\\Other\\BrakeLights\\BrakeLights.mdl", 2.0)

    runCountDown(1, 1.0, (remaining) => {
      const textTag = createCountdownTextTag(caster, I2S(remaining))
      destroyTextTagLater(textTag, 0.75)
      if (remaining > 0) {
        return false
      }

      const projectile = CreateUnit(owner, FourCC("u009"), centerX, centerY, facing)
      if (patternRushSlide) {
        patternRushSlide(
          projectile,
          facing,
          1200.0,
          6.0,
          0.03,
          0.0,
          false,
          true,
          true,
          "origin",
          "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl",
          "Abilities\\Spells\\Other\\BreathOfFire\\BreathOfFireDamage.mdl"
        )
      }
      startProjectileDamageSimulation(caster, projectile, owner, damage, 4.7, 0.03, 100.0, facing, 1200.0, !patternRushSlide)
      if (removeUnitLater) {
        removeUnitLater(4.7, projectile)
      } else {
        const removeTimer = CreateTimer()
        TimerStart(removeTimer, 4.7, false, () => {
          RemoveUnit(projectile)
          DestroyTimer(removeTimer)
        })
      }

      const trailTimer = CreateTimer()
      TimerStart(trailTimer, 0.5, true, () => {
        if (GetWidgetLife(projectile) <= 0.405) {
          DestroyTimer(trailTimer)
          return
        }
        const trail = CreateUnit(owner, FourCC("u00A"), GetUnitX(projectile), GetUnitY(projectile), bj_UNIT_FACING)
        if (removeUnitLater) {
          removeUnitLater(7.0, trail)
        } else {
          const trailRemoveTimer = CreateTimer()
          TimerStart(trailRemoveTimer, 7.0, false, () => {
            RemoveUnit(trail)
            DestroyTimer(trailRemoveTimer)
          })
        }
      })

      SetUnitAnimation(caster, "stand")
      PauseUnit(caster, false)
      return true
    })
  })
  replaceGlobalTrigger("gg_trg_fire_arrow", triggerHandle)
}

/**
 * 入口：迁移 fire_blast / slime_hit / fire_arrow。
 */
export function migrateSpellBurstTriggers(): void {
  registerFireBlastTrigger()
  registerSlimeHitTrigger()
  registerFireArrowTrigger()
}

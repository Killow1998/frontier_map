import {
  ATTACK_TYPE_MELEE,
  DAMAGE_TYPE_NORMAL,
  PLAYER_NEUTRAL_AGGRESSIVE,
  UNIT_STATE_ATTACK_MAX,
  UNIT_STATE_ATTACK_MIX,
  UNIT_TYPE_HERO,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  getFallbackAttackBonus,
  getGlobal,
  getRecentAttackInfo,
  overrideCurrentEventDamage,
  registerAnyUnitDamagedEvent,
  replaceGlobalTrigger
} from "../core/helpers"

const DAY_TIME_FLAG_KEY = 0x767B29CC
const SIN_BONE_CHILD_KEY = 0x6CCF2C68
const BULLET_FLY_CHANCE_BY_LEVEL = [25, 35, 50]
let hasWarnedMissingEventDamageOverride = false

/**
 * 读取单位背包中的指定物品。
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
 * 判断单位是否携带指定物品。
 */
function hasItem(unitHandle: unit, itemTypeId: number): boolean {
  return findItemByTypeId(unitHandle, itemTypeId) !== undefined
}

/**
 * 计算单位间距离。
 */
function distanceBetweenUnits(a: unit, b: unit): number {
  const dx = GetUnitX(a) - GetUnitX(b)
  const dy = GetUnitY(a) - GetUnitY(b)
  return SquareRoot(dx * dx + dy * dy)
}

/**
 * 在同一个伤害事件内改写最终伤害。
 */
function applyDamageOverride(finalDamage: number): void {
  const nextDamage = finalDamage < 0.0 ? 0.0 : finalDamage
  if (overrideCurrentEventDamage(nextDamage)) {
    return
  }
  if (!hasWarnedMissingEventDamageOverride) {
    hasWarnedMissingEventDamageOverride = true
    print("[migration] Missing EXSetEventDamage/BlzSetEventDamage; damage rewrite skipped")
  }
}

/**
 * 延迟销毁特效。
 */
function destroyEffectLater(duration: number, effectHandle: effect): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
}

/**
 * 延迟销毁文字。
 */
function destroyTextTagLater(duration: number, textTag: texttag): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, duration, false, () => {
    DestroyTextTag(textTag)
    DestroyTimer(timerHandle)
  })
}

/**
 * 百分比颜色转 0-255。
 */
function percentToColor255(percent: number): number {
  const v = R2I(percent * 2.55)
  if (v < 0) {
    return 0
  }
  if (v > 255) {
    return 255
  }
  return v
}

/**
 * 创建战斗漂字。
 */
function createCombatTextTag(
  content: string,
  whichUnit: unit,
  zOffset: number,
  size: number,
  redPercent: number,
  greenPercent: number,
  bluePercent: number,
  transparencyPercent: number
): texttag {
  const textTag = CreateTextTag()
  const height = size > 0 ? size * 0.0023 : 0.023
  SetTextTagText(textTag, content, height)
  SetTextTagPosUnit(textTag, whichUnit, zOffset)
  SetTextTagColor(
    textTag,
    percentToColor255(redPercent),
    percentToColor255(greenPercent),
    percentToColor255(bluePercent),
    percentToColor255(100.0 - transparencyPercent)
  )
  SetTextTagPermanent(textTag, false)
  return textTag
}

/**
 * 根据伤害来源玩家创建颜色漂字。
 */
function showDamageTextBySourceOwner(source: unit, target: unit, damage: number, textSize: number, critical: boolean): void {
  const owner = GetOwningPlayer(source)
  const ownerId = GetPlayerId(owner)
  const criticalText = critical
  let red = 100.0
  let green = 100.0
  let blue = 100.0
  let alpha = 0.0

  if (ownerId === 0) {
    red = 100.0; green = 0.0; blue = 0.0; alpha = 0.0
  } else if (ownerId === 1) {
    red = 0.0; green = 0.0; blue = 100.0; alpha = 0.0
  } else if (ownerId === 2) {
    red = 0.0; green = 100.0; blue = 100.0; alpha = 0.0
  } else if (ownerId === 3) {
    red = 50.2; green = 0.0; blue = 50.2; alpha = 0.0
  } else if (ownerId === 4) {
    red = 100.0; green = 100.0; blue = 0.0; alpha = 0.0
  } else if (ownerId === 5) {
    red = 100.0; green = 50.2; blue = 0.0; alpha = 0.0
  } else if (ownerId === 6) {
    red = 0.0; green = 100.0; blue = 0.0; alpha = 0.0
  } else if (ownerId === 7) {
    red = 100.0; green = 0.0; blue = 100.0; alpha = 0.0
  } else if (ownerId === 8) {
    red = 50.2; green = 50.2; blue = 50.2; alpha = 0.0
  } else if (ownerId === 9) {
    red = 0.0; green = 50.2; blue = 100.0; alpha = 0.0
  } else if (ownerId === 10) {
    red = 0.0; green = 50.2; blue = 0.0; alpha = 0.0
  } else if (ownerId === 11) {
    red = 50.2; green = 25.1; blue = 0.0; alpha = 0.0
  } else if (ownerId === PLAYER_NEUTRAL_AGGRESSIVE) {
    red = 55.0; green = 25.1; blue = 12.5; alpha = 30.0
  }

  const content = criticalText ? ("会心 " + I2S(R2I(damage))) : I2S(R2I(damage))
  const size = criticalText ? textSize + 2.0 : textSize
  const textTag = createCombatTextTag(content, target, 0.0, size, red, green, blue, alpha)
  const setVelocityBJ = getGlobal<(targetTextTag: texttag, speed: number, angle: number) => void>("SetTextTagVelocityBJ")
  if (setVelocityBJ) {
    setVelocityBJ(textTag, 80.0, GetRandomReal(70.0, 110.0))
  } else {
    SetTextTagVelocity(textTag, 0.0, 0.04)
  }
  destroyTextTagLater(2.0, textTag)
}

/**
 * show_da：
 * 统一处理战斗表现与伤害修正（格挡、反击、会心、飞弹、装备修正、伤害飘字等）。
 */
function registerShowDaTrigger(): void {
  disableLegacyTrigger("gg_trg_show_da")
  const triggerHandle = CreateTrigger()
  registerAnyUnitDamagedEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => GetEventDamage() >= 1.0))
  TriggerAddAction(triggerHandle, () => {
    const target = GetTriggerUnit()
    const source = GetEventDamageSource()
    const originalDamage = GetEventDamage()
    let damage = originalDamage
    let criticalTriggered = false
    const textSize = getGlobal<number>("udg_textsize") ?? 10.0
    const ydht = getGlobal<hashtable>("YDHT")
    const attackInfo = getRecentAttackInfo(source, target)

    const setDamage = (value: number) => {
      damage = value < 0.0 ? 0.0 : value
    }

    if (attackInfo.isAttack) {
      const fallbackAttackBonus = getFallbackAttackBonus(source)
      if (fallbackAttackBonus > 0) {
        setDamage(damage + fallbackAttackBonus)
      }
    }

    const swimmingRect = getGlobal<rect>("gg_rct_swimmingpool")
    if (swimmingRect && GetUnitTypeId(target) === FourCC("U00K")) {
      const inSwimming = GetUnitX(source) >= GetRectMinX(swimmingRect) &&
        GetUnitX(source) <= GetRectMaxX(swimmingRect) &&
        GetUnitY(source) >= GetRectMinY(swimmingRect) &&
        GetUnitY(source) <= GetRectMaxY(swimmingRect)
      if (!inSwimming) {
        const fx = AddSpecialEffectTarget("Abilities\\Spells\\Human\\Defend\\DefendCaster.mdl", target, "chest")
        destroyEffectLater(0.5, fx)
        setDamage(0.0)
        applyDamageOverride(damage)
        return
      }
    }

    if (attackInfo.isRanged && distanceBetweenUnits(target, source) >= 567.0 && IsUnitType(target, UNIT_TYPE_HERO()) && hasItem(target, FourCC("I03D"))) {
      const fx = AddSpecialEffectTarget("Abilities\\Spells\\Human\\Defend\\DefendCaster.mdl", target, "chest")
      destroyEffectLater(0.5, fx)
      setDamage(0.0)
      applyDamageOverride(damage)
      return
    }

    // 命中/闪避阶段：用脚本接管“命中/闪避/绝对命中”，避免依赖原生闪避与 Never Miss 取巧。
    if (attackInfo.isAttack && IsUnitEnemy(target, GetOwningPlayer(source))) {
      // 陨星盾：远程格挡（前置以避免后续 on-hit 逻辑在“应当无伤”的情况下仍继续跑）。
      if (hasItem(target, FourCC("I03Q")) && attackInfo.isRanged) {
        if (GetRandomInt(1, 100) <= 39) {
          setDamage(0.0)
          const blockTag = createCombatTextTag("格挡", target, -108.0, textSize, 40.0, 70.0, 100.0, 25.0)
          const setVelocityBJ = getGlobal<(targetTextTag: texttag, speed: number, angle: number) => void>("SetTextTagVelocityBJ")
          if (setVelocityBJ) {
            setVelocityBJ(blockTag, 64.0, 45.0)
          } else {
            SetTextTagVelocity(blockTag, 0.02, 0.02)
          }
          destroyTextTagLater(1.5, blockTag)
          applyDamageOverride(damage)
          return
        }
      }

      // 帝国之盾：概率格挡普攻（原图用原生 miss 表达，这里改为触发器控制）。
      if (GetUnitAbilityLevel(target, FourCC("A0AQ")) > 0) {
        if (GetRandomInt(1, 100) <= 40) {
          setDamage(0.0)
          const blockTag = createCombatTextTag("格挡", target, -108.0, textSize, 40.0, 70.0, 100.0, 25.0)
          const setVelocityBJ = getGlobal<(targetTextTag: texttag, speed: number, angle: number) => void>("SetTextTagVelocityBJ")
          if (setVelocityBJ) {
            setVelocityBJ(blockTag, 64.0, 45.0)
          } else {
            SetTextTagVelocity(blockTag, 0.02, 0.02)
          }
          destroyTextTagLater(1.5, blockTag)
          applyDamageOverride(damage)
          return
        }
      }

      // 绝对命中（陨星系武器）：先额外掷一次；成功则直接命中，不再进入闪避判定。
      // - 星辰打击：100% 绝对命中
      // - 星辰连打：66% 绝对命中
      let absoluteHitChance = 0
      if (GetUnitAbilityLevel(source, FourCC("A0AA")) > 0) {
        absoluteHitChance = 100
      } else if (GetUnitAbilityLevel(source, FourCC("A0AG")) > 0) {
        absoluteHitChance = 66
      }

      const isAbsoluteHit = absoluteHitChance > 0 && GetRandomInt(1, 100) <= absoluteHitChance
      if (!isAbsoluteHit) {
        // 闪避：采用“乘法叠加（独立事件）”，即 combined = 1 - Π(1 - p)。
        // 例：40% 和 40% => 1 - 0.6*0.6 = 64%。
        let missProduct = 1.0

        const applyDodgeChance = (chancePercent: number) => {
          const p = Math.max(0.0, Math.min(100.0, chancePercent)) / 100.0
          missProduct *= (1.0 - p)
        }

        // 闪避来源（名称见 agnet.md 持久化记录）：
        if (GetUnitAbilityLevel(target, FourCC("A04L")) > 0) {
          applyDodgeChance(77)
        }
        if (GetUnitAbilityLevel(target, FourCC("A08R")) > 0) {
          applyDodgeChance(66)
        }
        if (GetUnitAbilityLevel(target, FourCC("A0AB")) > 0) {
          applyDodgeChance(100)
        }
        if (GetUnitAbilityLevel(target, FourCC("A00W")) > 0) {
          applyDodgeChance(20)
        }
        if (GetUnitAbilityLevel(target, FourCC("A00X")) > 0) {
          applyDodgeChance(35)
        }
        if (GetUnitAbilityLevel(target, FourCC("A09K")) > 0) {
          applyDodgeChance(14)
        }

        const combinedDodge = Math.max(0.0, Math.min(1.0, 1.0 - missProduct))
        const dodged = combinedDodge > 0.0 && GetRandomInt(1, 10000) <= R2I(combinedDodge * 10000.0)
        if (dodged) {
          setDamage(0.0)
          const dodgeTag = createCombatTextTag("闪避", target, -108.0, textSize, 70.0, 70.0, 70.0, 25.0)
          const setVelocityBJ = getGlobal<(targetTextTag: texttag, speed: number, angle: number) => void>("SetTextTagVelocityBJ")
          if (setVelocityBJ) {
            setVelocityBJ(dodgeTag, 64.0, 45.0)
          } else {
            SetTextTagVelocity(dodgeTag, 0.02, 0.02)
          }
          destroyTextTagLater(1.5, dodgeTag)
          applyDamageOverride(damage)
          return
        }
      }
    }

    if (attackInfo.isAttack && !attackInfo.isRanged && IsUnitType(target, UNIT_TYPE_HERO()) && hasItem(target, FourCC("I03D")) && GetRandomInt(1, 100) <= 9) {
      const facing = Atan2(GetUnitY(source) - GetUnitY(target), GetUnitX(source) - GetUnitX(target)) / bj_DEGTORAD
      SetUnitFacing(target, facing)
      SetUnitTimeScale(target, 9.0)
      SetUnitAnimation(target, "attack")
      let hitCount = 0
      const timerHandle = CreateTimer()
      TimerStart(timerHandle, 0.06, true, () => {
        hitCount++
        UnitDamageTarget(
          target,
          source,
          GetRandomReal(GetUnitState(target, UNIT_STATE_ATTACK_MIX()), GetUnitState(target, UNIT_STATE_ATTACK_MAX())),
          true,
          false,
          ATTACK_TYPE_MELEE(),
          DAMAGE_TYPE_NORMAL(),
          WEAPON_TYPE_WHOKNOWS()
        )
        if (hitCount >= 3) {
          SetUnitTimeScale(target, 1.0)
          SetUnitAnimation(target, "stand")
          DestroyTimer(timerHandle)
        }
      })
    }

    if (attackInfo.isAttack && GetUnitAbilityLevel(source, FourCC("A006")) > 0 && IsUnitType(source, UNIT_TYPE_HERO()) && IsUnitEnemy(target, GetOwningPlayer(source))) {
      const agi = GetHeroAgi(source, true)
      const intel = GetHeroInt(source, true)
      const level = GetUnitAbilityLevel(source, FourCC("A006"))
      const chance = Math.max(0.0, Math.min(65.0, I2R(agi) * 0.05 + (I2R(level) * 2.5 + 12.5)))
      const rate = I2R(intel) * 0.01 + I2R(level) * 0.05
      if (GetRandomInt(1, 10000) <= R2I(chance * 100.0)) {
        setDamage(damage + damage * rate)
        criticalTriggered = true
      }
    }

    if (IsUnitType(source, UNIT_TYPE_HERO()) && GetUnitTypeId(source) === FourCC("E002") && GetUnitAbilityLevel(source, FourCC("A06L")) > 0 && attackInfo.isAttack) {
      const level = GetUnitAbilityLevel(source, FourCC("A06L"))
      const chance = BULLET_FLY_CHANCE_BY_LEVEL[Math.max(0, Math.min(BULLET_FLY_CHANCE_BY_LEVEL.length - 1, level - 1))]
      if (GetRandomInt(1, 100) <= chance) {
        const distance = distanceBetweenUnits(target, source)
        if (distance <= 444.0) {
          const dummy = CreateUnit(GetOwningPlayer(source), FourCC("ewsp"), GetUnitX(target), GetUnitY(target), 270.0)
          ShowUnit(dummy, false)
          SetUnitInvulnerable(dummy, true)
          UnitAddAbility(dummy, FourCC("A06M"))
          SetUnitAbilityLevel(dummy, FourCC("A06M"), Math.max(1, Math.min(3, level)))
          IssueTargetOrder(dummy, "thunderbolt", target)
          const timerHandle = CreateTimer()
          TimerStart(timerHandle, 1.0, false, () => {
            RemoveUnit(dummy)
            DestroyTimer(timerHandle)
          })
        } else {
          const fx = AddSpecialEffectTarget("Objects\\Spawnmodels\\Human\\HumanBlood\\HeroBloodElfBlood.mdl", target, "chest")
          destroyEffectLater(0.5, fx)
          setDamage(damage * (distance / 444.0))
        }
      }
    }

    if (IsUnitType(source, UNIT_TYPE_HERO()) && hasItem(source, FourCC("I034"))) {
      setDamage(damage * 1.33)
    }
    if (IsUnitType(target, UNIT_TYPE_HERO()) && hasItem(target, FourCC("I034"))) {
      setDamage(damage * 1.49)
    }

    if (hasItem(target, FourCC("I00T"))) {
      const isNight = ydht ? !LoadBoolean(ydht, StringHash("时间"), DAY_TIME_FLAG_KEY) : false
      if (GetUnitTypeId(source) === FourCC("n01B") || hasItem(source, FourCC("I021")) || isNight) {
        if (GetRandomInt(1, 500) <= 7) {
          const fx = AddSpecialEffectTarget("Abilities\\Spells\\NightElf\\Starfall\\StarfallCaster.mdl", target, "origin")
          destroyEffectLater(0.5, fx)
          const oldItem = findItemByTypeId(target, FourCC("I00T"))
          if (oldItem) {
            RemoveItem(oldItem)
          }
          UnitAddItem(target, CreateItem(FourCC("I00W"), GetUnitX(target), GetUnitY(target)))
          DisplayTextToPlayer(GetOwningPlayer(target), 0, 0, "您的雇佣兵已得到最佳的防护")
        }
      }
    }

    if (hasItem(source, FourCC("I03Q"))) {
      setDamage(damage * 0.88)
    }

    if (IsUnitType(target, UNIT_TYPE_HERO()) && GetUnitTypeId(target) === FourCC("H004") && hasItem(target, FourCC("I040")) && ydht) {
      const boneCount = LoadInteger(ydht, FourCC("H004"), SIN_BONE_CHILD_KEY)
      if (boneCount > 0) {
        const boneItem = findItemByTypeId(target, FourCC("I040"))
        if (boneItem) {
          SetItemCharges(boneItem, boneCount)
        }
        setDamage(damage - I2R(boneCount))
      }
    }

    applyDamageOverride(damage)
    showDamageTextBySourceOwner(source, target, damage, textSize, criticalTriggered)
  })
  replaceGlobalTrigger("gg_trg_show_da", triggerHandle)
}

/**
 * 入口：迁移 show_da 触发器。
 */
export function migrateShowDaTrigger(): void {
  registerShowDaTrigger()
}

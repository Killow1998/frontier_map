import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_UNIT_DEATH,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE,
  WEAPON_TYPE_WHOKNOWS,
  bj_DEGTORAD,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  markRecentAttackInfo,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger
} from "../core/helpers"

const WATER_SHIELD_ABILITY_ID = FourCC("A04T")
const WINDMILL_SOURCE_UNIT_ID = FourCC("h00I")
const WINDMILL_UNIT_ID = FourCC("n01B")
const WINDMILL_ITEM_ID = FourCC("I037")
const REINFORCEMENT_UNIT_ID = FourCC("h00T")
const REINFORCEMENT_CENTER_RECT = "gg_rct_footman"

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
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 生成矩形内随机点。
 */
function randomPointInRect(whichRect: rect): [number, number] {
  return [
    GetRandomReal(GetRectMinX(whichRect), GetRectMaxX(whichRect)),
    GetRandomReal(GetRectMinY(whichRect), GetRectMaxY(whichRect))
  ]
}

/**
 * 水盾：按波纹对周围敌军造成持续伤害。
 */
function registerWaterShieldTrigger(): void {
  disableLegacyTrigger("gg_trg_water_shield")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO()) && GetSpellAbilityId() === WATER_SHIELD_ABILITY_ID))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const abilityLevel = GetUnitAbilityLevel(hero, WATER_SHIELD_ABILITY_ID)
    const duration = 2.0 * abilityLevel + 6.0
    const totalTicks = Math.floor(duration / 0.25)
    const spokeCount = 2 + abilityLevel
    const timerHandle = CreateTimer()
    let elapsedTicks = 0
    let sweepAngle = 0.0

    TimerStart(timerHandle, 0.25, true, () => {
      if (!isUnitAlive(hero) || elapsedTicks >= totalTicks) {
        DestroyTimer(timerHandle)
        return
      }

      const heroX = GetUnitX(hero)
      const heroY = GetUnitY(hero)
      const damage = 25.0 * abilityLevel + 0.5 * GetHeroInt(hero, true)
      const angleStep = 360.0 / spokeCount

      for (let index = 0; index < spokeCount; index++) {
        const angleDegrees = angleStep * index + sweepAngle
        const angleRad = angleDegrees * bj_DEGTORAD
        const pointX = heroX + 275.0 * Cos(angleRad)
        const pointY = heroY + 275.0 * Sin(angleRad)
        const effectHandle = AddSpecialEffect("Abilities\\Weapons\\ZigguratFrostMissile\\ZigguratFrostMissile.mdl", pointX, pointY)
        destroyEffectLater(effectHandle, 0.25)

        const group = CreateGroup()
        GroupEnumUnitsInRange(group, pointX, pointY, 100.0, null)
        ForGroup(group, () => {
          const target = GetEnumUnit()
          if (IsUnitEnemy(target, GetOwningPlayer(hero)) && !IsUnitType(target, UNIT_TYPE_STRUCTURE()) && isUnitAlive(target)) {
            markRecentAttackInfo(hero, target, false, 0.20)
            UnitDamageTarget(hero, target, damage, true, false, ATTACK_TYPE_NORMAL(), DAMAGE_TYPE_NORMAL(), WEAPON_TYPE_WHOKNOWS())
          }
        })
        DestroyGroup(group)
      }

      elapsedTicks++
      sweepAngle += 10.0
    })
  })
  replaceGlobalTrigger("gg_trg_water_shield", triggerHandle)
}

/**
 * 风车：死亡后复位场景并重建守卫。
 */
function registerWindmillTrigger(): void {
  disableLegacyTrigger("gg_trg_Windmill")
  const triggerHandle = CreateTrigger()
  const sourceUnit = getGlobal<unit>("gg_unit_h00I_0124")
  if (sourceUnit) {
    TriggerRegisterUnitEvent(triggerHandle, sourceUnit, EVENT_UNIT_DEATH())
  }
  TriggerAddAction(triggerHandle, () => {
    const windmillRect = getGlobal<rect>("gg_rct_windmill")
    if (!windmillRect) {
      return
    }
    const centerX = GetRectCenterX(windmillRect)
    const centerY = GetRectCenterY(windmillRect)

    const effectTimer = CreateTimer()
    TimerStart(effectTimer, 2.0, false, () => {
      const effectHandle = AddSpecialEffect("Abilities\\Spells\\NightElf\\Starfall\\StarfallCaster.mdl", centerX, centerY)
      destroyEffectLater(effectHandle, 2.0)
      const spawnTimer = CreateTimer()
      TimerStart(spawnTimer, 2.0, false, () => {
        CreateUnit(Player(10), WINDMILL_UNIT_ID, centerX, centerY, GetRandomReal(0.0, 360.0))
        DestroyTimer(spawnTimer)
      })
      DestroyTimer(effectTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_Windmill", triggerHandle)
}

/**
 * 风车守卫死亡：掉落零件并延时重生。
 */
function registerWindmillDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_Windmill_death")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === WINDMILL_UNIT_ID))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    if (GetRandomInt(1, 100) <= 50) {
      CreateItem(WINDMILL_ITEM_ID, GetUnitX(deadUnit), GetUnitY(deadUnit))
    }

    const windmillRect = getGlobal<rect>("gg_rct_windmill")
    if (!windmillRect) {
      return
    }
    const centerX = GetRectCenterX(windmillRect)
    const centerY = GetRectCenterY(windmillRect)
    const respawnTimer = CreateTimer()
    TimerStart(respawnTimer, 92.0, false, () => {
      const effectHandle = AddSpecialEffect("Abilities\\Spells\\NightElf\\Starfall\\StarfallCaster.mdl", centerX, centerY)
      destroyEffectLater(effectHandle, 2.0)
      CreateUnit(Player(10), WINDMILL_UNIT_ID, centerX, centerY, GetRandomReal(0.0, 360.0))
      DestroyTimer(respawnTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_Windmill_death", triggerHandle)
}

/**
 * 援军：建筑完成后按时间轴派出两名援兵。
 */
function registerReinforcementsTrigger(): void {
  disableLegacyTrigger("gg_trg_reinforcements")
  const triggerHandle = CreateTrigger()
  TriggerAddCondition(triggerHandle, Condition(() => getGlobal<boolean>("udg_build_finish") === true))
  TriggerAddAction(triggerHandle, () => {
    const startupTimer = CreateTimer()
    TimerStart(startupTimer, 12.0, false, () => {
      displayTextToMercenaryPlayers("[穿云之信]——谢天谢地！帝国没有忘记我们，援军很快就要抵达了！")

      const reinforcementLoopTimer = CreateTimer()
      TimerStart(reinforcementLoopTimer, 12.0, true, () => {
        const anchorUnit = getGlobal<unit>("gg_unit_n001_0012")
        if (anchorUnit && !isUnitAlive(anchorUnit)) {
          DestroyTimer(reinforcementLoopTimer)
          return
        }

        const baseArea = getGlobal<rect>("gg_rct_base_area")
        if (!baseArea) {
          return
        }

        const spawnReinforcement = (): void => {
          const [x, y] = randomPointInRect(baseArea)
          const effectHandle = AddSpecialEffect("Abilities\\Spells\\Human\\MassTeleport\\MassTeleportTo.mdl", x, y)
          destroyEffectLater(effectHandle, 1.0)
          const spawnTimer = CreateTimer()
          TimerStart(spawnTimer, 0.5, false, () => {
            const unitHandle = CreateUnit(Player(4), REINFORCEMENT_UNIT_ID, x, y, bj_UNIT_FACING)
            UnitShareVision(unitHandle, Player(0), true)
            UnitShareVision(unitHandle, Player(1), true)
            UnitShareVision(unitHandle, Player(2), true)
            UnitShareVision(unitHandle, Player(3), true)
            DestroyTimer(spawnTimer)
          })
        }

        spawnReinforcement()
        spawnReinforcement()

        const attackTimer = CreateTimer()
        TimerStart(attackTimer, 3.0, false, () => {
          const footmanRect = getGlobal<rect>(REINFORCEMENT_CENTER_RECT)
          if (!footmanRect) {
            DestroyTimer(attackTimer)
            return
          }

          const attackX = GetRectCenterX(footmanRect)
          const attackY = GetRectCenterY(footmanRect)
          const group = CreateGroup()
          GroupEnumUnitsInRect(group, GetWorldBounds(), null)
          ForGroup(group, () => {
            const unitHandle = GetEnumUnit()
            if (GetUnitTypeId(unitHandle) === REINFORCEMENT_UNIT_ID) {
              IssuePointOrder(unitHandle, "attack", attackX, attackY)
            }
          })
          DestroyGroup(group)
          DestroyTimer(attackTimer)
        })
      })

      DestroyTimer(startupTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_reinforcements", triggerHandle)
}

/**
 * 入口：迁移水盾、风车与援军逻辑。
 */
export function migrateWaterWindReinforcementsTriggers(): void {
  registerWaterShieldTrigger()
  registerWindmillTrigger()
  registerWindmillDeathTrigger()
  registerReinforcementsTrigger()
}

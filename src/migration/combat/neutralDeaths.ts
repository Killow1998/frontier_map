import {
  ATTACK_TYPE_MAGIC,
  DAMAGE_TYPE_MAGIC,
  EVENT_PLAYER_UNIT_DEATH,
  EVENT_PLAYER_UNIT_SPELL_EFFECT,
  UNIT_TYPE_DEAD,
  UNIT_TYPE_HERO,
  WEAPON_TYPE_WHOKNOWS,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  registerAnyUnitDamagedEvent,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  setGlobal
} from "../core/helpers"

const SLAP_ABILITY_ID = FourCC("A04O")
const SLAP_DUMMY_ID = FourCC("e004")
const SLAP_DUMMY_STUN_ID = FourCC("A04R")

const BEAR_UNIT_ID = FourCC("n000")
const BEAR_DROP_ITEM_ID = FourCC("I01D")
const BOSS_RECT_KEY = "gg_rct______________________u"
const PLAYER_NEUTRAL = Player(10)

const GEM_DROP_ITEM_ID = FourCC("I00D")
const FIRE_PEARL_ITEM_ID = FourCC("I01B")
const TURTLE_SHELL_ITEM_ID = FourCC("I035")
const STAR_STONE_ITEM_ID = FourCC("I03S")
const LION_HEART_FRAGMENT_ID = FourCC("I036")
const SPACE_GEM_ITEM_ID = FourCC("I038")
const FIRE_CORE_ITEM_ID = FourCC("I039")
const ICE_CORE_ITEM_ID = FourCC("I03A")
const PRIEST_RING_ITEM_ID = FourCC("I00G")
const PRIEST_RING_DROP_KEY = 0x75A1C0CB

const CROCODILE_RATE_KEY = "udg_crocodile_rate"
const CROCODILE_UNIT_KEY = "gg_unit_O005_0028"
const BOSS_GROUP_KEY = "udg_boss"

type RespawnRule = {
  unitTypeId: number
  delay: number
  rectGlobal: string
  spawnTypeId: number
  useRectCenter?: boolean
}

const NEUTRAL_RESPAWN_RULES: RespawnRule[] = [
  { unitTypeId: FourCC("n004"), delay: 45.0, rectGlobal: "gg_rct________________01", spawnTypeId: FourCC("n004") },
  { unitTypeId: FourCC("n003"), delay: 35.0, rectGlobal: "gg_rct________________01", spawnTypeId: FourCC("n003") },
  { unitTypeId: FourCC("n005"), delay: 45.0, rectGlobal: "gg_rct_____________02", spawnTypeId: FourCC("n005") },
  { unitTypeId: FourCC("n006"), delay: 35.0, rectGlobal: "gg_rct_____________02", spawnTypeId: FourCC("n006") },
  { unitTypeId: FourCC("n007"), delay: 35.0, rectGlobal: "gg_rct_________________________0", spawnTypeId: FourCC("n007") },
  { unitTypeId: FourCC("n010"), delay: 42.0, rectGlobal: "gg_rct________area_11", spawnTypeId: FourCC("n010") },
  { unitTypeId: FourCC("n015"), delay: 35.0, rectGlobal: "gg_rct_bugs_area", spawnTypeId: FourCC("n015") },
  { unitTypeId: FourCC("n014"), delay: 45.0, rectGlobal: "gg_rct_bugs_area", spawnTypeId: FourCC("n014"), useRectCenter: true },
  { unitTypeId: FourCC("e007"), delay: 45.0, rectGlobal: "gg_rct_frozenArea", spawnTypeId: FourCC("e007") },
  { unitTypeId: FourCC("e008"), delay: 45.0, rectGlobal: "gg_rct_volcanoArea", spawnTypeId: FourCC("e008") },
  { unitTypeId: FourCC("n018"), delay: 35.0, rectGlobal: "gg_rct_niriu_area", spawnTypeId: FourCC("n018") },
  { unitTypeId: FourCC("n017"), delay: 45.0, rectGlobal: "gg_rct_niriu_area", spawnTypeId: FourCC("n017") },
  { unitTypeId: FourCC("n01A"), delay: 89.0, rectGlobal: "gg_rct_turtle_fucker", spawnTypeId: FourCC("n01A"), useRectCenter: true },
  { unitTypeId: FourCC("n016"), delay: 45.0, rectGlobal: "gg_rct_water_prison", spawnTypeId: FourCC("n016") },
  { unitTypeId: FourCC("n009"), delay: 35.0, rectGlobal: "gg_rct___________________5124", spawnTypeId: FourCC("n009") }
]

/**
 * 注册任意单位受伤事件。
 */
function registerAnyDamageEvent(triggerHandle: trigger): void {
  registerAnyUnitDamagedEvent(triggerHandle)
}

/**
 * 延迟移除单位。
 */
function removeUnitLater(unitHandle: unit, delay: number): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    RemoveUnit(unitHandle)
    DestroyTimer(timerHandle)
  })
}

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
 * 在矩形内生成中立生物。
 */
function spawnNeutralInRect(rule: RespawnRule): void {
  const whereRect = getGlobal<rect>(rule.rectGlobal)
  if (!whereRect) {
    return
  }
  const x = rule.useRectCenter ? GetRectCenterX(whereRect) : GetRandomReal(GetRectMinX(whereRect), GetRectMaxX(whereRect))
  const y = rule.useRectCenter ? GetRectCenterY(whereRect) : GetRandomReal(GetRectMinY(whereRect), GetRectMaxY(whereRect))
  CreateUnit(PLAYER_NEUTRAL, rule.spawnTypeId, x, y, rule.useRectCenter ? bj_UNIT_FACING : GetRandomReal(0.0, 360.0))
}

/**
 * slap：对敌方单体目标施加重击伤害并眩晕。
 */
function registerSlapTrigger(): void {
  disableLegacyTrigger("gg_trg_slap")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_EFFECT())
  TriggerAddCondition(
    triggerHandle,
    Condition(() => {
      const caster = GetTriggerUnit()
      const target = GetSpellTargetUnit()
      return (
        GetSpellAbilityId() === SLAP_ABILITY_ID &&
        !!target &&
        IsUnitType(caster, UNIT_TYPE_HERO()) &&
        !IsUnitType(target, UNIT_TYPE_DEAD()) &&
        IsUnitEnemy(target, GetOwningPlayer(caster))
      )
    })
  )
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const target = GetSpellTargetUnit()
    if (!target) {
      return
    }
    const targetX = GetUnitX(target)
    const targetY = GetUnitY(target)
    const dummy = CreateUnit(GetOwningPlayer(caster), SLAP_DUMMY_ID, targetX, targetY, GetUnitFacing(caster))
    ShowUnit(dummy, false)
    SetUnitInvulnerable(dummy, true)
    UnitAddAbility(dummy, SLAP_DUMMY_STUN_ID)
    SetUnitAbilityLevel(dummy, SLAP_DUMMY_STUN_ID, 1)
    IssueTargetOrder(dummy, "thunderbolt", target)
    removeUnitLater(dummy, 1.0)

    const damage = 300.0 + GetHeroStr(caster, true) * 5.0 + GetUnitAbilityLevel(caster, SLAP_ABILITY_ID) * 100.0
    const jumpTimer = getGlobal<(whichUnit: unit, angle: number, distance: number, duration: number, step: number, height: number) => void>("YDWEJumpTimer")
    const damageGroup = CreateGroup()
    GroupEnumUnitsInRange(damageGroup, targetX, targetY, 100.0, null)
    ForGroup(damageGroup, () => {
      const enumUnit = GetEnumUnit()
      if (GetWidgetLife(enumUnit) > 0.405 && IsUnitEnemy(enumUnit, GetOwningPlayer(caster))) {
        if (jumpTimer) {
          jumpTimer(enumUnit, 0.0, 0.1, 2.0, 0.05, 400.0)
        }
        UnitDamageTarget(caster, enumUnit, damage, true, false, ATTACK_TYPE_MAGIC(), DAMAGE_TYPE_MAGIC(), WEAPON_TYPE_WHOKNOWS())
      }
    })
    DestroyGroup(damageGroup)
  })
  replaceGlobalTrigger("gg_trg_slap", triggerHandle)
}

/**
 * Critical_hit：原逻辑已迁移到 show_da，这里仅保留伤害事件占位触发器。
 */
function registerCriticalHitTrigger(): void {
  disableLegacyTrigger("gg_trg_Critical_hit")
  const triggerHandle = CreateTrigger()
  registerAnyDamageEvent(triggerHandle)
  TriggerAddCondition(triggerHandle, Condition(() => true))
  replaceGlobalTrigger("gg_trg_Critical_hit", triggerHandle)
}

/**
 * bear_death：熊怪死亡掉落并定时重生。
 */
function registerBearDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_bear_death")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => GetUnitTypeId(GetTriggerUnit()) === BEAR_UNIT_ID))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const deadX = GetUnitX(deadUnit)
    const deadY = GetUnitY(deadUnit)
    if (GetRandomInt(1, 100) <= 85) {
      CreateItem(BEAR_DROP_ITEM_ID, deadX, deadY)
    }

    const respawnTimer = CreateTimer()
    TimerStart(respawnTimer, GetRandomReal(45.0, 80.0), false, () => {
      const bossRect = getGlobal<rect>(BOSS_RECT_KEY)
      if (bossRect) {
        const boss = CreateUnit(PLAYER_NEUTRAL, BEAR_UNIT_ID, GetRectCenterX(bossRect), GetRectCenterY(bossRect), bj_UNIT_FACING)
        const bossGroup = getGlobal<group>(BOSS_GROUP_KEY)
        if (bossGroup) {
          GroupAddUnit(bossGroup, boss)
        }
      }
      DestroyTimer(respawnTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_bear_death", triggerHandle)
}

/**
 * 中立怪死亡掉落表。
 */
function handleNeutralDeathDrops(deadUnit: unit): void {
  const deadX = GetUnitX(deadUnit)
  const deadY = GetUnitY(deadUnit)
  const unitTypeId = GetUnitTypeId(deadUnit)
  const ydht = getGlobal<hashtable>("YDHT")

  if (GetRandomInt(1, 100) <= 9 || (GetUnitLevel(deadUnit) >= 7 && GetRandomInt(1, 100) <= 15)) {
    CreateItem(GEM_DROP_ITEM_ID, deadX, deadY)
  }
  if (unitTypeId === FourCC("n009") && GetRandomInt(1, 100) <= 6) {
    CreateItem(FIRE_PEARL_ITEM_ID, deadX, deadY)
  }
  if (unitTypeId === FourCC("n01A") && GetRandomInt(1, 100) <= 40) {
    CreateItem(TURTLE_SHELL_ITEM_ID, deadX, deadY)
  }
  if (unitTypeId === FourCC("n010") && GetRandomInt(1, 100) <= 5) {
    CreateItem(STAR_STONE_ITEM_ID, deadX, deadY)
  }
  if ((unitTypeId === FourCC("n014") || unitTypeId === FourCC("n015")) && GetRandomInt(1, 100) <= 8) {
    CreateItem(LION_HEART_FRAGMENT_ID, deadX, deadY)
  }
  if ((unitTypeId === FourCC("n018") || unitTypeId === FourCC("n017")) && GetRandomInt(1, 100) <= 9) {
    CreateItem(SPACE_GEM_ITEM_ID, deadX, deadY)
  }
  if (unitTypeId === FourCC("e008") && GetRandomInt(1, 100) <= 12) {
    CreateItem(FIRE_CORE_ITEM_ID, deadX, deadY)
  }
  if (unitTypeId === FourCC("e007") && GetRandomInt(1, 100) <= 12) {
    CreateItem(ICE_CORE_ITEM_ID, deadX, deadY)
  }
  if (unitTypeId === FourCC("n016") && ydht && !LoadBoolean(ydht, PRIEST_RING_ITEM_ID, PRIEST_RING_DROP_KEY) && GetRandomInt(1, 100) <= 15) {
    CreateItem(PRIEST_RING_ITEM_ID, deadX, deadY)
    SaveBoolean(ydht, PRIEST_RING_ITEM_ID, PRIEST_RING_DROP_KEY, true)
  }
}

/**
 * n016 死亡时推进鳄鱼计数并在达标后唤醒首领。
 */
function handleCrocodileWakeOnWaterMobDeath(unitTypeId: number): void {
  if (unitTypeId !== FourCC("n016")) {
    return
  }
  const currentRate = getGlobal<number>(CROCODILE_RATE_KEY) ?? 0
  const nextRate = currentRate + 3
  setGlobal(CROCODILE_RATE_KEY, nextRate)

  const crocodile = getGlobal<unit>(CROCODILE_UNIT_KEY)
  if (!crocodile) {
    return
  }
  if (GetRandomInt(1, 100) <= nextRate && IsUnitHidden(crocodile)) {
    displayTextToMercenaryPlayers("竟敢有人于此搅动风雨，击杀我的孩儿")
    const effectHandle = AddSpecialEffect("Units\\Demon\\Infernal\\InfernalBirth.mdl", GetUnitX(crocodile), GetUnitY(crocodile))
    destroyEffectLater(effectHandle, 1.0)
    ShowUnit(crocodile, true)
    SetUnitInvulnerable(crocodile, false)
    PauseUnit(crocodile, false)
    setGlobal(CROCODILE_RATE_KEY, -9999)
  }
}

/**
 * nobody_death：中立怪掉落、复活与水牢鳄鱼唤醒控制。
 */
function registerNobodyDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_nobody_death")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => IsUnitOwnedByPlayer(GetTriggerUnit(), PLAYER_NEUTRAL)))
  TriggerAddAction(triggerHandle, () => {
    const deadUnit = GetTriggerUnit()
    const unitTypeId = GetUnitTypeId(deadUnit)
    handleNeutralDeathDrops(deadUnit)
    handleCrocodileWakeOnWaterMobDeath(unitTypeId)

    const rule = NEUTRAL_RESPAWN_RULES.find((it) => it.unitTypeId === unitTypeId)
    if (!rule) {
      return
    }
    const respawnTimer = CreateTimer()
    TimerStart(respawnTimer, rule.delay, false, () => {
      spawnNeutralInRect(rule)
      DestroyTimer(respawnTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_nobody_death", triggerHandle)
}

/**
 * firebeing_death：原图无初始化实现，显式接管为空触发器。
 */
function registerFirebeingDeathTrigger(): void {
  disableLegacyTrigger("gg_trg_firebeing_death")
  const triggerHandle = CreateTrigger()
  replaceGlobalTrigger("gg_trg_firebeing_death", triggerHandle)
}

/**
 * 入口：迁移 slap / Critical_hit / bear_death / nobody_death / firebeing_death。
 */
export function migrateNeutralDeathTriggers(): void {
  registerSlapTrigger()
  registerCriticalHitTrigger()
  registerBearDeathTrigger()
  registerNobodyDeathTrigger()
  registerFirebeingDeathTrigger()
}

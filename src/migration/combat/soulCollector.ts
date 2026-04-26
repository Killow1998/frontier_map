import {
  EVENT_UNIT_DEATH,
  EVENT_UNIT_TARGET_IN_RANGE,
  UNIT_STATE_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_STRUCTURE
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  displayTimedTextToMercenaryPlayers,
  getGlobal,
  replaceGlobalTrigger,
  setGlobal
} from "../core/helpers"

const BOSS_UNIT_ID = FourCC("U00B")
const BOSS_EFFECT_MODEL = "Abilities\\Spells\\Undead\\DeathandDecay\\DeathandDecayTarget.mdl"
const ENEMY_WAVE_COUNT_GLOBAL = "udg_enemywaveCount"

function destroyEffectLater(fx: effect, duration: number): void {
  const t = CreateTimer()
  TimerStart(t, duration, false, () => {
    DestroyEffect(fx)
    DestroyTimer(t)
  })
}

/**
 * Soul_Collector：首领逻辑重构。
 * 加固：周期性检测使用同步组池。
 */
function registerSoulCollectorTrigger(): void {
  disableLegacyTrigger("gg_trg_Soul_Collector")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const boss = getGlobal<unit>("gg_unit_U00B_0243")
    const baseRect = getGlobal<rect>("gg_rct_base_area")
    const bossCount = getGlobal<number>("udg_bosscnt") ?? 0
    const baseWaveTime = getGlobal<number>("udg_base_wave_time") ?? 0
    const waveReduction = getGlobal<number>("udg_wave_interval_reduction") ?? 0
    const difficulty = getGlobal<number>("udg_difficulty_level") ?? 1

    if (!boss || !baseRect) return

    setGlobal("udg_bosscnt", bossCount + 1)

    // 死亡判定加固
    const deathTrigger = CreateTrigger()
    TriggerRegisterUnitEvent(deathTrigger, boss, EVENT_UNIT_DEATH())
    TriggerAddAction(deathTrigger, () => {
      const bossX = GetUnitX(boss)
      const bossY = GetUnitY(boss)
      const deathFx = AddSpecialEffect(BOSS_EFFECT_MODEL, bossX, bossY)
      destroyEffectLater(deathFx, 2.0)
      
      CreateItem(FourCC("I00D"), bossX + 256.0, bossY)
      CreateItem(FourCC("I00D"), bossX - 256.0, bossY)
      if (GetRandomInt(1, 100) <= 33) {
        CreateItem(FourCC("I02W"), bossX, bossY)
      }

      setGlobal("udg_base_wave_time", baseWaveTime - waveReduction)
      displayTimedTextToMercenaryPlayers(60.0, "|cffff0000首领陨落，敌军攻势变得更加狂暴！|r")
      setGlobal("udg_bosswave", false)
      
      const currentWave = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? 0
      if (currentWave > 0) setGlobal(ENEMY_WAVE_COUNT_GLOBAL, currentWave + 1)

      const enemyComing = getGlobal<trigger>("gg_trg_enemycoming")
      if (enemyComing) TriggerExecute(enemyComing)
      
      DestroyTrigger(deathTrigger)
    })

    const periodicTimer = CreateTimer()
    TimerStart(periodicTimer, 5.0, true, () => {
      if (GetWidgetLife(boss) <= 0.405) {
        DestroyTimer(periodicTimer)
        return
      }

      const attackPoint = Location(GetRectCenterX(baseRect), GetRectCenterY(baseRect))
      IssuePointOrderLoc(boss, "attack", attackPoint)
      RemoveLocation(attackPoint)

      const bossX = GetUnitX(boss)
      const bossY = GetUnitY(boss)
      
      // 【加固】使用同步组进行周期抽蓝判定
      GroupClear(SYNC_GROUP)
      GroupEnumUnitsInRange(SYNC_GROUP, bossX, bossY, 700.0, null)
      ForGroup(SYNC_GROUP, () => {
        const enumUnit = GetEnumUnit()
        if (
          enumUnit !== boss &&
          GetWidgetLife(enumUnit) > 0.405 &&
          IsUnitEnemy(enumUnit, GetOwningPlayer(boss)) &&
          !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) &&
          GetUnitState(enumUnit, UNIT_STATE_MANA()) >= 25.0
        ) {
          SetUnitState(enumUnit, UNIT_STATE_MANA(), GetUnitState(enumUnit, UNIT_STATE_MANA()) - 25.0)
        }
      })
      GroupClear(SYNC_GROUP)

      // 难度成长
      if (difficulty > 1) {
        SetHeroStr(boss, GetHeroStr(boss, true) + 1, true)
        SetHeroAgi(boss, GetHeroAgi(boss, true) + 1, true)
        SetHeroInt(boss, GetHeroInt(boss, true) + 1, true)
      }
    })
  })
  
  replaceGlobalTrigger("gg_trg_Soul_Collector", triggerHandle)
}

export function migrateSoulCollectorTrigger(): void {
  registerSoulCollectorTrigger()
}

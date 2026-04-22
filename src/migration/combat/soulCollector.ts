import {
  EVENT_UNIT_TARGET_IN_RANGE,
  UNIT_STATE_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MAX_MANA,
  UNIT_TYPE_STRUCTURE
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  displayTimedTextToMercenaryPlayers,
  getGlobal,
  replaceGlobalTrigger,
  setAbilityDataRealValue,
  setGlobal
} from "../core/helpers"

const SOUL_COLLECTOR_UNIT_GLOBAL = "gg_unit_U005_0257"
const BOSS_BASE_RECT_GLOBAL = "gg_rct_base_area"
const ENEMY_WAVE_COUNT_GLOBAL = "udg_enemywaveCount"
const BOSS_EFFECT_MODEL = "Abilities\\Spells\\Orc\\EtherealForm\\SpiritWalkerChange.mdl"

interface SoulCollectorAiOrder {
  order: string
  orderType: 1 | 3
  probability: number
}

const SOUL_COLLECTOR_AI_ORDERS: SoulCollectorAiOrder[] = [
  { order: "cripple", orderType: 1, probability: 60 },
  { order: "frostnova", orderType: 1, probability: 60 },
  { order: "howlofterror", orderType: 3, probability: 45 }
]

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
 * 获取一个必需的全局值。
 */
function getRequiredGlobal<T>(name: string): T {
  const value = getGlobal<T>(name)
  if (value === undefined) {
    print("[migration] Missing required global: " + name)
    return undefined as unknown as T
  }
  return value
}

/**
 * 从配置中按原图概率桶抽取一条 AI 指令。
 */
function pickSoulCollectorAiOrder(): SoulCollectorAiOrder | undefined {
  const count = SOUL_COLLECTOR_AI_ORDERS.length
  if (count <= 0) {
    return undefined
  }
  const randomBucket = GetRandomInt(0, 100 * count)
  let selected: SoulCollectorAiOrder | undefined
  for (let i = 0; i <= count; i++) {
    const current = SOUL_COLLECTOR_AI_ORDERS[i]
    if (!current) {
      continue
    }
    const probability = math.max(0, math.min(100, current.probability))
    const rangeStart = 100 * i
    if (rangeStart <= randomBucket && randomBucket < rangeStart + probability) {
      selected = current
    }
  }
  return selected
}

/**
 * 注册 Soul Collector 事件驱动 AI（对齐 YDWEAddAIOrder 语义）。
 */
function registerSoulCollectorAiDispatcher(boss: unit): trigger {
  const aiTrigger = CreateTrigger()
  TriggerRegisterUnitEvent(aiTrigger, boss, EVENT_UNIT_TARGET_IN_RANGE())
  TriggerAddAction(aiTrigger, () => {
    if (GetWidgetLife(boss) <= 0.405) {
      return
    }
    const aiOrder = pickSoulCollectorAiOrder()
    if (!aiOrder) {
      return
    }
    if (aiOrder.orderType === 3) {
      IssueImmediateOrder(boss, aiOrder.order)
      return
    }
    IssueTargetOrder(boss, aiOrder.order, GetEventTargetUnit())
  })
  return aiTrigger
}

/**
 * Soul Collector：阶段性拉怪并在死亡时触发下一波。
 */
function registerSoulCollectorTrigger(): void {
  disableLegacyTrigger("gg_trg_Soul_Collector")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    const boss = getRequiredGlobal<unit>(SOUL_COLLECTOR_UNIT_GLOBAL)
    const baseRect = getRequiredGlobal<rect>(BOSS_BASE_RECT_GLOBAL)
    if (!boss || !baseRect) {
      return
    }
    const bossCount = getGlobal<number>("udg_bosscnt") ?? 0
    const bossProperty = getGlobal<number>("udg_boss_property") ?? 0
    const difficulty = getGlobal<number>("udg_difficulty") ?? 1
    const waveReduction = getGlobal<number>("udg_wave_interval_reduction") ?? 0
    const baseWaveTime = getGlobal<number>("udg_base_wave_time") ?? 0

    ShowUnit(boss, true)
    SetUnitInvulnerable(boss, false)
    PauseUnit(boss, false)

    const basePoint = Location(GetRectCenterX(baseRect), GetRectCenterY(baseRect))
    IssuePointOrderLoc(boss, "attack", basePoint)
    RemoveLocation(basePoint)

    if (bossCount >= 1 && bossCount <= 4) {
      const rewardItems = [FourCC("I02H"), FourCC("I02I"), FourCC("I02J"), FourCC("I02K")]
      UnitAddItem(boss, CreateItem(rewardItems[bossCount - 1], GetUnitX(boss), GetUnitY(boss)))
    }

    const bossScale = bossCount * bossProperty
    SetHeroStr(boss, bossScale, true)
    SetHeroAgi(boss, bossScale, true)
    SetHeroInt(boss, bossScale, true)
    SetUnitState(boss, UNIT_STATE_MAX_LIFE(), GetUnitState(boss, UNIT_STATE_MAX_LIFE()) + bossScale * 111.0)
    SetUnitState(boss, UNIT_STATE_MAX_MANA(), GetUnitState(boss, UNIT_STATE_MAX_MANA()) + bossScale * 111.0)
    SetUnitState(boss, UNIT_STATE_LIFE(), GetUnitState(boss, UNIT_STATE_MAX_LIFE()))
    SetUnitState(boss, UNIT_STATE_MANA(), GetUnitState(boss, UNIT_STATE_MAX_MANA()) * 0.05)

    setAbilityDataRealValue(boss, FourCC("A076"), 1, 108, 111.0 * bossCount)
    setAbilityDataRealValue(boss, FourCC("A076"), 1, 109, 111.0 * bossCount)
    SetUnitAbilityLevel(boss, FourCC("A076"), 1)

    const aiTrigger = registerSoulCollectorAiDispatcher(boss)

    setGlobal("udg_bosscnt", bossCount + 1)

    // 【加固】将死亡判定从轮询计时器中抽离，改为纯同步的死亡事件驱动
    const deathTrigger = CreateTrigger()
    TriggerRegisterUnitEvent(deathTrigger, boss, EVENT_UNIT_DEATH())
    TriggerAddAction(deathTrigger, () => {
      DestroyTrigger(aiTrigger)
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
      displayTimedTextToMercenaryPlayers(60.0, "|cffff0000敌将的陨落彻底激怒了敌军，他们的攻势变得越发凶猛！提高警惕，保持戒备！|r")
      setGlobal("udg_bosswave", false)
      const currentWave = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? 0
      if (currentWave > 0) {
        setGlobal(ENEMY_WAVE_COUNT_GLOBAL, currentWave + 1)
      }

      const enemyComing = getGlobal<trigger>("gg_trg_enemycoming")
      if (enemyComing) {
        const runTimer = CreateTimer()
        TimerStart(runTimer, 2.0, false, () => {
          TriggerExecute(enemyComing)
          DestroyTimer(runTimer)
        })
      }
      DestroyTrigger(deathTrigger)
    })

    const periodicTimer = CreateTimer()
    TimerStart(periodicTimer, 5.0, true, () => {
      const attackPoint = Location(GetRectCenterX(baseRect), GetRectCenterY(baseRect))
      IssuePointOrderLoc(boss, "attack", attackPoint)
      RemoveLocation(attackPoint)

      const bossX = GetUnitX(boss)
      const bossY = GetUnitY(boss)
      const enemies: unit[] = []
      const groupHandle = CreateGroup()
      GroupEnumUnitsInRange(groupHandle, bossX, bossY, 700.0, null)
      ForGroup(groupHandle, () => {
        const enumUnit = GetEnumUnit()
        if (
          enumUnit !== boss &&
          GetWidgetLife(enumUnit) > 0.405 &&
          IsUnitEnemy(enumUnit, GetOwningPlayer(boss)) &&
          !IsUnitType(enumUnit, UNIT_TYPE_STRUCTURE()) &&
          GetUnitState(enumUnit, UNIT_STATE_MANA()) >= 25.0
        ) {
          enemies.push(enumUnit)
        }
      })
      DestroyGroup(groupHandle)
      for (const enemy of enemies) {
        SetUnitState(enemy, UNIT_STATE_MANA(), GetUnitState(enemy, UNIT_STATE_MANA()) - 25.0)
      }

      if (GetWidgetLife(boss) <= 0.405) {
        DestroyTimer(periodicTimer)
        return
      }

      if (difficulty > 1) {
        SetHeroStr(boss, GetHeroStr(boss, true) + 1, true)
        SetHeroAgi(boss, GetHeroAgi(boss, true) + 1, true)
        SetHeroInt(boss, GetHeroInt(boss, true) + 1, true)
      }
    })

    displayTimedTextToMercenaryPlayers(10.0, "|cffffcc00强敌已进攻|r")
  })
  replaceGlobalTrigger("gg_trg_Soul_Collector", triggerHandle)
}

/**
 * 入口：迁移 Soul_Collector 触发器。
 */
export function migrateSoulCollectorTrigger(): void {
  registerSoulCollectorTrigger()
}

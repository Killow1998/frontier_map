import { EVENT_PLAYER_UNIT_USE_ITEM, GAME_STATE_TIME_OF_DAY, bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger, setGlobal } from "../core/helpers"

/**
 * 人造太阳：
 * - 仅黑夜可用，强制进入“白昼表现”120 秒；
 * - 期间暂停夜间倒计时与夜之图腾光环同步；
 * - 结束后恢复夜晚状态。
 */

const ARTIFICIAL_SUN_ITEM_ID = FourCC("I03V")
const DAY_TIME_FLAG_KEY = 0x767B29CC
const ARTIFICIAL_SUN_DURATION = 120.0
const NIGHT_AURA_BONUS_ABILITY_ID = FourCC("A0AD")
const ARTIFICIAL_SUN_TIMER_GLOBAL = "udg_Artificial_Sun_Timer"
const ARTIFICIAL_SUN_TIMER_DIALOG_GLOBAL = "udg_Artificial_Sun_Timer_Dialog"

function isDayTimeNow(): boolean {
  const ydht = getGlobal<hashtable>("YDHT")
  if (!ydht) {
    return false
  }
  return LoadBoolean(ydht, StringHash("时间"), DAY_TIME_FLAG_KEY)
}

function setTimeStateIsDay(isDay: boolean): void {
  const ydht = getGlobal<hashtable>("YDHT")
  if (ydht) {
    SaveBoolean(ydht, StringHash("时间"), DAY_TIME_FLAG_KEY, isDay)
  }
}

function setTimeOfDayValue(hour: number): void {
  SetFloatGameState(GAME_STATE_TIME_OF_DAY(), hour)
}

function restoreNightTotemAuras(nightTotem: unit, difficulty: number): void {
  UnitAddAbility(nightTotem, FourCC("A0A7"))
  SetUnitAbilityLevel(nightTotem, FourCC("A0A7"), difficulty)
  UnitAddAbility(nightTotem, FourCC("A0A8"))
  SetUnitAbilityLevel(nightTotem, FourCC("A0A8"), difficulty)
  UnitAddAbility(nightTotem, FourCC("A0AE"))
  SetUnitAbilityLevel(nightTotem, FourCC("A0AE"), difficulty)
}

function registerPlayerUnitEventAll(triggerHandle: trigger, eventId: playerunitevent): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    TriggerRegisterPlayerUnitEvent(triggerHandle, Player(i), eventId, null)
  }
}

// 迁移对齐原图：不创建倒计时 TimerDialog，只走提示 + 强制白昼表现逻辑。

function registerArtificialSunTrigger(): void {
  disableLegacyTrigger("gg_trg_artificial_sun")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_USE_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === ARTIFICIAL_SUN_ITEM_ID))
  TriggerAddAction(triggerHandle, () => {
    const triggerUnit = GetTriggerUnit()
    const owner = GetOwningPlayer(triggerUnit)
    const forceDay = getGlobal<boolean>("udg_force_day") === true
    if (isDayTimeNow() || forceDay) {
      DisplayTextToPlayer(owner, 0, 0, "|cffFF0000无法使用！目前不是黑夜，或人造太阳已在生效中！|r")
      UnitAddItem(triggerUnit, CreateItem(ARTIFICIAL_SUN_ITEM_ID, GetUnitX(triggerUnit), GetUnitY(triggerUnit)))
      return
    }

    const nightTimer = getGlobal<timer>("udg_Night_Timer")
    const nightEndTimer = getGlobal<timer>("udg_Night_Timer_End")
    const nightAuraTimer = getGlobal<timer>("udg_Night_Aura_Timer")
    const affectedGroup = getGlobal<group>("udg_Night_Affected_Group")
    const nightTotem = getGlobal<unit>("udg_Night_Totem")
    const difficulty = getGlobal<number>("udg_difficulty") ?? 1

    // 记录并冻结当前时间流速，避免人造太阳期间触发正午/午夜事件。
    const previousScale = getGlobal<number>("udg_TimeOfDayScale") ?? 1.0

    setGlobal("udg_force_day", true)
    setTimeStateIsDay(true)

    if (nightTimer) {
      PauseTimer(nightTimer)
    }
    if (nightEndTimer) {
      PauseTimer(nightEndTimer)
    }

    // 立刻清空夜晚加成（夜之图腾光环在 force_day=true 时会被同步移除，但这里为了即时生效手动兜底一次）。
    if (affectedGroup) {
      while (true) {
        const current = FirstOfGroup(affectedGroup)
        if (!current) {
          break
        }
        GroupRemoveUnit(affectedGroup, current)
        UnitRemoveAbility(current, NIGHT_AURA_BONUS_ABILITY_ID)
      }
    }

    if (nightAuraTimer) {
      PauseTimer(nightAuraTimer)
    }

    setTimeOfDayValue(10.0)
    SetTimeOfDayScale(0.0)
    setGlobal("udg_TimeOfDayScale", 0.0)
    if (nightTotem) {
      ShowUnit(nightTotem, false)
      UnitRemoveAbility(nightTotem, FourCC("A0A7"))
      UnitRemoveAbility(nightTotem, FourCC("A0A8"))
      UnitRemoveAbility(nightTotem, FourCC("A0AE"))
    }
    const unitName = GetUnitName(triggerUnit)
    DisplayTextToPlayer(owner, 0, 0, "|cffFFD700雇佣兵【" + unitName + "】使用了【人造太阳】！|r")

    const timerHandle = CreateTimer()
    setGlobal(ARTIFICIAL_SUN_TIMER_GLOBAL, timerHandle)
    TimerStart(timerHandle, ARTIFICIAL_SUN_DURATION, false, () => {
      setGlobal("udg_force_day", false)
      setTimeStateIsDay(false)

      if (nightTimer) {
        ResumeTimer(nightTimer)
      }
      if (nightEndTimer) {
        ResumeTimer(nightEndTimer)
      }
      if (nightAuraTimer) {
        ResumeTimer(nightAuraTimer)
      }

      setTimeOfDayValue(0.01)
      // 恢复时间流速（夜晚会在 midnight 事件中再次按难度设置，这里先恢复为上一档）。
      SetTimeOfDayScale(previousScale)
      setGlobal("udg_TimeOfDayScale", previousScale)

      if (nightTotem) {
        ShowUnit(nightTotem, true)
        restoreNightTotemAuras(nightTotem, difficulty)
      }
      setGlobal(ARTIFICIAL_SUN_TIMER_GLOBAL, undefined)
      setGlobal(ARTIFICIAL_SUN_TIMER_DIALOG_GLOBAL, undefined)
      DisplayTextToPlayer(owner, 0, 0, "|cffFFD700【人造太阳】的光芒消散了。|r")
      DestroyTimer(timerHandle)
    })
    // 原图行为：仅提示使用者，不创建全员倒计时面板。
    // 保留 timer global 仅用于内部逻辑/调试一致性。
  })
  replaceGlobalTrigger("gg_trg_artificial_sun", triggerHandle)
}

export function migrateArtificialSunTrigger(): void {
  registerArtificialSunTrigger()
}

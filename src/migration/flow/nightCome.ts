import { EQUAL, GAME_STATE_TIME_OF_DAY, UNIT_TYPE_DEAD, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { getNightDurationByDifficulty } from "./dayNightConfig"
import { disableLegacyTrigger, getAbilityDataRealValue, getGlobal, replaceGlobalTrigger, setGlobal } from "../core/helpers"

const DAY_TIME_FLAG_KEY = 0x767B29CC
const DAY_TIMER_GLOBAL = "udg_Day_Timer"
const NIGHT_AURA_BUFF_ID = FourCC("B015")
const NIGHT_AURA_BONUS_ABILITY_ID = FourCC("A0AD")
const NIGHT_TOTEM_UNIT_ID = FourCC("u00M")
const NIGHT_TOTEM_AURA_1 = FourCC("A0A7")
const NIGHT_TOTEM_AURA_2 = FourCC("A0A8")
const NIGHT_TOTEM_AURA_3 = FourCC("A0AE")
let nightComeTriggerHandle: trigger | undefined

/**
 * 写入“时间”状态到 YDHT：true=白昼，false=黑夜。
 */
function setTimeStateIsDay(isDay: boolean): void {
  const ydht = getGlobal<hashtable>("YDHT")
  if (ydht) {
    SaveBoolean(ydht, StringHash("时间"), DAY_TIME_FLAG_KEY, isDay)
  }
}

/**
 * 兼容调用 UseTimeOfDayBJ，不存在时回退到 SuspendTimeOfDay。
 */
function setTimeFlowEnabled(enabled: boolean): void {
  const useTimeOfDayBJ = getGlobal<(enable: boolean) => void>("UseTimeOfDayBJ")
  if (useTimeOfDayBJ) {
    useTimeOfDayBJ(enabled)
  }
  // 双保险：同时直调原生接口，避免旧 BJ 包装未生效导致时间仍被冻结。
  SuspendTimeOfDay(!enabled)
}

/**
 * 判断单位是否存活。
 */
function isUnitAlive(unitHandle: unit): boolean {
  return GetWidgetLife(unitHandle) > 0.405 && !IsUnitType(unitHandle, UNIT_TYPE_DEAD())
}

/**
 * 清空夜晚加成组，并移除所有单位的夜间加成技能。
 */
function clearNightAuraGroup(groupHandle: group): void {
  while (true) {
    const current = FirstOfGroup(groupHandle)
    if (!current) {
      break
    }
    GroupRemoveUnit(groupHandle, current)
    UnitRemoveAbility(current, NIGHT_AURA_BONUS_ABILITY_ID)
  }
}

/**
 * 获取夜之图腾范围（优先读取 A0AE 的 Area 数据字段）。
 */
function getNightAuraRange(totem: unit, auraLevel: number): number {
  return getAbilityDataRealValue(totem, NIGHT_TOTEM_AURA_3, auraLevel, 106, 900.0)
}

/**
 * 每 0.5 秒同步一次夜晚魔抗加成：
 * - 有夜幕 buff 的单位获得夜间加成；
 * - 离开范围或死亡则移除；
 * - 人造太阳生效期间强制移除并暂停加成。
 */
function syncNightAura(totem: unit, affectedGroup: group): void {
  if (!isUnitAlive(totem)) {
    clearNightAuraGroup(affectedGroup)
    return
  }
  if (getGlobal<boolean>("udg_force_day") === true) {
    clearNightAuraGroup(affectedGroup)
    return
  }

  const auraLevel = GetUnitAbilityLevel(totem, NIGHT_TOTEM_AURA_3)
  const auraRange = getNightAuraRange(totem, auraLevel > 0 ? auraLevel : 1)
  const nearByGroup = CreateGroup()
  GroupEnumUnitsInRange(
    nearByGroup,
    GetUnitX(totem),
    GetUnitY(totem),
    auraRange,
    Filter(() => {
      const filterUnit = GetFilterUnit()
      return isUnitAlive(filterUnit) && GetUnitAbilityLevel(filterUnit, NIGHT_AURA_BUFF_ID) > 0
    })
  )

  // 先把上一轮受影响单位转移到临时组，避免“移除后又加回同一组”导致死循环。
  const previousAffectedGroup = CreateGroup()
  while (true) {
    const current = FirstOfGroup(affectedGroup)
    if (!current) {
      break
    }
    GroupRemoveUnit(affectedGroup, current)
    GroupAddUnit(previousAffectedGroup, current)
  }

  while (true) {
    const current = FirstOfGroup(previousAffectedGroup)
    if (!current) {
      break
    }
    GroupRemoveUnit(previousAffectedGroup, current)
    if (isUnitAlive(current) && IsUnitInGroup(current, nearByGroup)) {
      if (GetUnitAbilityLevel(current, NIGHT_AURA_BONUS_ABILITY_ID) <= 0) {
        UnitAddAbility(current, NIGHT_AURA_BONUS_ABILITY_ID)
      }
      SetUnitAbilityLevel(current, NIGHT_AURA_BONUS_ABILITY_ID, auraLevel > 0 ? auraLevel : 1)
      GroupAddUnit(affectedGroup, current)
    } else {
      UnitRemoveAbility(current, NIGHT_AURA_BONUS_ABILITY_ID)
    }
  }
  DestroyGroup(previousAffectedGroup)

  while (true) {
    const current = FirstOfGroup(nearByGroup)
    if (!current) {
      break
    }
    GroupRemoveUnit(nearByGroup, current)
    if (!IsUnitInGroup(current, affectedGroup)) {
      UnitAddAbility(current, NIGHT_AURA_BONUS_ABILITY_ID)
      SetUnitAbilityLevel(current, NIGHT_AURA_BONUS_ABILITY_ID, auraLevel > 0 ? auraLevel : 1)
      GroupAddUnit(affectedGroup, current)
    }
  }

  DestroyGroup(nearByGroup)
}

/**
 * night_come：
 * - 午夜触发：创建夜之图腾并开启夜间强化；
 * - 固定跳变模式：暂停昼夜时间流动，用真实计时器显示到黎明的剩余时间。
 */
function cleanupExistingNightState(): void {
  const dayTimer = getGlobal<timer>(DAY_TIMER_GLOBAL)
  const nightAuraTimer = getGlobal<timer>("udg_Night_Aura_Timer")
  const nightTimer = getGlobal<timer>("udg_Night_Timer")
  const nightEndTimer = getGlobal<timer>("udg_Night_Timer_End")
  const nightDialog = getGlobal<timerdialog>("udg_Night_Timer_Dialog")
  const nightTotem = getGlobal<unit>("udg_Night_Totem")
  const affectedGroup = getGlobal<group>("udg_Night_Affected_Group")

  if (dayTimer) {
    DestroyTimer(dayTimer)
  }
  if (nightAuraTimer) {
    DestroyTimer(nightAuraTimer)
  }
  if (affectedGroup) {
    while (true) {
      const current = FirstOfGroup(affectedGroup)
      if (!current) {
        break
      }
      GroupRemoveUnit(affectedGroup, current)
      UnitRemoveAbility(current, NIGHT_AURA_BONUS_ABILITY_ID)
    }
    DestroyGroup(affectedGroup)
  }
  if (nightTotem) {
    RemoveUnit(nightTotem)
  }
  if (nightDialog) {
    TimerDialogDisplay(nightDialog, false)
    DestroyTimerDialog(nightDialog)
  }
  if (nightTimer) {
    DestroyTimer(nightTimer)
  }
  if (nightEndTimer) {
    DestroyTimer(nightEndTimer)
  }

  setGlobal("udg_Night_Aura_Timer", undefined)
  setGlobal(DAY_TIMER_GLOBAL, undefined)
  setGlobal("udg_Night_Timer", undefined)
  setGlobal("udg_Night_Timer_End", undefined)
  setGlobal("udg_Night_Timer_Dialog", undefined)
  setGlobal("udg_Night_Totem", undefined)
  setGlobal("udg_Night_Affected_Group", undefined)
}

function startNightPhase(triggerHandle: trigger | undefined, difficulty: number): void {
  if (getGlobal<boolean>("udg_force_day") === true) {
    return
  }
  if (getGlobal<boolean>("udg_Night_Phase_Active") === true) {
    const existingDialog = getGlobal<timerdialog>("udg_Night_Timer_Dialog")
    if (existingDialog) {
      TimerDialogSetTitle(existingDialog, "距黎明来临还有")
      TimerDialogDisplay(existingDialog, true)
      return
    }
    // 标记为夜晚但缺少计时面板时，视为异常状态并重建夜晚流程。
    setGlobal("udg_Night_Phase_Active", false)
  }
  if (triggerHandle) {
    DisableTrigger(triggerHandle)
  }

  cleanupExistingNightState()
  setGlobal("udg_Night_Phase_Active", true)
  setTimeStateIsDay(false)

  const fullNightSeconds = getNightDurationByDifficulty(difficulty)

  const spawnRect = getGlobal<rect>("gg_rct_____________11a")
  let nightTotem: unit | undefined
  if (spawnRect) {
    nightTotem = CreateUnit(
      Player(11),
      NIGHT_TOTEM_UNIT_ID,
      GetRectCenterX(spawnRect),
      GetRectCenterY(spawnRect),
      bj_UNIT_FACING
    )
    SetUnitAbilityLevel(nightTotem, NIGHT_TOTEM_AURA_1, difficulty)
    SetUnitAbilityLevel(nightTotem, NIGHT_TOTEM_AURA_2, difficulty)
    SetUnitAbilityLevel(nightTotem, NIGHT_TOTEM_AURA_3, difficulty)
    setGlobal("udg_Night_Totem", nightTotem)
  }

  const affectedGroup = CreateGroup()
  setGlobal("udg_Night_Affected_Group", affectedGroup)

  const periodicTimer = CreateTimer()
  setGlobal("udg_Night_Aura_Timer", periodicTimer)
  TimerStart(periodicTimer, 0.5, true, () => {
    if (nightTotem) {
      syncNightAura(nightTotem, affectedGroup)
    }
  })

  const nightTimer = CreateTimer()
  setGlobal("udg_Night_Timer", nightTimer)
  TimerStart(nightTimer, fullNightSeconds, false, () => {})
  const nightTimerDialog = CreateTimerDialog(nightTimer)
  setGlobal("udg_Night_Timer_Dialog", nightTimerDialog)
  TimerDialogSetTitle(nightTimerDialog, "距黎明来临还有")
  TimerDialogDisplay(nightTimerDialog, true)

  SetTimeOfDayScale(0.0)
  setTimeFlowEnabled(false)
  setGlobal("udg_TimeOfDayScale", 0.0)

  const nightEndTimer = CreateTimer()
  setGlobal("udg_Night_Timer_End", nightEndTimer)
  TimerStart(nightEndTimer, fullNightSeconds, false, () => {
    cleanupExistingNightState()
    setGlobal("udg_Night_Phase_Active", false)
    SetTimeOfDayScale(1.0)
    setTimeFlowEnabled(true)
    setGlobal("udg_TimeOfDayScale", 1.0)
    SetFloatGameState(GAME_STATE_TIME_OF_DAY(), 11.98)
    if (triggerHandle) {
      EnableTrigger(triggerHandle)
    }
  })
}

export function ensureNightPhaseFromCurrentTime(): void {
  const currentTime = GetFloatGameState(GAME_STATE_TIME_OF_DAY())
  if (currentTime < 12.0) {
    const difficulty = getGlobal<number>("udg_difficulty") ?? 1
    startNightPhase(nightComeTriggerHandle, difficulty)
  }
}

export function beginNightPhaseNow(difficulty: number): void {
  // 难度确认时需要强制重建首夜倒计时，避免沿用初始化阶段（默认难度）已创建的夜晚面板。
  setGlobal("udg_Night_Phase_Active", false)
  startNightPhase(nightComeTriggerHandle, difficulty)
}

function registerNightComeTrigger(): void {
  disableLegacyTrigger("gg_trg_night_come")
  const triggerHandle = CreateTrigger()
  nightComeTriggerHandle = triggerHandle
  // 与原图一致：00:00 进入夜晚阶段。
  TriggerRegisterGameStateEvent(triggerHandle, GAME_STATE_TIME_OF_DAY(), EQUAL(), 0.0)
  TriggerAddAction(triggerHandle, () => {
    const difficulty = getGlobal<number>("udg_difficulty") ?? 1
    startNightPhase(triggerHandle, difficulty)
  })
  replaceGlobalTrigger("gg_trg_night_come", triggerHandle)
}

/**
 * 入口：迁移 night_come 触发器。
 */
export function migrateNightComeTrigger(): void {
  registerNightComeTrigger()
}







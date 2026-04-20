import {
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  bj_MAX_PLAYER_SLOTS,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger, setGlobal } from "../core/helpers"

const ENEMY_WAVE_TIMER_GLOBAL = "udg_enemyT"
const ENEMY_WAVE_DIALOG_GLOBAL = "udg_enemyTW"

const ENEMY_WAVE_COUNT_GLOBAL = "udg_enemywaveCount"
const BOSS_COUNT_GLOBAL = "udg_bosscnt"
const BOSS_WAVE_GLOBAL = "udg_bosswave"
const DIFFICULTY_GLOBAL = "udg_difficulty"
const BASE_WAVE_TIME_GLOBAL = "udg_base_wave_time"
const PLAYER_FORCE_GLOBAL = "udg_player"
const ENEMY_WAVE_ACTIVE_GLOBAL = "udg_migration_enemy_wave_active"

const BASE_RECT_GLOBAL = "gg_rct_base_area"
const FOOTMAN_RECT_GLOBAL = "gg_rct_footman"
const BOSS_BIRTH_RECT_GLOBAL = "gg_rct_boss_birth"
const RIDEMAN_RECT_GLOBAL = "gg_rct_rideman"

/**
 * 统一延迟触发执行。
 */
function runTriggerAfter(delay: number, triggerGlobalName: string): void {
  const targetTrigger = getGlobal<trigger>(triggerGlobalName)
  if (!targetTrigger) {
    print("Missing trigger: " + triggerGlobalName)
    return
  }
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    TriggerExecute(targetTrigger)
    DestroyTimer(timerHandle)
  })
}

/**
 * 向所有玩家广播文本。
 */
function broadcastText(message: string): void {
  for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
    DisplayTextToPlayer(Player(i), 0, 0, message)
  }
}

/**
 * 计算敌军数量倍率（向上取整）。
 */
function scaledCount(base: number, multiplier: number): number {
  return math.floor(base * multiplier + 0.999)
}

/**
 * 读取全局矩形；缺失时返回 undefined 并输出日志。
 */
function getRectGlobal(name: string): rect | undefined {
  const rectHandle = getGlobal<rect>(name)
  if (!rectHandle) {
    print("Missing rect: " + name)
  }
  return rectHandle
}

/**
 * 在指定矩形内随机刷怪并写入波次组。
 */
function spawnWaveUnits(
  targetGroup: group,
  rectHandle: rect,
  unitTypeId: number,
  ownerPlayerId: number,
  count: number,
  hpRatio: number,
  waveCount: number,
  extraLifePerWave?: number
): void {
  for (let i = 0; i < count; i++) {
    const x = GetRandomReal(GetRectMinX(rectHandle), GetRectMaxX(rectHandle))
    const y = GetRandomReal(GetRectMinY(rectHandle), GetRectMaxY(rectHandle))
    const unitHandle = CreateUnit(Player(ownerPlayerId), unitTypeId, x, y, bj_UNIT_FACING)
    RemoveGuardPosition(unitHandle)

    let nextMaxLife = GetUnitState(unitHandle, UNIT_STATE_MAX_LIFE())
    if (extraLifePerWave !== undefined) {
      nextMaxLife = (nextMaxLife + extraLifePerWave * waveCount) * hpRatio
    } else {
      nextMaxLife = nextMaxLife * hpRatio
    }
    SetUnitState(unitHandle, UNIT_STATE_MAX_LIFE(), nextMaxLife)
    SetUnitState(unitHandle, UNIT_STATE_LIFE(), nextMaxLife)
    GroupAddUnit(targetGroup, unitHandle)
  }
}

/**
 * 刷新一组敌军的进攻命令，并移除死亡单位。
 */
function updateWaveGroupAttackOrders(targetGroup: group, baseX: number, baseY: number): void {
  ForGroup(targetGroup, () => {
    const enumUnit = GetEnumUnit()
    if (!enumUnit) {
      return
    }
    if (GetUnitCurrentOrder(enumUnit) === 0) {
      IssuePointOrder(enumUnit, "attack", baseX, baseY)
    }
    if (GetWidgetLife(enumUnit) <= 0.405) {
      GroupRemoveUnit(targetGroup, enumUnit)
    }
  })
}

/**
 * 统计组内单位数量（替代 CountUnitsInGroup BJ）。
 */
function getGroupUnitCount(targetGroup: group): number {
  let count = 0
  ForGroup(targetGroup, () => {
    count++
  })
  return count
}

/**
 * firstboss：2 秒后拉起 Soul_Collector。
 */
function registerFirstBossTrigger(): void {
  disableLegacyTrigger("gg_trg_firstboss")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    runTriggerAfter(2.0, "gg_trg_Soul_Collector")
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_firstboss", triggerHandle)
}

/**
 * secondboss：二选一触发 Zombie / Slime。
 */
function registerSecondBossTrigger(): void {
  disableLegacyTrigger("gg_trg_secondboss")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    if (GetRandomInt(1, 10) >= 5) {
      runTriggerAfter(2.0, "gg_trg_Zombie")
    } else {
      runTriggerAfter(2.0, "gg_trg_Slime")
    }
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_secondboss", triggerHandle)
}

/**
 * thirdboss：二选一触发 Arrow_Shooter / Captain（并提升 Player(11) 科技）。
 */
function registerThirdBossTrigger(): void {
  disableLegacyTrigger("gg_trg_thirdboss")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    if (GetRandomInt(1, 10) >= 5) {
      runTriggerAfter(2.0, "gg_trg_Arrow_Shooter")
    } else {
      SetPlayerTechResearched(Player(11), FourCC("R000"), 14)
      SetPlayerTechResearched(Player(11), FourCC("R001"), 14)
      SetPlayerTechResearched(Player(11), FourCC("R002"), 14)
      runTriggerAfter(2.0, "gg_trg_Captain")
    }
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_thirdboss", triggerHandle)
}

/**
 * fourthboss：二选一触发 Sea_God / Mana_ruin。
 */
function registerFourthBossTrigger(): void {
  disableLegacyTrigger("gg_trg_fourthboss")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    if (GetRandomInt(1, 10) >= 5) {
      runTriggerAfter(2.0, "gg_trg_Sea_God")
    } else {
      runTriggerAfter(2.0, "gg_trg_Mana_ruin")
    }
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger("gg_trg_fourthboss", triggerHandle)
}

/**
 * enemycoming：开启下一波倒计时与倒计时面板。
 */
function registerEnemyComingTrigger(): void {
  disableLegacyTrigger("gg_trg_enemycoming")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    const existingDialog = getGlobal<timerdialog>(ENEMY_WAVE_DIALOG_GLOBAL)
    if (existingDialog) {
      DestroyTimerDialog(existingDialog)
      setGlobal(ENEMY_WAVE_DIALOG_GLOBAL, undefined)
    }

    const enemyTimer = getGlobal<timer>(ENEMY_WAVE_TIMER_GLOBAL)
    if (!enemyTimer) {
      print("Missing timer: " + ENEMY_WAVE_TIMER_GLOBAL)
      return
    }

    const waveCount = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? 0
    const waveInterval = getGlobal<number>(BASE_WAVE_TIME_GLOBAL) ?? 0
    TimerStart(enemyTimer, waveInterval, false, () => {})

    const timerDialog = CreateTimerDialog(enemyTimer)
    TimerDialogSetTitle(timerDialog, "距离第" + I2S(waveCount) + "次敌方进军还有")
    TimerDialogDisplay(timerDialog, true)
    setGlobal(ENEMY_WAVE_DIALOG_GLOBAL, timerDialog)
  })
  replaceGlobalTrigger("gg_trg_enemycoming", triggerHandle)
}

interface WaveMonitorState {
  group: group
  initialCount: number
  timer: timer
}

/**
 * enemystart：按波次刷怪，管理进攻与 boss/下一波分流。
 */
function registerEnemyStartTrigger(): void {
  disableLegacyTrigger("gg_trg_enemystart")
  const triggerHandle = CreateTrigger()

  const enemyTimer = getGlobal<timer>(ENEMY_WAVE_TIMER_GLOBAL)
  if (enemyTimer) {
    TriggerRegisterTimerExpireEvent(triggerHandle, enemyTimer)
  } else {
    print("Missing timer: " + ENEMY_WAVE_TIMER_GLOBAL)
  }

  TriggerAddAction(triggerHandle, () => {
    if (getGlobal<boolean>(ENEMY_WAVE_ACTIVE_GLOBAL) === true) {
      return
    }
    setGlobal(ENEMY_WAVE_ACTIVE_GLOBAL, true)

    const existingDialog = getGlobal<timerdialog>(ENEMY_WAVE_DIALOG_GLOBAL)
    if (existingDialog) {
      DestroyTimerDialog(existingDialog)
      setGlobal(ENEMY_WAVE_DIALOG_GLOBAL, undefined)
    }

    const waveCount = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? 0
    if (waveCount > 18) {
      const finalRoundTrigger = getGlobal<trigger>("gg_trg_final_round_remake")
      if (finalRoundTrigger) {
        TriggerExecute(finalRoundTrigger)
      } else {
        print("Missing trigger: gg_trg_final_round_remake")
      }
      setGlobal(ENEMY_WAVE_ACTIVE_GLOBAL, false)
      return
    }

    const difficulty = getGlobal<number>(DIFFICULTY_GLOBAL) ?? 1
    let diffMult = 1.0
    let hpRatio = 1.0
    if (difficulty === 2) {
      diffMult = 1.5
      hpRatio = 1.35
    } else if (difficulty >= 3) {
      diffMult = 2.0
      hpRatio = 1.8
    }

    const countPlayersInForceBJ = getGlobal<(whichForce: force) => number>("CountPlayersInForceBJ")
    const playerForce = getGlobal<force>(PLAYER_FORCE_GLOBAL)
    const activePlayers = countPlayersInForceBJ && playerForce ? countPlayersInForceBJ(playerForce) : 1
    const finalMult = diffMult * (0.7 + activePlayers * 0.3)

    const footmanRect = getRectGlobal(FOOTMAN_RECT_GLOBAL)
    const bossBirthRect = getRectGlobal(BOSS_BIRTH_RECT_GLOBAL)
    const ridemanRect = getRectGlobal(RIDEMAN_RECT_GLOBAL)
    const baseRect = getRectGlobal(BASE_RECT_GLOBAL)
    if (!footmanRect || !bossBirthRect || !ridemanRect || !baseRect) {
      setGlobal(ENEMY_WAVE_ACTIVE_GLOBAL, false)
      return
    }

    const waveGroup = CreateGroup()
    spawnWaveUnits(waveGroup, footmanRect, FourCC("u00F"), 7, scaledCount(3, finalMult), hpRatio, waveCount)
    spawnWaveUnits(waveGroup, bossBirthRect, FourCC("n011"), 8, scaledCount(2, finalMult), hpRatio, waveCount, 62)
    spawnWaveUnits(waveGroup, ridemanRect, FourCC("o002"), 9, scaledCount(2, finalMult), hpRatio, waveCount)

    if (waveCount >= 7) {
      spawnWaveUnits(waveGroup, bossBirthRect, FourCC("u00I"), 9, scaledCount(3, finalMult), hpRatio, waveCount)
    }
    if (waveCount >= 11) {
      spawnWaveUnits(waveGroup, bossBirthRect, FourCC("u00J"), 7, scaledCount(2, finalMult), hpRatio, waveCount)
    }
    if (waveCount >= 14) {
      spawnWaveUnits(waveGroup, bossBirthRect, FourCC("o003"), 8, scaledCount(2, finalMult), hpRatio, waveCount)
    }

    broadcastText("第" + I2S(waveCount) + "波敌军已展开攻势")

    const monitorState: WaveMonitorState = {
      group: waveGroup,
      initialCount: getGroupUnitCount(waveGroup),
      timer: CreateTimer()
    }

    const baseX = GetRectCenterX(baseRect)
    const baseY = GetRectCenterY(baseRect)
    const startMonitorTimer = CreateTimer()
    TimerStart(startMonitorTimer, 1.0, false, () => {
      DestroyTimer(startMonitorTimer)
      TimerStart(monitorState.timer, 1.0, true, () => {
        updateWaveGroupAttackOrders(monitorState.group, baseX, baseY)
        const remain = getGroupUnitCount(monitorState.group)
        if (remain > 0 && remain > monitorState.initialCount / 5) {
          return
        }

        const bossCount = getGlobal<number>(BOSS_COUNT_GLOBAL) ?? 0
        const isBossWave = getGlobal<boolean>(BOSS_WAVE_GLOBAL) === true
        const currentWave = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? waveCount

        if (currentWave === 4 && bossCount < 2 && !isBossWave) {
          setGlobal(BOSS_WAVE_GLOBAL, true)
          runTriggerAfter(2.0, "gg_trg_firstboss")
        } else if (currentWave === 8 && bossCount < 3 && !isBossWave) {
          setGlobal(BOSS_WAVE_GLOBAL, true)
          runTriggerAfter(2.0, "gg_trg_secondboss")
        } else if (currentWave === 12 && bossCount < 4 && !isBossWave) {
          setGlobal(BOSS_WAVE_GLOBAL, true)
          runTriggerAfter(2.0, "gg_trg_thirdboss")
        } else if (currentWave === 16 && bossCount < 5 && !isBossWave) {
          setGlobal(BOSS_WAVE_GLOBAL, true)
          runTriggerAfter(2.0, "gg_trg_fourthboss")
        } else if (!isBossWave) {
          setGlobal(ENEMY_WAVE_COUNT_GLOBAL, currentWave + 1)
          runTriggerAfter(2.0, "gg_trg_enemycoming")
          runTriggerAfter(1.0, "gg_trg_tech_upgrade")
        }

        DestroyGroup(monitorState.group)
        DestroyTimer(monitorState.timer)
        setGlobal(ENEMY_WAVE_ACTIVE_GLOBAL, false)
      })
    })
  })

  replaceGlobalTrigger("gg_trg_enemystart", triggerHandle)
}

/**
 * 入口：迁移 firstboss/secondboss/thirdboss/fourthboss/enemystart/enemycoming。
 */
export function migrateWaveBossControlTriggers(): void {
  registerFirstBossTrigger()
  registerSecondBossTrigger()
  registerThirdBossTrigger()
  registerFourthBossTrigger()
  registerEnemyStartTrigger()
  registerEnemyComingTrigger()
}

import {
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  bj_MAX_PLAYER_SLOTS,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  getGlobal,
  replaceGlobalTrigger,
  setGlobal,
  toSyncInt
} from "../core/helpers"

const ENEMY_WAVE_COUNT_GLOBAL = "udg_enemywaveCount"
const ENEMY_WAVE_TYPE_ARRAY = "udg_enemywave"
const BASE_WAVE_TIME_GLOBAL = "udg_base_wave_time"

/**
 * 进攻波次控制重构。
 * 加固：使用全局同步组 SYNC_GROUP 管理进攻单位，确保 Handle 序列绝对一致。
 */
function registerEnemyStartTrigger(): void {
  disableLegacyTrigger("gg_trg_enemystart")
  const triggerHandle = CreateTrigger()
  
  TriggerAddAction(triggerHandle, () => {
    const waveCount = getGlobal<number>(ENEMY_WAVE_COUNT_GLOBAL) ?? 0
    const enemyTypeId = getGlobal<number[]>(ENEMY_WAVE_TYPE_ARRAY)?.[waveCount]
    const spawnRect = getGlobal<rect>("gg_rct_boss_birth")
    const baseRect = getGlobal<rect>("gg_rct_base_area")
    
    if (!enemyTypeId || !spawnRect || !baseRect) return

    // 【加固】使用全服唯一同步组
    const waveGroup = SYNC_GROUP
    GroupClear(waveGroup)

    const spawnX = GetRectCenterX(spawnRect)
    const spawnY = GetRectCenterY(spawnRect)
    const baseX = GetRectCenterX(baseRect)
    const baseY = GetRectCenterY(baseRect)

    // 精准循环，全端同步创建单位
    for (let i = 0; i < 15; i++) {
      const u = CreateUnit(Player(11), enemyTypeId, spawnX, spawnY, bj_UNIT_FACING)
      GroupAddUnit(waveGroup, u)
      IssuePointOrder(u, "attack", baseX, baseY)
    }

    // 后续可根据需要将 waveGroup 的引用转存到全局，但此时 Handle ID 已对齐
    GroupClear(waveGroup)
  })
  
  replaceGlobalTrigger("gg_trg_enemystart", triggerHandle)
}

function registerEnemyComingTrigger(): void {
  disableLegacyTrigger("gg_trg_enemycoming")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    const baseWaveTime = getGlobal<number>(BASE_WAVE_TIME_GLOBAL) ?? 60.0
    const timer = CreateTimer()
    const dialog = CreateTimerDialog(timer)
    TimerDialogSetTitle(dialog, "敌军进攻倒计时")
    TimerDialogDisplay(dialog, true)
    
    TimerStart(timer, baseWaveTime, false, () => {
      const enemyStart = getGlobal<trigger>("gg_trg_enemystart")
      if (enemyStart) TriggerExecute(enemyStart)
      TimerDialogDisplay(dialog, false)
      DestroyTimerDialog(dialog)
      DestroyTimer(timer)
    })
  })
  replaceGlobalTrigger("gg_trg_enemycoming", triggerHandle)
}

export function migrateWaveBossControlTriggers(): void {
  registerEnemyStartTrigger()
  registerEnemyComingTrigger()
}

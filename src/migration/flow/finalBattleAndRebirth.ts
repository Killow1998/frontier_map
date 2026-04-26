import {
  EVENT_PLAYER_UNIT_SPELL_CAST,
  EVENT_UNIT_DEATH,
  UNIT_STATE_LIFE,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const FINAL_ENEMY_UNIT_ID = FourCC("n012")

/**
 * 延迟执行（同步加固版）。
 */
function runLaterSync(delay: number, action: () => void): void {
  const t = CreateTimer()
  TimerStart(t, delay, false, () => {
    action()
    DestroyTimer(t)
  })
}

/**
 * 通用 BOSS 刷新与奖励点逻辑。
 */
function registerBossRebirthTrigger(config: {
  triggerGlobal: string
  bossGlobal: string
  rectGlobal: string
  bonusStr: number
  bonusAgi: number
  bonusInt: number
}): void {
  disableLegacyTrigger(config.triggerGlobal)
  const triggerHandle = CreateTrigger()
  TriggerRegisterAnyUnitEventBJ(triggerHandle, EVENT_UNIT_DEATH())
  TriggerAddCondition(triggerHandle, Condition(() => GetTriggerUnit() === getGlobal<unit>(config.bossGlobal)))
  TriggerAddAction(triggerHandle, () => {
    const deadBoss = getGlobal<unit>(config.bossGlobal)
    const rebirthRect = getGlobal<rect>(config.rectGlobal)
    if (!deadBoss || !rebirthRect) return

    displayTextToMercenaryPlayers("强敌已被击败，正在附近重塑真身...")
    runLaterSync(10.0, () => {
      const respawnPoint = Location(GetRectCenterX(rebirthRect), GetRectCenterY(rebirthRect))
      ReviveHeroLoc(deadBoss, respawnPoint, false)
      RemoveLocation(respawnPoint)

      SetHeroStr(deadBoss, GetHeroStr(deadBoss, false) + config.bonusStr, true)
      SetHeroAgi(deadBoss, GetHeroAgi(deadBoss, false) + config.bonusAgi, true)
      SetHeroInt(deadBoss, GetHeroInt(deadBoss, false) + config.bonusInt, true)
      SetUnitState(deadBoss, UNIT_STATE_LIFE(), GetUnitState(deadBoss, UNIT_STATE_MAX_LIFE()))
      
      displayTextToMercenaryPlayers("强敌已重塑完成！它的力量变得更强了！")
    })
  })
  replaceGlobalTrigger(config.triggerGlobal, triggerHandle)
}

/**
 * final_round_remake：最后一波进攻与通关判定重构。
 */
function registerFinalRoundRemakeTrigger(): void {
  disableLegacyTrigger("gg_trg_final_round_remake")
  const triggerHandle = CreateTrigger()
  // 该触发器通常由其他流程逻辑手动 TriggerExecute 或通过全局变量标记触发
  TriggerAddAction(triggerHandle, () => {
    const bossBirthRect = getGlobal<rect>("gg_rct_boss_birth")
    const baseRect = getGlobal<rect>("gg_rct_base_area")
    if (!bossBirthRect || !baseRect) return

    // 【加固】使用全服唯一同步组
    const enemyGroup = SYNC_GROUP
    GroupClear(enemyGroup)
    
    for (let i = 0; i < 67; i++) {
      const x = GetRandomReal(GetRectMinX(bossBirthRect), GetRectMaxX(bossBirthRect))
      const y = GetRandomReal(GetRectMinY(bossBirthRect), GetRectMaxY(bossBirthRect))
      const unitHandle = CreateUnit(Player(11), FINAL_ENEMY_UNIT_ID, x, y, bj_UNIT_FACING)
      GroupAddUnit(enemyGroup, unitHandle)
    }
    displayTextToMercenaryPlayers("最后一波敌人已进攻！")

    const patrolTimer = CreateTimer()
    
    // 【加固】300秒强制胜利保底逻辑，根除卡死风险
    const failSafeTimer = CreateTimer()
    let isGameWon = false
    
    const triggerVictory = () => {
      if (isGameWon) return
      isGameWon = true
      displayTextToMercenaryPlayers("你们击败了所有进攻的敌军！你们守住了传送锚点，帝国将以此战为锋锐，刺穿敌军的心脏！！！")
      displayTextToMercenaryPlayers("恭喜你们通关，游戏将在10秒后结束")
      
      runLaterSync(10.0, () => {
        const missionSuccess = getGlobal<trigger>("gg_trg_mission_success")
        if (missionSuccess) TriggerExecute(missionSuccess)
      })
      
      GroupClear(enemyGroup)
      DestroyTimer(patrolTimer)
      DestroyTimer(failSafeTimer)
    }

    TimerStart(failSafeTimer, 300.0, false, () => {
      displayTextToMercenaryPlayers("|cff00ff00[保底机制] 战斗已持续过久，判定残留敌军溃退...|r")
      triggerVictory()
    })

    TimerStart(patrolTimer, 3.0, true, () => {
      const baseX = GetRectCenterX(baseRect)
      const baseY = GetRectCenterY(baseRect)
      
      ForGroup(enemyGroup, () => {
        const enumUnit = GetEnumUnit()
        if (!enumUnit) return
        IssuePointOrder(enumUnit, "attack", baseX, baseY)
        if (GetWidgetLife(enumUnit) <= 0.405) {
          GroupRemoveUnit(enemyGroup, enumUnit)
        }
      })

      if (getGroupUnitCount(enemyGroup) === 0) {
        triggerVictory()
      }
    })
  })
  replaceGlobalTrigger("gg_trg_final_round_remake", triggerHandle)
}

/**
 * 入口：迁移最终战与重生逻辑。
 */
export function migrateFinalBattleAndRebirthTriggers(): void {
  registerFinalRoundRemakeTrigger()
  
  // 注册主线 BOSS 重生点
  registerBossRebirthTrigger({
    triggerGlobal: "gg_trg_bug_rebirth",
    bossGlobal: "gg_unit_u000_0120",
    rectGlobal: "gg_rct_bugbirth",
    bonusStr: 2,
    bonusAgi: 2,
    bonusInt: 4
  })
  registerBossRebirthTrigger({
    triggerGlobal: "gg_trg_dk_rebirth",
    bossGlobal: "gg_unit_H000_0118",
    rectGlobal: "gg_rct_dkbirth",
    bonusStr: 2,
    bonusAgi: 2,
    bonusInt: 4
  })
  registerBossRebirthTrigger({
    triggerGlobal: "gg_trg_lich_rebirth",
    bossGlobal: "gg_unit_U001_0121",
    rectGlobal: "gg_rct_lichbirth",
    bonusStr: 7,
    bonusAgi: 12,
    bonusInt: 22
  })
}

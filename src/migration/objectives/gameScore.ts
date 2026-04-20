import { PLAYER_NEUTRAL_AGGRESSIVE, UNIT_TYPE_HERO } from "@eiriksgata/wc3ts/src/globals/define"

const ATTACK_ENEMY_PLAYER_IDS = [7, 8, 9, 11]
const WILD_ENEMY_PLAYER_IDS = [PLAYER_NEUTRAL_AGGRESSIVE, 10]

const SCORE_BONUS_ATTACK_BOSS_KILL = 80
const SCORE_BONUS_WILD_BOSS_KILL = 60
const SCORE_BONUS_QUEST_COMPLETE = 120
const SCORE_BONUS_ANCHOR_STRENGTHEN = 100
const SCORE_BONUS_ANCHOR_REPAIR = 80

interface GameScoreState {
  totalScore: number
  rewardPointsTotal: number
  normalKills: number
  bossKills: number
  attackEnemyKills: number
  attackBossKills: number
  wildCreepKills: number
  wildBossKills: number
  questCompletions: number
  anchorStrengthens: number
  anchorRepairs: number
}

const scoreState: GameScoreState = {
  totalScore: 0,
  rewardPointsTotal: 0,
  normalKills: 0,
  bossKills: 0,
  attackEnemyKills: 0,
  attackBossKills: 0,
  wildCreepKills: 0,
  wildBossKills: 0,
  questCompletions: 0,
  anchorStrengthens: 0,
  anchorRepairs: 0
}

let summaryDisplayed = false
let elapsedSeconds = 0
let clockTimer: timer | undefined

/**
 * 重置对局评分状态并启动时长计时。
 */
export function initializeGameScoreSystem(): void {
  scoreState.totalScore = 0
  scoreState.rewardPointsTotal = 0
  scoreState.normalKills = 0
  scoreState.bossKills = 0
  scoreState.attackEnemyKills = 0
  scoreState.attackBossKills = 0
  scoreState.wildCreepKills = 0
  scoreState.wildBossKills = 0
  scoreState.questCompletions = 0
  scoreState.anchorStrengthens = 0
  scoreState.anchorRepairs = 0
  summaryDisplayed = false
  elapsedSeconds = 0

  if (clockTimer) {
    DestroyTimer(clockTimer)
  }
  clockTimer = CreateTimer()
  TimerStart(clockTimer, 1.0, true, () => {
    elapsedSeconds++
  })
}

function isAttackEnemyOwner(playerId: number): boolean {
  for (const id of ATTACK_ENEMY_PLAYER_IDS) {
    if (id === playerId) {
      return true
    }
  }
  return false
}

function isWildEnemyOwner(playerId: number): boolean {
  for (const id of WILD_ENEMY_PLAYER_IDS) {
    if (id === playerId) {
      return true
    }
  }
  return false
}

/**
 * 记录击杀与奖励点收益，并按来源折算到总得分。
 */
export function recordKillReward(deadUnit: unit, rewardPointsGain: number): void {
  const gain = math.max(0, rewardPointsGain)
  scoreState.rewardPointsTotal += gain
  scoreState.totalScore += gain

  const deadOwnerId = GetPlayerId(GetOwningPlayer(deadUnit))
  const isBoss = IsUnitType(deadUnit, UNIT_TYPE_HERO())
  if (isBoss) {
    scoreState.bossKills++
  } else {
    scoreState.normalKills++
  }

  if (isAttackEnemyOwner(deadOwnerId)) {
    if (isBoss) {
      scoreState.attackBossKills++
      scoreState.totalScore += SCORE_BONUS_ATTACK_BOSS_KILL
    } else {
      scoreState.attackEnemyKills++
    }
    return
  }

  if (isWildEnemyOwner(deadOwnerId)) {
    if (isBoss) {
      scoreState.wildBossKills++
      scoreState.totalScore += SCORE_BONUS_WILD_BOSS_KILL
    } else {
      scoreState.wildCreepKills++
    }
  }
}

/**
 * 记录任务完成得分。
 */
export function recordQuestCompletion(): void {
  scoreState.questCompletions++
  scoreState.totalScore += SCORE_BONUS_QUEST_COMPLETE
}

/**
 * 记录强化传送锚点得分。
 */
export function recordAnchorStrengthen(): void {
  scoreState.anchorStrengthens++
  scoreState.totalScore += SCORE_BONUS_ANCHOR_STRENGTHEN
}

/**
 * 记录修复传送锚点得分。
 */
export function recordAnchorRepair(): void {
  scoreState.anchorRepairs++
  scoreState.totalScore += SCORE_BONUS_ANCHOR_REPAIR
}

function pad2(value: number): string {
  if (value < 10) {
    return "0" + I2S(value)
  }
  return I2S(value)
}

function formatDuration(totalSeconds: number): string {
  const hours = math.floor(totalSeconds / 3600)
  const minutes = math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
}

function broadcastToMercenaryPlayers(message: string): void {
  for (let i = 0; i < 4; i++) {
    DisplayTextToPlayer(Player(i), 0, 0, message)
  }
}

/**
 * 展示对局结算统计（仅展示一次）。
 */
export function showGameScoreSummary(isVictory: boolean): void {
  if (summaryDisplayed) {
    return
  }
  summaryDisplayed = true
  if (clockTimer) {
    DestroyTimer(clockTimer)
    clockTimer = undefined
  }

  broadcastToMercenaryPlayers("|cffffcc00========== 对局结算 ==========")
  broadcastToMercenaryPlayers("结局：" + (isVictory ? "防守成功" : "防守失败"))
  broadcastToMercenaryPlayers("总得分：" + I2S(scoreState.totalScore))
  broadcastToMercenaryPlayers(
    "击杀普通单位：" + I2S(scoreState.normalKills) +
      "  击杀Boss：" + I2S(scoreState.bossKills)
  )
  broadcastToMercenaryPlayers(
    "总奖励点数：" + I2S(scoreState.rewardPointsTotal) +
      "  游戏时长：" + formatDuration(elapsedSeconds)
  )
  broadcastToMercenaryPlayers(
    "来源统计：进攻敌军" + I2S(scoreState.attackEnemyKills) +
      " / 进攻Boss" + I2S(scoreState.attackBossKills) +
      " / 野怪" + I2S(scoreState.wildCreepKills) +
      " / 野外Boss" + I2S(scoreState.wildBossKills)
  )
  broadcastToMercenaryPlayers(
    "任务完成：" + I2S(scoreState.questCompletions) +
      "  强化锚点：" + I2S(scoreState.anchorStrengthens) +
      "  修复锚点：" + I2S(scoreState.anchorRepairs)
  )
}

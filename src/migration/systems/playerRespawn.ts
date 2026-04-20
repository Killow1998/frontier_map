import { EVENT_PLAYER_UNIT_DEATH } from "@eiriksgata/wc3ts/src/globals/define"
import { panCameraToPointForPlayer } from "../core/camera"
import { disableLegacyTrigger, getGlobal, replaceGlobalTrigger } from "../core/helpers"

const DIED_HERO_ARRAY_GLOBAL = "udg_diedhero"
const DIED_HERO_DIALOG_ARRAY_GLOBAL = "udg_diedhero_cnt_window"
const RESPAWN_RECT_GLOBAL = "gg_rct_____________u"

const respawnTimerBySlot: Record<number, timer | undefined> = {}
const respawnHeroBySlot: Record<number, unit | undefined> = {}
const respawnDialogBySlot: Record<number, timerdialog | undefined> = {}
let fallbackGameTimeTimer: timer | undefined
let warnedGameTimeFallback = false

interface PlayerRespawnConfig {
  deathTriggerGlobal: string
  reviveTriggerGlobal: string
  playerIndex: number
  heroSlot: number
}

/**
 * 读取游戏已运行时间，用于复活时间缩放。
 */
function getElapsedGameTimeSeconds(): number {
  const gameTimeTimer = getGlobal<timer>("YDWEGetGameTime___t")
  if (gameTimeTimer) {
    return TimerGetElapsed(gameTimeTimer)
  }
  const gameTimeGetter = getGlobal<() => number>("YDWEGetGameTime")
  if (gameTimeGetter) {
    return gameTimeGetter()
  }
  if (!fallbackGameTimeTimer) {
    fallbackGameTimeTimer = CreateTimer()
    TimerStart(fallbackGameTimeTimer, 2147483.0, false, () => {})
  }
  if (!warnedGameTimeFallback) {
    warnedGameTimeFallback = true
    print("[migration] Missing YDWEGetGameTime___t; respawn delay uses fallback timer")
  }
  return TimerGetElapsed(fallbackGameTimeTimer)
}

/**
 * 计算复活倒计时。
 */
function getRespawnDelay(hero: unit): number {
  return 5 + GetHeroLevel(hero) + Math.floor(getElapsedGameTimeSeconds() / 75)
}

/**
 * 构造复活提示条。
 */
function createRespawnTimerDialog(timerHandle: timer, hero: unit): timerdialog {
  const timerDialog = CreateTimerDialog(timerHandle)
  TimerDialogSetTitle(timerDialog, "距离" + GetUnitName(hero) + "复活还有")
  TimerDialogDisplay(timerDialog, true)
  return timerDialog
}

function getOrCreateRespawnTimer(heroSlot: number): timer {
  const existing = respawnTimerBySlot[heroSlot]
  if (existing) {
    return existing
  }
  const created = CreateTimer()
  respawnTimerBySlot[heroSlot] = created
  return created
}

/**
 * 销毁并清理指定槽位的复活倒计时面板。
 */
function clearRespawnTimerDialog(heroSlot: number): void {
  const localDialog = respawnDialogBySlot[heroSlot]
  if (localDialog) {
    DestroyTimerDialog(localDialog)
    respawnDialogBySlot[heroSlot] = undefined
  }
  const globalDialogs = getGlobal<Record<number, timerdialog | undefined>>(DIED_HERO_DIALOG_ARRAY_GLOBAL)
  if (globalDialogs) {
    globalDialogs[heroSlot] = undefined
  }
}

/**
 * 复活指定槽位对应的雇佣兵英雄。
 */
function reviveHeroBySlot(heroSlot: number): void {
  const diedHeroes = getGlobal<Record<number, unit | undefined>>(DIED_HERO_ARRAY_GLOBAL)
  const hero = respawnHeroBySlot[heroSlot] ?? (diedHeroes ? diedHeroes[heroSlot] : undefined)
  clearRespawnTimerDialog(heroSlot)
  respawnHeroBySlot[heroSlot] = undefined
  if (!hero) {
    print("Missing died hero for slot: " + I2S(heroSlot))
    return
  }

  const respawnRect = getGlobal<rect>(RESPAWN_RECT_GLOBAL)
  if (!respawnRect) {
    print("Missing rect: " + RESPAWN_RECT_GLOBAL)
    return
  }
  const respawnX = GetRectCenterX(respawnRect)
  const respawnY = GetRectCenterY(respawnRect)
  const respawnPoint = Location(respawnX, respawnY)
  const player = GetOwningPlayer(hero)

  ReviveHeroLoc(hero, respawnPoint, true)
  panCameraToPointForPlayer(player, respawnX, respawnY)
  RemoveLocation(respawnPoint)
  DisplayTextToPlayer(player, 0, 0, "您的雇佣兵已复活，请继续战斗")
  const setUnitManaPercent = getGlobal<(whichUnit: unit, percent: number) => void>("SetUnitManaPercentBJ")
  if (setUnitManaPercent) {
    setUnitManaPercent(hero, 100)
  }
}

/**
 * 迁移单个玩家的死亡触发器。
 */
function registerPlayerDeathTrigger(config: PlayerRespawnConfig): void {
  disableLegacyTrigger(config.deathTriggerGlobal)
  const triggerHandle = CreateTrigger()
  TriggerRegisterPlayerUnitEvent(triggerHandle, Player(config.playerIndex), EVENT_PLAYER_UNIT_DEATH(), null)
  TriggerAddCondition(triggerHandle, Condition(() => {
    const heroSelectGroup = getGlobal<group>("udg_hero_select")
    if (!heroSelectGroup) {
      return false
    }
    return IsUnitInGroup(GetTriggerUnit(), heroSelectGroup)
  }))
  TriggerAddAction(triggerHandle, () => {
    const hero = GetTriggerUnit()
    const diedHeroes = getGlobal<Record<number, unit | undefined>>(DIED_HERO_ARRAY_GLOBAL)
    const respawnTimer = getOrCreateRespawnTimer(config.heroSlot)
    clearRespawnTimerDialog(config.heroSlot)

    respawnHeroBySlot[config.heroSlot] = hero
    if (diedHeroes) {
      diedHeroes[config.heroSlot] = hero
    }

    TimerStart(respawnTimer, getRespawnDelay(hero), false, () => reviveHeroBySlot(config.heroSlot))

    const timerDialog = createRespawnTimerDialog(respawnTimer, hero)
    respawnDialogBySlot[config.heroSlot] = timerDialog
    const globalDialogs = getGlobal<Record<number, timerdialog | undefined>>(DIED_HERO_DIALOG_ARRAY_GLOBAL)
    if (globalDialogs) {
      globalDialogs[config.heroSlot] = timerDialog
    }
  })
  replaceGlobalTrigger(config.deathTriggerGlobal, triggerHandle)
}

/**
 * p1~p4：雇佣兵死亡后进入倒计时，并在时间结束后回到出生点。
 */
function registerPlayerRespawnTrigger(config: PlayerRespawnConfig): void {
  registerPlayerDeathTrigger(config)
  replaceGlobalTrigger(config.reviveTriggerGlobal, CreateTrigger())
}

/**
 * 入口：迁移 p1/p2/p3/p4 复活相关触发器。
 */
export function migratePlayerRespawnTriggers(): void {
  registerPlayerRespawnTrigger({
    deathTriggerGlobal: "gg_trg_p1_______u",
    reviveTriggerGlobal: "gg_trg_p1______u",
    playerIndex: 0,
    heroSlot: 1
  })
  registerPlayerRespawnTrigger({
    deathTriggerGlobal: "gg_trg_p2_______u",
    reviveTriggerGlobal: "gg_trg_p2______u",
    playerIndex: 1,
    heroSlot: 2
  })
  registerPlayerRespawnTrigger({
    deathTriggerGlobal: "gg_trg_p3_______u",
    reviveTriggerGlobal: "gg_trg_p3______u",
    playerIndex: 2,
    heroSlot: 3
  })
  registerPlayerRespawnTrigger({
    deathTriggerGlobal: "gg_trg_p4_______u",
    reviveTriggerGlobal: "gg_trg_p4______u",
    playerIndex: 3,
    heroSlot: 4
  })
}

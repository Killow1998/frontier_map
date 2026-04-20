import {
  EVENT_PLAYER_UNIT_SPELL_CAST,
  EVENT_UNIT_DEATH,
  UNIT_STATE_LIFE,
  bj_UNIT_FACING
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  displayTextToMercenaryPlayers,
  getGlobal,
  registerPlayerUnitEventAll,
  replaceGlobalTrigger,
  setAbilityDataRealValue
} from "../core/helpers"

const FINAL_ENEMY_UNIT_ID = FourCC("n012")
const GROUP_HEALING_CASTER_ID = FourCC("u00J")
const GROUP_HEALING_ABILITY_ID = FourCC("A08L")
const GROUP_HEALING_AUX_ABILITY_ID = FourCC("A08N")

/**
 * 延迟执行一次动作。
 */
function runLater(delay: number, action: () => void): void {
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, delay, false, () => {
    action()
    DestroyTimer(timerHandle)
  })
}

/**
 * 兼容执行 ConditionalTriggerExecute。
 */
function runConditionalTrigger(triggerGlobalName: string): void {
  const targetTrigger = getGlobal<trigger>(triggerGlobalName)
  if (!targetTrigger) {
    print("Missing trigger: " + triggerGlobalName)
    return
  }
  const conditionalExecute = getGlobal<(target: trigger) => boolean>("ConditionalTriggerExecute")
  if (conditionalExecute) {
    conditionalExecute(targetTrigger)
    return
  }
  if (TriggerEvaluate(targetTrigger)) {
    TriggerExecute(targetTrigger)
  }
}

/**
 * 统计组内单位数量。
 */
function getGroupUnitCount(groupHandle: group): number {
  let count = 0
  ForGroup(groupHandle, () => {
    count++
  })
  return count
}

/**
 * final_round_remake：
 * 终局刷怪并持续压向基地，清空后延迟触发 mission_success。
 */
function registerFinalRoundRemakeTrigger(): void {
  disableLegacyTrigger("gg_trg_final_round_remake")
  const triggerHandle = CreateTrigger()
  TriggerAddAction(triggerHandle, () => {
    runConditionalTrigger("gg_trg_reinforcements")

    const bossBirthRect = getGlobal<rect>("gg_rct_boss_birth")
    const baseRect = getGlobal<rect>("gg_rct_base_area")
    if (!bossBirthRect || !baseRect) {
      print("Missing rect: final round spawn/base")
      return
    }

    const enemyGroup = CreateGroup()
    for (let i = 0; i < 67; i++) {
      const x = GetRandomReal(GetRectMinX(bossBirthRect), GetRectMaxX(bossBirthRect))
      const y = GetRandomReal(GetRectMinY(bossBirthRect), GetRectMaxY(bossBirthRect))
      const unitHandle = CreateUnit(Player(11), FINAL_ENEMY_UNIT_ID, x, y, bj_UNIT_FACING)
      GroupAddUnit(enemyGroup, unitHandle)
    }
    displayTextToMercenaryPlayers("最后一波敌人已进攻！")

    const patrolTimer = CreateTimer()
    TimerStart(patrolTimer, 3.0, true, () => {
      const baseX = GetRectCenterX(baseRect)
      const baseY = GetRectCenterY(baseRect)
      ForGroup(enemyGroup, () => {
        const enumUnit = GetEnumUnit()
        if (!enumUnit) {
          return
        }
        IssuePointOrder(enumUnit, "attack", baseX, baseY)
        if (GetWidgetLife(enumUnit) <= 0.405) {
          GroupRemoveUnit(enemyGroup, enumUnit)
        }
      })

      if (getGroupUnitCount(enemyGroup) > 0) {
        return
      }
      displayTextToMercenaryPlayers("你们击败了所有进攻的敌军！你们守住了传送锚点，帝国将以此战为锋锐，刺穿敌军的心脏！！！")
      displayTextToMercenaryPlayers("恭喜你们通关，游戏将在10秒后结束")
      runLater(10.0, () => {
        const missionSuccess = getGlobal<trigger>("gg_trg_mission_success")
        if (missionSuccess) {
          TriggerExecute(missionSuccess)
        }
      })
      DestroyGroup(enemyGroup)
      DestroyTimer(patrolTimer)
    })
  })
  replaceGlobalTrigger("gg_trg_final_round_remake", triggerHandle)
}

/**
 * Group_healing_SCP：
 * u00J 释放 A08L 时动态刷新治疗系数并重置技能开关。
 */
function registerGroupHealingScpTrigger(): void {
  disableLegacyTrigger("gg_trg_Group_healing_SCP")
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_SPELL_CAST())
  TriggerAddCondition(triggerHandle, Condition(() => {
    return GetSpellAbilityId() === GROUP_HEALING_ABILITY_ID && GetUnitTypeId(GetTriggerUnit()) === GROUP_HEALING_CASTER_ID
  }))
  TriggerAddAction(triggerHandle, () => {
    const caster = GetTriggerUnit()
    const life = GetUnitState(caster, UNIT_STATE_LIFE())
    DisplayTextToPlayer(GetOwningPlayer(caster), 0, 0, "回复效果触发")

    setAbilityDataRealValue(caster, GROUP_HEALING_ABILITY_ID, 1, 108, life * 0.12)
    setAbilityDataRealValue(caster, GROUP_HEALING_AUX_ABILITY_ID, 1, 108, life * 0.03)

    IncUnitAbilityLevel(caster, GROUP_HEALING_ABILITY_ID)
    IncUnitAbilityLevel(caster, GROUP_HEALING_AUX_ABILITY_ID)
    DecUnitAbilityLevel(caster, GROUP_HEALING_ABILITY_ID)
    DecUnitAbilityLevel(caster, GROUP_HEALING_AUX_ABILITY_ID)
    IssueImmediateOrder(caster, "unimmolation")
    IssueImmediateOrder(caster, "immolation")
    SetUnitState(caster, UNIT_STATE_LIFE(), life * 0.95)
  })
  replaceGlobalTrigger("gg_trg_Group_healing_SCP", triggerHandle)
}

interface RebirthConfig {
  triggerGlobal: string
  bossGlobal: string
  rectGlobal: string
  bonusStr: number
  bonusAgi: number
  bonusInt: number
  itemId?: number
}

/**
 * 通用 Boss 重生触发器：死亡后随机延迟复活并追加属性。
 */
function registerBossRebirthTrigger(config: RebirthConfig): void {
  disableLegacyTrigger(config.triggerGlobal)
  const triggerHandle = CreateTrigger()
  const bossUnit = getGlobal<unit>(config.bossGlobal)
  if (bossUnit) {
    TriggerRegisterUnitEvent(triggerHandle, bossUnit, EVENT_UNIT_DEATH())
  }
  TriggerAddAction(triggerHandle, () => {
    const deadBoss = GetTriggerUnit()
    runLater(GetRandomReal(80.0, 128.0), () => {
      const rebirthRect = getGlobal<rect>(config.rectGlobal)
      if (!rebirthRect) {
        print("Missing rect: " + config.rectGlobal)
        return
      }
      const respawnPoint = Location(GetRectCenterX(rebirthRect), GetRectCenterY(rebirthRect))
      ReviveHeroLoc(deadBoss, respawnPoint, false)
      RemoveLocation(respawnPoint)

      SetHeroStr(deadBoss, GetHeroStr(deadBoss, false) + config.bonusStr, true)
      SetHeroAgi(deadBoss, GetHeroAgi(deadBoss, false) + config.bonusAgi, true)
      SetHeroInt(deadBoss, GetHeroInt(deadBoss, false) + config.bonusInt, true)

      if (config.itemId !== undefined) {
        UnitAddItem(deadBoss, CreateItem(config.itemId, GetUnitX(deadBoss), GetUnitY(deadBoss)))
      }
    })
  })
  replaceGlobalTrigger(config.triggerGlobal, triggerHandle)
}

/**
 * 入口：迁移 final_round_remake / Group_healing_SCP / dk_rebirth / ________rebitrh / lich_rebirth。
 */
export function migrateFinalBattleAndRebirthTriggers(): void {
  registerFinalRoundRemakeTrigger()
  registerGroupHealingScpTrigger()
  registerBossRebirthTrigger({
    triggerGlobal: "gg_trg_dk_rebirth",
    bossGlobal: "gg_unit_U000_0120",
    rectGlobal: "gg_rct_dkbirth",
    bonusStr: 10,
    bonusAgi: 10,
    bonusInt: 10,
    itemId: FourCC("I000")
  })
  registerBossRebirthTrigger({
    triggerGlobal: "gg_trg________rebitrh",
    bossGlobal: "gg_unit_O001_0261",
    rectGlobal: "gg_rct_tinybirth",
    bonusStr: 4,
    bonusAgi: 12,
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

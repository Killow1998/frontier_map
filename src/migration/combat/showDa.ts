import {
  ATTACK_TYPE_HERO,
  ATTACK_TYPE_MAGIC,
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_MAGIC,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_ATTACKED,
  UNIT_STATE_MAX_LIFE,
  UNIT_TYPE_HERO,
  UNIT_TYPE_STRUCTURE
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  disableLegacyTrigger,
  getGlobal,
  isHumanMercenaryPlayer,
  markRecentAttackInfo,
  replaceGlobalTrigger
} from "../core/helpers"

const CRITICAL_HITS_ABILITY_ID = FourCC("A006")

/**
 * 【最高优先级加固】
 * 全服同步创建 TextTag，通过透明度控制本地可见性。
 * 彻底解决由于本地创建 Handle 导致的 ID 序列分叉（分车）。
 */
function createSyncTextTag(
  whichPlayer: player,
  text: string,
  size: number,
  x: number,
  y: number,
  zOffset: number,
  red: number,
  green: number,
  blue: number
): texttag {
  // 必须全服同步创建 Handle，确保 ID 一致
  const tag = CreateTextTag()
  SetTextTagText(tag, text, size * 0.0023)
  SetTextTagPos(tag, x, y, zOffset)
  
  // 关键：仅在目标玩家电脑上显示颜色，其他玩家看到的是透明的（不消耗 Handle 差异）
  if (GetLocalPlayer() === whichPlayer) {
    SetTextTagColor(tag, red, green, blue, 255)
  } else {
    SetTextTagColor(tag, 0, 0, 0, 0)
  }
  
  SetTextTagPermanent(tag, false)
  SetTextTagLifespan(tag, 2.0)
  SetTextTagFadepoint(tag, 1.5)
  
  // 同步设置初速度，确保漂移轨迹一致
  SetTextTagVelocity(tag, 0, 0.03)
  
  return tag
}

/**
 * 伤害显示总线。
 */
function registerShowDamageTrigger(): void {
  disableLegacyTrigger("gg_trg_show_da")
  const triggerHandle = CreateTrigger()
  
  // 注意：这里必须监听所有单位受伤
  const jassGlobals = require("jass.globals") as Record<string, any>
  const anyUnitDamagedTrigger = jassGlobals["gg_trg_any_unit_damaged"]
  
  TriggerAddAction(triggerHandle, () => {
    const damage = GetEventDamage()
    if (damage <= 1.0) return

    const target = GetTriggerUnit()
    const source = GetEventDamageSource()
    if (!source) return

    const owner = GetOwningPlayer(source)
    if (!isHumanMercenaryPlayer(owner)) return

    const tx = GetUnitX(target)
    const ty = GetUnitY(target)
    
    // 判定是否会心
    let isCrit = false
    const critLevel = GetUnitAbilityLevel(source, CRITICAL_HITS_ABILITY_ID)
    if (critLevel > 0) {
      if (GetRandomInt(1, 100) <= (10 + critLevel * 5)) {
        isCrit = true
      }
    }

    const displayText = isCrit ? "会心 " + I2S(R2I(damage)) : I2S(R2I(damage))
    
    // 调用加固后的同步创建函数
    createSyncTextTag(owner, displayText, 10, tx, ty, 64, 255, 255, 255)
  })
  
  replaceGlobalTrigger("gg_trg_show_da", triggerHandle)
}

/**
 * 普攻近期追踪（用于会心判定辅助）。
 */
function registerAttackTracker(): void {
  const t = CreateTrigger()
  for (let i = 0; i < 4; i++) {
    TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_ATTACKED(), null)
  }
  TriggerAddAction(t, () => {
    markRecentAttackInfo(GetAttacker(), GetTriggerUnit())
  })
}

export function migrateShowDaTriggers(): void {
  registerShowDamageTrigger()
  registerAttackTracker()
}

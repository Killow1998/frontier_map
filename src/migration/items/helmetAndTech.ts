import {
  ATTACK_TYPE_NORMAL,
  DAMAGE_TYPE_NORMAL,
  EVENT_PLAYER_UNIT_SPELL_EFFECT
} from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import {
  SYNC_GROUP,
  disableLegacyTrigger,
  getGlobal,
  replaceGlobalTrigger,
  toSyncInt
} from "../core/helpers"

const MIN_ALIVE_LIFE = 0.405

/**
 * 获取玩家当前的英雄（加固版）。
 */
function getPlayerHeroSync(p: player): unit | undefined {
  const heroSelectGroup = getGlobal<group>("udg_hero_select")
  if (!heroSelectGroup) return undefined
  
  let found: unit | undefined = undefined
  
  // 【同步加固】使用池化组
  GroupClear(SYNC_GROUP)
  ForGroup(heroSelectGroup, () => {
    const u = GetEnumUnit()
    if (GetOwningPlayer(u) === p && GetWidgetLife(u) > MIN_ALIVE_LIFE) {
      found = u
    }
  })
  
  if (found) return found

  // 降级方案：枚举玩家拥有的所有存活单位
  GroupClear(SYNC_GROUP)
  GroupEnumUnitsOfPlayer(SYNC_GROUP, p, null)
  ForGroup(SYNC_GROUP, () => {
    const u = GetEnumUnit()
    if (!found && GetWidgetLife(u) > MIN_ALIVE_LIFE) {
      found = u
    }
  })
  GroupClear(SYNC_GROUP)
  
  return found
}

function registerStatusCommands(): void {
  const t = CreateTrigger()
  for (let i = 0; i < 4; i++) {
    TriggerRegisterPlayerChatEvent(t, Player(i), "-ms", false)
    TriggerRegisterPlayerChatEvent(t, Player(i), "-as", false)
    TriggerRegisterPlayerChatEvent(t, Player(i), "-at", false)
  }
  TriggerAddAction(t, () => {
    const p = GetTriggerPlayer()
    const hero = getPlayerHeroSync(p)
    if (!hero) {
      DisplayTextToPlayer(p, 0, 0, "|cffff0000[系统] 未能定位到您的英雄数据。|r")
      return
    }
    
    const cmd = GetEventPlayerChatString()
    if (cmd === "-ms") {
      DisplayTextToPlayer(p, 0, 0, "|cff00ff00[状态] 当前移速：" + I2S(R2I(GetUnitMoveSpeed(hero))))
    } else if (cmd === "-as") {
      DisplayTextToPlayer(p, 0, 0, "|cff00ff00[状态] 当前攻速加成：" + R2SW(GetUnitState(hero, ConvertUnitState(0x51)), 1, 2))
    } else if (cmd === "-at") {
      DisplayTextToPlayer(p, 0, 0, "|cff00ff00[状态] 当前白字攻击：" + I2S(R2I(GetUnitState(hero, ConvertUnitState(0x12)))))
    }
  })
}

export function migrateHelmetAndTechTriggers(): void {
  registerStatusCommands()
}

import { EVENT_PLAYER_UNIT_PICKUP_ITEM, UNIT_TYPE_HERO, bj_MAX_PLAYER_SLOTS, bj_UNIT_FACING } from "@eiriksgata/wc3ts/src/globals/define"
import { FourCC } from "../../utils/helper"
import { panCameraToBaseForPlayer } from "../core/camera"
import { disableLegacyTrigger, getGlobal, registerPlayerUnitEventAll, replaceGlobalTrigger } from "../core/helpers"

interface SelectHeroTriggerConfig {
  globalName: string
  itemId: number
  unitId: number
  announceText: string
  abilityId?: number
}

/**
 * 在基地生成对应雇佣兵并完成公共收尾逻辑。
 */
function spawnSelectableHero(whichPlayer: player, unitId: number, announceText: string, abilityId?: number): void {
  const baseArea = getGlobal<rect>("gg_rct_base_area")
  const heroSelect = getGlobal<group>("udg_hero_select")
  const playerForce = getGlobal<force>("udg_player")
  const diedHeroes = getGlobal<Record<number, unit | undefined>>("udg_diedhero")
  if (!baseArea || !heroSelect || !playerForce || !diedHeroes) {
    print("Missing hero selection globals")
    return
  }

  const hero = CreateUnit(whichPlayer, unitId, GetRectCenterX(baseArea), GetRectCenterY(baseArea), bj_UNIT_FACING)
  if (abilityId) {
    UnitAddAbility(hero, abilityId)
  }
  GroupAddUnit(heroSelect, hero)
  diedHeroes[GetPlayerId(whichPlayer) + 1] = hero
  const effectHandle = AddSpecialEffectTarget("Abilities\\Spells\\Human\\ReviveHuman\\ReviveHuman.mdl", hero, "origin")
  const timerHandle = CreateTimer()
  TimerStart(timerHandle, 2.0, false, () => {
    DestroyEffect(effectHandle)
    DestroyTimer(timerHandle)
  })
  for (let index = 0; index < bj_MAX_PLAYER_SLOTS; index++) {
    DisplayTextToPlayer(Player(index), 0, 0, "玩家" + GetPlayerName(whichPlayer) + announceText)
  }
  ForceAddPlayer(playerForce, whichPlayer)
  panCameraToBaseForPlayer(whichPlayer)
}

/**
 * 注册某个“买道具选职业”的触发器。
 */
function registerSelectHeroTrigger(config: SelectHeroTriggerConfig): void {
  disableLegacyTrigger(config.globalName)
  const triggerHandle = CreateTrigger()
  registerPlayerUnitEventAll(triggerHandle, EVENT_PLAYER_UNIT_PICKUP_ITEM())
  TriggerAddCondition(triggerHandle, Condition(() => GetItemTypeId(GetManipulatedItem()) === config.itemId))
  TriggerAddAction(triggerHandle, () => {
    spawnSelectableHero(GetOwningPlayer(GetTriggerUnit()), config.unitId, config.announceText, config.abilityId)
    DisableTrigger(triggerHandle)
  })
  replaceGlobalTrigger(config.globalName, triggerHandle)
}

/**
 * transmit：传送进入基地区域。
 */
function registerTransmitTrigger(): void {
  disableLegacyTrigger("gg_trg_transmit")
  const triggerHandle = CreateTrigger()
  const setupTimer = CreateTimer()
  let attempts = 0
  TimerStart(setupTimer, 0.03, true, () => {
    attempts++
    const transmitRect = getGlobal<rect>("gg_rct________________0010")
    if (!transmitRect) {
      if (attempts < 100) {
        return
      }
      print("Missing transmit rect: gg_rct________________0010")
      DestroyTimer(setupTimer)
      return
    }
    const transmitRegion = CreateRegion()
    RegionAddRect(transmitRegion, transmitRect)
    TriggerRegisterEnterRegion(triggerHandle, transmitRegion, null)
    TriggerAddCondition(triggerHandle, Condition(() => IsUnitType(GetTriggerUnit(), UNIT_TYPE_HERO())))
    TriggerAddAction(triggerHandle, () => {
      const hero = GetTriggerUnit()
      const baseArea = getGlobal<rect>("gg_rct_base_area")
      if (!baseArea) {
        return
      }
      const centerX = GetRectCenterX(baseArea)
      const centerY = GetRectCenterY(baseArea)
      SetUnitPosition(hero, centerX, centerY)
      SetUnitFacing(hero, GetRandomReal(0.0, 360.0))
      panCameraToBaseForPlayer(GetOwningPlayer(hero))
    })
    replaceGlobalTrigger("gg_trg_transmit", triggerHandle)
    DestroyTimer(setupTimer)
  })
}

/**
 * 入口：迁移职业选择与传送触发器。
 */
export function migrateHeroSelectionTriggers(): void {
  registerSelectHeroTrigger({
    globalName: "gg_trg_stick_bobi_select",
    itemId: FourCC("I02A"),
    unitId: FourCC("H001"),
    announceText: "雇佣了大棒波比",
    abilityId: FourCC("A006")
  })
  registerSelectHeroTrigger({
    globalName: "gg_trg_builder_select",
    itemId: FourCC("I02B"),
    unitId: FourCC("H007"),
    announceText: "雇佣了建筑师"
  })
  registerSelectHeroTrigger({
    globalName: "gg_trg_shadow_select",
    itemId: FourCC("I02C"),
    unitId: FourCC("H009"),
    announceText: "雇佣了焉影"
  })
  registerSelectHeroTrigger({
    globalName: "gg_trg_bladesman_select",
    itemId: FourCC("I02D"),
    unitId: FourCC("H00A"),
    announceText: "雇佣了刀客"
  })
  registerSelectHeroTrigger({
    globalName: "gg_trg_physiotherapists_select",
    itemId: FourCC("I02G"),
    unitId: FourCC("N00Q"),
    announceText: "雇佣了炼药师"
  })
  registerSelectHeroTrigger({
    globalName: "gg_trg_massive_artillery",
    itemId: FourCC("I02E"),
    unitId: FourCC("E002"),
    announceText: "雇佣了重炮"
  })
  registerSelectHeroTrigger({
    globalName: "gg_trg_Arcane_Researcher",
    itemId: FourCC("I02F"),
    unitId: FourCC("H00E"),
    announceText: "雇佣了研法者"
  })
  registerTransmitTrigger()
}

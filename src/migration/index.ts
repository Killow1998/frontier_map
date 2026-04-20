import { migrateDayComeTrigger } from "./flow/dayCome"
import { migrateNightComeTrigger } from "./flow/nightCome"
import { initializeTimeOfDayFlow } from "./flow/timeOfDayFlow"
import { migrateCameraChatTriggers } from "./systems/camera"
import { migrateHpStealTrigger } from "./combat/hpSteal"
import { migrateInitTrigger } from "./flow/mapInit"
import { migrateDayInitTrigger } from "./flow/dayInit"
import { migrateNobodyInitTrigger } from "./flow/nobodyInit"
import { migrateShowDaTrigger } from "./combat/showDa"
import { migrateBossInitTrigger } from "./flow/bossInit"
import { migrateFirstEnemyStartTrigger } from "./flow/firstEnemyStart"
import { migrateIntroGuideTrigger } from "./flow/introGuide"
import { migrateHolyLightGuardianTrigger } from "./combat/holyLightGuardian"
import { migrateGetStoneTrigger } from "./items/getStone"
import { migrateMissionTriggers } from "./objectives/mission"
import { migrateDifficultySelectionTrigger } from "./flow/difficulty"
import { migrateCreditsTriggers } from "./objectives/credits"
import { migrateShowResourceTrigger } from "./objectives/showResource"
import { migrateHeroSelectionTriggers } from "./heroes/selectHeroes"
import { migrateManaAndItemTriggers } from "./items/manaAndItems"
import { migrateSpellBurstTriggers } from "./combat/spellBursts"
import { migrateSinSystemTriggers } from "./items/sinSystems"
import { migrateExchangeTriggers } from "./items/exchange"
import { migrateTeleportationTriggers } from "./items/teleport"
import { migratePeddlerTrigger } from "./items/peddler"
import { migrateChaplainTrigger } from "./items/chaplain"
import { migrateArtificialSunTrigger } from "./items/artificialSun"
import { migrateCrocodileAndFakeObjectTriggers } from "./combat/crocodile"
import { migrateGenshinPushTrigger } from "./combat/genshinPush"
import { migrateGenshinHitTrigger } from "./combat/genshinHit"
import { migrateTimeShieldTrigger } from "./combat/timeShield"
import { migrateSwimmingTrigger } from "./combat/swimming"
import { migrateTombsDestroyTrigger } from "./combat/tombsDestroy"
import { migrateDeadSoldierRebirthTrigger } from "./combat/deadSoldierRebirth"
import { migrateDeadLordDeathTrigger } from "./combat/deadLordDeath"
import { migrateFireflyCloakEquipTrigger } from "./items/fireflyCloakEquip"
import { migrateItemProgressionTriggers } from "./items/itemProgression"
import { migrateAvengeTriggers } from "./combat/avenge"
import { migrateDeathClawTrigger } from "./combat/deathClaw"
import { migrateLightingEventTriggers } from "./combat/lightingEvents"
import { migrateLightingArmorTrigger } from "./combat/lightingArmor"
import { migrateMeteorSystemTriggers } from "./combat/meteorSystems"
import { migrateSwordAndBowTriggers } from "./combat/swordAndBow"
import { migrateRingAndHelmetTriggers } from "./items/ringAndHelmet"
import { migrateHelmetDraftMagicBookTriggers } from "./items/helmetDraftMagicBook"
import { migrateShieldItemSetTriggers } from "./items/shieldItemSet"
import { migrateEquipmentCraftingTriggers } from "./items/equipmentCrafting"
import { migrateStaffEmpowermentTriggers } from "./items/staffEmpowerment"
import { migrateHelmetAndTechTriggers } from "./items/helmetAndTech"
import { migratePlayerRespawnTriggers } from "./systems/playerRespawn"
import { migrateDebugBossTriggers } from "./systems/debugBoss"
import { migrateDebugCommandsTriggers } from "./systems/debugCommands"
import { migrateAshArrowTrigger } from "./combat/ashArrow"
import { migrateSunAndOrbTriggers } from "./combat/sunAndOrb"
import { migrateSupportSpellTriggers } from "./combat/supportSpells"
import { migrateAlchemySpellTriggers } from "./combat/alchemySpells"
import { migrateArcaneSpellTriggers } from "./combat/arcaneMagic"
import { migrateBladeAndWaveTriggers } from "./combat/bladeAndWave"
import { migrateShadowKnifeTriggers } from "./combat/shadowKnife"
import { migrateWaterWindReinforcementsTriggers } from "./combat/waterWindReinforcements"
import { migrateNeutralDeathTriggers } from "./combat/neutralDeaths"
import { migrateSoulCollectorTrigger } from "./combat/soulCollector"
import { migrateSkillMorphTriggers } from "./combat/skillMorphs"
import { migrateTaskQuestChainTriggers } from "./objectives/taskQuestChains"
import { migrateWaveBossControlTriggers } from "./flow/waveBossControl"
import { migrateFinalBattleAndRebirthTriggers } from "./flow/finalBattleAndRebirth"
import { migrateBossBranchTriggers } from "./flow/bossBranches"
import { initializeGameScoreSystem } from "./objectives/gameScore"

/**
 * 触发器迁移总入口
 * 按地图触发器顺序注册各模块
 */
export function runTriggerMigrations(): void {
  initializeGameScoreSystem()
  migrateDifficultySelectionTrigger()
  migrateDayComeTrigger()
  migrateNightComeTrigger()
  initializeTimeOfDayFlow()
  migrateArtificialSunTrigger()
  migrateMissionTriggers()
  migrateCameraChatTriggers()
  migrateHpStealTrigger()
  migrateInitTrigger()
  migrateDayInitTrigger()
  migrateNobodyInitTrigger()
  migrateShowDaTrigger()
  migrateBossInitTrigger()
  migrateFirstEnemyStartTrigger()
  migrateIntroGuideTrigger()
  migrateHolyLightGuardianTrigger()
  migrateGetStoneTrigger()
  migrateCreditsTriggers()
  migrateShowResourceTrigger()
  migrateHeroSelectionTriggers()
  migrateManaAndItemTriggers()
  migrateSpellBurstTriggers()
  migrateSinSystemTriggers()
  migrateExchangeTriggers()
  migrateTeleportationTriggers()
  migratePeddlerTrigger()
  migrateChaplainTrigger()
  migrateCrocodileAndFakeObjectTriggers()
  migrateGenshinPushTrigger()
  migrateGenshinHitTrigger()
  migrateTimeShieldTrigger()
  migrateSwimmingTrigger()
  migrateTombsDestroyTrigger()
  migrateDeadSoldierRebirthTrigger()
  migrateDeadLordDeathTrigger()
  migrateFireflyCloakEquipTrigger()
  migrateItemProgressionTriggers()
  migrateAvengeTriggers()
  migrateDeathClawTrigger()
  migrateLightingEventTriggers()
  migrateLightingArmorTrigger()
  migrateMeteorSystemTriggers()
  migrateSwordAndBowTriggers()
  migrateRingAndHelmetTriggers()
  migrateHelmetDraftMagicBookTriggers()
  migrateShieldItemSetTriggers()
  migrateEquipmentCraftingTriggers()
  migrateStaffEmpowermentTriggers()
  migrateHelmetAndTechTriggers()
  migratePlayerRespawnTriggers()
  migrateDebugBossTriggers()
  migrateDebugCommandsTriggers()
  migrateAshArrowTrigger()
  migrateSunAndOrbTriggers()
  migrateSupportSpellTriggers()
  migrateAlchemySpellTriggers()
  migrateArcaneSpellTriggers()
  migrateBladeAndWaveTriggers()
  migrateShadowKnifeTriggers()
  migrateWaterWindReinforcementsTriggers()
  migrateNeutralDeathTriggers()
  migrateTaskQuestChainTriggers()
  migrateWaveBossControlTriggers()
  migrateBossBranchTriggers()
  migrateFinalBattleAndRebirthTriggers()
  migrateSkillMorphTriggers()
  migrateSoulCollectorTrigger()
}


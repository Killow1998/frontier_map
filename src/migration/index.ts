import { migrateDayComeTrigger } from "./flow/dayCome"
import { migrateNightComeTrigger } from "./flow/nightCome"
import { initializeTimeOfDayFlow } from "./flow/timeOfDayFlow"
import { migrateCameraChatTriggers } from "./systems/cameraChat"
import { migrateDifficultySelectionTrigger } from "./flow/difficulty"
import { migrateMissionTriggers } from "./objectives/mission"
import { migrateShowResourceTrigger } from "./objectives/showResource"
import { migrateShowDaTriggers } from "./combat/showDa"
import { migrateAvengeTriggers } from "./combat/avenge"
import { migrateArcaneSpellTriggers } from "./combat/arcaneMagic"
import { migrateAlchemySpellTriggers } from "./combat/alchemySpells"
import { migrateAshArrowTriggers } from "./combat/ashArrow"
import { migrateBladeAndWaveTriggers } from "./combat/bladeAndWave"
import { migrateCrocodileTriggers } from "./combat/crocodile"
import { migrateGenshinTriggers } from "./combat/genshinPush"
import { migrateGenshinHitTriggers } from "./combat/genshinHit"
import { migrateLightingTriggers } from "./combat/lightingEvents"
import { migrateSunAndOrbTriggers } from "./combat/sunAndOrb"
import { migrateSupportSpellTriggers } from "./combat/supportSpells"
import { migrateSwimmingTriggers } from "./combat/swimming"
import { migrateFireflyTriggers } from "./items/fireflyCloakEquip"
import { migrateBookTriggers } from "./items/helmetDraftMagicBook"
import { migrateReinforcementTriggers } from "./combat/waterWindReinforcements"
import { migrateEquipmentCraftingTriggers } from "./items/equipmentCrafting"
import { migrateStaffEmpowermentTriggers } from "./items/staffEmpowerment"
import { migrateHelmetAndTechTriggers } from "./items/helmetAndTech"
import { migratePlayerRespawnTriggers } from "./systems/playerRespawn"
import { migrateSinSystemTriggers } from "./items/sinSystems"
import { migrateShadowKnifeTriggers } from "./combat/shadowKnife"
import { migrateNeutralDeathTriggers } from "./combat/neutralDeaths"
import { migrateTaskTriggers } from "./objectives/taskQuestChains"
import { migrateWaveBossControlTriggers } from "./flow/waveBossControl"
import { migrateBossBranchTriggers } from "./flow/bossBranches"
import { migrateFinalBattleAndRebirthTriggers } from "./flow/finalBattleAndRebirth"
import { migrateSkillMorphTriggers } from "./combat/skillMorphs"
import { migrateSoulCollectorTrigger } from "./combat/soulCollector"
import { migrateInitTrigger } from "./flow/mapInit"

export function migrateAllTriggers(): void {
  migrateInitTrigger()
  migrateDifficultySelectionTrigger()
  migrateMissionTriggers()
  migrateDayComeTrigger()
  migrateNightComeTrigger()
  migrateShowDaTriggers()
  migrateShowResourceTrigger()
  migrateCameraChatTriggers()
  initializeTimeOfDayFlow()

  // Combat systems
  migrateAvengeTriggers()
  migrateArcaneSpellTriggers()
  migrateAlchemySpellTriggers()
  migrateAshArrowTriggers()
  migrateBladeAndWaveTriggers()
  migrateCrocodileTriggers()
  migrateGenshinTriggers()
  migrateGenshinHitTriggers()
  migrateLightingTriggers()
  migrateSunAndOrbTriggers()
  migrateSupportSpellTriggers()
  migrateSwimmingTriggers()
  migrateReinforcementTriggers()
  migrateShadowKnifeTriggers()
  migrateSkillMorphTriggers()
  migrateSoulCollectorTrigger()

  // Item & Quest systems
  migrateEquipmentCraftingTriggers()
  migrateStaffEmpowermentTriggers()
  migrateHelmetAndTechTriggers()
  migrateFireflyTriggers()
  migrateBookTriggers()
  migrateSinSystemTriggers()
  migrateTaskTriggers()

  // Game flow & core systems
  migratePlayerRespawnTriggers()
  migrateNeutralDeathTriggers()
  migrateWaveBossControlTriggers()
  migrateBossBranchTriggers()
  migrateFinalBattleAndRebirthTriggers()
}

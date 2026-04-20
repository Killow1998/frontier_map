/**
 * 已完成纯 TS 重写的触发器白名单
 * 这些触发器不会再走遗留桥接逻辑
 */
const EXCLUDED_TRIGGERS: Record<string, boolean> = {
  // Core flow migrated in TS (avoid being disabled when ENABLE_LEGACY_TAKEOVER_GUARD is enabled).
  gg_trg_day_come: true,
  gg_trg_night_come: true,
  gg_trg_init: true,
  gg_trg_day_init: true,
  gg_trg_nobody_init: true,
  gg_trg_boss_init: true,
  gg_trg_first_enemy_start: true,
  // “intro_guide” in the original map uses an obfuscated trigger name.
  gg_trg_______u: true,
  // Sin init migrated in TS (state init for sin weapon use flags).
  gg_trg_sin_init: true,

  gg_trg_difficulty_selection: true,
  gg_trg_mission_success: true,
  gg_trg_mission_fail: true,
  gg_trg_show_credit: true,
  gg_trg_killtoget: true,
  gg_trg_get_bottle: true,
  gg_trg_get_holy_ring: true,
  gg_trg_get_space_tech: true,
  gg_trg_teleportation_scroll: true,
  gg_trg_teleportation_scroll_get: true,
  gg_trg_teleportation_scroll_eat: true,
  gg_trg_artificial_sun: true,
  gg_trg_fake_object: true,
  gg_trg_fake_object_get: true,
  gg_trg_Crocodile_Armor_use: true,
  gg_trg_Crocodile_skill1: true,
  gg_trg_Crocodile_skillUse: true,
  gg_trg_Crocodile_skill2: true,
  gg_trg_Crocodile_death: true,
  gg_trg_camera_sub: true,
  gg_trg_camera_add: true,
  gg_trg_shadow_get: true,
  gg_trg_steal_soul: true,
  gg_trg_sin_equipment: true,
  gg_trg_sin_equipment_quit: true,
  gg_trg_knife_get: true,
  gg_trg_sin_lvup_knife7: true,
  gg_trg_knife_use_new: true,
  gg_trg_sloth_skill: true,
  gg_trg_wrath_skill: true,
  gg_trg_pride_skill: true,
  gg_trg_envy_skill: true,
  gg_trg_blood_shadow: true,
  gg_trg_blood_shadowlearn: true,
  gg_trg_perfect_craft: true,
  gg_trg_perfect_craft_______u: true,
  gg_trg_perfect_craft_lv: true,
  gg_trg_Tempest_of_Termination: true,
  gg_trg_shadow_raid: true,
  gg_trg_shadow_shackle: true,
  gg_trg_shadow_return: true,
  gg_trg_water_shield: true,
  gg_trg_slap: true,
  gg_trg_Critical_hit: true,
  gg_trg_bear_death: true,
  gg_trg_nobody_death: true,
  gg_trg_firebeing_death: true,
  gg_trg_emerald_get: true,
  gg_trg_tower_death: true,
  gg_trg_not_forget_me: true,
  gg_trg_task_init: true,
  gg_trg_tower_to_build: true,
  gg_trg_tower_task: true,
  gg_trg_zuorinai: true,
  gg_trg_Emerald_use: true,
  gg_trg_fire_and_ice: true,
  gg_trg_tech_upgrade: true,
  gg_trg_firstboss: true,
  gg_trg_secondboss: true,
  gg_trg_thirdboss: true,
  gg_trg_fourthboss: true,
  gg_trg_enemystart: true,
  gg_trg_enemycoming: true,
  gg_trg_final_round_remake: true,
  gg_trg_Group_healing_SCP: true,
  gg_trg_dk_rebirth: true,
  gg_trg________rebitrh: true,
  gg_trg_lich_rebirth: true,
  gg_trg_Captain: true,
  gg_trg_Mana_ruin: true,
  gg_trg_Arrow_Shooter: true,
  gg_trg_Zombie: true,
  gg_trg_Slime: true,
  gg_trg_Sea_God: true,
  gg_trg_base_build: true,
  gg_trg_bullet_fly: true,
  gg_trg_stick_bobi_select: true,
  gg_trg_massive_artillery: true,
  gg_trg_Arcane_Researcher: true,
  gg_trg_blademan_die: true,
  gg_trg_Avenge_Equip: true,
  gg_trg_Avenge_Attacked: true,
  gg_trg_Sworduse: true,
  gg_trg_ring_levelup: true,
  gg_trg_ring_get: true,
  gg_trg_ring_throw: true,
  gg_trg_shield_use: true,
  gg_trg_shield_throw: true,
  gg_trg_shield_get: true,
  gg_trg_draft: true,
  gg_trg_magic_book: true,
  gg_trg_book_fire: true,
  gg_trg_golden_stone: true,
  gg_trg_sliver_tree: true,
  gg_trg_lust_choice: true,
  gg_trg_gluttony_choice: true,
  gg_trg_greed_choice: true,
  gg_trg_get_bone_num: true,
  gg_trg_throw_bone_num: true,
  gg_trg_get_bone: true,
  gg_trg_vtu_task: true,
  gg_trg_ring_task: true,
  gg_trg_fake_task: true,
  gg_trg_Windmill: true,
  gg_trg_Windmill_death: true,
  gg_trg_reinforcements: true
}
const ENABLE_LEGACY_TAKEOVER_GUARD = false
const jassGlobals = require("jass.globals") as Record<string, unknown> | undefined

/**
 * 显式禁用未迁移触发器，避免回落到遗留 JASS 执行路径。
 */
function disableUnmigratedTrigger(triggerKey: string, triggerHandle: trigger): void {
  DisableTrigger(triggerHandle)
  TriggerClearActions(triggerHandle)
  print(`[migration] Unmigrated legacy trigger disabled: ${triggerKey}`)
}

/**
 * 扫描并禁用剩余未迁移触发器。
 */
export function takeOverRemainingLegacyTriggers(): void {
  if (!ENABLE_LEGACY_TAKEOVER_GUARD) {
    return
  }
  const globalScope = _G as Record<string, unknown>
  const lookupScopes: Array<Record<string, unknown>> = [globalScope]
  if (jassGlobals) {
    lookupScopes.push(jassGlobals)
  }
  const visited: Record<string, true> = {}
  for (let scopeIndex = 0; scopeIndex < lookupScopes.length; scopeIndex++) {
    const scope = lookupScopes[scopeIndex]
    for (const key in scope) {
      if (visited[key]) {
        continue
      }
      visited[key] = true
      if (key.indexOf("gg_trg_") !== 0) {
        continue
      }
      if (EXCLUDED_TRIGGERS[key] === true) {
        continue
      }
      const triggerHandle = scope[key] as trigger | undefined
      if (!triggerHandle) {
        continue
      }
      disableUnmigratedTrigger(key, triggerHandle)
    }
  }
}

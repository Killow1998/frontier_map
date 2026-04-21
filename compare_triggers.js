const fs = require('fs');
const path = require('path');

// Triggers found in JASS (war3map.j)
const jassTriggers = [
    "gg_trg____________________001", "gg_trg____________________002", "gg_trg_____________u", "gg_trg________rebitrh", "gg_trg_______u",
    "gg_trg_Arcane_Impale", "gg_trg_Arcane_Impale_New", "gg_trg_Arcane_Impale_New_stomp", "gg_trg_Arcane_Researcher", "gg_trg_Arcane_Susceptibility_Aura_Damage",
    "gg_trg_Arcane_Susceptibility_Aura_Learn", "gg_trg_area_slience", "gg_trg_Armor", "gg_trg_Arrow_Shooter", "gg_trg_artificial_sun",
    "gg_trg_artificial_sun_gui", "gg_trg_Ash_Arrow", "gg_trg_Avenge", "gg_trg_Avenge_Attacked", "gg_trg_Avenge_Equip", "gg_trg_avenge_get",
    "gg_trg_avenge_throw", "gg_trg_avenge_tim", "gg_trg_Avenge_Timer", "gg_trg_Axe", "gg_trg_base_build", "gg_trg_bear_death", "gg_trg_big_wave",
    "gg_trg_blademan_die", "gg_trg_bladesman_select", "gg_trg_blood_shadow", "gg_trg_blood_shadowlearn", "gg_trg_book_fire", "gg_trg_boss_init",
    "gg_trg_Bow", "gg_trg_Bow_lv5", "gg_trg_bug_rebirth", "gg_trg_builder_select", "gg_trg_bullet_fly", "gg_trg_camera_add", "gg_trg_camera_sub",
    "gg_trg_Captain", "gg_trg_chaplain", "gg_trg_concealed_weapon", "gg_trg_create_soul", "gg_trg_Critical_hit", "gg_trg_Crocodile_Armor_use",
    "gg_trg_Crocodile_death", "gg_trg_Crocodile_skill1", "gg_trg_Crocodile_skill2", "gg_trg_Crocodile_skillUse", "gg_trg_day_come", "gg_trg_day_come_gui",
    "gg_trg_day_init", "gg_trg_dead_lord_death", "gg_trg_dead_soldier_rebirth", "gg_trg_death_claw", "gg_trg_debug_am", "gg_trg_debug_boss1",
    "gg_trg_debug_boss2", "gg_trg_debug_boss3", "gg_trg_debug_boss4", "gg_trg_debug_boss5", "gg_trg_debug_boss6", "gg_trg_debug_boss7",
    "gg_trg_debug_final_run", "gg_trg_debug_light", "gg_trg_debug_lightoff", "gg_trg_debug_sr", "gg_trg_debug_success", "gg_trg_difficulty_selected",
    "gg_trg_difficulty_selection", "gg_trg_digestive_glands", "gg_trg_dk_rebirth", "gg_trg_draft", "gg_trg_E_learn", "gg_trg_emerald_get",
    "gg_trg_Emerald_use", "gg_trg_enemy_group", "gg_trg_enemycoming", "gg_trg_enemystart", "gg_trg_envy_skill", "gg_trg_Extreme_Dosage",
    "gg_trg_fake_object", "gg_trg_fake_object_get", "gg_trg_fake_task", "gg_trg_final_round_remake", "gg_trg_finalround", "gg_trg_fire_and_ice",
    "gg_trg_fire_arrow", "gg_trg_fire_blast", "gg_trg_fire_mana", "gg_trg_fire_mana_use", "gg_trg_firebeing_death", "gg_trg_Firefly_Cloak_Equip",
    "gg_trg_first_enemy_start", "gg_trg_firstboss", "gg_trg_Flag", "gg_trg_fourthboss", "gg_trg_genshin_hit", "gg_trg_genshin_push", "gg_trg_get_as",
    "gg_trg_get_at", "gg_trg_get_bone", "gg_trg_get_bone_num", "gg_trg_get_bottle", "gg_trg_get_gold", "gg_trg_get_holy_ring", "gg_trg_get_item",
    "gg_trg_get_meteor_shield", "gg_trg_get_ms", "gg_trg_get_space_tech", "gg_trg_get_stone",
    "gg_trg_gluttony_choice", "gg_trg_golden_stone", "gg_trg_greed_choice", "gg_trg_Group_healing_SCP", "gg_trg_Heart_of_Corruption", "gg_trg_helmet",
    "gg_trg_helmet_1", "gg_trg_helmet_2", "gg_trg_helmet_use", "gg_trg_holy_light_guardian", "gg_trg_hp_steal", "gg_trg_hpwave", "gg_trg_Illusory_Void",
    "gg_trg_init", "gg_trg_Item_Drop", "gg_trg_Item_Equip", "gg_trg_Item_Kill_Events", "gg_trg_killtoget", "gg_trg_knife_get", "gg_trg_knife_use",
    "gg_trg_knife_use_new", "gg_trg_lich_rebirth", "gg_trg_Life_Synthesis", "gg_trg_lightday", "gg_trg_lighting_armor", "gg_trg_lighting_armor_attack",
    "gg_trg_lighting_get", "gg_trg_lighting_get_trig", "gg_trg_lust_choice", "gg_trg_magic_book", "gg_trg_Malicious_coin", "gg_trg_mana_decrease",
    "gg_trg_mana_get", "gg_trg_Mana_ruin", "gg_trg_mana_steal", "gg_trg_massive_artillery", "gg_trg_meteor_shield_get", "gg_trg_meteor_sword_drop",
    "gg_trg_meteor_sword_get", "gg_trg_meteor_sword_hit", "gg_trg_meteor_sword_unique", "gg_trg_mission_fail", "gg_trg_mission_success",
    "gg_trg_night_come", "gg_trg_night_come_gui", "gg_trg_nobody_death", "gg_trg_nobody_init", "gg_trg_not_forget_me", "gg_trg_p1_______u",
    "gg_trg_p1______u", "gg_trg_p2_______u", "gg_trg_p2______u", "gg_trg_p3_______u", "gg_trg_p3______u", "gg_trg_p4_______u", "gg_trg_p4______u",
    "gg_trg_peddler", "gg_trg_perfect_craft", "gg_trg_perfect_craft_______u", "gg_trg_perfect_craft_lv", "gg_trg_physiotherapists_select",
    "gg_trg_poisonous_fog", "gg_trg_poli_mana", "gg_trg_Praise_the_Sun", "gg_trg_pride_skill", "gg_trg_Q_learn", "gg_trg_reinforcements",
    "gg_trg_Ring", "gg_trg_ring_get", "gg_trg_ring_levelup", "gg_trg_ring_task", "gg_trg_ring_throw", "gg_trg_ring_to_base", "gg_trg_Sea_God",
    "gg_trg_secondboss", "gg_trg_shadow_get", "gg_trg_shadow_raid", "gg_trg_shadow_return", "gg_trg_shadow_returnlearn", "gg_trg_shadow_select",
    "gg_trg_shadow_shackle", "gg_trg_Sharpening_Edge_attack", "gg_trg_Sharpening_Edge_kill", "gg_trg_Sharpening_Edge_learn", "gg_trg_Shield",
    "gg_trg_shield_get", "gg_trg_shield_throw", "gg_trg_shield_use", "gg_trg_show_credit", "gg_trg_show_da", "gg_trg_show_resource",
    "gg_trg_sin_equipment", "gg_trg_sin_equipment_quit", "gg_trg_sin_get", "gg_trg_sin_get_1", "gg_trg_sin_init", "gg_trg_sin_lvup",
    "gg_trg_sin_lvup_knife7", "gg_trg_sin_lvup_new", "gg_trg_sin_select", "gg_trg_sin_upgrade", "gg_trg_slap", "gg_trg_Slime", "gg_trg_slime_hit",
    "gg_trg_sliver_tree", "gg_trg_sloth_skill", "gg_trg_Soul_Collector", "gg_trg_Soul_Orb", "gg_trg_soul_reap", "gg_trg_soul_reap_get",
    "gg_trg_soul_reap_throw", "gg_trg_Soul_Severing_Blood_Rite", "gg_trg_spy_find", "gg_trg_Staff", "gg_trg_Starstrike", "gg_trg_stay",
    "gg_trg_steal_soul", "gg_trg_stick_bobi_select", "gg_trg_sweet_soup", "gg_trg_swimming", "gg_trg_Sword", "gg_trg_Sworduse", "gg_trg_task_init",
    "gg_trg_tech_get", "gg_trg_tech_get_1", "gg_trg_tech_get_2", "gg_trg_tech_get_3", "gg_trg_tech_get_4", "gg_trg_tech_get_5", "gg_trg_tech_upgrade",
    "gg_trg_teleportation_scroll", "gg_trg_teleportation_scroll_eat", "gg_trg_teleportation_scroll_get", "gg_trg_Tempest_of_Termination",
    "gg_trg_thirdboss", "gg_trg_Thousandfold_Slash", "gg_trg_Thousandfold_Slash______nouse", "gg_trg_Thousandfold_Slash111", "gg_trg_throw_bone_num",
    "gg_trg_time_shield", "gg_trg_tombs_destory", "gg_trg_tower_death", "gg_trg_tower_task", "gg_trg_tower_to_build", "gg_trg_transmit",
    "gg_trg_ubstable", "gg_trg_vtu_task", "gg_trg_walk", "gg_trg_water_shield", "gg_trg_Windmill", "gg_trg_Windmill_death", "gg_trg_wrath_skill",
    "gg_trg_Zombie", "gg_trg_Zombie_die", "gg_trg_zuorinai"
];

// Triggers actually referenced in TS migration code
const tsReferencedTriggers = [
    "gg_trg________rebitrh", "gg_trg_______u", "gg_trg_Arcane_Impale_New_stomp", "gg_trg_Arcane_Researcher", "gg_trg_Arcane_Susceptibility_Aura_Damage",
    "gg_trg_Arcane_Susceptibility_Aura_Learn", "gg_trg_area_slience", "gg_trg_Armor", "gg_trg_Arrow_Shooter", "gg_trg_artificial_sun",
    "gg_trg_Ash_Arrow", "gg_trg_Avenge_Attacked", "gg_trg_Avenge_Equip", "gg_trg_Avenge_Timer", "gg_trg_Axe", "gg_trg_base_build",
    "gg_trg_bear_death", "gg_trg_big_wave", "gg_trg_blademan_die", "gg_trg_bladesman_select", "gg_trg_blood_shadow", "gg_trg_blood_shadowlearn",
    "gg_trg_book_fire", "gg_trg_boss_init", "gg_trg_Bow", "gg_trg_Bow_lv5", "gg_trg_builder_select", "gg_trg_bullet_fly", "gg_trg_camera_add",
    "gg_trg_camera_sub", "gg_trg_Captain", "gg_trg_chaplain", "gg_trg_concealed_weapon", "gg_trg_Critical_hit", "gg_trg_Crocodile_Armor_use",
    "gg_trg_Crocodile_death", "gg_trg_Crocodile_skill1", "gg_trg_Crocodile_skill2", "gg_trg_Crocodile_skillUse", "gg_trg_day_come", "gg_trg_day_init",
    "gg_trg_dead_lord_death", "gg_trg_dead_soldier_rebirth", "gg_trg_death_claw", "gg_trg_debug_am", "gg_trg_debug_boss1", "gg_trg_debug_boss2",
    "gg_trg_debug_boss3", "gg_trg_debug_boss4", "gg_trg_debug_boss5", "gg_trg_debug_boss6", "gg_trg_debug_boss7", "gg_trg_debug_daynight",
    "gg_trg_debug_daynight_once", "gg_trg_debug_final_run", "gg_trg_debug_light", "gg_trg_debug_lightoff", "gg_trg_debug_success", "gg_trg_debug_tod",
    "gg_trg_debug_tod_once", "gg_trg_difficulty_selection", "gg_trg_digestive_glands", "gg_trg_dk_rebirth", "gg_trg_draft", "gg_trg_E_learn",
    "gg_trg_emerald_get", "gg_trg_Emerald_use", "gg_trg_enemy_group", "gg_trg_enemycoming", "gg_trg_enemystart", "gg_trg_envy_skill", "gg_trg_Extreme_Dosage",
    "gg_trg_fake_object", "gg_trg_fake_object_get", "gg_trg_fake_task", "gg_trg_final_round_remake", "gg_trg_fire_and_ice", "gg_trg_fire_arrow",
    "gg_trg_fire_blast", "gg_trg_fire_mana", "gg_trg_fire_mana_use", "gg_trg_firebeing_death", "gg_trg_Firefly_Cloak_Equip", "gg_trg_first_enemy_start",
    "gg_trg_firstboss", "gg_trg_Flag", "gg_trg_fourthboss", "gg_trg_genshin_hit", "gg_trg_genshin_push", "gg_trg_get_as", "gg_trg_get_at", "gg_trg_get_bone",
    "gg_trg_get_bone_num", "gg_trg_get_bottle", "gg_trg_get_gold", "gg_trg_get_holy_ring", "gg_trg_get_item", "gg_trg_get_ms", "gg_trg_get_space_tech",
    "gg_trg_get_stone", "gg_trg_gluttony_choice", "gg_trg_golden_stone", "gg_trg_greed_choice", "gg_trg_Group_healing_SCP", "gg_trg_Heart_of_Corruption",
    "gg_trg_helmet", "gg_trg_helmet_1", "gg_trg_helmet_2", "gg_trg_helmet_use", "gg_trg_holy_light_guardian", "gg_trg_hp_steal", "gg_trg_hpwave",
    "gg_trg_Illusory_Void", "gg_trg_init", "gg_trg_Item_Drop", "gg_trg_Item_Equip", "gg_trg_Item_Kill_Events", "gg_trg_killtoget", "gg_trg_knife_get",
    "gg_trg_knife_use_new", "gg_trg_lich_rebirth", "gg_trg_Life_Synthesis", "gg_trg_lighting_armor", "gg_trg_lighting_armor_attack", "gg_trg_lighting_get",
    "gg_trg_lighting_get_trig", "gg_trg_lust_choice", "gg_trg_magic_book", "gg_trg_mana_get", "gg_trg_Mana_ruin", "gg_trg_mana_steal", "gg_trg_massive_artillery",
    "gg_trg_meteor_shield_get", "gg_trg_meteor_sword_drop", "gg_trg_meteor_sword_get", "gg_trg_meteor_sword_hit", "gg_trg_meteor_sword_unique",
    "gg_trg_mission_fail", "gg_trg_mission_success", "gg_trg_night_come", "gg_trg_nobody_death", "gg_trg_nobody_init", "gg_trg_not_forget_me",
    "gg_trg_p1_______u", "gg_trg_p1______u", "gg_trg_p2_______u", "gg_trg_p2______u", "gg_trg_p3_______u", "gg_trg_p3______u", "gg_trg_p4_______u",
    "gg_trg_p4______u", "gg_trg_peddler", "gg_trg_perfect_craft", "gg_trg_perfect_craft_______u", "gg_trg_perfect_craft_lv", "gg_trg_physiotherapists_select",
    "gg_trg_poisonous_fog", "gg_trg_poli_mana", "gg_trg_Praise_the_Sun", "gg_trg_pride_skill", "gg_trg_Q_learn", "gg_trg_reinforcements",
    "gg_trg_Ring", "gg_trg_ring_get", "gg_trg_ring_levelup", "gg_trg_ring_task", "gg_trg_ring_throw", "gg_trg_Sea_God", "gg_trg_secondboss",
    "gg_trg_shadow_get", "gg_trg_shadow_raid", "gg_trg_shadow_return", "gg_trg_shadow_select", "gg_trg_shadow_shackle", "gg_trg_Sharpening_Edge_attack",
    "gg_trg_Sharpening_Edge_learn", "gg_trg_Shield", "gg_trg_shield_get", "gg_trg_shield_throw", "gg_trg_shield_use", "gg_trg_show_credit",
    "gg_trg_show_da", "gg_trg_show_resource", "gg_trg_sin_equipment", "gg_trg_sin_equipment_quit", "gg_trg_sin_init", "gg_trg_sin_lvup_knife7",
    "gg_trg_sin_lvup_new", "gg_trg_sin_select", "gg_trg_sin_upgrade", "gg_trg_slap", "gg_trg_Slime", "gg_trg_slime_hit", "gg_trg_sliver_tree",
    "gg_trg_sloth_skill", "gg_trg_Soul_Collector", "gg_trg_Soul_Orb", "gg_trg_Soul_Severing_Blood_Rite", "gg_trg_Staff", "gg_trg_Starstrike",
    "gg_trg_stay", "gg_trg_steal_soul", "gg_trg_stick_bobi_select", "gg_trg_sweet_soup", "gg_trg_swimming", "gg_trg_Sword", "gg_trg_Sworduse",
    "gg_trg_task_init", "gg_trg_tech_get", "gg_trg_tech_get_1", "gg_trg_tech_get_2", "gg_trg_tech_get_3", "gg_trg_tech_get_4", "gg_trg_tech_get_5",
    "gg_trg_tech_upgrade", "gg_trg_teleportation_scroll", "gg_trg_teleportation_scroll_eat", "gg_trg_teleportation_scroll_get",
    "gg_trg_Tempest_of_Termination", "gg_trg_thirdboss", "gg_trg_Thousandfold_Slash", "gg_trg_throw_bone_num", "gg_trg_time_shield",
    "gg_trg_tombs_destory", "gg_trg_tower_death", "gg_trg_tower_task", "gg_trg_tower_to_build", "gg_trg_transmit", "gg_trg_ubstable",
    "gg_trg_vtu_task", "gg_trg_walk", "gg_trg_water_shield", "gg_trg_Windmill", "gg_trg_Windmill_death", "gg_trg_wrath_skill", "gg_trg_Zombie",
    "gg_trg_zuorinai"
];

// Combine referenced triggers with JASS presence verification
const finalExcludedTriggers = tsReferencedTriggers.filter(t => jassTriggers.includes(t));

console.log("const EXCLUDED_TRIGGERS: Record<string, boolean> = {");
finalExcludedTriggers.sort().forEach((t, i) => {
    console.log(`  ${t}: true${i === finalExcludedTriggers.length - 1 ? "" : ","}`);
});
console.log("}");

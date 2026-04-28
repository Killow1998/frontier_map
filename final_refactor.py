import re
import os

def final_staff_and_dummy_refactor():
    j_path = 'base_src/map/war3map.j'
    item_path = 'base_src/table/item.ini'
    unit_path = 'base_src/table/unit.ini'

    # --- 1. Standardize Dummy Units in unit.ini ---
    with open(unit_path, 'r', encoding='gbk', errors='ignore') as f:
        unit_content = f.read()

    dummy_ids = ['ewsp', 'e003', 'e009']
    for did in dummy_ids:
        # Force traits: Locust, Invulnerable, 0 scale, No attack
        pattern = rf'(\[{did}\].*?)(?=\n\n|\[|$)'
        traits = f'''-- 技能
abilList = "Aloc,Avul"
-- 模型缩放
modelScale = 0.00
-- 攻击 1 - 基础伤害
dmgplus1 = 0
-- 攻击 1 - 骰子数量
dice1 = 0
-- 攻击 1 - 攻击类型
atkType1 = "none"
-- 碰撞体积
collision = 0.0'''
        # Replace existing block content or append if missing
        # This is a bit aggressive but ensures "unification"
        unit_content = re.sub(pattern, rf'[{did}]\n_parent = "ewsp"\n{traits}', unit_content, flags=re.DOTALL)

    with open(unit_path, 'w', encoding='gbk', errors='ignore') as f:
        f.write(unit_content)

    # --- 2. Update Item Descriptions (ICD info) ---
    with open(item_path, 'r', encoding='gbk', errors='ignore') as f:
        item_content = f.read()

    # Add ICD info to [魔能汲取]
    icd_txt = '|n|cff808080(冷却时间: 1.0秒，仅对单次超过 20 点的伤害生效)|r'
    item_content = item_content.replace('[魔能汲取]|r', '[魔能汲取]|r' + icd_txt)
    
    with open(item_path, 'w', encoding='gbk', errors='ignore') as f:
        f.write(item_content)

    # --- 3. Refactor JASS Logic ---
    with open(j_path, 'r', encoding='gbk', errors='ignore') as f:
        j_content = f.read()

    # 3a. Add CreateStandardDummy Helper
    dummy_helper = r'''
function CreateStandardDummy takes unit master, integer dummyId, real x, real y returns unit
    local unit dummy = CreateUnit(GetOwningPlayer(master), dummyId, x, y, 0)
    call SaveUnitHandle(YDHT, GetHandleId(dummy), StringHash("master"), master)
    call UnitApplyTimedLife(dummy, 'BHwe', 2.0) // Auto cleanup
    return dummy
endfunction
'''
    if 'function CreateStandardDummy' not in j_content:
        j_content = j_content.replace('function CreateDynamicCriticalText', dummy_helper + '\nfunction CreateDynamicCriticalText')

    # 3b. Update StaffManaSiphonLogic with ICD and Threshold
    new_siphon_logic = r'''
// Enhanced Staff Mana Siphon System
function StaffManaSiphonLogic takes unit source, real damage returns nothing
    local unit master = source
    local integer unitId
    local integer siphonPerc = 0
    local integer i = 0
    local item it
    local real lastTriggerTime
    
    // 1. Threshold Check (Ignore tick/small damage)
    if (damage < 20.0) then
        return
    endif
    
    // 2. Summoned Exclusion
    set unitId = GetUnitTypeId(source)
    if (unitId == 'o000' or unitId == 'n00A') then
        return
    endif
    
    // 3. Dummy Source Redirection
    if (IsUnitType(source, UNIT_TYPE_HERO) == false) then
        set master = LoadUnitHandle(YDHT, GetHandleId(source), StringHash("master"))
        if (master == null) then
            return // No master found for this dummy, ignore
        endif
    endif

    // 4. ICD Check (1.0s per Master)
    set lastTriggerTime = LoadReal(YDHT, GetHandleId(master), StringHash("SiphonCD"))
    if (TimerGetElapsed(bj_gameStartedTimer) - lastTriggerTime < 1.0) then
         set master = null
         return
    endif

    // 5. Calculate Siphon percentage
    set i = 0
    loop
        exitwhen i > 5
        set it = UnitItemInSlot(master, i)
        if (it != null) then
            set unitId = GetItemTypeId(it)
            if (unitId == 'I01S') then
                set siphonPerc = siphonPerc + 1
            elif (unitId == 'I01T') then
                set siphonPerc = siphonPerc + 2
            elif (unitId == 'I01U') then
                set siphonPerc = siphonPerc + 3
            elif (unitId == 'I01V') then
                set siphonPerc = siphonPerc + 4
            elif (unitId == 'I01W') then
                set siphonPerc = siphonPerc + 5
            endif
        endif
        set i = i + 1
    endloop
    
    if (siphonPerc > 0) then
        call SetUnitState(master, UNIT_STATE_MANA, GetUnitState(master, UNIT_STATE_MANA) + damage * I2R(siphonPerc) * 0.01)
        call SaveReal(YDHT, GetHandleId(master), StringHash("SiphonCD"), TimerGetElapsed(bj_gameStartedTimer))
        
        // 6. Visual Feedback (Blue floating text)
        // Only show if master is visible to player
        if (GetLocalPlayer() == GetOwningPlayer(master)) then
             // Using simple effect for now to avoid text spam
             call DestroyEffect(AddSpecialEffectTarget("Abilities\\Spells\\Items\\AIma\\AImaTarget.mdl", master, "origin"))
        endif
    endif
    
    set master = null
    set it = null
endfunction
'''
    j_content = re.sub(r'// Staff System Logic.*?function StaffScalingActions', new_siphon_logic + '\nfunction StaffScalingActions', j_content, flags=re.DOTALL)

    # 3c. Replace manual dummy creation in key places with tracker
    # For example, in Trig_OriginalManaPotionActions (though it's a potion, good test)
    # Actually, we need to find skill-based dummy creation.
    # Searching for skill patterns like 'call CreateNUnitsAtLoc(1, \'ewsp\''
    j_content = re.sub(r'call CreateNUnitsAtLoc\(1,\s*\'(ewsp|e003|e009)\',\s*GetOwningPlayer\((.*?)\),', 
                       r'call CreateStandardDummy(\2, \'\1\', GetUnitX(\2), GetUnitY(\2)) // Tracking enabled\n// call CreateNUnitsAtLoc(1, \'\1\', GetOwningPlayer(\2),', 
                       j_content)

    with open(j_path, 'w', encoding='gbk', errors='ignore') as f:
        f.write(j_content)

final_staff_and_dummy_refactor()
print("Final Staff & Dummy Siphon System integrated.")

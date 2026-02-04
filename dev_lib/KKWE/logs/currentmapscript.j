globals
//globals from BzAPI:
constant boolean LIBRARY_BzAPI=true
//endglobals from BzAPI
//globals from YDTriggerSaveLoadSystem:
constant boolean LIBRARY_YDTriggerSaveLoadSystem=true
hashtable YDHT
hashtable YDLOC
//endglobals from YDTriggerSaveLoadSystem
//globals from YDWEBase:
constant boolean LIBRARY_YDWEBase=true
//ȫ�ֹ�ϣ�� 
string bj_AllString=".................................!.#$%&'()*+,-./0123456789:;<=>.@ABCDEFGHIJKLMNOPQRSTUVWXYZ[.]^_`abcdefghijklmnopqrstuvwxyz{|}~................................................................................................................................"
//全局系统变量
unit bj_lastAbilityCastingUnit=null
unit bj_lastAbilityTargetUnit=null
unit bj_lastPoolAbstractedUnit=null
unitpool bj_lastCreatedUnitPool=null
item bj_lastPoolAbstractedItem=null
itempool bj_lastCreatedItemPool=null
attacktype bj_lastSetAttackType= ATTACK_TYPE_NORMAL
damagetype bj_lastSetDamageType= DAMAGE_TYPE_NORMAL
weapontype bj_lastSetWeaponType= WEAPON_TYPE_WHOKNOWS
real yd_MapMaxX= 0
real yd_MapMinX= 0
real yd_MapMaxY= 0
real yd_MapMinY= 0
string array YDWEBase__yd_PlayerColor
trigger array YDWEBase__AbilityCastingOverEventQueue
integer array YDWEBase__AbilityCastingOverEventType
integer YDWEBase__AbilityCastingOverEventNumber= 0
//endglobals from YDWEBase
//globals from YDWEGetUnitsOfPlayerMatchingNull:
constant boolean LIBRARY_YDWEGetUnitsOfPlayerMatchingNull=true
group yd_NullTempGroup
//endglobals from YDWEGetUnitsOfPlayerMatchingNull
//globals from MemoryLeakHelper:
constant boolean LIBRARY_MemoryLeakHelper=true
constant real MemoryLeakHelper__HASH_DECAY_TIME= 500.
constant integer MemoryLeakHelper__CLEAR_HASH_COUNT= 8190
integer MemoryLeakHelper__HashNumber= 0
integer array MemoryLeakHelper__HashData
integer array MemoryLeakHelper__HashHash
integer array MemoryLeakHelper__HashPlace
real array MemoryLeakHelper__CreationTime
        
integer MemoryLeakHelper__TempHashNumber= 0
integer array MemoryLeakHelper__TempHashHash
integer array MemoryLeakHelper__TempHashPlace
integer array MemoryLeakHelper__TempHashData
real array MemoryLeakHelper__TempCreationTime
        
integer MemoryLeakHelper__LastHashedValue= 0
integer MemoryLeakHelper__LastIndex= 0
real MemoryLeakHelper__GameTime= 0.
timer MemoryLeakHelper__GameTimeTimer= CreateTimer()
constant real MemoryLeakHelper__GAMETIME_TIMER_INTERVAL= 30.
constant integer MemoryLeakHelper__key= 0
        
constant integer MemoryLeakHelper__MAX_INSTANCES=8100

        // The system fires when you do something that creates a leak.
        // The data that cause leak are saved in a variable then.
        // And every CLEAN_UP_INTERVAL seconds those data are destroyed.
        // This shouldn't be too high, or too low.
constant real MemoryLeakHelper__CLEAN_UP_INTERVAL= 10
        // If this is set to true, the system will work more slowly (but you wont notice)
        // and count, how much memory this system was able to save.
        // This value is display by the function DisplayLeaks() then.
        // WARNING: This sucks a lot of performance. I would ONLY use it when you want
        // to test, if this is useful for your map. Later set it to false.
constant boolean MemoryLeakHelper__DISPLAY_SAVED_MEMORY= true
        // The Data are only cleaned up, when that many handles were caught
constant integer MemoryLeakHelper__MIN_LEAK_NUMBER= 1750
        // How often are data passed to the destroyer?
        // Leaks stay for a random time between CLEAN_UP_INTERVAL and CLEAN_UP_INTERVAL+PASS_INTERVAL
        // in the game
constant real MemoryLeakHelper__PASS_INTERVAL= 2.5
        // Memory leaks occur pretty frequently. When a leak is caught it is saved in
        // an array. But the array can't have more than MAX_LEAK_INSTANCES instances, so
        // if more than MAX_LEAK_INSTANCES memory leaks occur during a destroy interval,
        // the system fails.
constant integer MemoryLeakHelper__MAX_LEAK_INSTANCES= 60000
integer MemoryLeakHelper__IndexData
integer MemoryLeakHelper__IsSaved
        
integer MemoryLeakHelper__CaughtLocationLeaks= 0
// processed:         location array MemoryLeakHelper__LocationLeakData[MemoryLeakHelper__MAX_LEAK_INSTANCES]
integer MemoryLeakHelper__LocationDestroyCount= 0
// processed:         location array MemoryLeakHelper__LocationDestroyData[MemoryLeakHelper__MAX_LEAK_INSTANCES]
		
integer MemoryLeakHelper__CaughtEffectLeaks= 0
// processed:         effect array MemoryLeakHelper__EffectLeakData[MemoryLeakHelper__MAX_LEAK_INSTANCES]
integer MemoryLeakHelper__EffectDestroyCount= 0
// processed:         effect array MemoryLeakHelper__EffectDestroyData[MemoryLeakHelper__MAX_LEAK_INSTANCES]
		
integer MemoryLeakHelper__CaughtGroupLeaks= 0
// processed:         group array MemoryLeakHelper__GroupLeakData[MemoryLeakHelper__MAX_LEAK_INSTANCES]
integer MemoryLeakHelper__GroupDestroyCount= 0
// processed:         group array MemoryLeakHelper__GroupDestroyData[MemoryLeakHelper__MAX_LEAK_INSTANCES]
        
        
integer MemoryLeakHelper__DestroyedLeaks= 0
integer MemoryLeakHelper__CaughtLeaks= 0
integer MemoryLeakHelper__DestroyedLeaksUser= 0
handle MemoryLeakHelper__LastCaught
timer MemoryLeakHelper__PassTimer= CreateTimer()
timer MemoryLeakHelper__CleanTimer= CreateTimer()
timer MemoryLeakHelper__DelayTimer= CreateTimer()
boolean MemoryLeakHelper__IsDestroying= false
real MemoryLeakHelper__SavedMemory= 0.
real MemoryLeakHelper__LastCheckedGroupMemoryUsage= 0.
boolean MemoryLeakHelper__DestroyThreadRunning= false
boolean MemoryLeakHelper__Disabled= false
        
        // These values were found out in a big leak test by gekko.
constant real MemoryLeakHelper__LOCATION_MEMORY_USAGE= 0.361
constant real MemoryLeakHelper__GROUP_MEMORY_USAGE= 0.62
constant real MemoryLeakHelper__GROUP_UNIT_MEMORY_USAGE= 0.040
constant real MemoryLeakHelper__EFFECT_MEMORY_USAGE= 11.631
constant real MemoryLeakHelper__REMOVED_EFFECT_MEMORY_USAGE= 0.066
        // 用于判断是否开启内存排泄帮助
boolean MemoryLeakHelper__IsOpenMemoryLeakHelper= false
boolean MemoryLeakHelper__IsDisplayMemoryLeakHelper= false
//endglobals from MemoryLeakHelper
//globals from YDWEGetUnitsOfPlayerAllNull:
constant boolean LIBRARY_YDWEGetUnitsOfPlayerAllNull=true
//endglobals from YDWEGetUnitsOfPlayerAllNull
    // Generated
trigger gg_trg_________________________u= null
trigger gg_trg_t01= null
trigger gg_trg____________________001= null
trigger gg_trg____________________002= null
trigger gg_trg____________________003= null

trigger l__library_init

//JASSHelper struct globals:
constant integer si__MemoryLeakHelper__Index=1
integer si__MemoryLeakHelper__Index_F=0
integer si__MemoryLeakHelper__Index_I=0
integer array si__MemoryLeakHelper__Index_V
constant integer si__MemoryLeakHelper__GTable=2
integer si__MemoryLeakHelper__GTable_F=0
integer si__MemoryLeakHelper__GTable_I=0
integer array si__MemoryLeakHelper__GTable_V
constant integer si__MemoryLeakHelper__HandleTable=3
location array s__MemoryLeakHelper__LocationLeakData
location array s__2MemoryLeakHelper__LocationLeakData
location array s__3MemoryLeakHelper__LocationLeakData
location array s__4MemoryLeakHelper__LocationLeakData
location array s__5MemoryLeakHelper__LocationLeakData
location array s__6MemoryLeakHelper__LocationLeakData
location array s__7MemoryLeakHelper__LocationLeakData
location array s__8MemoryLeakHelper__LocationLeakData
location array s__MemoryLeakHelper__LocationDestroyData
location array s__2MemoryLeakHelper__LocationDestroyData
location array s__3MemoryLeakHelper__LocationDestroyData
location array s__4MemoryLeakHelper__LocationDestroyData
location array s__5MemoryLeakHelper__LocationDestroyData
location array s__6MemoryLeakHelper__LocationDestroyData
location array s__7MemoryLeakHelper__LocationDestroyData
location array s__8MemoryLeakHelper__LocationDestroyData
effect array s__MemoryLeakHelper__EffectLeakData
effect array s__2MemoryLeakHelper__EffectLeakData
effect array s__3MemoryLeakHelper__EffectLeakData
effect array s__4MemoryLeakHelper__EffectLeakData
effect array s__5MemoryLeakHelper__EffectLeakData
effect array s__6MemoryLeakHelper__EffectLeakData
effect array s__7MemoryLeakHelper__EffectLeakData
effect array s__8MemoryLeakHelper__EffectLeakData
effect array s__MemoryLeakHelper__EffectDestroyData
effect array s__2MemoryLeakHelper__EffectDestroyData
effect array s__3MemoryLeakHelper__EffectDestroyData
effect array s__4MemoryLeakHelper__EffectDestroyData
effect array s__5MemoryLeakHelper__EffectDestroyData
effect array s__6MemoryLeakHelper__EffectDestroyData
effect array s__7MemoryLeakHelper__EffectDestroyData
effect array s__8MemoryLeakHelper__EffectDestroyData
group array s__MemoryLeakHelper__GroupLeakData
group array s__2MemoryLeakHelper__GroupLeakData
group array s__3MemoryLeakHelper__GroupLeakData
group array s__4MemoryLeakHelper__GroupLeakData
group array s__5MemoryLeakHelper__GroupLeakData
group array s__6MemoryLeakHelper__GroupLeakData
group array s__7MemoryLeakHelper__GroupLeakData
group array s__8MemoryLeakHelper__GroupLeakData
group array s__MemoryLeakHelper__GroupDestroyData
group array s__2MemoryLeakHelper__GroupDestroyData
group array s__3MemoryLeakHelper__GroupDestroyData
group array s__4MemoryLeakHelper__GroupDestroyData
group array s__5MemoryLeakHelper__GroupDestroyData
group array s__6MemoryLeakHelper__GroupDestroyData
group array s__7MemoryLeakHelper__GroupDestroyData
group array s__8MemoryLeakHelper__GroupDestroyData
integer array si__MemoryLeakHelper__GTable_type
trigger array st__MemoryLeakHelper__GTable_onDestroy
trigger array st___prototype164
real f__result_real
trigger array st___prototype168
trigger array st___prototype169
trigger array st___prototype170
trigger array st___prototype171
trigger array st___prototype172
trigger array st___prototype173
trigger array st___prototype174
trigger array st___prototype175
trigger array st___prototype176
trigger array st___prototype177
trigger array st___prototype178
trigger array st___prototype179
trigger array st___prototype180
location f__arg_location1
location f__arg_location2
group f__arg_group1
effect f__arg_effect1
real f__arg_real1
real f__arg_real2
integer f__arg_integer1
integer f__arg_integer2
player f__arg_player1
unit f__arg_unit1
string f__arg_string1
string f__arg_string2
boolexpr f__arg_boolexpr1
code f__arg_code1
widget f__arg_widget1
integer f__arg_this

//JASSHelper null local generated globals:
endglobals
    native DzGetMouseTerrainX takes nothing returns real
    native DzGetMouseTerrainY takes nothing returns real
    native DzGetMouseTerrainZ takes nothing returns real
    native DzIsMouseOverUI takes nothing returns boolean
    native DzGetMouseX takes nothing returns integer
    native DzGetMouseY takes nothing returns integer
    native DzGetMouseXRelative takes nothing returns integer
    native DzGetMouseYRelative takes nothing returns integer
    native DzSetMousePos takes integer x, integer y returns nothing
    native DzTriggerRegisterMouseEvent takes trigger trig, integer btn, integer status, boolean sync, string func returns nothing
    native DzTriggerRegisterMouseEventByCode takes trigger trig, integer btn, integer status, boolean sync, code funcHandle returns nothing
    native DzTriggerRegisterKeyEvent takes trigger trig, integer key, integer status, boolean sync, string func returns nothing
    native DzTriggerRegisterKeyEventByCode takes trigger trig, integer key, integer status, boolean sync, code funcHandle returns nothing
    native DzTriggerRegisterMouseWheelEvent takes trigger trig, boolean sync, string func returns nothing
    native DzTriggerRegisterMouseWheelEventByCode takes trigger trig, boolean sync, code funcHandle returns nothing
    native DzTriggerRegisterMouseMoveEvent takes trigger trig, boolean sync, string func returns nothing
    native DzTriggerRegisterMouseMoveEventByCode takes trigger trig, boolean sync, code funcHandle returns nothing
    native DzGetTriggerKey takes nothing returns integer
    native DzGetWheelDelta takes nothing returns integer
    native DzIsKeyDown takes integer iKey returns boolean
    native DzGetTriggerKeyPlayer takes nothing returns player
    native DzGetWindowWidth takes nothing returns integer
    native DzGetWindowHeight takes nothing returns integer
    native DzGetWindowX takes nothing returns integer
    native DzGetWindowY takes nothing returns integer
    native DzTriggerRegisterWindowResizeEvent takes trigger trig, boolean sync, string func returns nothing
    native DzTriggerRegisterWindowResizeEventByCode takes trigger trig, boolean sync, code funcHandle returns nothing
    native DzIsWindowActive takes nothing returns boolean
    native DzDestructablePosition takes destructable d, real x, real y returns nothing
    native DzSetUnitPosition takes unit whichUnit, real x, real y returns nothing
    native DzExecuteFunc takes string funcName returns nothing
    native DzGetUnitUnderMouse takes nothing returns unit
    native DzSetUnitTexture takes unit whichUnit, string path, integer texId returns nothing
    native DzSetMemory takes integer address, real value returns nothing
    native DzSetUnitID takes unit whichUnit, integer id returns nothing
    native DzSetUnitModel takes unit whichUnit, string path returns nothing
    native DzSetWar3MapMap takes string map returns nothing
    native DzGetLocale takes nothing returns string
    native DzGetUnitNeededXP takes unit whichUnit, integer level returns integer
    native DzTriggerRegisterSyncData takes trigger trig, string prefix, boolean server returns nothing
    native DzSyncData takes string prefix, string data returns nothing
    native DzGetTriggerSyncPrefix takes nothing returns string
    native DzGetTriggerSyncData takes nothing returns string
    native DzGetTriggerSyncPlayer takes nothing returns player
    native DzSyncBuffer takes string prefix, string data, integer dataLen returns nothing
    native DzSyncDataImmediately takes string prefix, string data returns nothing 
    native DzFrameHideInterface takes nothing returns nothing
    native DzFrameEditBlackBorders takes real upperHeight, real bottomHeight returns nothing
    native DzFrameGetPortrait takes nothing returns integer
    native DzFrameGetMinimap takes nothing returns integer
    native DzFrameGetCommandBarButton takes integer row, integer column returns integer
    native DzFrameGetHeroBarButton takes integer buttonId returns integer
    native DzFrameGetHeroHPBar takes integer buttonId returns integer
    native DzFrameGetHeroManaBar takes integer buttonId returns integer
    native DzFrameGetItemBarButton takes integer buttonId returns integer
    native DzFrameGetMinimapButton takes integer buttonId returns integer
    native DzFrameGetUpperButtonBarButton takes integer buttonId returns integer
    native DzFrameGetTooltip takes nothing returns integer
    native DzFrameGetChatMessage takes nothing returns integer
    native DzFrameGetUnitMessage takes nothing returns integer
    native DzFrameGetTopMessage takes nothing returns integer
    native DzGetColor takes integer r, integer g, integer b, integer a returns integer
    native DzFrameSetUpdateCallback takes string func returns nothing
    native DzFrameSetUpdateCallbackByCode takes code funcHandle returns nothing
    native DzFrameShow takes integer frame, boolean enable returns nothing
    native DzCreateFrame takes string frame, integer parent, integer id returns integer
    native DzCreateSimpleFrame takes string frame, integer parent, integer id returns integer
    native DzDestroyFrame takes integer frame returns nothing
    native DzLoadToc takes string fileName returns nothing
    native DzFrameSetPoint takes integer frame, integer point, integer relativeFrame, integer relativePoint, real x, real y returns nothing
    native DzFrameSetAbsolutePoint takes integer frame, integer point, real x, real y returns nothing
    native DzFrameClearAllPoints takes integer frame returns nothing
    native DzFrameSetEnable takes integer name, boolean enable returns nothing
    native DzFrameSetScript takes integer frame, integer eventId, string func, boolean sync returns nothing
    native DzFrameSetScriptByCode takes integer frame, integer eventId, code funcHandle, boolean sync returns nothing
    native DzFrameSetScriptBlock takes integer frame, integer eventId, code funcHandle, boolean sync returns nothing
    native DzFrameSetScriptAsync takes integer frame, integer eventId, string funcName returns nothing
    native DzFrameSetScriptByCodeAsync takes integer frame, integer eventId, code func returns nothing
    native DzFrameSetScriptBlockAsync takes integer frame, integer eventId, code func returns nothing
    native DzGetTriggerUIEventPlayer takes nothing returns player
    native DzGetTriggerUIEventFrame takes nothing returns integer
    native DzFrameFindByName takes string name, integer id returns integer
    native DzSimpleFrameFindByName takes string name, integer id returns integer
    native DzSimpleFontStringFindByName takes string name, integer id returns integer
    native DzSimpleTextureFindByName takes string name, integer id returns integer
    native DzGetGameUI takes nothing returns integer
    native DzClickFrame takes integer frame returns nothing
    native DzSetCustomFovFix takes real value returns nothing
    native DzEnableWideScreen takes boolean enable returns nothing
    native DzFrameSetText takes integer frame, string text returns nothing
    native DzFrameGetText takes integer frame returns string
    native DzFrameSetTextSizeLimit takes integer frame, integer size returns nothing
    native DzFrameGetTextSizeLimit takes integer frame returns integer
    native DzFrameSetTextColor takes integer frame, integer color returns nothing
    native DzGetMouseFocus takes nothing returns integer
    native DzFrameSetAllPoints takes integer frame, integer relativeFrame returns boolean
    native DzFrameSetFocus takes integer frame, boolean enable returns boolean
    native DzFrameSetModel takes integer frame, string modelFile, integer modelType, integer flag returns nothing
    native DzFrameGetEnable takes integer frame returns boolean
    native DzFrameSetAlpha takes integer frame, integer alpha returns nothing
    native DzFrameGetAlpha takes integer frame returns integer
    native DzFrameSetAnimate takes integer frame, integer animId, boolean autocast returns nothing
    native DzFrameSetAnimateOffset takes integer frame, real offset returns nothing
    native DzFrameSetTexture takes integer frame, string texture, integer flag returns nothing
    native DzFrameSetScale takes integer frame, real scale returns nothing
    native DzFrameSetTooltip takes integer frame, integer tooltip returns nothing
    native DzFrameCageMouse takes integer frame, boolean enable returns nothing
    native DzFrameGetValue takes integer frame returns real
    native DzFrameSetMinMaxValue takes integer frame, real minValue, real maxValue returns nothing
    native DzFrameSetStepValue takes integer frame, real step returns nothing
    native DzFrameSetValue takes integer frame, real value returns nothing
    native DzFrameSetSize takes integer frame, real w, real h returns nothing
    native DzCreateFrameByTagName takes string frameType, string name, integer parent, string template, integer id returns integer
    native DzFrameSetVertexColor takes integer frame, integer color returns nothing
    native DzOriginalUIAutoResetPoint takes boolean enable returns nothing
    native DzFrameSetPriority takes integer frame, integer priority returns nothing
    native DzFrameSetParent takes integer frame, integer parent returns nothing
    native DzFrameGetHeight takes integer frame returns real
    native DzFrameSetFont takes integer frame, string fileName, real height, integer flag returns nothing
    native DzFrameGetParent takes integer frame returns integer
    native DzFrameSetTextAlignment takes integer frame, integer align returns nothing
    native DzFrameGetName takes integer frame returns string
    native DzGetClientWidth takes nothing returns integer
    native DzGetClientHeight takes nothing returns integer
    native DzFrameIsVisible takes integer frame returns boolean
    native DzSimpleFrameShow takes integer frame, boolean enable returns nothing
    native DzFrameAddText takes integer frame, string text returns nothing
    native DzUnitSilence takes unit whichUnit, boolean disable returns nothing
    native DzUnitDisableAttack takes unit whichUnit, boolean disable returns nothing
    native DzUnitDisableInventory takes unit whichUnit, boolean disable returns nothing
    native DzUpdateMinimap takes nothing returns nothing
    native DzUnitChangeAlpha takes unit whichUnit, integer alpha, boolean forceUpdate returns nothing
    native DzUnitSetCanSelect takes unit whichUnit, boolean state returns nothing
    native DzUnitSetTargetable takes unit whichUnit, boolean state returns nothing
    native DzSaveMemoryCache takes string cache returns nothing
    native DzGetMemoryCache takes nothing returns string
    native DzSetSpeed takes real ratio returns nothing
    native DzConvertWorldPosition takes real x, real y, real z, code callback returns boolean
    native DzGetConvertWorldPositionX takes nothing returns real
    native DzGetConvertWorldPositionY takes nothing returns real
    native DzCreateCommandButton takes integer parent, string icon, string name, string desc returns integer


function sg__MemoryLeakHelper__LocationLeakData_get takes integer i returns location
    if(i<8191) then
        return s__MemoryLeakHelper__LocationLeakData[i]
    elseif(i<32764) then
        if(i<16382) then
            return s__2MemoryLeakHelper__LocationLeakData[i-8191]
        elseif(i<24573) then
            return s__3MemoryLeakHelper__LocationLeakData[i-16382]
        else
            return s__4MemoryLeakHelper__LocationLeakData[i-24573]
        endif
    elseif(i<40955) then
        return s__5MemoryLeakHelper__LocationLeakData[i-32764]
    elseif(i<49146) then
            return s__6MemoryLeakHelper__LocationLeakData[i-40955]
    elseif(i<57337) then
        return s__7MemoryLeakHelper__LocationLeakData[i-49146]
    else
        return s__8MemoryLeakHelper__LocationLeakData[i-57337]
    endif
endfunction

function sg__MemoryLeakHelper__LocationLeakData_set takes integer i,location v returns nothing
    if(i<8191) then
        set s__MemoryLeakHelper__LocationLeakData[i]=v
    elseif(i<32764) then
        if(i<16382) then
            set s__2MemoryLeakHelper__LocationLeakData[i-8191]=v
        elseif(i<24573) then
            set s__3MemoryLeakHelper__LocationLeakData[i-16382]=v
        else
            set s__4MemoryLeakHelper__LocationLeakData[i-24573]=v
        endif
    elseif(i<40955) then
        set s__5MemoryLeakHelper__LocationLeakData[i-32764]=v
    elseif(i<49146) then
            set s__6MemoryLeakHelper__LocationLeakData[i-40955]=v
    elseif(i<57337) then
        set s__7MemoryLeakHelper__LocationLeakData[i-49146]=v
    else
        set s__8MemoryLeakHelper__LocationLeakData[i-57337]=v
    endif
endfunction

function sg__MemoryLeakHelper__LocationDestroyData_get takes integer i returns location
    if(i<8191) then
        return s__MemoryLeakHelper__LocationDestroyData[i]
    elseif(i<32764) then
        if(i<16382) then
            return s__2MemoryLeakHelper__LocationDestroyData[i-8191]
        elseif(i<24573) then
            return s__3MemoryLeakHelper__LocationDestroyData[i-16382]
        else
            return s__4MemoryLeakHelper__LocationDestroyData[i-24573]
        endif
    elseif(i<40955) then
        return s__5MemoryLeakHelper__LocationDestroyData[i-32764]
    elseif(i<49146) then
            return s__6MemoryLeakHelper__LocationDestroyData[i-40955]
    elseif(i<57337) then
        return s__7MemoryLeakHelper__LocationDestroyData[i-49146]
    else
        return s__8MemoryLeakHelper__LocationDestroyData[i-57337]
    endif
endfunction

function sg__MemoryLeakHelper__LocationDestroyData_set takes integer i,location v returns nothing
    if(i<8191) then
        set s__MemoryLeakHelper__LocationDestroyData[i]=v
    elseif(i<32764) then
        if(i<16382) then
            set s__2MemoryLeakHelper__LocationDestroyData[i-8191]=v
        elseif(i<24573) then
            set s__3MemoryLeakHelper__LocationDestroyData[i-16382]=v
        else
            set s__4MemoryLeakHelper__LocationDestroyData[i-24573]=v
        endif
    elseif(i<40955) then
        set s__5MemoryLeakHelper__LocationDestroyData[i-32764]=v
    elseif(i<49146) then
            set s__6MemoryLeakHelper__LocationDestroyData[i-40955]=v
    elseif(i<57337) then
        set s__7MemoryLeakHelper__LocationDestroyData[i-49146]=v
    else
        set s__8MemoryLeakHelper__LocationDestroyData[i-57337]=v
    endif
endfunction

function sg__MemoryLeakHelper__EffectLeakData_get takes integer i returns effect
    if(i<8191) then
        return s__MemoryLeakHelper__EffectLeakData[i]
    elseif(i<32764) then
        if(i<16382) then
            return s__2MemoryLeakHelper__EffectLeakData[i-8191]
        elseif(i<24573) then
            return s__3MemoryLeakHelper__EffectLeakData[i-16382]
        else
            return s__4MemoryLeakHelper__EffectLeakData[i-24573]
        endif
    elseif(i<40955) then
        return s__5MemoryLeakHelper__EffectLeakData[i-32764]
    elseif(i<49146) then
            return s__6MemoryLeakHelper__EffectLeakData[i-40955]
    elseif(i<57337) then
        return s__7MemoryLeakHelper__EffectLeakData[i-49146]
    else
        return s__8MemoryLeakHelper__EffectLeakData[i-57337]
    endif
endfunction

function sg__MemoryLeakHelper__EffectLeakData_set takes integer i,effect v returns nothing
    if(i<8191) then
        set s__MemoryLeakHelper__EffectLeakData[i]=v
    elseif(i<32764) then
        if(i<16382) then
            set s__2MemoryLeakHelper__EffectLeakData[i-8191]=v
        elseif(i<24573) then
            set s__3MemoryLeakHelper__EffectLeakData[i-16382]=v
        else
            set s__4MemoryLeakHelper__EffectLeakData[i-24573]=v
        endif
    elseif(i<40955) then
        set s__5MemoryLeakHelper__EffectLeakData[i-32764]=v
    elseif(i<49146) then
            set s__6MemoryLeakHelper__EffectLeakData[i-40955]=v
    elseif(i<57337) then
        set s__7MemoryLeakHelper__EffectLeakData[i-49146]=v
    else
        set s__8MemoryLeakHelper__EffectLeakData[i-57337]=v
    endif
endfunction

function sg__MemoryLeakHelper__EffectDestroyData_get takes integer i returns effect
    if(i<8191) then
        return s__MemoryLeakHelper__EffectDestroyData[i]
    elseif(i<32764) then
        if(i<16382) then
            return s__2MemoryLeakHelper__EffectDestroyData[i-8191]
        elseif(i<24573) then
            return s__3MemoryLeakHelper__EffectDestroyData[i-16382]
        else
            return s__4MemoryLeakHelper__EffectDestroyData[i-24573]
        endif
    elseif(i<40955) then
        return s__5MemoryLeakHelper__EffectDestroyData[i-32764]
    elseif(i<49146) then
            return s__6MemoryLeakHelper__EffectDestroyData[i-40955]
    elseif(i<57337) then
        return s__7MemoryLeakHelper__EffectDestroyData[i-49146]
    else
        return s__8MemoryLeakHelper__EffectDestroyData[i-57337]
    endif
endfunction

function sg__MemoryLeakHelper__EffectDestroyData_set takes integer i,effect v returns nothing
    if(i<8191) then
        set s__MemoryLeakHelper__EffectDestroyData[i]=v
    elseif(i<32764) then
        if(i<16382) then
            set s__2MemoryLeakHelper__EffectDestroyData[i-8191]=v
        elseif(i<24573) then
            set s__3MemoryLeakHelper__EffectDestroyData[i-16382]=v
        else
            set s__4MemoryLeakHelper__EffectDestroyData[i-24573]=v
        endif
    elseif(i<40955) then
        set s__5MemoryLeakHelper__EffectDestroyData[i-32764]=v
    elseif(i<49146) then
            set s__6MemoryLeakHelper__EffectDestroyData[i-40955]=v
    elseif(i<57337) then
        set s__7MemoryLeakHelper__EffectDestroyData[i-49146]=v
    else
        set s__8MemoryLeakHelper__EffectDestroyData[i-57337]=v
    endif
endfunction

function sg__MemoryLeakHelper__GroupLeakData_get takes integer i returns group
    if(i<8191) then
        return s__MemoryLeakHelper__GroupLeakData[i]
    elseif(i<32764) then
        if(i<16382) then
            return s__2MemoryLeakHelper__GroupLeakData[i-8191]
        elseif(i<24573) then
            return s__3MemoryLeakHelper__GroupLeakData[i-16382]
        else
            return s__4MemoryLeakHelper__GroupLeakData[i-24573]
        endif
    elseif(i<40955) then
        return s__5MemoryLeakHelper__GroupLeakData[i-32764]
    elseif(i<49146) then
            return s__6MemoryLeakHelper__GroupLeakData[i-40955]
    elseif(i<57337) then
        return s__7MemoryLeakHelper__GroupLeakData[i-49146]
    else
        return s__8MemoryLeakHelper__GroupLeakData[i-57337]
    endif
endfunction

function sg__MemoryLeakHelper__GroupLeakData_set takes integer i,group v returns nothing
    if(i<8191) then
        set s__MemoryLeakHelper__GroupLeakData[i]=v
    elseif(i<32764) then
        if(i<16382) then
            set s__2MemoryLeakHelper__GroupLeakData[i-8191]=v
        elseif(i<24573) then
            set s__3MemoryLeakHelper__GroupLeakData[i-16382]=v
        else
            set s__4MemoryLeakHelper__GroupLeakData[i-24573]=v
        endif
    elseif(i<40955) then
        set s__5MemoryLeakHelper__GroupLeakData[i-32764]=v
    elseif(i<49146) then
            set s__6MemoryLeakHelper__GroupLeakData[i-40955]=v
    elseif(i<57337) then
        set s__7MemoryLeakHelper__GroupLeakData[i-49146]=v
    else
        set s__8MemoryLeakHelper__GroupLeakData[i-57337]=v
    endif
endfunction

function sg__MemoryLeakHelper__GroupDestroyData_get takes integer i returns group
    if(i<8191) then
        return s__MemoryLeakHelper__GroupDestroyData[i]
    elseif(i<32764) then
        if(i<16382) then
            return s__2MemoryLeakHelper__GroupDestroyData[i-8191]
        elseif(i<24573) then
            return s__3MemoryLeakHelper__GroupDestroyData[i-16382]
        else
            return s__4MemoryLeakHelper__GroupDestroyData[i-24573]
        endif
    elseif(i<40955) then
        return s__5MemoryLeakHelper__GroupDestroyData[i-32764]
    elseif(i<49146) then
            return s__6MemoryLeakHelper__GroupDestroyData[i-40955]
    elseif(i<57337) then
        return s__7MemoryLeakHelper__GroupDestroyData[i-49146]
    else
        return s__8MemoryLeakHelper__GroupDestroyData[i-57337]
    endif
endfunction

function sg__MemoryLeakHelper__GroupDestroyData_set takes integer i,group v returns nothing
    if(i<8191) then
        set s__MemoryLeakHelper__GroupDestroyData[i]=v
    elseif(i<32764) then
        if(i<16382) then
            set s__2MemoryLeakHelper__GroupDestroyData[i-8191]=v
        elseif(i<24573) then
            set s__3MemoryLeakHelper__GroupDestroyData[i-16382]=v
        else
            set s__4MemoryLeakHelper__GroupDestroyData[i-24573]=v
        endif
    elseif(i<40955) then
        set s__5MemoryLeakHelper__GroupDestroyData[i-32764]=v
    elseif(i<49146) then
            set s__6MemoryLeakHelper__GroupDestroyData[i-40955]=v
    elseif(i<57337) then
        set s__7MemoryLeakHelper__GroupDestroyData[i-49146]=v
    else
        set s__8MemoryLeakHelper__GroupDestroyData[i-57337]=v
    endif
endfunction

//Generated allocator of MemoryLeakHelper__Index
function s__MemoryLeakHelper__Index__allocate takes nothing returns integer
 local integer this=si__MemoryLeakHelper__Index_F
    if (this!=0) then
        set si__MemoryLeakHelper__Index_F=si__MemoryLeakHelper__Index_V[this]
    else
        set si__MemoryLeakHelper__Index_I=si__MemoryLeakHelper__Index_I+1
        set this=si__MemoryLeakHelper__Index_I
    endif
    if (this>8190) then
        return 0
    endif

    set si__MemoryLeakHelper__Index_V[this]=-1
 return this
endfunction

//Generated destructor of MemoryLeakHelper__Index
function s__MemoryLeakHelper__Index_deallocate takes integer this returns nothing
    if this==null then
        return
    elseif (si__MemoryLeakHelper__Index_V[this]!=-1) then
        return
    endif
    set si__MemoryLeakHelper__Index_V[this]=si__MemoryLeakHelper__Index_F
    set si__MemoryLeakHelper__Index_F=this
endfunction

//Generated method caller for MemoryLeakHelper__GTable.onDestroy
function sc__MemoryLeakHelper__GTable_onDestroy takes integer this returns nothing
    set f__arg_this=this
    call TriggerEvaluate(st__MemoryLeakHelper__GTable_onDestroy[2])
endfunction

//Generated allocator of MemoryLeakHelper__GTable
function s__MemoryLeakHelper__GTable__allocate takes nothing returns integer
 local integer this=si__MemoryLeakHelper__GTable_F
    if (this!=0) then
        set si__MemoryLeakHelper__GTable_F=si__MemoryLeakHelper__GTable_V[this]
    else
        set si__MemoryLeakHelper__GTable_I=si__MemoryLeakHelper__GTable_I+1
        set this=si__MemoryLeakHelper__GTable_I
    endif
    if (this>8100) then
        return 0
    endif

    set si__MemoryLeakHelper__GTable_type[this]=2
    set si__MemoryLeakHelper__GTable_V[this]=-1
 return this
endfunction

//Generated destructor of MemoryLeakHelper__GTable
function sc__MemoryLeakHelper__GTable_deallocate takes integer this returns nothing
    if this==null then
        return
    elseif (si__MemoryLeakHelper__GTable_V[this]!=-1) then
        return
    endif
    set f__arg_this=this
    call TriggerEvaluate(st__MemoryLeakHelper__GTable_onDestroy[si__MemoryLeakHelper__GTable_type[this]])
    set si__MemoryLeakHelper__GTable_V[this]=si__MemoryLeakHelper__GTable_F
    set si__MemoryLeakHelper__GTable_F=this
endfunction

//Generated allocator of MemoryLeakHelper__HandleTable
function s__MemoryLeakHelper__HandleTable__allocate takes nothing returns integer
 local integer this=s__MemoryLeakHelper__GTable__allocate()
 local integer kthis
    if(this==0) then
        return 0
    endif
    set si__MemoryLeakHelper__GTable_type[this]=3
    set kthis=this

 return this
endfunction

function sc___prototype164_execute takes integer i returns nothing

    call TriggerExecute(st___prototype164[i])
endfunction
function sc___prototype164_evaluate takes integer i returns real

    call TriggerEvaluate(st___prototype164[i])
 return f__result_real
endfunction
function sc___prototype168_execute takes integer i,location a1 returns nothing
    set f__arg_location1=a1

    call TriggerExecute(st___prototype168[i])
endfunction
function sc___prototype168_evaluate takes integer i,location a1 returns nothing
    set f__arg_location1=a1

    call TriggerEvaluate(st___prototype168[i])

endfunction
function sc___prototype169_execute takes integer i,group a1 returns nothing
    set f__arg_group1=a1

    call TriggerExecute(st___prototype169[i])
endfunction
function sc___prototype169_evaluate takes integer i,group a1 returns nothing
    set f__arg_group1=a1

    call TriggerEvaluate(st___prototype169[i])

endfunction
function sc___prototype170_execute takes integer i,effect a1 returns nothing
    set f__arg_effect1=a1

    call TriggerExecute(st___prototype170[i])
endfunction
function sc___prototype170_evaluate takes integer i,effect a1 returns nothing
    set f__arg_effect1=a1

    call TriggerEvaluate(st___prototype170[i])

endfunction
function sc___prototype171_execute takes integer i,location a1,real a2,real a3 returns nothing
    set f__arg_location1=a1
    set f__arg_real1=a2
    set f__arg_real2=a3

    call TriggerExecute(st___prototype171[i])
endfunction
function sc___prototype171_evaluate takes integer i,location a1,real a2,real a3 returns nothing
    set f__arg_location1=a1
    set f__arg_real1=a2
    set f__arg_real2=a3

    call TriggerEvaluate(st___prototype171[i])

endfunction
function sc___prototype172_execute takes integer i,integer a1,integer a2,player a3,location a4,real a5 returns nothing
    set f__arg_integer1=a1
    set f__arg_integer2=a2
    set f__arg_player1=a3
    set f__arg_location1=a4
    set f__arg_real1=a5

    call TriggerExecute(st___prototype172[i])
endfunction
function sc___prototype172_evaluate takes integer i,integer a1,integer a2,player a3,location a4,real a5 returns nothing
    set f__arg_integer1=a1
    set f__arg_integer2=a2
    set f__arg_player1=a3
    set f__arg_location1=a4
    set f__arg_real1=a5

    call TriggerEvaluate(st___prototype172[i])

endfunction
function sc___prototype173_execute takes integer i,unit a1,string a2,location a3 returns nothing
    set f__arg_unit1=a1
    set f__arg_string1=a2
    set f__arg_location1=a3

    call TriggerExecute(st___prototype173[i])
endfunction
function sc___prototype173_evaluate takes integer i,unit a1,string a2,location a3 returns nothing
    set f__arg_unit1=a1
    set f__arg_string1=a2
    set f__arg_location1=a3

    call TriggerEvaluate(st___prototype173[i])

endfunction
function sc___prototype174_execute takes integer i,unit a1,location a2 returns nothing
    set f__arg_unit1=a1
    set f__arg_location1=a2

    call TriggerExecute(st___prototype174[i])
endfunction
function sc___prototype174_evaluate takes integer i,unit a1,location a2 returns nothing
    set f__arg_unit1=a1
    set f__arg_location1=a2

    call TriggerEvaluate(st___prototype174[i])

endfunction
function sc___prototype175_execute takes integer i,unit a1,location a2,real a3 returns nothing
    set f__arg_unit1=a1
    set f__arg_location1=a2
    set f__arg_real1=a3

    call TriggerExecute(st___prototype175[i])
endfunction
function sc___prototype175_evaluate takes integer i,unit a1,location a2,real a3 returns nothing
    set f__arg_unit1=a1
    set f__arg_location1=a2
    set f__arg_real1=a3

    call TriggerEvaluate(st___prototype175[i])

endfunction
function sc___prototype176_execute takes integer i,real a1,location a2,boolexpr a3 returns nothing
    set f__arg_real1=a1
    set f__arg_location1=a2
    set f__arg_boolexpr1=a3

    call TriggerExecute(st___prototype176[i])
endfunction
function sc___prototype176_evaluate takes integer i,real a1,location a2,boolexpr a3 returns nothing
    set f__arg_real1=a1
    set f__arg_location1=a2
    set f__arg_boolexpr1=a3

    call TriggerEvaluate(st___prototype176[i])

endfunction
function sc___prototype177_execute takes integer i,integer a1,integer a2,player a3,location a4,location a5 returns nothing
    set f__arg_integer1=a1
    set f__arg_integer2=a2
    set f__arg_player1=a3
    set f__arg_location1=a4
    set f__arg_location2=a5

    call TriggerExecute(st___prototype177[i])
endfunction
function sc___prototype177_evaluate takes integer i,integer a1,integer a2,player a3,location a4,location a5 returns nothing
    set f__arg_integer1=a1
    set f__arg_integer2=a2
    set f__arg_player1=a3
    set f__arg_location1=a4
    set f__arg_location2=a5

    call TriggerEvaluate(st___prototype177[i])

endfunction
function sc___prototype178_execute takes integer i,group a1,code a2 returns nothing
    set f__arg_group1=a1
    set f__arg_code1=a2

    call TriggerExecute(st___prototype178[i])
endfunction
function sc___prototype178_evaluate takes integer i,group a1,code a2 returns nothing
    set f__arg_group1=a1
    set f__arg_code1=a2

    call TriggerEvaluate(st___prototype178[i])

endfunction
function sc___prototype179_execute takes integer i,string a1,widget a2,string a3 returns nothing
    set f__arg_string1=a1
    set f__arg_widget1=a2
    set f__arg_string2=a3

    call TriggerExecute(st___prototype179[i])
endfunction
function sc___prototype179_evaluate takes integer i,string a1,widget a2,string a3 returns nothing
    set f__arg_string1=a1
    set f__arg_widget1=a2
    set f__arg_string2=a3

    call TriggerEvaluate(st___prototype179[i])

endfunction
function sc___prototype180_execute takes integer i,location a1,string a2 returns nothing
    set f__arg_location1=a1
    set f__arg_string1=a2

    call TriggerExecute(st___prototype180[i])
endfunction
function sc___prototype180_evaluate takes integer i,location a1,string a2 returns nothing
    set f__arg_location1=a1
    set f__arg_string1=a2

    call TriggerEvaluate(st___prototype180[i])

endfunction
function h__PolarProjectionBJ takes location a0, real a1, real a2 returns location
    //hook: MemoryLeakHelper__PP
    call sc___prototype171_evaluate(1,a0,a1,a2)
return PolarProjectionBJ(a0,a1,a2)
endfunction
function h__CreateNUnitsAtLoc takes integer a0, integer a1, player a2, location a3, real a4 returns group
    //hook: MemoryLeakHelper__CU
    call sc___prototype172_evaluate(1,a0,a1,a2,a3,a4)
return CreateNUnitsAtLoc(a0,a1,a2,a3,a4)
endfunction
function h__CreateNUnitsAtLocFacingLocBJ takes integer a0, integer a1, player a2, location a3, location a4 returns group
    //hook: MemoryLeakHelper__CUF
    call sc___prototype177_evaluate(1,a0,a1,a2,a3,a4)
return CreateNUnitsAtLocFacingLocBJ(a0,a1,a2,a3,a4)
endfunction
function h__IssuePointOrderLocBJ takes unit a0, string a1, location a2 returns boolean
    //hook: MemoryLeakHelper__IPO
    call sc___prototype173_evaluate(1,a0,a1,a2)
return IssuePointOrderLocBJ(a0,a1,a2)
endfunction
function h__SetUnitPositionLoc takes unit a0, location a1 returns nothing
    //hook: MemoryLeakHelper__SUP
    call sc___prototype174_evaluate(1,a0,a1)
call SetUnitPositionLoc(a0,a1)
endfunction
function h__SetUnitFacingToFaceLocTimed takes unit a0, location a1, real a2 returns nothing
    //hook: MemoryLeakHelper__SUF
    call sc___prototype175_evaluate(1,a0,a1,a2)
call SetUnitFacingToFaceLocTimed(a0,a1,a2)
endfunction
function h__GetUnitsInRangeOfLocMatching takes real a0, location a1, boolexpr a2 returns group
    //hook: MemoryLeakHelper__GUR
    call sc___prototype176_evaluate(1,a0,a1,a2)
return GetUnitsInRangeOfLocMatching(a0,a1,a2)
endfunction
function h__RemoveLocation takes location a0 returns nothing
    //hook: MemoryLeakHelper__ReleaseLocation
    call sc___prototype168_evaluate(1,a0)
call RemoveLocation(a0)
endfunction
function h__ForGroupBJ takes group a0, code a1 returns nothing
    //hook: MemoryLeakHelper__FG
    call sc___prototype178_evaluate(1,a0,a1)
call ForGroupBJ(a0,a1)
endfunction
function h__GroupPickRandomUnit takes group a0 returns unit
    //hook: MemoryLeakHelper__CatchGroup
    call sc___prototype169_evaluate(1,a0)
return GroupPickRandomUnit(a0)
endfunction
function h__CountUnitsInGroup takes group a0 returns integer
    //hook: MemoryLeakHelper__CatchGroup
    call sc___prototype169_evaluate(1,a0)
return CountUnitsInGroup(a0)
endfunction
function h__DestroyGroup takes group a0 returns nothing
    //hook: MemoryLeakHelper__ReleaseGroup
    call sc___prototype169_evaluate(2,a0)
call DestroyGroup(a0)
endfunction
function h__AddSpecialEffectLocBJ takes location a0, string a1 returns effect
    //hook: MemoryLeakHelper__ASE
    call sc___prototype180_evaluate(1,a0,a1)
return AddSpecialEffectLocBJ(a0,a1)
endfunction
function h__AddSpecialEffectTargetUnitBJ takes string a0, widget a1, string a2 returns effect
    //hook: MemoryLeakHelper__ASETU
    call sc___prototype179_evaluate(1,a0,a1,a2)
return AddSpecialEffectTargetUnitBJ(a0,a1,a2)
endfunction
function h__DestroyEffect takes effect a0 returns nothing
    //hook: MemoryLeakHelper__ReleaseEffect
    call sc___prototype170_evaluate(1,a0)
call DestroyEffect(a0)
endfunction
function h__DestroyEffectBJ takes effect a0 returns nothing
    //hook: MemoryLeakHelper__ReleaseEffect
    call sc___prototype170_evaluate(1,a0)
call DestroyEffectBJ(a0)
endfunction

//library BzAPI:
    //hardware




























    //plus











    //sync






    //native DzGetPushContext takes nothing returns string

    //gui















































































    //显示/隐藏SimpleFrame

    // 追加文字（支持TextArea）

    // 沉默单位-禁用技能

    // 禁用攻击

    // 禁用道具

    // 刷新小地图

    // 修改单位alpha

    // 设置单位是否可以选中

    // 修改单位是否可以被设置为目标

    // 保存内存数据

    // 读取内存数据

    // 设置加速倍率

    // 转换世界坐标为屏幕坐标-异步

    // 转换世界坐标为屏幕坐标-获取转换后的X坐标

    // 转换世界坐标为屏幕坐标-获取转换后的Y坐标

    // 创建command button

    function DzTriggerRegisterMouseEventTrg takes trigger trg,integer status,integer btn returns nothing
        if trg == null then
            return
        endif
        call DzTriggerRegisterMouseEvent(trg, btn, status, true, null)
    endfunction
    function DzTriggerRegisterKeyEventTrg takes trigger trg,integer status,integer btn returns nothing
        if trg == null then
            return
        endif
        call DzTriggerRegisterKeyEvent(trg, btn, status, true, null)
    endfunction
    function DzTriggerRegisterMouseMoveEventTrg takes trigger trg returns nothing
        if trg == null then
            return
        endif
        call DzTriggerRegisterMouseMoveEvent(trg, true, null)
    endfunction
    function DzTriggerRegisterMouseWheelEventTrg takes trigger trg returns nothing
        if trg == null then
            return
        endif
        call DzTriggerRegisterMouseWheelEvent(trg, true, null)
    endfunction
    function DzTriggerRegisterWindowResizeEventTrg takes trigger trg returns nothing
        if trg == null then
            return
        endif
        call DzTriggerRegisterWindowResizeEvent(trg, true, null)
    endfunction
    function DzF2I takes integer i returns integer
        return i
    endfunction
    function DzI2F takes integer i returns integer
        return i
    endfunction
    function DzK2I takes integer i returns integer
        return i
    endfunction
    function DzI2K takes integer i returns integer
        return i
    endfunction
    function DzTriggerRegisterMallItemSyncData takes trigger trig returns nothing
        call DzTriggerRegisterSyncData(trig, "DZMIA", true)
    endfunction
    //玩家消耗/使用商城道具事件
    function DzTriggerRegisterMallItemConsumeEvent takes trigger trig returns nothing
        call DzTriggerRegisterSyncData(trig, "DZMIC", true)
    endfunction
    //玩家删除商城道具事件
    function DzTriggerRegisterMallItemRemoveEvent takes trigger trig returns nothing
        call DzTriggerRegisterSyncData(trig, "DZMID", true)
    endfunction
    function DzGetTriggerMallItemPlayer takes nothing returns player
        return DzGetTriggerSyncPlayer()
    endfunction
    function DzGetTriggerMallItem takes nothing returns string
        return DzGetTriggerSyncData()
    endfunction
    

//library BzAPI ends
//library YDTriggerSaveLoadSystem:
//#  define YDTRIGGER_handle(SG)                          YDTRIGGER_HT##SG##(HashtableHandle)
    function YDTriggerSaveLoadSystem__Init takes nothing returns nothing
            set YDHT=InitHashtable()
        set YDLOC=InitHashtable()
    endfunction

//library YDTriggerSaveLoadSystem ends
//library YDWEBase:
//===========================================================================
//HashTable
//===========================================================================
//===========================================================================
//Return bug
//===========================================================================
function YDWEH2I takes handle h returns integer
    return GetHandleId(h)
endfunction
//����
function YDWEFlushAllData takes nothing returns nothing
    call FlushParentHashtable(YDHT)
endfunction
function YDWEFlushMissionByInteger takes integer i returns nothing
    call FlushChildHashtable(YDHT, i)
endfunction
function YDWEFlushMissionByString takes string s returns nothing
    call FlushChildHashtable(YDHT, StringHash(s))
endfunction
function YDWEFlushStoredIntegerByInteger takes integer i,integer j returns nothing
    call RemoveSavedInteger(YDHT, i, j)
endfunction
function YDWEFlushStoredIntegerByString takes string s1,string s2 returns nothing
    call RemoveSavedInteger(YDHT, StringHash(s1), StringHash(s2))
endfunction
function YDWEHaveSavedIntegerByInteger takes integer i,integer j returns boolean
    return HaveSavedInteger(YDHT, i, j)
endfunction
function YDWEHaveSavedIntegerByString takes string s1,string s2 returns boolean
    return HaveSavedInteger(YDHT, StringHash(s1), StringHash(s2))
endfunction
//store and get integer
function YDWESaveIntegerByInteger takes integer pTable,integer pKey,integer i returns nothing
    call SaveInteger(YDHT, pTable, pKey, i)
endfunction
function YDWESaveIntegerByString takes string pTable,string pKey,integer i returns nothing
    call SaveInteger(YDHT, StringHash(pTable), StringHash(pKey), i)
endfunction
function YDWEGetIntegerByInteger takes integer pTable,integer pKey returns integer
    return LoadInteger(YDHT, pTable, pKey)
endfunction
function YDWEGetIntegerByString takes string pTable,string pKey returns integer
    return LoadInteger(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//store and get real
function YDWESaveRealByInteger takes integer pTable,integer pKey,real r returns nothing
    call SaveReal(YDHT, pTable, pKey, r)
endfunction
function YDWESaveRealByString takes string pTable,string pKey,real r returns nothing
    call SaveReal(YDHT, StringHash(pTable), StringHash(pKey), r)
endfunction
function YDWEGetRealByInteger takes integer pTable,integer pKey returns real
    return LoadReal(YDHT, pTable, pKey)
endfunction
function YDWEGetRealByString takes string pTable,string pKey returns real
    return LoadReal(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//store and get string
function YDWESaveStringByInteger takes integer pTable,integer pKey,string s returns nothing
    call SaveStr(YDHT, pTable, pKey, s)
endfunction
function YDWESaveStringByString takes string pTable,string pKey,string s returns nothing
    call SaveStr(YDHT, StringHash(pTable), StringHash(pKey), s)
endfunction
function YDWEGetStringByInteger takes integer pTable,integer pKey returns string
    return LoadStr(YDHT, pTable, pKey)
endfunction
function YDWEGetStringByString takes string pTable,string pKey returns string
    return LoadStr(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//store and get boolean
function YDWESaveBooleanByInteger takes integer pTable,integer pKey,boolean b returns nothing
    call SaveBoolean(YDHT, pTable, pKey, b)
endfunction
function YDWESaveBooleanByString takes string pTable,string pKey,boolean b returns nothing
    call SaveBoolean(YDHT, StringHash(pTable), StringHash(pKey), b)
endfunction
function YDWEGetBooleanByInteger takes integer pTable,integer pKey returns boolean
    return LoadBoolean(YDHT, pTable, pKey)
endfunction
function YDWEGetBooleanByString takes string pTable,string pKey returns boolean
    return LoadBoolean(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Unit
function YDWESaveUnitByInteger takes integer pTable,integer pKey,unit u returns nothing
    call SaveUnitHandle(YDHT, pTable, pKey, u)
endfunction
function YDWESaveUnitByString takes string pTable,string pKey,unit u returns nothing
    call SaveUnitHandle(YDHT, StringHash(pTable), StringHash(pKey), u)
endfunction
function YDWEGetUnitByInteger takes integer pTable,integer pKey returns unit
    return LoadUnitHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetUnitByString takes string pTable,string pKey returns unit
    return LoadUnitHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert UnitID
function YDWESaveUnitIDByInteger takes integer pTable,integer pKey,integer uid returns nothing
    call SaveInteger(YDHT, pTable, pKey, uid)
endfunction
function YDWESaveUnitIDByString takes string pTable,string pKey,integer uid returns nothing
    call SaveInteger(YDHT, StringHash(pTable), StringHash(pKey), uid)
endfunction
function YDWEGetUnitIDByInteger takes integer pTable,integer pKey returns integer
    return LoadInteger(YDHT, pTable, pKey)
endfunction
function YDWEGetUnitIDByString takes string pTable,string pKey returns integer
    return LoadInteger(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert AbilityID
function YDWESaveAbilityIDByInteger takes integer pTable,integer pKey,integer abid returns nothing
    call SaveInteger(YDHT, pTable, pKey, abid)
endfunction
function YDWESaveAbilityIDByString takes string pTable,string pKey,integer abid returns nothing
    call SaveInteger(YDHT, StringHash(pTable), StringHash(pKey), abid)
endfunction
function YDWEGetAbilityIDByInteger takes integer pTable,integer pKey returns integer
    return LoadInteger(YDHT, pTable, pKey)
endfunction
function YDWEGetAbilityIDByString takes string pTable,string pKey returns integer
    return LoadInteger(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Player
function YDWESavePlayerByInteger takes integer pTable,integer pKey,player p returns nothing
    call SavePlayerHandle(YDHT, pTable, pKey, p)
endfunction
function YDWESavePlayerByString takes string pTable,string pKey,player p returns nothing
    call SavePlayerHandle(YDHT, StringHash(pTable), StringHash(pKey), p)
endfunction
function YDWEGetPlayerByInteger takes integer pTable,integer pKey returns player
    return LoadPlayerHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetPlayerByString takes string pTable,string pKey returns player
    return LoadPlayerHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Item
function YDWESaveItemByInteger takes integer pTable,integer pKey,item it returns nothing
    call SaveItemHandle(YDHT, pTable, pKey, it)
endfunction
function YDWESaveItemByString takes string pTable,string pKey,item it returns nothing
    call SaveItemHandle(YDHT, StringHash(pTable), StringHash(pKey), it)
endfunction
function YDWEGetItemByInteger takes integer pTable,integer pKey returns item
    return LoadItemHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetItemByString takes string pTable,string pKey returns item
    return LoadItemHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert ItemID
function YDWESaveItemIDByInteger takes integer pTable,integer pKey,integer itid returns nothing
    call SaveInteger(YDHT, pTable, pKey, itid)
endfunction
function YDWESaveItemIDByString takes string pTable,string pKey,integer itid returns nothing
    call SaveInteger(YDHT, StringHash(pTable), StringHash(pKey), itid)
endfunction
function YDWEGetItemIDByInteger takes integer pTable,integer pKey returns integer
    return LoadInteger(YDHT, pTable, pKey)
endfunction
function YDWEGetItemIDByString takes string pTable,string pKey returns integer
    return LoadInteger(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Timer
function YDWESaveTimerByInteger takes integer pTable,integer pKey,timer t returns nothing
    call SaveTimerHandle(YDHT, pTable, pKey, t)
endfunction
function YDWESaveTimerByString takes string pTable,string pKey,timer t returns nothing
    call SaveTimerHandle(YDHT, StringHash(pTable), StringHash(pKey), t)
endfunction
function YDWEGetTimerByInteger takes integer pTable,integer pKey returns timer
    return LoadTimerHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTimerByString takes string pTable,string pKey returns timer
    return LoadTimerHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Trigger
function YDWESaveTriggerByInteger takes integer pTable,integer pKey,trigger trg returns nothing
    call SaveTriggerHandle(YDHT, pTable, pKey, trg)
endfunction
function YDWESaveTriggerByString takes string pTable,string pKey,trigger trg returns nothing
    call SaveTriggerHandle(YDHT, StringHash(pTable), StringHash(pKey), trg)
endfunction
function YDWEGetTriggerByInteger takes integer pTable,integer pKey returns trigger
    return LoadTriggerHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTriggerByString takes string pTable,string pKey returns trigger
    return LoadTriggerHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Location
function YDWESaveLocationByInteger takes integer pTable,integer pKey,location pt returns nothing
    call SaveLocationHandle(YDHT, pTable, pKey, pt)
endfunction
function YDWESaveLocationByString takes string pTable,string pKey,location pt returns nothing
    call SaveLocationHandle(YDHT, StringHash(pTable), StringHash(pKey), pt)
endfunction
function YDWEGetLocationByInteger takes integer pTable,integer pKey returns location
    return LoadLocationHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetLocationByString takes string pTable,string pKey returns location
    return LoadLocationHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Group
function YDWESaveGroupByInteger takes integer pTable,integer pKey,group g returns nothing
    call SaveGroupHandle(YDHT, pTable, pKey, g)
endfunction
function YDWESaveGroupByString takes string pTable,string pKey,group g returns nothing
    call SaveGroupHandle(YDHT, StringHash(pTable), StringHash(pKey), g)
endfunction
function YDWEGetGroupByInteger takes integer pTable,integer pKey returns group
    return LoadGroupHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetGroupByString takes string pTable,string pKey returns group
    return LoadGroupHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Multiboard
function YDWESaveMultiboardByInteger takes integer pTable,integer pKey,multiboard m returns nothing
    call SaveMultiboardHandle(YDHT, pTable, pKey, m)
endfunction
function YDWESaveMultiboardByString takes string pTable,string pKey,multiboard m returns nothing
    call SaveMultiboardHandle(YDHT, StringHash(pTable), StringHash(pKey), m)
endfunction
function YDWEGetMultiboardByInteger takes integer pTable,integer pKey returns multiboard
    return LoadMultiboardHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetMultiboardByString takes string pTable,string pKey returns multiboard
    return LoadMultiboardHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert MultiboardItem
function YDWESaveMultiboardItemByInteger takes integer pTable,integer pKey,multiboarditem mt returns nothing
    call SaveMultiboardItemHandle(YDHT, pTable, pKey, mt)
endfunction
function YDWESaveMultiboardItemByString takes string pTable,string pKey,multiboarditem mt returns nothing
    call SaveMultiboardItemHandle(YDHT, StringHash(pTable), StringHash(pKey), mt)
endfunction
function YDWEGetMultiboardItemByInteger takes integer pTable,integer pKey returns multiboarditem
    return LoadMultiboardItemHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetMultiboardItemByString takes string pTable,string pKey returns multiboarditem
    return LoadMultiboardItemHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert TextTag
function YDWESaveTextTagByInteger takes integer pTable,integer pKey,texttag tt returns nothing
    call SaveTextTagHandle(YDHT, pTable, pKey, tt)
endfunction
function YDWESaveTextTagByString takes string pTable,string pKey,texttag tt returns nothing
    call SaveTextTagHandle(YDHT, StringHash(pTable), StringHash(pKey), tt)
endfunction
function YDWEGetTextTagByInteger takes integer pTable,integer pKey returns texttag
    return LoadTextTagHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTextTagByString takes string pTable,string pKey returns texttag
    return LoadTextTagHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Lightning
function YDWESaveLightningByInteger takes integer pTable,integer pKey,lightning ln returns nothing
    call SaveLightningHandle(YDHT, pTable, pKey, ln)
endfunction
function YDWESaveLightningByString takes string pTable,string pKey,lightning ln returns nothing
    call SaveLightningHandle(YDHT, StringHash(pTable), StringHash(pKey), ln)
endfunction
function YDWEGetLightningByInteger takes integer pTable,integer pKey returns lightning
    return LoadLightningHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetLightningByString takes string pTable,string pKey returns lightning
    return LoadLightningHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Region
function YDWESaveRegionByInteger takes integer pTable,integer pKey,region rn returns nothing
    call SaveRegionHandle(YDHT, pTable, pKey, rn)
endfunction
function YDWESaveRegionByString takes string pTable,string pKey,region rt returns nothing
    call SaveRegionHandle(YDHT, StringHash(pTable), StringHash(pKey), rt)
endfunction
function YDWEGetRegionByInteger takes integer pTable,integer pKey returns region
    return LoadRegionHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetRegionByString takes string pTable,string pKey returns region
    return LoadRegionHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Rect
function YDWESaveRectByInteger takes integer pTable,integer pKey,rect rn returns nothing
    call SaveRectHandle(YDHT, pTable, pKey, rn)
endfunction
function YDWESaveRectByString takes string pTable,string pKey,rect rt returns nothing
    call SaveRectHandle(YDHT, StringHash(pTable), StringHash(pKey), rt)
endfunction
function YDWEGetRectByInteger takes integer pTable,integer pKey returns rect
    return LoadRectHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetRectByString takes string pTable,string pKey returns rect
    return LoadRectHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Leaderboard
function YDWESaveLeaderboardByInteger takes integer pTable,integer pKey,leaderboard lb returns nothing
    call SaveLeaderboardHandle(YDHT, pTable, pKey, lb)
endfunction
function YDWESaveLeaderboardByString takes string pTable,string pKey,leaderboard lb returns nothing
    call SaveLeaderboardHandle(YDHT, StringHash(pTable), StringHash(pKey), lb)
endfunction
function YDWEGetLeaderboardByInteger takes integer pTable,integer pKey returns leaderboard
    return LoadLeaderboardHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetLeaderboardByString takes string pTable,string pKey returns leaderboard
    return LoadLeaderboardHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Effect
function YDWESaveEffectByInteger takes integer pTable,integer pKey,effect e returns nothing
    call SaveEffectHandle(YDHT, pTable, pKey, e)
endfunction
function YDWESaveEffectByString takes string pTable,string pKey,effect e returns nothing
    call SaveEffectHandle(YDHT, StringHash(pTable), StringHash(pKey), e)
endfunction
function YDWEGetEffectByInteger takes integer pTable,integer pKey returns effect
    return LoadEffectHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetEffectByString takes string pTable,string pKey returns effect
    return LoadEffectHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert Destructable
function YDWESaveDestructableByInteger takes integer pTable,integer pKey,destructable da returns nothing
    call SaveDestructableHandle(YDHT, pTable, pKey, da)
endfunction
function YDWESaveDestructableByString takes string pTable,string pKey,destructable da returns nothing
    call SaveDestructableHandle(YDHT, StringHash(pTable), StringHash(pKey), da)
endfunction
function YDWEGetDestructableByInteger takes integer pTable,integer pKey returns destructable
    return LoadDestructableHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetDestructableByString takes string pTable,string pKey returns destructable
    return LoadDestructableHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert triggercondition
function YDWESaveTriggerConditionByInteger takes integer pTable,integer pKey,triggercondition tc returns nothing
    call SaveTriggerConditionHandle(YDHT, pTable, pKey, tc)
endfunction
function YDWESaveTriggerConditionByString takes string pTable,string pKey,triggercondition tc returns nothing
    call SaveTriggerConditionHandle(YDHT, StringHash(pTable), StringHash(pKey), tc)
endfunction
function YDWEGetTriggerConditionByInteger takes integer pTable,integer pKey returns triggercondition
    return LoadTriggerConditionHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTriggerConditionByString takes string pTable,string pKey returns triggercondition
    return LoadTriggerConditionHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert triggeraction
function YDWESaveTriggerActionByInteger takes integer pTable,integer pKey,triggeraction ta returns nothing
    call SaveTriggerActionHandle(YDHT, pTable, pKey, ta)
endfunction
function YDWESaveTriggerActionByString takes string pTable,string pKey,triggeraction ta returns nothing
    call SaveTriggerActionHandle(YDHT, StringHash(pTable), StringHash(pKey), ta)
endfunction
function YDWEGetTriggerActionByInteger takes integer pTable,integer pKey returns triggeraction
    return LoadTriggerActionHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTriggerActionByString takes string pTable,string pKey returns triggeraction
    return LoadTriggerActionHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert event
function YDWESaveTriggerEventByInteger takes integer pTable,integer pKey,event et returns nothing
    call SaveTriggerEventHandle(YDHT, pTable, pKey, et)
endfunction
function YDWESaveTriggerEventByString takes string pTable,string pKey,event et returns nothing
    call SaveTriggerEventHandle(YDHT, StringHash(pTable), StringHash(pKey), et)
endfunction
function YDWEGetTriggerEventByInteger takes integer pTable,integer pKey returns event
    return LoadTriggerEventHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTriggerEventByString takes string pTable,string pKey returns event
    return LoadTriggerEventHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert force
function YDWESaveForceByInteger takes integer pTable,integer pKey,force fc returns nothing
    call SaveForceHandle(YDHT, pTable, pKey, fc)
endfunction
function YDWESaveForceByString takes string pTable,string pKey,force fc returns nothing
    call SaveForceHandle(YDHT, StringHash(pTable), StringHash(pKey), fc)
endfunction
function YDWEGetForceByInteger takes integer pTable,integer pKey returns force
    return LoadForceHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetForceByString takes string pTable,string pKey returns force
    return LoadForceHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert boolexpr
function YDWESaveBoolexprByInteger takes integer pTable,integer pKey,boolexpr be returns nothing
    call SaveBooleanExprHandle(YDHT, pTable, pKey, be)
endfunction
function YDWESaveBoolexprByString takes string pTable,string pKey,boolexpr be returns nothing
    call SaveBooleanExprHandle(YDHT, StringHash(pTable), StringHash(pKey), be)
endfunction
function YDWEGetBoolexprByInteger takes integer pTable,integer pKey returns boolexpr
    return LoadBooleanExprHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetBoolexprByString takes string pTable,string pKey returns boolexpr
    return LoadBooleanExprHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert sound
function YDWESaveSoundByInteger takes integer pTable,integer pKey,sound sd returns nothing
    call SaveSoundHandle(YDHT, pTable, pKey, sd)
endfunction
function YDWESaveSoundByString takes string pTable,string pKey,sound sd returns nothing
    call SaveSoundHandle(YDHT, StringHash(pTable), StringHash(pKey), sd)
endfunction
function YDWEGetSoundByInteger takes integer pTable,integer pKey returns sound
    return LoadSoundHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetSoundByString takes string pTable,string pKey returns sound
    return LoadSoundHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert timerdialog
function YDWESaveTimerDialogByInteger takes integer pTable,integer pKey,timerdialog td returns nothing
    call SaveTimerDialogHandle(YDHT, pTable, pKey, td)
endfunction
function YDWESaveTimerDialogByString takes string pTable,string pKey,timerdialog td returns nothing
    call SaveTimerDialogHandle(YDHT, StringHash(pTable), StringHash(pKey), td)
endfunction
function YDWEGetTimerDialogByInteger takes integer pTable,integer pKey returns timerdialog
    return LoadTimerDialogHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTimerDialogByString takes string pTable,string pKey returns timerdialog
    return LoadTimerDialogHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert trackable
function YDWESaveTrackableByInteger takes integer pTable,integer pKey,trackable ta returns nothing
    call SaveTrackableHandle(YDHT, pTable, pKey, ta)
endfunction
function YDWESaveTrackableByString takes string pTable,string pKey,trackable ta returns nothing
    call SaveTrackableHandle(YDHT, StringHash(pTable), StringHash(pKey), ta)
endfunction
function YDWEGetTrackableByInteger takes integer pTable,integer pKey returns trackable
    return LoadTrackableHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetTrackableByString takes string pTable,string pKey returns trackable
    return LoadTrackableHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert dialog
function YDWESaveDialogByInteger takes integer pTable,integer pKey,dialog d returns nothing
    call SaveDialogHandle(YDHT, pTable, pKey, d)
endfunction
function YDWESaveDialogByString takes string pTable,string pKey,dialog d returns nothing
    call SaveDialogHandle(YDHT, StringHash(pTable), StringHash(pKey), d)
endfunction
function YDWEGetDialogByInteger takes integer pTable,integer pKey returns dialog
    return LoadDialogHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetDialogByString takes string pTable,string pKey returns dialog
    return LoadDialogHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert button
function YDWESaveButtonByInteger takes integer pTable,integer pKey,button bt returns nothing
    call SaveButtonHandle(YDHT, pTable, pKey, bt)
endfunction
function YDWESaveButtonByString takes string pTable,string pKey,button bt returns nothing
    call SaveButtonHandle(YDHT, StringHash(pTable), StringHash(pKey), bt)
endfunction
function YDWEGetButtonByInteger takes integer pTable,integer pKey returns button
    return LoadButtonHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetButtonByString takes string pTable,string pKey returns button
    return LoadButtonHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert quest
function YDWESaveQuestByInteger takes integer pTable,integer pKey,quest qt returns nothing
    call SaveQuestHandle(YDHT, pTable, pKey, qt)
endfunction
function YDWESaveQuestByString takes string pTable,string pKey,quest qt returns nothing
    call SaveQuestHandle(YDHT, StringHash(pTable), StringHash(pKey), qt)
endfunction
function YDWEGetQuestByInteger takes integer pTable,integer pKey returns quest
    return LoadQuestHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetQuestByString takes string pTable,string pKey returns quest
    return LoadQuestHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
//Covert questitem
function YDWESaveQuestItemByInteger takes integer pTable,integer pKey,questitem qi returns nothing
    call SaveQuestItemHandle(YDHT, pTable, pKey, qi)
endfunction
function YDWESaveQuestItemByString takes string pTable,string pKey,questitem qi returns nothing
    call SaveQuestItemHandle(YDHT, StringHash(pTable), StringHash(pKey), qi)
endfunction
function YDWEGetQuestItemByInteger takes integer pTable,integer pKey returns questitem
    return LoadQuestItemHandle(YDHT, pTable, pKey)
endfunction
function YDWEGetQuestItemByString takes string pTable,string pKey returns questitem
    return LoadQuestItemHandle(YDHT, StringHash(pTable), StringHash(pKey))
endfunction
function YDWES2I takes string s returns integer
    return StringHash(s)
endfunction
function YDWESaveAbilityHandleBJ takes integer AbilityID,integer key,integer missionKey,hashtable table returns nothing
    call SaveInteger(table, missionKey, key, AbilityID)
endfunction
function YDWESaveAbilityHandle takes hashtable table,integer parentKey,integer childKey,integer AbilityID returns nothing
    call SaveInteger(table, parentKey, childKey, AbilityID)
endfunction
function YDWELoadAbilityHandleBJ takes integer key,integer missionKey,hashtable table returns integer
    return LoadInteger(table, missionKey, key)
endfunction
function YDWELoadAbilityHandle takes hashtable table,integer parentKey,integer childKey returns integer
    return LoadInteger(table, parentKey, childKey)
endfunction
//===========================================================================
//返回参数
//===========================================================================
//地图边界判断
function YDWECoordinateX takes real x returns real
    return RMinBJ(RMaxBJ(x, yd_MapMinX), yd_MapMaxX)
endfunction
function YDWECoordinateY takes real y returns real
    return RMinBJ(RMaxBJ(y, yd_MapMinY), yd_MapMaxY)
endfunction
//两个单位之间的距离
function YDWEDistanceBetweenUnits takes unit a,unit b returns real
    return SquareRoot(( GetUnitX(a) - GetUnitX(b) ) * ( GetUnitX(a) - GetUnitX(b) ) + ( GetUnitY(a) - GetUnitY(b) ) * ( GetUnitY(a) - GetUnitY(b) ))
endfunction
//两个单位之间的角度
function YDWEAngleBetweenUnits takes unit fromUnit,unit toUnit returns real
    return bj_RADTODEG * Atan2(GetUnitY(toUnit) - GetUnitY(fromUnit), GetUnitX(toUnit) - GetUnitX(fromUnit))
endfunction
//生成区域
function YDWEGetRect takes real x,real y,real width,real height returns rect
    return Rect(x - width * 0.5, y - height * 0.5, x + width * 0.5, y + height * 0.5)
endfunction
//===========================================================================
//设置单位可以飞行
//===========================================================================
function YDWEFlyEnable takes unit u returns nothing
    call UnitAddAbility(u, 'Amrf')
    call UnitRemoveAbility(u, 'Amrf')
endfunction
//===========================================================================
//字符窜与ID转换
//===========================================================================
function YDWEId2S takes integer value returns string
    local string charMap=bj_AllString
    local string result= ""
    local integer remainingValue= value
    local integer charValue
    local integer byteno
    set byteno=0
    loop
        set charValue=ModuloInteger(remainingValue, 256)
        set remainingValue=remainingValue / 256
        set result=SubString(charMap, charValue, charValue + 1) + result
        set byteno=byteno + 1
        exitwhen byteno == 4
    endloop
    return result
endfunction
function YDWES2Id takes string targetstr returns integer
    local string originstr=bj_AllString
    local integer strlength=StringLength(targetstr)
    local integer a=0
local integer b=0
local integer numx=1
local integer result=0
    loop
    exitwhen b > strlength - 1
        set numx=R2I(Pow(256, strlength - 1 - b))
        set a=1
        loop
            exitwhen a > 255
            if SubString(targetstr, b, b + 1) == SubString(originstr, a, a + 1) then
                set result=result + a * numx
                set a=256
            endif
            set a=a + 1
        endloop
        set b=b + 1
    endloop
    return result
endfunction
function YDWES2UnitId takes string targetstr returns integer
    return YDWES2Id(targetstr)
endfunction
function YDWES2ItemId takes string targetstr returns integer
    return YDWES2Id(targetstr)
endfunction
function GetLastAbilityCastingUnit takes nothing returns unit
    return bj_lastAbilityCastingUnit
endfunction
function GetLastAbilityTargetUnit takes nothing returns unit
    return bj_lastAbilityTargetUnit
endfunction
function YDWESetMapLimitCoordinate takes real MinX,real MaxX,real MinY,real MaxY returns nothing
    set yd_MapMaxX=MaxX
    set yd_MapMinX=MinX
    set yd_MapMaxY=MaxY
    set yd_MapMinY=MinY
endfunction
//===========================================================================
//===========================================================================
//地图初始化
//===========================================================================
//YDWE特殊技能结束事件 
function YDWESyStemAbilityCastingOverTriggerAction takes unit hero,integer index returns nothing
 local integer i= 0
    loop
        exitwhen i >= YDWEBase__AbilityCastingOverEventNumber
        if YDWEBase__AbilityCastingOverEventType[i] == index then
            set bj_lastAbilityCastingUnit=hero
			if YDWEBase__AbilityCastingOverEventQueue[i] != null and TriggerEvaluate(YDWEBase__AbilityCastingOverEventQueue[i]) and IsTriggerEnabled(YDWEBase__AbilityCastingOverEventQueue[i]) then
				call TriggerExecute(YDWEBase__AbilityCastingOverEventQueue[i])
			endif
		endif
        set i=i + 1
    endloop
endfunction
//===========================================================================  
//YDWE技能捕捉事件 
//===========================================================================  
function YDWESyStemAbilityCastingOverRegistTrigger takes trigger trg,integer index returns nothing
	set YDWEBase__AbilityCastingOverEventQueue[YDWEBase__AbilityCastingOverEventNumber]=trg
	set YDWEBase__AbilityCastingOverEventType[YDWEBase__AbilityCastingOverEventNumber]=index
	set YDWEBase__AbilityCastingOverEventNumber=YDWEBase__AbilityCastingOverEventNumber + 1
endfunction 
//===========================================================================
//系统函数完善
//===========================================================================
function YDWECreateUnitPool takes nothing returns nothing
    set bj_lastCreatedUnitPool=CreateUnitPool()
endfunction
function YDWEPlaceRandomUnit takes unitpool up,player p,real x,real y,real face returns nothing
set bj_lastPoolAbstractedUnit=PlaceRandomUnit(up, p, x, y, face)
endfunction
function YDWEGetLastUnitPool takes nothing returns unitpool
    return bj_lastCreatedUnitPool
endfunction
function YDWEGetLastPoolAbstractedUnit takes nothing returns unit
    return bj_lastPoolAbstractedUnit
endfunction
function YDWECreateItemPool takes nothing returns nothing
    set bj_lastCreatedItemPool=CreateItemPool()
endfunction
function YDWEPlaceRandomItem takes itempool ip,real x,real y returns nothing
set bj_lastPoolAbstractedItem=PlaceRandomItem(ip, x, y)
endfunction
function YDWEGetLastItemPool takes nothing returns itempool
    return bj_lastCreatedItemPool
endfunction
function YDWEGetLastPoolAbstractedItem takes nothing returns item
    return bj_lastPoolAbstractedItem
endfunction
function YDWESetAttackDamageWeaponType takes attacktype at,damagetype dt,weapontype wt returns nothing
    set bj_lastSetAttackType=at
    set bj_lastSetDamageType=dt
    set bj_lastSetWeaponType=wt
endfunction
//unitpool bj_lastCreatedPool=null
//unit bj_lastPoolAbstractedUnit=null
function YDWEGetPlayerColorString takes player p,string s returns string
    return YDWEBase__yd_PlayerColor[GetHandleId(GetPlayerColor(p))] + s + "|r"
endfunction
//===========================================================================
//===========================================================================
//系统函数补充
//===========================================================================
//===========================================================================
function YDWEGetUnitItemSoftId takes unit hero,item it returns integer
    local integer i= 0
    loop
         exitwhen i > 5
         if UnitItemInSlot(hero, i) == it then
            return i + 1
         endif
         set i=i + 1
    endloop
    return 0
endfunction
//===========================================================================
//===========================================================================
//地图初始化
//===========================================================================
//===========================================================================
//显示版本
function YDWEVersion_Display takes nothing returns boolean
    call DisplayTimedTextToPlayer(GetTriggerPlayer(), 0, 0, 30, "|cFF1E90FF当前编辑器版本为： |r|cFF00FF00KKWE 1.1.0.2362")
    return false
endfunction
function YDWEVersion_Init takes nothing returns nothing
    local trigger t= CreateTrigger()
    local integer i= 0
    loop
        exitwhen i == 12
        call TriggerRegisterPlayerChatEvent(t, Player(i), "KKWE Version", true)
        set i=i + 1
    endloop
    call TriggerAddCondition(t, Condition(function YDWEVersion_Display))
    set t=null
//JASSHelper null local processed: endfunction
set t = null
endfunction
function InitializeYD takes nothing returns nothing
     set YDHT=InitHashtable()
	//=================设置变量=====================
	set yd_MapMinX=GetCameraBoundMinX() - GetCameraMargin(CAMERA_MARGIN_LEFT)
	set yd_MapMinY=GetCameraBoundMinY() - GetCameraMargin(CAMERA_MARGIN_BOTTOM)
	set yd_MapMaxX=GetCameraBoundMaxX() + GetCameraMargin(CAMERA_MARGIN_RIGHT)
	set yd_MapMaxY=GetCameraBoundMaxY() + GetCameraMargin(CAMERA_MARGIN_TOP)
	
    set YDWEBase__yd_PlayerColor[0]="|cFFFF0303"
    set YDWEBase__yd_PlayerColor[1]="|cFF0042FF"
    set YDWEBase__yd_PlayerColor[2]="|cFF1CE6B9"
    set YDWEBase__yd_PlayerColor[3]="|cFF540081"
    set YDWEBase__yd_PlayerColor[4]="|cFFFFFC01"
    set YDWEBase__yd_PlayerColor[5]="|cFFFE8A0E"
    set YDWEBase__yd_PlayerColor[6]="|cFF20C000"
    set YDWEBase__yd_PlayerColor[7]="|cFFE55BB0"
    set YDWEBase__yd_PlayerColor[8]="|cFF959697"
    set YDWEBase__yd_PlayerColor[9]="|cFF7EBFF1"
    set YDWEBase__yd_PlayerColor[10]="|cFF106246"
    set YDWEBase__yd_PlayerColor[11]="|cFF4E2A04"
    set YDWEBase__yd_PlayerColor[12]="|cFF282828"
    set YDWEBase__yd_PlayerColor[13]="|cFF282828"
    set YDWEBase__yd_PlayerColor[14]="|cFF282828"
    set YDWEBase__yd_PlayerColor[15]="|cFF282828"
    //=================显示版本=====================
    call YDWEVersion_Init()
endfunction

//library YDWEBase ends
//library YDWEGetUnitsOfPlayerMatchingNull:
function YDWEGetUnitsOfPlayerMatchingNull takes player whichPlayer,boolexpr filter returns group
    local group g= CreateGroup()
    call GroupEnumUnitsOfPlayer(g, whichPlayer, filter)
    call DestroyBoolExpr(filter)
    set yd_NullTempGroup=g
    set g=null
//JASSHelper null local processed:     return yd_NullTempGroup
set g = null
    return yd_NullTempGroup
endfunction

//library YDWEGetUnitsOfPlayerMatchingNull ends
//library MemoryLeakHelper:
    
    function MemoryLeakHelper__GetElapsedGameTime takes nothing returns real
        return MemoryLeakHelper__GameTime + TimerGetElapsed(MemoryLeakHelper__GameTimeTimer)
    endfunction
    
    function MemoryLeakHelper__UpdateGameTime takes nothing returns nothing
        set MemoryLeakHelper__GameTime=MemoryLeakHelper__GameTime + MemoryLeakHelper__GAMETIME_TIMER_INTERVAL
    endfunction
  function s__MemoryLeakHelper__Index_DestroyHashes takes nothing returns nothing
   local real gt= (1)
   local integer ind
			
			// Well, due to the nature of this system, the looking of the code sucks.
			loop
				exitwhen MemoryLeakHelper__HashNumber == 0
				if gt - MemoryLeakHelper__CreationTime[MemoryLeakHelper__HashNumber] > MemoryLeakHelper__HASH_DECAY_TIME then
					set ind=MemoryLeakHelper__HashHash[MemoryLeakHelper__HashNumber]
					call s__MemoryLeakHelper__Index_deallocate(ind)
					call RemoveSavedInteger(YDHT, (MemoryLeakHelper__key ), ( MemoryLeakHelper__HashData[MemoryLeakHelper__HashNumber])) // INLINED!!
				else
					set MemoryLeakHelper__TempHashNumber=MemoryLeakHelper__TempHashNumber + 1
					set MemoryLeakHelper__TempHashData[MemoryLeakHelper__TempHashNumber]=MemoryLeakHelper__HashData[MemoryLeakHelper__HashNumber]
					set MemoryLeakHelper__TempHashHash[MemoryLeakHelper__TempHashNumber]=MemoryLeakHelper__HashHash[MemoryLeakHelper__HashNumber]
					set MemoryLeakHelper__TempHashPlace[MemoryLeakHelper__TempHashNumber]=MemoryLeakHelper__HashPlace[MemoryLeakHelper__HashNumber]
					set MemoryLeakHelper__TempCreationTime[MemoryLeakHelper__TempHashNumber]=MemoryLeakHelper__CreationTime[MemoryLeakHelper__HashNumber]
				endif
				set MemoryLeakHelper__HashData[MemoryLeakHelper__HashNumber]=0
				set MemoryLeakHelper__HashHash[MemoryLeakHelper__HashNumber]=0
				set MemoryLeakHelper__HashPlace[MemoryLeakHelper__HashNumber]=0
				set MemoryLeakHelper__CreationTime[MemoryLeakHelper__HashNumber]=0.
				set MemoryLeakHelper__HashNumber=MemoryLeakHelper__HashNumber - 1
			endloop
			
			loop
				exitwhen MemoryLeakHelper__TempHashNumber == 0
				set MemoryLeakHelper__HashNumber=MemoryLeakHelper__HashNumber + 1
				set MemoryLeakHelper__HashData[MemoryLeakHelper__HashNumber]=MemoryLeakHelper__TempHashData[MemoryLeakHelper__TempHashNumber]
				set MemoryLeakHelper__HashHash[MemoryLeakHelper__HashNumber]=MemoryLeakHelper__TempHashHash[MemoryLeakHelper__TempHashNumber]
				set MemoryLeakHelper__HashPlace[MemoryLeakHelper__HashNumber]=MemoryLeakHelper__TempHashPlace[MemoryLeakHelper__TempHashNumber]
				set MemoryLeakHelper__TempHashData[MemoryLeakHelper__TempHashNumber]=0
				set MemoryLeakHelper__TempHashNumber=MemoryLeakHelper__TempHashNumber - 1
			endloop
			
  endfunction
	
        function s__MemoryLeakHelper__Index_GetHash takes integer value returns integer
            local integer int= (LoadInteger(YDHT, (MemoryLeakHelper__key ), ( value))) // INLINED!!
            
            if int == 0 then
                set int=s__MemoryLeakHelper__Index__allocate()
                call SaveInteger(YDHT, (MemoryLeakHelper__key ), ( value ), ( int)) // INLINED!!
                
                set MemoryLeakHelper__HashNumber=MemoryLeakHelper__HashNumber + 1
                set MemoryLeakHelper__HashPlace[int]=MemoryLeakHelper__HashNumber
                set MemoryLeakHelper__HashData[MemoryLeakHelper__HashNumber]=value
                set MemoryLeakHelper__HashHash[MemoryLeakHelper__HashNumber]=int
                set MemoryLeakHelper__CreationTime[MemoryLeakHelper__HashNumber]=(MemoryLeakHelper__GameTime + TimerGetElapsed(MemoryLeakHelper__GameTimeTimer)) // INLINED!!
                
                if MemoryLeakHelper__HashNumber >= MemoryLeakHelper__CLEAR_HASH_COUNT then
                    call s__MemoryLeakHelper__Index_DestroyHashes()
                endif
            endif
            
            set MemoryLeakHelper__LastHashedValue=value
            set MemoryLeakHelper__LastIndex=int
            
            return int
        endfunction
        function s__MemoryLeakHelper__GTable_reset takes integer this returns nothing
			call FlushChildHashtable(YDHT, (0)) // INLINED!!
            call FlushChildHashtable(YDHT, ((this))) // INLINED!!
        endfunction
        function s__MemoryLeakHelper__GTable_onDestroy takes integer this returns nothing
            call s__MemoryLeakHelper__GTable_reset(this)
        endfunction
	
function s__MemoryLeakHelper__HandleTable__getindex takes integer this,handle l__MemoryLeakHelper__key returns integer
            return (LoadInteger(YDHT, ((this) ), ( (GetHandleId((l__MemoryLeakHelper__key)))))) // INLINED!!
        endfunction
function s__MemoryLeakHelper__HandleTable__setindex takes integer this,handle l__MemoryLeakHelper__key,integer value returns nothing
            call SaveInteger(YDHT, ((this) ), ( (GetHandleId((l__MemoryLeakHelper__key))) ), ( value)) // INLINED!!
        endfunction
function s__MemoryLeakHelper__HandleTable_flush takes integer this,handle l__MemoryLeakHelper__key returns nothing
            call RemoveSavedInteger(YDHT, ((this) ), ( (GetHandleId((l__MemoryLeakHelper__key))))) // INLINED!!
        endfunction
function s__MemoryLeakHelper__HandleTable_exists takes integer this,handle l__MemoryLeakHelper__key returns boolean
            return (HaveSavedInteger(YDHT, ((this) ), ( (GetHandleId((l__MemoryLeakHelper__key)))))) // INLINED!!
        endfunction
        function s__MemoryLeakHelper__HandleTable_flush2D takes string firstkey returns nothing
            call s__MemoryLeakHelper__GTable_reset((- (StringHash((firstkey))))) // INLINED!!
        endfunction
        function s__MemoryLeakHelper__HandleTable__staticgetindex takes string firstkey returns integer
            return (- (StringHash((firstkey)))) // INLINED!!
        endfunction
//===========================================================================
// Trigger: MemoryLeakHelper
//
//     //hook GetLocationX CatchLocation
//     //hook GetLocationY CatchLocation  
//      //hook ForGroup FG
// 129k
// 3,02 + 43,32 + 697,86
// 744
//===========================================================================
    
    
    
    function YDWEMemoryLeakHelperGetLastCaughtHandle takes nothing returns handle
        return MemoryLeakHelper__LastCaught
    endfunction
    
    function YDWEMemoryLeakHelperProtectHandle takes handle h returns nothing
        call SaveInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId(((h)))) ), ( ( 1))) // INLINED!!
    endfunction
    
    function YDWEMemoryLeakHelperProtectVariable takes handle h returns nothing
        call SaveInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId(((h)))) ), ( ( 1))) // INLINED!!
    endfunction
    function MemoryLeakHelper__EnableMMH takes nothing returns nothing
        set MemoryLeakHelper__Disabled=false
    endfunction
    function YDWEMemoryLeakHelperDelayMMH takes nothing returns nothing
        set MemoryLeakHelper__Disabled=true
        call TimerStart(MemoryLeakHelper__DelayTimer, 0.00, false, function MemoryLeakHelper__EnableMMH)
    endfunction
    
    function YDWEMemoryLeakHelperDisplayLeaks takes nothing returns nothing
        local location loc=null
        if MemoryLeakHelper__IsDisplayMemoryLeakHelper == false then
            call h__CreateNUnitsAtLoc(1, 'hfoo', Player(15), GetRectCenter(GetPlayableMapRect()), bj_UNIT_FACING)
            call RemoveUnit(bj_lastCreatedUnit)
            set loc=GetRectCenter(GetPlayableMapRect())
            call h__CreateNUnitsAtLoc(1, 'hfoo', Player(15), loc, bj_UNIT_FACING)
            call RemoveUnit(bj_lastCreatedUnit)
            call h__RemoveLocation(loc)
            set loc=null
            set MemoryLeakHelper__IsDisplayMemoryLeakHelper=true
        endif
        call ClearTextMessages()
        call BJDebugMsg("======= 自动排泄系统 =======")
        call BJDebugMsg("排除的泄漏" + I2S(MemoryLeakHelper__DestroyedLeaks))
        call BJDebugMsg("用户手动排除的泄漏" + I2S(MemoryLeakHelper__DestroyedLeaksUser))
        call BJDebugMsg("系统排泄比例: " + R2S(I2R(MemoryLeakHelper__DestroyedLeaks) / I2R(MemoryLeakHelper__DestroyedLeaks + MemoryLeakHelper__DestroyedLeaksUser) * 100.) + "%")
        call BJDebugMsg("作者排泄比例" + R2S(I2R(MemoryLeakHelper__DestroyedLeaksUser) / I2R(MemoryLeakHelper__DestroyedLeaks + MemoryLeakHelper__DestroyedLeaksUser) * 100.) + "%")
        call BJDebugMsg("下次排除的泄漏" + I2S(MemoryLeakHelper__MIN_LEAK_NUMBER - MemoryLeakHelper__CaughtLeaks))
        call BJDebugMsg(" === 待排除的泄漏 === ")
        call BJDebugMsg("   单位组泄漏" + I2S(MemoryLeakHelper__GroupDestroyCount))
        call BJDebugMsg("   点泄漏" + I2S(MemoryLeakHelper__LocationDestroyCount))
        call BJDebugMsg("   特效泄漏: " + I2S(MemoryLeakHelper__EffectDestroyCount))
        call BJDebugMsg(" === 还未排除的泄漏=== ")
        call BJDebugMsg("   单位组泄漏" + I2S(MemoryLeakHelper__CaughtGroupLeaks))
        call BJDebugMsg("   点泄漏" + I2S(MemoryLeakHelper__CaughtLocationLeaks))
        call BJDebugMsg("   特效泄漏: " + I2S(MemoryLeakHelper__CaughtEffectLeaks))
        call BJDebugMsg("下次排泄时间: " + I2S(R2I(TimerGetRemaining(MemoryLeakHelper__PassTimer) + 0.5)) + " seconds.")
        call BJDebugMsg("======= 自动排泄系统 =======")
        call BJDebugMsg("排除泄漏" + I2S(MemoryLeakHelper__DestroyedLeaks))
        //if DISPLAY_SAVED_MEMORY then
            call BJDebugMsg("自动排泄系统释放的总内存为 " + R2S(MemoryLeakHelper__SavedMemory) + " kb.")
        //endif
        call BJDebugMsg("================================")
//JASSHelper null local processed:     endfunction
set loc = null
endfunction
    
    function MemoryLeakHelper__GroupGetMemoryUsageEnum takes nothing returns nothing
        set MemoryLeakHelper__LastCheckedGroupMemoryUsage=MemoryLeakHelper__LastCheckedGroupMemoryUsage + MemoryLeakHelper__GROUP_UNIT_MEMORY_USAGE
    endfunction
    
    function MemoryLeakHelper__GroupGetMemoryUsage takes group g returns real
        set MemoryLeakHelper__LastCheckedGroupMemoryUsage=0.
        call ForGroup(g, function MemoryLeakHelper__GroupGetMemoryUsageEnum)
        return MemoryLeakHelper__LastCheckedGroupMemoryUsage + MemoryLeakHelper__GROUP_MEMORY_USAGE
    endfunction
    	
 function MemoryLeakHelper__CatchLocation takes location l returns nothing
        set MemoryLeakHelper__LastCaught=l
        
        if MemoryLeakHelper__Disabled then
            return
        elseif MemoryLeakHelper__CaughtLocationLeaks == MemoryLeakHelper__MAX_LEAK_INSTANCES then
            return
        endif
        
        if (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) == false then // INLINED!!
            //call BJDebugMsg("Caught Location")
            set MemoryLeakHelper__CaughtLocationLeaks=MemoryLeakHelper__CaughtLocationLeaks + 1
            call sg__MemoryLeakHelper__LocationLeakData_set(MemoryLeakHelper__CaughtLocationLeaks,l)
            call SaveInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))) ), ( ( MemoryLeakHelper__CaughtLocationLeaks))) // INLINED!!
        endif
    endfunction
    
    function MemoryLeakHelper__AddToLocationDestroyQueue takes location l returns nothing
        set MemoryLeakHelper__LocationDestroyCount=MemoryLeakHelper__LocationDestroyCount + 1
        call sg__MemoryLeakHelper__LocationDestroyData_set(MemoryLeakHelper__LocationDestroyCount,l)
        call SaveInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))) ), ( ( MemoryLeakHelper__LocationDestroyCount * - 1))) // Put his to negative, so we know that this is used in the DestroyQueue now. // INLINED!!
endfunction
    
    function MemoryLeakHelper__ReleaseLocation takes location l returns nothing
        local integer index
        if MemoryLeakHelper__IsDestroying == false and (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) then // INLINED!!
            set index=(LoadInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) // INLINED!!
            // If this is true, the index wasn't put to a destroy queue yet.
            if index > 0 then
                call sg__MemoryLeakHelper__LocationLeakData_set(index,sg__MemoryLeakHelper__LocationLeakData_get(MemoryLeakHelper__CaughtLocationLeaks))
                set MemoryLeakHelper__CaughtLocationLeaks=MemoryLeakHelper__CaughtLocationLeaks - 1
            else
                set index=index * - 1
                call sg__MemoryLeakHelper__LocationDestroyData_set(index,sg__MemoryLeakHelper__LocationDestroyData_get(MemoryLeakHelper__LocationDestroyCount))
                set MemoryLeakHelper__LocationDestroyCount=MemoryLeakHelper__LocationDestroyCount - 1
            endif
            call RemoveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))))) // INLINED!!
            set MemoryLeakHelper__DestroyedLeaksUser=MemoryLeakHelper__DestroyedLeaksUser + 1
        endif
    endfunction
	
 function MemoryLeakHelper__CatchGroup takes group l returns nothing
        set MemoryLeakHelper__LastCaught=l
        
        if MemoryLeakHelper__Disabled then
            return
        elseif MemoryLeakHelper__CaughtGroupLeaks == MemoryLeakHelper__MAX_LEAK_INSTANCES then
            return
        endif
        
        if (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) == false then // INLINED!!
            //call BJDebugMsg("Caught Group")
            set MemoryLeakHelper__CaughtGroupLeaks=MemoryLeakHelper__CaughtGroupLeaks + 1
            call sg__MemoryLeakHelper__GroupLeakData_set(MemoryLeakHelper__CaughtGroupLeaks,l)
            call SaveInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))) ), ( ( MemoryLeakHelper__CaughtGroupLeaks))) // INLINED!!
        endif
    endfunction
    
    function MemoryLeakHelper__AddToGroupDestroyQueue takes group l returns nothing
        set MemoryLeakHelper__GroupDestroyCount=MemoryLeakHelper__GroupDestroyCount + 1
        call sg__MemoryLeakHelper__GroupDestroyData_set(MemoryLeakHelper__GroupDestroyCount,l)
        call SaveInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))) ), ( ( MemoryLeakHelper__GroupDestroyCount * - 1))) // Put his to negative, so we know that this is used in the DestroyQueue now. // INLINED!!
endfunction
    
    function MemoryLeakHelper__ReleaseGroup takes group l returns nothing
        local integer index
        if MemoryLeakHelper__IsDestroying == false and (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) then // INLINED!!
            set index=(LoadInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) // INLINED!!
            // If this is true, the index wasn't put to a destroy queue yet.
            if index > 0 then
                call sg__MemoryLeakHelper__GroupLeakData_set(index,sg__MemoryLeakHelper__GroupLeakData_get(MemoryLeakHelper__CaughtGroupLeaks))
                set MemoryLeakHelper__CaughtGroupLeaks=MemoryLeakHelper__CaughtGroupLeaks - 1
            else
                set index=index * - 1
                call sg__MemoryLeakHelper__GroupDestroyData_set(index,sg__MemoryLeakHelper__GroupDestroyData_get(MemoryLeakHelper__GroupDestroyCount))
                set MemoryLeakHelper__GroupDestroyCount=MemoryLeakHelper__GroupDestroyCount - 1
            endif
            call RemoveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))))) // INLINED!!
            set MemoryLeakHelper__DestroyedLeaksUser=MemoryLeakHelper__DestroyedLeaksUser + 1
        endif
    endfunction
	
 function MemoryLeakHelper__CatchEffect takes effect l returns nothing
        set MemoryLeakHelper__LastCaught=l
        
        if MemoryLeakHelper__Disabled then
            return
        elseif MemoryLeakHelper__CaughtEffectLeaks == MemoryLeakHelper__MAX_LEAK_INSTANCES then
            return
        endif
        
        if (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) == false then // INLINED!!
            //call BJDebugMsg("Caught Effect")
            set MemoryLeakHelper__CaughtEffectLeaks=MemoryLeakHelper__CaughtEffectLeaks + 1
            call sg__MemoryLeakHelper__EffectLeakData_set(MemoryLeakHelper__CaughtEffectLeaks,l)
            call SaveInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))) ), ( ( MemoryLeakHelper__CaughtEffectLeaks))) // INLINED!!
        endif
    endfunction
    
    function MemoryLeakHelper__AddToEffectDestroyQueue takes effect l returns nothing
        set MemoryLeakHelper__EffectDestroyCount=MemoryLeakHelper__EffectDestroyCount + 1
        call sg__MemoryLeakHelper__EffectDestroyData_set(MemoryLeakHelper__EffectDestroyCount,l)
        call SaveInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))) ), ( ( MemoryLeakHelper__EffectDestroyCount * - 1))) // Put his to negative, so we know that this is used in the DestroyQueue now. // INLINED!!
endfunction
    
    function MemoryLeakHelper__ReleaseEffect takes effect l returns nothing
        local integer index
        if MemoryLeakHelper__IsDestroying == false and (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) then // INLINED!!
            set index=(LoadInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l))))))) // INLINED!!
            // If this is true, the index wasn't put to a destroy queue yet.
            if index > 0 then
                call sg__MemoryLeakHelper__EffectLeakData_set(index,sg__MemoryLeakHelper__EffectLeakData_get(MemoryLeakHelper__CaughtEffectLeaks))
                set MemoryLeakHelper__CaughtEffectLeaks=MemoryLeakHelper__CaughtEffectLeaks - 1
            else
                set index=index * - 1
                call sg__MemoryLeakHelper__EffectDestroyData_set(index,sg__MemoryLeakHelper__EffectDestroyData_get(MemoryLeakHelper__EffectDestroyCount))
                set MemoryLeakHelper__EffectDestroyCount=MemoryLeakHelper__EffectDestroyCount - 1
            endif
            call RemoveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((l)))))) // INLINED!!
            set MemoryLeakHelper__DestroyedLeaksUser=MemoryLeakHelper__DestroyedLeaksUser + 1
        endif
    endfunction
	
    function MemoryLeakHelper__DestroyMemoryLeaks takes nothing returns nothing
        set MemoryLeakHelper__IsDestroying=true
        
		set MemoryLeakHelper__DestroyedLeaks=MemoryLeakHelper__DestroyedLeaks + MemoryLeakHelper__GroupDestroyCount
        loop
            exitwhen MemoryLeakHelper__GroupDestroyCount == 0
            
            if MemoryLeakHelper__DISPLAY_SAVED_MEMORY then
                set MemoryLeakHelper__SavedMemory=MemoryLeakHelper__SavedMemory + MemoryLeakHelper__GroupGetMemoryUsage(sg__MemoryLeakHelper__GroupDestroyData_get(MemoryLeakHelper__GroupDestroyCount))
            endif
            
            call h__DestroyGroup(sg__MemoryLeakHelper__GroupDestroyData_get(MemoryLeakHelper__GroupDestroyCount))
            call RemoveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((sg__MemoryLeakHelper__GroupDestroyData_get(MemoryLeakHelper__GroupDestroyCount))))))) // INLINED!!
            set MemoryLeakHelper__GroupDestroyCount=MemoryLeakHelper__GroupDestroyCount - 1
        endloop
		
		set MemoryLeakHelper__DestroyedLeaks=MemoryLeakHelper__DestroyedLeaks + MemoryLeakHelper__LocationDestroyCount
        loop
            exitwhen MemoryLeakHelper__LocationDestroyCount == 0
            
            if MemoryLeakHelper__DISPLAY_SAVED_MEMORY then
                set MemoryLeakHelper__SavedMemory=MemoryLeakHelper__SavedMemory + MemoryLeakHelper__LOCATION_MEMORY_USAGE
            endif
            
            call h__RemoveLocation(sg__MemoryLeakHelper__LocationDestroyData_get(MemoryLeakHelper__LocationDestroyCount))
            call RemoveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((sg__MemoryLeakHelper__LocationDestroyData_get(MemoryLeakHelper__LocationDestroyCount))))))) // INLINED!!
            set MemoryLeakHelper__LocationDestroyCount=MemoryLeakHelper__LocationDestroyCount - 1
        endloop
		
		set MemoryLeakHelper__DestroyedLeaks=MemoryLeakHelper__DestroyedLeaks + MemoryLeakHelper__EffectDestroyCount
        loop
            exitwhen MemoryLeakHelper__EffectDestroyCount == 0
            
            if MemoryLeakHelper__DISPLAY_SAVED_MEMORY then
                set MemoryLeakHelper__SavedMemory=MemoryLeakHelper__SavedMemory + MemoryLeakHelper__EFFECT_MEMORY_USAGE
            endif
            
            call h__DestroyEffect(sg__MemoryLeakHelper__EffectDestroyData_get(MemoryLeakHelper__EffectDestroyCount))
            call RemoveSavedInteger(YDHT, (((MemoryLeakHelper__IndexData)) ), ( (GetHandleId(((sg__MemoryLeakHelper__EffectDestroyData_get(MemoryLeakHelper__EffectDestroyCount))))))) // INLINED!!
            set MemoryLeakHelper__EffectDestroyCount=MemoryLeakHelper__EffectDestroyCount - 1
        endloop
		
        set MemoryLeakHelper__IsDestroying=false
        set MemoryLeakHelper__DestroyThreadRunning=false
        //call StartPassTimer.execute() // Strange. This causes bugs sometimes and the function isn't called
        // This is slower, but safe.
        call ExecuteFunc("YDWEMemoryLeakStartPassTimer")
    endfunction
    
    function MemoryLeakHelper__StartDestroyThread takes nothing returns nothing
        if MemoryLeakHelper__DestroyThreadRunning == false then
            set MemoryLeakHelper__DestroyThreadRunning=true
            call TimerStart(MemoryLeakHelper__CleanTimer, MemoryLeakHelper__CLEAN_UP_INTERVAL, false, function MemoryLeakHelper__DestroyMemoryLeaks)
            call PauseTimer(MemoryLeakHelper__PassTimer)
        endif
    endfunction
    
   // hook DoNothing StartDestroyThread
    
    // We want that the user doesn't have to protect too many variables, but all the variables that are filled longer
    // than CLEAN_UP_INTERVAL seconds. But what, when the handle thing is put into the destroy stack and the next destroy is
    // in 5 seconds, because the last one was 15 seconds ago? We can simply avoid something like that by using a 2-step-system
    // that goes sure, the handle is only destroyed when it passed the CLEAN_UP_INTERVAL twice.
    // Having two kinds of variables is simply easier and more efficient than having another variable that refers to
    // how many times the handle passed the timer; If it isn't passed/cleared in the Interval then, we can't loop
    // that easily through the data and we'd have to fix gaps later; That would suck a lot of performacne.
    function MemoryLeakHelper__PassMemoryLeaks takes nothing returns nothing
		set MemoryLeakHelper__CaughtLeaks=MemoryLeakHelper__CaughtLeaks + MemoryLeakHelper__CaughtGroupLeaks
        loop
            exitwhen MemoryLeakHelper__CaughtGroupLeaks < 1
            if (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId(((sg__MemoryLeakHelper__GroupLeakData_get(MemoryLeakHelper__CaughtGroupLeaks)))))))) == false and sg__MemoryLeakHelper__GroupLeakData_get(MemoryLeakHelper__CaughtGroupLeaks) != null then // INLINED!!
                call MemoryLeakHelper__AddToGroupDestroyQueue(sg__MemoryLeakHelper__GroupLeakData_get(MemoryLeakHelper__CaughtGroupLeaks))
            endif
            call sg__MemoryLeakHelper__GroupLeakData_set(MemoryLeakHelper__CaughtGroupLeaks,null)
            set MemoryLeakHelper__CaughtGroupLeaks=MemoryLeakHelper__CaughtGroupLeaks - 1
        endloop
		
		set MemoryLeakHelper__CaughtLeaks=MemoryLeakHelper__CaughtLeaks + MemoryLeakHelper__CaughtLocationLeaks
        loop
            exitwhen MemoryLeakHelper__CaughtLocationLeaks < 1
            if (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId(((sg__MemoryLeakHelper__LocationLeakData_get(MemoryLeakHelper__CaughtLocationLeaks)))))))) == false and sg__MemoryLeakHelper__LocationLeakData_get(MemoryLeakHelper__CaughtLocationLeaks) != null then // INLINED!!
                call MemoryLeakHelper__AddToLocationDestroyQueue(sg__MemoryLeakHelper__LocationLeakData_get(MemoryLeakHelper__CaughtLocationLeaks))
            endif
            call sg__MemoryLeakHelper__LocationLeakData_set(MemoryLeakHelper__CaughtLocationLeaks,null)
            set MemoryLeakHelper__CaughtLocationLeaks=MemoryLeakHelper__CaughtLocationLeaks - 1
        endloop
		
		set MemoryLeakHelper__CaughtLeaks=MemoryLeakHelper__CaughtLeaks + MemoryLeakHelper__CaughtEffectLeaks
        loop
            exitwhen MemoryLeakHelper__CaughtEffectLeaks < 1
            if (HaveSavedInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId(((sg__MemoryLeakHelper__EffectLeakData_get(MemoryLeakHelper__CaughtEffectLeaks)))))))) == false and sg__MemoryLeakHelper__EffectLeakData_get(MemoryLeakHelper__CaughtEffectLeaks) != null then // INLINED!!
                call MemoryLeakHelper__AddToEffectDestroyQueue(sg__MemoryLeakHelper__EffectLeakData_get(MemoryLeakHelper__CaughtEffectLeaks))
            endif
            call sg__MemoryLeakHelper__EffectLeakData_set(MemoryLeakHelper__CaughtEffectLeaks,null)
            set MemoryLeakHelper__CaughtEffectLeaks=MemoryLeakHelper__CaughtEffectLeaks - 1
        endloop
		
        if MemoryLeakHelper__CaughtLeaks > MemoryLeakHelper__MIN_LEAK_NUMBER then
            set MemoryLeakHelper__CaughtLeaks=0
            //call BJDebugMsg("Caught Leaks: "+I2S(MIN_LEAK_NUMBER))
            //call BJDebugMsg("Now start Destroy Timer")
            set MemoryLeakHelper__DestroyThreadRunning=true
            call TimerStart(MemoryLeakHelper__CleanTimer, MemoryLeakHelper__CLEAN_UP_INTERVAL, false, function MemoryLeakHelper__DestroyMemoryLeaks)
            // We have to pause this timer a bit; Otherwise it would break the CLEAN_UP_INTERVAL rule.
            call PauseTimer(MemoryLeakHelper__PassTimer)
        endif
        
    endfunction
    
    // =================================
    // ============= Usage =============
    // =================================
    
    function MemoryLeakHelper__PP takes location source,real dist,real angle returns nothing
        call MemoryLeakHelper__CatchLocation(source)
    endfunction
    
    function MemoryLeakHelper__CU takes integer count,integer unitId,player p,location l,real face returns nothing
        call MemoryLeakHelper__CatchLocation(l)
    endfunction
    
    function MemoryLeakHelper__IPO takes unit k,string order,location l returns nothing
        call MemoryLeakHelper__CatchLocation(l)
    endfunction
    
    function MemoryLeakHelper__SUP takes unit who,location l returns nothing
        call MemoryLeakHelper__CatchLocation(l)
    endfunction
    
    function MemoryLeakHelper__SUF takes unit who,location l,real dur returns nothing
        call MemoryLeakHelper__CatchLocation(l)
    endfunction
    
    function MemoryLeakHelper__GUR takes real radius,location l,boolexpr filter returns nothing
        call MemoryLeakHelper__CatchLocation(l)
    endfunction
    
    function MemoryLeakHelper__CUF takes integer count,integer unitId,player whichPlayer,location loc,location lookAt returns nothing
        call MemoryLeakHelper__CatchLocation(loc)
        call MemoryLeakHelper__CatchLocation(lookAt)
    endfunction
    
//processed hook:     hook PolarProjectionBJ MemoryLeakHelper__PP
//processed hook:     hook CreateNUnitsAtLoc MemoryLeakHelper__CU
//processed hook:     hook CreateNUnitsAtLocFacingLocBJ MemoryLeakHelper__CUF
//processed hook:     hook IssuePointOrderLocBJ MemoryLeakHelper__IPO
//processed hook:     hook SetUnitPositionLoc MemoryLeakHelper__SUP
//processed hook:     hook SetUnitFacingToFaceLocTimed MemoryLeakHelper__SUF
//processed hook:     hook GetUnitsInRangeOfLocMatching MemoryLeakHelper__GUR
//processed hook:     hook RemoveLocation MemoryLeakHelper__ReleaseLocation
    function MemoryLeakHelper__FG takes group g,code callback returns nothing
        call MemoryLeakHelper__CatchGroup(g)
    endfunction
    
//processed hook:     hook ForGroupBJ MemoryLeakHelper__FG // :D This should catch all GUI usages for groups.
//processed hook: hook GroupPickRandomUnit MemoryLeakHelper__CatchGroup
//processed hook:     hook CountUnitsInGroup MemoryLeakHelper__CatchGroup
    
//processed hook:     hook DestroyGroup MemoryLeakHelper__ReleaseGroup
    
    function MemoryLeakHelper__ASETU takes string bla,widget d,string blu returns nothing
        // We can not catch THIS effect, but the effect that was created before.
        // So we can destroy all SpecialEffects excpet one.
        call MemoryLeakHelper__CatchEffect(GetLastCreatedEffectBJ())
    endfunction
    
    function MemoryLeakHelper__ASE takes location where,string modelName returns nothing
        call MemoryLeakHelper__CatchLocation(where)
        call MemoryLeakHelper__CatchEffect(GetLastCreatedEffectBJ())
    endfunction
//processed hook:     hook AddSpecialEffectLocBJ MemoryLeakHelper__ASE
//processed hook:     hook AddSpecialEffectTargetUnitBJ MemoryLeakHelper__ASETU
//processed hook:     hook DestroyEffect MemoryLeakHelper__ReleaseEffect
//processed hook:     hook DestroyEffectBJ MemoryLeakHelper__ReleaseEffect
    
    // When I want to make the timer run the PassMemoryLeaks things, I have to use an .execute command which requires an extra func.
    function YDWEMemoryLeakStartPassTimer takes nothing returns nothing
        //call BJDebugMsg("Restarting PassTimer")
        call TimerStart(MemoryLeakHelper__PassTimer, MemoryLeakHelper__PASS_INTERVAL, true, function MemoryLeakHelper__PassMemoryLeaks)
    endfunction
    
	// 开启接口函数
    function YDWEMemoryLeakHelperMapIsOpenMemoryLeakHelper takes boolean IsOpenMemoryLeak returns nothing
        set MemoryLeakHelper__IsOpenMemoryLeakHelper=IsOpenMemoryLeak
        call PauseTimer(MemoryLeakHelper__PassTimer)
        if ( IsOpenMemoryLeak ) then
            call TimerStart(MemoryLeakHelper__PassTimer, MemoryLeakHelper__PASS_INTERVAL, true, function MemoryLeakHelper__PassMemoryLeaks) // INLINED!!
        endif
    endfunction
    
    function YDWEMemoryLeakHelperProtectLastCaughtHandle takes nothing returns nothing
        call SaveInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId(((((MemoryLeakHelper__LastCaught)))))) ), ( ( 1))) // INLINED!!
    endfunction
    
    function YDWEMemoryLeakHelperProtectLocation takes location loc returns nothing
        call SaveInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId((((loc))))) ), ( ( 1))) // INLINED!!
    endfunction
    function YDWEMemoryLeakHelperProtectGroup takes group g returns nothing
        call SaveInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId((((g))))) ), ( ( 1))) // INLINED!!
    endfunction
    
    function YDWEMemoryLeakHelperProtectEffect takes effect e returns nothing
        call SaveInteger(YDHT, (((MemoryLeakHelper__IsSaved)) ), ( (GetHandleId((((e))))) ), ( ( 1))) // INLINED!!
    endfunction
        
    function MemoryLeakHelper__Init takes nothing returns nothing
        set MemoryLeakHelper__IndexData=s__MemoryLeakHelper__HandleTable__allocate()
        set MemoryLeakHelper__IsSaved=s__MemoryLeakHelper__HandleTable__allocate()
        
        //call YDWEMemoryLeakStartPassTimer()
        call TimerStart(MemoryLeakHelper__GameTimeTimer, MemoryLeakHelper__GAMETIME_TIMER_INTERVAL, true, function MemoryLeakHelper__UpdateGameTime)
    endfunction
    

//library MemoryLeakHelper ends
//library YDWEGetUnitsOfPlayerAllNull:
function YDWEGetUnitsOfPlayerAllNull takes player whichPlayer returns group
    return YDWEGetUnitsOfPlayerMatchingNull(whichPlayer , null)
endfunction

//library YDWEGetUnitsOfPlayerAllNull ends
//===========================================================================
// 
// 只是另外一张魔兽争霸的地图
// 
//   Warcraft III map script
//   Generated by the Warcraft III World Editor
//   Date: Mon Jan 26 09:17:29 2026
//   Map Author: 未知
// 
//===========================================================================
//***************************************************************************
//*
//*  Global Variables
//*
//***************************************************************************
function InitGlobals takes nothing returns nothing
endfunction
//***************************************************************************
//*
//*  Triggers
//*
//***************************************************************************
//===========================================================================
// Trigger: 解锁单位寻路上限
//===========================================================================
function Trig_________________________uActions takes nothing returns nothing
    local integer ydul_i
    local integer ydl_localvar_step= LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76)
 set ydl_localvar_step=ydl_localvar_step + 3
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76, ydl_localvar_step)
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7, ydl_localvar_step)
    call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0xC7389490, DzCreateFrameByTagName("FRAME", "name", DzGetGameUI(), "template", 0))
    call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x25DAB820, DzFrameGetAlpha(((( ((LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0xC7389490))) - 172 ))))) // INLINED!!
    call DzDestroyFrame(LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0xC7389490))
    call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x25DAB820, ( LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x25DAB820) + 2537628 ))
    set ydul_i=0
    loop
        exitwhen ydul_i > 63
        call DzSetMemory(LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x25DAB820), 2.00)
        call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x25DAB820, ( LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x25DAB820) + 28 ))
        set ydul_i=ydul_i + 1
    endloop
    call FlushChildHashtable(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step)
endfunction
//===========================================================================
function InitTrig_________________________u takes nothing returns nothing
    set gg_trg_________________________u=CreateTrigger()
    call TriggerAddAction(gg_trg_________________________u, function Trig_________________________uActions)
endfunction
//===========================================================================
// Trigger: t01
//===========================================================================
function Trig_t01Func003CT takes nothing returns nothing
    if ( ( LoadBoolean(YDHT, GetHandleId(GetLocalPlayer()), 0x9A9DE167) == true ) ) then
        call SetCameraField(CAMERA_FIELD_ANGLE_OF_ATTACK, LoadReal(YDHT, GetHandleId(GetLocalPlayer()), 0x7CF6DDD1), 0.00)
        call SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, LoadReal(YDHT, GetHandleId(GetLocalPlayer()), 0x237DBC80), LoadReal(YDHT, GetHandleId(GetLocalPlayer()), 0x91C54AF7))
        call SaveBoolean(YDHT, GetHandleId(GetLocalPlayer()), 0x9A9DE167, false)
    else
    endif
endfunction
function Trig_t01Func008WT takes nothing returns nothing
    if ( ( DzIsMouseOverUI() == false ) ) then
        return
    else
    endif
    call SaveInteger(YDLOC, 0x91F8EFEE, 0x6726FFBF, DzGetWheelDelta())
    call SaveBoolean(YDHT, GetHandleId(GetLocalPlayer()), 0x9A9DE167, true)
    if ( ( LoadInteger(YDLOC, 0x91F8EFEE, 0x6726FFBF) > 0 ) ) then
        if ( ( LoadInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32) > 4 ) ) then
            call SaveInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32, ( LoadInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32) - 1 ))
        else
        endif
    else
        if ( ( LoadInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32) < 20 ) ) then
            call SaveInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32, ( LoadInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32) + 1 ))
        else
        endif
    endif
    call SaveReal(YDHT, GetHandleId(GetLocalPlayer()), 0x237DBC80, ( I2R(LoadInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32)) * 200.00 ))
endfunction
function Trig_t01Actions takes nothing returns nothing
    local integer ydl_localvar_step= LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76)
 set ydl_localvar_step=ydl_localvar_step + 3
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76, ydl_localvar_step)
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7, ydl_localvar_step)
    // 鼠标滚轮控制视距
    if GetLocalPlayer() == GetLocalPlayer() then
    	call DzFrameSetUpdateCallbackByCode(function Trig_t01Func003CT)
    endif
    call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0xB2CB6B32, 8)
    call SaveReal(YDHT, GetHandleId(GetLocalPlayer()), 0x91C54AF7, 0.10)
    call SaveReal(YDHT, GetHandleId(GetLocalPlayer()), 0x7CF6DDD1, 304.00)
    call SaveReal(YDHT, GetHandleId(GetLocalPlayer()), 0x237DBC80, ( I2R(LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0xB2CB6B32)) * 200.00 ))
    call SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, LoadReal(YDHT, GetHandleId(GetLocalPlayer()), 0x237DBC80), LoadReal(YDHT, GetHandleId(GetLocalPlayer()), 0x91C54AF7))
    call SaveInteger(YDLOC, 0x91F8EFEE, 0xB2CB6B32, 8)
    call SaveInteger(YDLOC, 0x91F8EFEE, 0x6726FFBF, LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x6726FFBF))
    if GetLocalPlayer() == GetLocalPlayer() then
    	call DzTriggerRegisterMouseWheelEventByCode(null, false, function Trig_t01Func008WT)
    endif
    call FlushChildHashtable(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step)
endfunction
//===========================================================================
function InitTrig_t01 takes nothing returns nothing
    set gg_trg_t01=CreateTrigger()
    call TriggerAddAction(gg_trg_t01, function Trig_t01Actions)
endfunction
//===========================================================================
// Trigger: 未命名触发器 001
//===========================================================================
function Trig____________________001Func004A takes nothing returns nothing
    call SaveLocationHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7), 0x2FFA023A, GetUnitLoc(GetEnumUnit()))
    call SaveLocationHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7), 0x32A9E4C8, h__PolarProjectionBJ(LoadLocationHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7), 0x2FFA023A), 5000.00, 270.00))
    call IssuePointOrderLoc(GetEnumUnit(), "patrol", LoadLocationHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7), 0x32A9E4C8))
    call h__RemoveLocation(LoadLocationHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7), 0x2FFA023A))
    call h__RemoveLocation(LoadLocationHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7), 0x32A9E4C8))
endfunction
function Trig____________________001Actions takes nothing returns nothing
    local group ydl_group
    local unit ydl_unit
    local integer ydl_localvar_step= LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76)
 set ydl_localvar_step=ydl_localvar_step + 3
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76, ydl_localvar_step)
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7, ydl_localvar_step)
    call DestroyTrigger(GetTriggeringTrigger())
    call BJDebugMsg("TRIGSTR_003")
    call SaveGroupHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x214C62CC, (YDWEGetUnitsOfPlayerMatchingNull((Player(0)) , null))) // INLINED!!
    call h__ForGroupBJ(LoadGroupHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x214C62CC), function Trig____________________001Func004A)
    call h__DestroyGroup(LoadGroupHandle(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step, 0x214C62CC))
    call FlushChildHashtable(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step)
    set ydl_group=null
    set ydl_unit=null
//JASSHelper null local processed: endfunction
set ydl_unit = null
set ydl_group = null
endfunction
//===========================================================================
function InitTrig____________________001 takes nothing returns nothing
    set gg_trg____________________001=CreateTrigger()
    call TriggerRegisterPlayerEventEndCinematic(gg_trg____________________001, Player(0))
    call TriggerAddAction(gg_trg____________________001, function Trig____________________001Actions)
endfunction
//===========================================================================
// Trigger: 未命名触发器 002
//===========================================================================
function Trig____________________002Actions takes nothing returns nothing
    call YDWEMemoryLeakHelperDisplayLeaks()
endfunction
//===========================================================================
function InitTrig____________________002 takes nothing returns nothing
    set gg_trg____________________002=CreateTrigger()
    call TriggerRegisterPlayerChatEvent(gg_trg____________________002, Player(0), "1", true)
    call TriggerAddAction(gg_trg____________________002, function Trig____________________002Actions)
endfunction
//===========================================================================
// Trigger: 未命名触发器 003
//===========================================================================
function Trig____________________003Actions takes nothing returns nothing
    set bj_forLoopAIndex=1
    set bj_forLoopAIndexEnd=700
    loop
        exitwhen bj_forLoopAIndex > bj_forLoopAIndexEnd
        call CreateUnit(Player(0), 'hpea', 0.00, 0.00, bj_UNIT_FACING)
        set bj_forLoopAIndex=bj_forLoopAIndex + 1
    endloop
endfunction
//===========================================================================
function InitTrig____________________003 takes nothing returns nothing
    set gg_trg____________________003=CreateTrigger()
    call TriggerRegisterTimerEventSingle(gg_trg____________________003, 1.00)
    call TriggerAddAction(gg_trg____________________003, function Trig____________________003Actions)
endfunction
//===========================================================================
function InitCustomTriggers takes nothing returns nothing
    call InitTrig_________________________u()
    call InitTrig_t01()
    call InitTrig____________________001()
    call InitTrig____________________002()
    call InitTrig____________________003()
endfunction
//===========================================================================
function RunInitializationTriggers takes nothing returns nothing
    call ConditionalTriggerExecute(gg_trg_________________________u)
    call ConditionalTriggerExecute(gg_trg_t01)
endfunction
//***************************************************************************
//*
//*  Players
//*
//***************************************************************************
function InitCustomPlayerSlots takes nothing returns nothing
    // Player 0
    call SetPlayerStartLocation(Player(0), 0)
    call SetPlayerColor(Player(0), ConvertPlayerColor(0))
    call SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    call SetPlayerRaceSelectable(Player(0), true)
    call SetPlayerController(Player(0), MAP_CONTROL_USER)
endfunction
function InitCustomTeams takes nothing returns nothing
    // Force: TRIGSTR_002
    call SetPlayerTeam(Player(0), 0)
endfunction
//***************************************************************************
//*
//*  Main Initialization
//*
//***************************************************************************
//===========================================================================
function main takes nothing returns nothing
    call SetCameraBounds(- 3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), - 3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), - 3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), - 3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    call SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    call NewSoundEnvironment("Default")
    call SetAmbientDaySound("LordaeronSummerDay")
    call SetAmbientNightSound("LordaeronSummerNight")
    call SetMapMusic("Music", true, 0)
    call InitBlizzard()

call ExecuteFunc("jasshelper__initstructs502156171")
call ExecuteFunc("YDTriggerSaveLoadSystem__Init")
call ExecuteFunc("InitializeYD")
call ExecuteFunc("MemoryLeakHelper__Init")

    call InitGlobals()
    call InitCustomTriggers()
    call RunInitializationTriggers()
endfunction
//***************************************************************************
//*
//*  Map Configuration
//*
//***************************************************************************
function config takes nothing returns nothing
    call SetMapName("只是另外一张魔兽争霸的地图")
    call SetMapDescription("没有说明")
    call SetPlayers(1)
    call SetTeams(1)
    call SetGamePlacement(MAP_PLACEMENT_USE_MAP_SETTINGS)
    call DefineStartLocation(0, - 192.0, 64.0)
    // Player setup
    call InitCustomPlayerSlots()
    call SetPlayerSlotAvailable(Player(0), MAP_CONTROL_USER)
    call InitGenericPlayerSlots()
endfunction
//library ValueIndexing initializer Init requires YDWEBase




//Struct method generated initializers/callers:

//Functions for BigArrays:
function sa__MemoryLeakHelper__GTable_onDestroy takes nothing returns boolean
local integer this=f__arg_this
            call s__MemoryLeakHelper__GTable_reset(this)
   return true
endfunction
function sa___prototype164_MemoryLeakHelper__GetElapsedGameTime takes nothing returns boolean

    set f__result_real= MemoryLeakHelper__GameTime + TimerGetElapsed(MemoryLeakHelper__GameTimeTimer)
    return true
endfunction
function sa___prototype168_MemoryLeakHelper__ReleaseLocation takes nothing returns boolean
    call MemoryLeakHelper__ReleaseLocation(f__arg_location1)
    return true
endfunction
function sa___prototype169_MemoryLeakHelper__CatchGroup takes nothing returns boolean
    call MemoryLeakHelper__CatchGroup(f__arg_group1)
    return true
endfunction
function sa___prototype169_MemoryLeakHelper__ReleaseGroup takes nothing returns boolean
    call MemoryLeakHelper__ReleaseGroup(f__arg_group1)
    return true
endfunction
function sa___prototype170_MemoryLeakHelper__ReleaseEffect takes nothing returns boolean
    call MemoryLeakHelper__ReleaseEffect(f__arg_effect1)
    return true
endfunction
function sa___prototype171_MemoryLeakHelper__PP takes nothing returns boolean
    call MemoryLeakHelper__PP(f__arg_location1,f__arg_real1,f__arg_real2)
    return true
endfunction
function sa___prototype172_MemoryLeakHelper__CU takes nothing returns boolean
    call MemoryLeakHelper__CU(f__arg_integer1,f__arg_integer2,f__arg_player1,f__arg_location1,f__arg_real1)
    return true
endfunction
function sa___prototype173_MemoryLeakHelper__IPO takes nothing returns boolean
    call MemoryLeakHelper__IPO(f__arg_unit1,f__arg_string1,f__arg_location1)
    return true
endfunction
function sa___prototype174_MemoryLeakHelper__SUP takes nothing returns boolean
    call MemoryLeakHelper__SUP(f__arg_unit1,f__arg_location1)
    return true
endfunction
function sa___prototype175_MemoryLeakHelper__SUF takes nothing returns boolean
    call MemoryLeakHelper__SUF(f__arg_unit1,f__arg_location1,f__arg_real1)
    return true
endfunction
function sa___prototype176_MemoryLeakHelper__GUR takes nothing returns boolean
    call MemoryLeakHelper__GUR(f__arg_real1,f__arg_location1,f__arg_boolexpr1)
    return true
endfunction
function sa___prototype177_MemoryLeakHelper__CUF takes nothing returns boolean
    call MemoryLeakHelper__CUF(f__arg_integer1,f__arg_integer2,f__arg_player1,f__arg_location1,f__arg_location2)
    return true
endfunction
function sa___prototype178_MemoryLeakHelper__FG takes nothing returns boolean
    call MemoryLeakHelper__FG(f__arg_group1,f__arg_code1)
    return true
endfunction
function sa___prototype179_MemoryLeakHelper__ASETU takes nothing returns boolean
    call MemoryLeakHelper__ASETU(f__arg_string1,f__arg_widget1,f__arg_string2)
    return true
endfunction
function sa___prototype180_MemoryLeakHelper__ASE takes nothing returns boolean
    call MemoryLeakHelper__ASE(f__arg_location1,f__arg_string1)
    return true
endfunction

function jasshelper__initstructs502156171 takes nothing returns nothing
    set st__MemoryLeakHelper__GTable_onDestroy[2]=CreateTrigger()
    set st__MemoryLeakHelper__GTable_onDestroy[3]=st__MemoryLeakHelper__GTable_onDestroy[2]
    call TriggerAddCondition(st__MemoryLeakHelper__GTable_onDestroy[2],Condition( function sa__MemoryLeakHelper__GTable_onDestroy))
    set st___prototype164[1]=CreateTrigger()
    call TriggerAddAction(st___prototype164[1],function sa___prototype164_MemoryLeakHelper__GetElapsedGameTime)
    call TriggerAddCondition(st___prototype164[1],Condition(function sa___prototype164_MemoryLeakHelper__GetElapsedGameTime))
    set st___prototype168[1]=CreateTrigger()
    call TriggerAddAction(st___prototype168[1],function sa___prototype168_MemoryLeakHelper__ReleaseLocation)
    call TriggerAddCondition(st___prototype168[1],Condition(function sa___prototype168_MemoryLeakHelper__ReleaseLocation))
    set st___prototype169[1]=CreateTrigger()
    call TriggerAddAction(st___prototype169[1],function sa___prototype169_MemoryLeakHelper__CatchGroup)
    call TriggerAddCondition(st___prototype169[1],Condition(function sa___prototype169_MemoryLeakHelper__CatchGroup))
    set st___prototype169[2]=CreateTrigger()
    call TriggerAddAction(st___prototype169[2],function sa___prototype169_MemoryLeakHelper__ReleaseGroup)
    call TriggerAddCondition(st___prototype169[2],Condition(function sa___prototype169_MemoryLeakHelper__ReleaseGroup))
    set st___prototype170[1]=CreateTrigger()
    call TriggerAddAction(st___prototype170[1],function sa___prototype170_MemoryLeakHelper__ReleaseEffect)
    call TriggerAddCondition(st___prototype170[1],Condition(function sa___prototype170_MemoryLeakHelper__ReleaseEffect))
    set st___prototype171[1]=CreateTrigger()
    call TriggerAddAction(st___prototype171[1],function sa___prototype171_MemoryLeakHelper__PP)
    call TriggerAddCondition(st___prototype171[1],Condition(function sa___prototype171_MemoryLeakHelper__PP))
    set st___prototype172[1]=CreateTrigger()
    call TriggerAddAction(st___prototype172[1],function sa___prototype172_MemoryLeakHelper__CU)
    call TriggerAddCondition(st___prototype172[1],Condition(function sa___prototype172_MemoryLeakHelper__CU))
    set st___prototype173[1]=CreateTrigger()
    call TriggerAddAction(st___prototype173[1],function sa___prototype173_MemoryLeakHelper__IPO)
    call TriggerAddCondition(st___prototype173[1],Condition(function sa___prototype173_MemoryLeakHelper__IPO))
    set st___prototype174[1]=CreateTrigger()
    call TriggerAddAction(st___prototype174[1],function sa___prototype174_MemoryLeakHelper__SUP)
    call TriggerAddCondition(st___prototype174[1],Condition(function sa___prototype174_MemoryLeakHelper__SUP))
    set st___prototype175[1]=CreateTrigger()
    call TriggerAddAction(st___prototype175[1],function sa___prototype175_MemoryLeakHelper__SUF)
    call TriggerAddCondition(st___prototype175[1],Condition(function sa___prototype175_MemoryLeakHelper__SUF))
    set st___prototype176[1]=CreateTrigger()
    call TriggerAddAction(st___prototype176[1],function sa___prototype176_MemoryLeakHelper__GUR)
    call TriggerAddCondition(st___prototype176[1],Condition(function sa___prototype176_MemoryLeakHelper__GUR))
    set st___prototype177[1]=CreateTrigger()
    call TriggerAddAction(st___prototype177[1],function sa___prototype177_MemoryLeakHelper__CUF)
    call TriggerAddCondition(st___prototype177[1],Condition(function sa___prototype177_MemoryLeakHelper__CUF))
    set st___prototype178[1]=CreateTrigger()
    call TriggerAddAction(st___prototype178[1],function sa___prototype178_MemoryLeakHelper__FG)
    call TriggerAddCondition(st___prototype178[1],Condition(function sa___prototype178_MemoryLeakHelper__FG))
    set st___prototype179[1]=CreateTrigger()
    call TriggerAddAction(st___prototype179[1],function sa___prototype179_MemoryLeakHelper__ASETU)
    call TriggerAddCondition(st___prototype179[1],Condition(function sa___prototype179_MemoryLeakHelper__ASETU))
    set st___prototype180[1]=CreateTrigger()
    call TriggerAddAction(st___prototype180[1],function sa___prototype180_MemoryLeakHelper__ASE)
    call TriggerAddCondition(st___prototype180[1],Condition(function sa___prototype180_MemoryLeakHelper__ASE))




endfunction


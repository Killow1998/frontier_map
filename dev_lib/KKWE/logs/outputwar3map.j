globals
//globals from BzAPI:
constant boolean LIBRARY_BzAPI=true
//endglobals from BzAPI
//globals from LBKKAPI:
constant boolean LIBRARY_LBKKAPI=true
string MOVE_TYPE_NONE= "none"
string MOVE_TYPE_FOOT= "foot"
string MOVE_TYPE_HORSE= "horse"
string MOVE_TYPE_FLY= "fly"
string MOVE_TYPE_HOVER= "hover"
string MOVE_TYPE_FLOAT= "float"
string MOVE_TYPE_AMPH= "amph"
string MOVE_TYPE_UNBUILD= "unbuild"
constant integer DEFENSE_TYPE_SMALL= 0
constant integer DEFENSE_TYPE_MEDIUM= 1
constant integer DEFENSE_TYPE_LARGE= 2
constant integer DEFENSE_TYPE_FORT= 3
constant integer DEFENSE_TYPE_NORMAL= 4
constant integer DEFENSE_TYPE_HERO= 5
constant integer DEFENSE_TYPE_DIVINE= 6
constant integer DEFENSE_TYPE_NONE= 7
integer array LBKKAPI___MonthDay
hashtable LBKKAPI___Hash=InitHashtable()
//endglobals from LBKKAPI
//globals from YDTriggerSaveLoadSystem:
constant boolean LIBRARY_YDTriggerSaveLoadSystem=true
hashtable YDHT
hashtable YDLOC
//endglobals from YDTriggerSaveLoadSystem
    // User-defined
integer udg_simple_frame= 0
    // Generated
trigger gg_trg____________________001= null
trigger gg_trg____________________002= null

trigger l__library_init

//JASSHelper struct globals:

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
        native DzGetSelectedLeaderUnit takes nothing returns unit 
        native DzIsChatBoxOpen takes nothing returns boolean 
        native DzSetUnitPreselectUIVisible takes unit whichUnit, boolean visible returns nothing 
        native DzSetEffectAnimation takes effect whichEffect, integer index, integer flag returns nothing 
        native DzSetEffectPos takes effect whichEffect, real x, real y, real z returns nothing 
        native DzSetEffectVertexColor takes effect whichEffect, integer color returns nothing 
        native DzSetEffectVertexAlpha takes effect whichEffect, integer alpha returns nothing 
        native DzSetEffectModel takes effect whichEffect, string model returns nothing
        native DzSetEffectTeamColor takes effect whichHandle, integer playerId returns nothing
        native DzFrameSetClip takes integer whichframe, boolean enable returns nothing 
        native DzChangeWindowSize takes integer width, integer height returns boolean 
        native DzPlayEffectAnimation takes effect whichEffect, string anim, string link returns nothing 
        native DzBindEffect takes widget parent, string attachPoint, effect whichEffect returns nothing 
        native DzUnbindEffect takes effect whichEffect returns nothing 
        native DzSetWidgetSpriteScale takes widget whichUnit, real scale returns nothing 
        native DzSetEffectScale takes effect whichHandle, real scale returns nothing 
        native DzGetEffectVertexColor takes effect whichEffect returns integer 
        native DzGetEffectVertexAlpha takes effect whichEffect returns integer 
        native DzGetItemAbility takes item whichEffect, integer index returns ability 
        native DzFrameGetChildrenCount takes integer whichframe returns integer 
        native DzFrameGetChild takes integer whichframe, integer index returns integer 
        native DzUnlockBlpSizeLimit takes boolean enable returns nothing 
        native DzGetActivePatron takes unit store, player p returns unit 
        native DzGetLocalSelectUnitCount takes nothing returns integer 
        native DzGetLocalSelectUnit takes integer index returns unit 
        native DzGetJassStringTableCount takes nothing returns integer 
        native DzModelRemoveFromCache takes string path returns nothing 
        native DzModelRemoveAllFromCache takes nothing returns nothing 
        native DzFrameGetInfoPanelSelectButton takes integer index returns integer 
        native DzFrameGetInfoPanelBuffButton takes integer index returns integer 
        native DzFrameGetPeonBar takes nothing returns integer 
        native DzFrameGetCommandBarButtonNumberText takes integer whichframe returns integer 
        native DzFrameGetCommandBarButtonNumberOverlay takes integer whichframe returns integer 
        native DzFrameGetCommandBarButtonCooldownIndicator takes integer whichframe returns integer 
        native DzFrameGetCommandBarButtonAutoCastIndicator takes integer whichframe returns integer 
        native DzToggleFPS takes boolean show returns nothing 
        native DzGetFPS takes nothing returns integer 
        native DzFrameWorldToMinimapPosX takes real x, real y returns real 
        native DzFrameWorldToMinimapPosY takes real x, real y returns real 
        native DzWidgetSetMinimapIcon takes unit whichunit, string path returns nothing 
        native DzWidgetSetMinimapIconEnable takes unit whichunit, boolean enable returns nothing 
        native DzFrameGetWorldFrameMessage takes nothing returns integer 
        native DzSimpleMessageFrameAddMessage takes integer whichframe, string text, integer color, real duration, boolean permanent returns nothing 
        native DzSimpleMessageFrameClear takes integer whichframe returns nothing 
        native DzConvertScreenPositionX takes real x, real y returns real 
        native DzConvertScreenPositionY takes real x, real y returns real 
        native DzRegisterOnBuildLocal takes code func returns nothing 
        native DzGetOnBuildOrderId takes nothing returns integer 
        native DzGetOnBuildOrderType takes nothing returns integer 
        native DzGetOnBuildAgent takes nothing returns widget 
        native DzRegisterOnTargetLocal takes code func returns nothing 
        native DzGetOnTargetAbilId takes nothing returns integer 
        native DzGetOnTargetOrderId takes nothing returns integer 
        native DzGetOnTargetOrderType takes nothing returns integer 
        native DzGetOnTargetAgent takes nothing returns widget 
        native DzGetOnTargetInstantTarget takes nothing returns widget 
        native DzOpenQQGroupUrl takes string url returns boolean 
        native DzFrameEnableClipRect takes boolean enable returns nothing 
        native DzSetUnitName takes unit whichUnit, string name returns nothing 
        native DzSetUnitPortrait takes unit whichUnit, string modelFile returns nothing 
        native DzSetUnitDescription takes unit whichUnit, string value returns nothing 
        native DzSetUnitMissileArc takes unit whichUnit, real arc returns nothing 
        native DzSetUnitMissileModel takes unit whichUnit, string modelFile returns nothing 
        native DzSetUnitProperName takes unit whichUnit, string name returns nothing 
        native DzSetUnitMissileHoming takes unit whichUnit, boolean enable returns nothing 
        native DzSetUnitMissileSpeed takes unit whichUnit, real speed returns nothing 
        native DzSetEffectVisible takes effect whichHandle, boolean enable returns nothing 
        native DzReviveUnit takes unit whichUnit, player whichPlayer, real hp, real mp, real x, real y returns nothing 
        native DzGetAttackAbility takes unit whichUnit returns ability 
        native DzAttackAbilityEndCooldown takes ability whichHandle returns nothing 
        native EXSetUnitArrayString takes integer uid, integer id, integer n, string name returns boolean 
        native EXSetUnitInteger takes integer uid, integer id, integer n returns boolean 
        native DzDoodadCreate takes integer id, integer var, real x, real y, real z, real rotate, real scale returns integer 
        native DzDoodadGetTypeId takes integer doodad returns integer 
        native DzDoodadSetModel takes integer doodad, string modelFile returns nothing 
        native DzDoodadSetTeamColor takes integer doodad, integer color returns nothing 
        native DzDoodadSetColor takes integer doodad, integer color returns nothing 
        native DzDoodadGetX takes integer doodad returns real 
        native DzDoodadGetY takes integer doodad returns real 
        native DzDoodadGetZ takes integer doodad returns real 
        native DzDoodadSetPosition takes integer doodad, real x, real y, real z returns nothing 
        native DzDoodadSetOrientMatrixRotate takes integer doodad, real angle, real axisX, real axisY, real axisZ returns nothing 
        native DzDoodadSetOrientMatrixScale takes integer doodad, real x, real y, real z returns nothing 
        native DzDoodadSetOrientMatrixResize takes integer doodad returns nothing 
        native DzDoodadSetVisible takes integer doodad, boolean enable returns nothing 
        native DzDoodadSetAnimation takes integer doodad, string animName, boolean animRandom returns nothing 
        native DzDoodadSetTimeScale takes integer doodad, real scale returns nothing 
        native DzDoodadGetTimeScale takes integer doodad returns real 
        native DzDoodadGetCurrentAnimationIndex takes integer doodad returns integer 
        native DzDoodadGetAnimationCount takes integer doodad returns integer 
        native DzDoodadGetAnimationName takes integer doodad, integer index returns string 
        native DzDoodadGetAnimationTime takes integer doodad, integer index returns integer 
        native DzUnlockOpCodeLimit takes boolean enable returns nothing
        native DzSetClipboard takes string content returns boolean
        native DzDoodadRemove takes integer doodad returns nothing
        native DzRemovePlayerTechResearched takes player whichPlayer, integer techid, integer removelevels returns nothing
        native DzUnitFindAbility takes unit whichUnit, integer abilcode returns ability
        native DzAbilitySetStringData takes ability whichAbility, string key, string value returns nothing
        native DzAbilitySetEnable takes ability whichAbility, boolean enable, boolean hideUI returns nothing
        native DzUnitSetMoveType takes unit whichUnit, string moveType returns nothing
        native DzFrameGetWidth takes integer frame returns real
        native DzFrameSetAnimateByIndex takes integer frame, integer index, integer flag returns nothing
        native DzSetUnitDataCacheInteger takes integer uid, integer id,integer index,integer v returns nothing
        native DzUnitUIAddLevelArrayInteger takes integer uid, integer id,integer lv,integer v returns nothing
        native DzItemSetModel takes item whichItem, string file returns nothing
        native DzItemSetVertexColor takes item whichItem, integer color returns nothing
        native DzItemSetAlpha takes item whichItem, integer color returns nothing
        native DzItemSetPortrait takes item whichItem, string modelPath returns nothing
	native DzFrameHookHpBar takes code func returns nothing
	native DzFrameGetTriggerHpBarUnit takes nothing returns unit
	native DzFrameGetTriggerHpBar takes nothing returns integer
	native DzFrameGetUnitHpBar takes unit whichUnit returns integer
        native DzGetCursorFrame takes nothing returns integer
        native DzFrameGetPointValid takes integer frame, integer anchor returns boolean
        native DzFrameGetPointRelative takes integer frame, integer anchor returns integer
        native DzFrameGetPointRelativePoint takes integer frame, integer anchor returns integer
        native DzFrameGetPointX takes integer frame, integer anchor returns real
        native DzFrameGetPointY takes integer frame, integer anchor returns real
        native DzWriteLog takes string msg returns nothing
        native DzTextTagGetFont takes nothing returns string
        native DzTextTagSetFont takes string fileName returns nothing
        native DzTextTagSetStartAlpha takes texttag t, integer alpha returns nothing
        native DzTextTagGetShadowColor takes texttag t returns integer
        native DzTextTagSetShadowColor takes texttag t, integer color returns nothing
        native DzGroupGetCount takes group g returns integer
        native DzGroupGetUnitAt takes group g, integer index returns unit
        native DzUnitCreateIllusion takes player p, integer unitId, real x, real y, real face returns unit
        native DzUnitCreateIllusionFromUnit takes unit u returns unit
        native DzStringContains takes string s, string whichString, boolean caseSensitive returns boolean
        native DzStringFind takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindFirstOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindFirstNotOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindLastOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringFindLastNotOf takes string s, string whichString, integer off, boolean caseSensitive returns integer
        native DzStringTrimLeft takes string s returns string
        native DzStringTrimRight takes string s returns string
        native DzStringTrim takes string s returns string
        native DzStringReverse takes string s returns string
        native DzStringReplace takes string s, string whichString, string replaceWith, boolean caseSensitive returns string
        native DzStringInsert takes string s, integer whichPosition, string whichString returns string
        native DzBitGet takes integer i, integer byteIndex returns integer
        native DzBitSet takes integer i, integer byteIndex, integer byteValue returns integer
        native DzBitGetByte takes integer i, integer byteIndex returns integer
        native DzBitSetByte takes integer i, integer byteIndex, integer byteValue returns integer
        native DzBitNot takes integer i returns integer
        native DzBitAnd takes integer a, integer b returns integer
        native DzBitOr takes integer a, integer b returns integer
        native DzBitXor takes integer a, integer b returns integer
        native DzBitShiftLeft takes integer i, integer bitsToShift returns integer
        native DzBitShiftRight takes integer i, integer bitsToShift returns integer
        native DzBitToInt takes integer b1, integer b2, integer b3, integer b4 returns integer
        native DzQueueGroupImmediateOrderById takes group whichGroup, integer order returns boolean
        native DzQueueGroupPointOrderById takes group whichGroup, integer order, real x, real y returns boolean
        native DzQueueGroupTargetOrderById takes group whichGroup, integer order, widget targetWidget returns boolean
        native DzQueueIssueImmediateOrderById takes unit whichUnit, integer order returns boolean
        native DzQueueIssuePointOrderById takes unit whichUnit, integer order, real x, real y returns boolean
        native DzQueueIssueTargetOrderById takes unit whichUnit, integer order, widget targetWidget returns boolean
        native DzQueueIssueInstantPointOrderById takes unit whichUnit, integer order, real x, real y, widget instantTargetWidget returns boolean
        native DzQueueIssueInstantTargetOrderById takes unit whichUnit, integer order, widget targetWidget, widget instantTargetWidget returns boolean
        native DzQueueIssueBuildOrderById takes unit whichPeon, integer unitId, real x, real y returns boolean
        native DzQueueIssueNeutralImmediateOrderById takes player forWhichPlayer,unit neutralStructure, integer unitId returns boolean
        native DzQueueIssueNeutralPointOrderById takes player forWhichPlayer,unit neutralStructure, integer unitId, real x, real y returns boolean
        native DzQueueIssueNeutralTargetOrderById takes player forWhichPlayer,unit neutralStructure, integer unitId, widget target returns boolean
        native DzUnitOrdersCount takes unit u returns integer
        native DzUnitOrdersClear takes unit u, boolean onlyQueued returns nothing
        native DzUnitOrdersExec takes unit u returns nothing
        native DzUnitOrdersForceStop takes unit u, boolean clearQueue returns nothing
        native DzUnitOrdersReverse takes unit u returns nothing
        native DzXlsxOpen takes string filePath returns integer
        native DzXlsxClose takes integer docHandle returns boolean
        native DzXlsxWorksheetGetRowCount takes integer docHandle, string sheetName returns integer
        native DzXlsxWorksheetGetColumnCount takes integer docHandle, string sheetName returns integer
        native DzXlsxWorksheetGetCellType takes integer docHandle, string sheetName, integer row, integer column returns integer
        native DzXlsxWorksheetGetCellString takes integer docHandle, string sheetName, integer row, integer column returns string
        native DzXlsxWorksheetGetCellInteger takes integer docHandle, string sheetName, integer row, integer column returns integer
        native DzXlsxWorksheetGetCellBoolean takes integer docHandle, string sheetName, integer row, integer column returns boolean
        native DzXlsxWorksheetGetCellFloat takes integer docHandle, string sheetName, integer row, integer column returns real
        native DzFrameSetTexCoord takes integer frame, real left, real top, real right, real bottom returns nothing
        native DzSetUnitAbilityRange takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityRange takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityArea takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityArea takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityCool takes unit Unit, integer abil_code, real cool, real max_cool returns boolean
        native DzGetUnitAbilityCool takes unit Unit, integer abil_code returns real
        native DzGetUnitAbilityMaxCool takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityDataA takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataA takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityDataB takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataB takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityDataC takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataC takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityDataD takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataD takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityDataE takes unit Unit, integer abil_code, real value returns boolean
        native DzGetUnitAbilityDataE takes unit Unit, integer abil_code returns real
        native DzSetUnitAbilityButtonPos takes unit Unit, integer abil_code, integer x, integer y returns boolean
        native DzSetUnitAbilityHotkey takes unit Unit, integer abil_code, string key returns boolean
        native DzConvertTargs2Str takes integer targs returns string 
        native DzConvertStr2Targs takes string targs returns integer 
        native DzSetUnitAbilityTargs takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityTargs takes unit Unit, integer abil_code returns integer
        native DzSetUnitAbilityCost takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityCost takes unit Unit, integer abil_code returns integer
        native DzSetUnitAbilityReqLevel takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityReqLevel takes unit Unit, integer abil_code returns integer
        native DzSetUnitAbilityUnitId takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityUnitId takes unit Unit, integer abil_code returns integer
        native DzSetUnitAbilityBuildOrderId takes unit Unit, integer abil_code, integer value returns boolean
        native DzGetUnitAbilityBuildOrderId takes unit Unit, integer abil_code returns integer
        native DzSetUnitAbilityBuildModel takes unit Unit, integer abil_code, string model_path, real model_scale returns boolean 
        native DzUnitHasAbility takes unit Unit, integer abil_code returns boolean 
        native KKCreateCommandButton takes nothing returns integer 
        native KKDestroyCommandButton takes integer btn returns nothing 
        native KKCommandButtonClick takes integer btn, integer mouse_type returns nothing
        native KKCommandTargetClick takes integer mouse_type, widget target returns boolean 
        native KKCommandTerrainClick takes integer mouse_type, real x, real y, real z returns boolean 
        native KKSetCommandUnitAbility takes integer btn, unit Unit, integer abil_code returns nothing 
        native DzItemGetVertexColor takes item Item returns integer 
        native DzItemSetSize takes item Item, real size returns nothing 
        native DzItemGetSize takes item Item returns real 
        native DzItemMatRotateX takes item Item, real x returns nothing
        native DzItemMatRotateY takes item Item, real y returns nothing
        native DzItemMatRotateZ takes item Item, real z returns nothing
        native DzItemMatScale takes item Item, real x, real y, real z returns nothing
        native DzItemMatReset takes item Item returns nothing 
        native DzGetLastSelectedItem takes nothing returns item 
        native DzSetPariticle2Size takes agent Widget, real scale returns nothing 
        native DzSetUnitCollisionSize takes unit Unit, real size returns nothing 
        native DzGetUnitCollisionSize takes unit Unit returns real 
        native DzSetWidgetTexture takes agent Handle, string TexturePath, integer ReplaceId returns nothing 
        native DzSetUnitSelectScale takes unit Unit, real scale returns nothing 
        native DzSetUnitHitIgnore takes unit Unit, boolean ignore returns nothing 
        native DzEffectBindEffect takes agent Handle, string AttachName, effect eff returns nothing
        native DzFrameSetIgnoreTrackEvents takes integer frame, boolean ignore returns nothing 
        native DzFrameAddModel takes integer parent_frame returns integer 
        native DzFrameSetModel2 takes integer model_frame, string model_file, integer team_color_id returns nothing 
        native DzFrameAddModelEffect takes integer model_frame, string attach_point, string model_file returns integer 
        native DzFrameRemoveModelEffect takes integer model_frame, integer effect_frame returns nothing 
        native DzFrameSetModelAnimationByIndex takes integer model_frame, integer anim_index returns nothing 
        native DzFrameSetModelAnimation takes integer model_frame, string animation returns nothing 
        native DzFrameSetModelCameraSource takes integer model_frame, real x, real y, real z returns nothing 
        native DzFrameSetModelCameraTarget takes integer model_frame, real x, real y, real z returns nothing 
        native DzFrameSetModelSize takes integer model_frame, real size returns nothing 
        native DzFrameGetModelSize takes integer model_frame returns real 
        native DzFrameSetModelPosition takes integer model_frame, real x, real y, real z returns nothing
        native DzFrameSetModelX takes integer model_frame, real x returns nothing 
        native DzFrameGetModelX takes integer model_frame returns real 
        native DzFrameSetModelY takes integer model_frame, real y returns nothing 
        native DzFrameGetModelY takes integer model_frame returns real 
        native DzFrameSetModelZ takes integer model_frame, real z returns nothing 
        native DzFrameGetModelZ takes integer model_frame returns real 
        native DzFrameSetModelSpeed takes integer model_frame, real speed returns nothing 
        native DzFrameGetModelSpeed takes integer model_frame returns real 
        native DzFrameSetModelScale takes integer model_frame, real x, real y, real z returns nothing 
        native DzFrameSetModelMatReset takes integer model_frame returns nothing 
        native DzFrameSetModelRotateX takes integer model_frame, real x returns nothing 
        native DzFrameSetModelRotateY takes integer model_frame, real y returns nothing 
        native DzFrameSetModelRotateZ takes integer model_frame, real z returns nothing 
        native DzFrameSetModelColor takes integer model_frame, integer color returns nothing 
        native DzFrameGetModelColor takes integer model_frame returns integer
        native DzFrameSetModelTexture takes integer model_frame, string texture_file, integer replace_texutre_id returns nothing 
        native DzFrameSetModelParticle2Size takes integer model_frame, real scale returns nothing 
        native DzGetGlueUI takes nothing returns integer 
        native DzFrameGetMouse takes nothing returns integer 
        native DzFrameGetContext takes integer frame returns integer 
        native DzFrameSetNameContext takes integer frame, string name, integer context returns nothing 
        native DzFrameSetTextFontSpacing takes integer text_frame, real spacing returns nothing 
        native KKCommandGetCooldownModel takes integer cmd_btn returns integer 
        native KKCommandSetCooldownModelSize takes integer cmd_btn, real size returns nothing 
        native KKCommandSetCooldownModelSize2 takes integer cmd_btn, real width, real height returns nothing 
        native DzGetPlayerLastSelectedItem takes player p returns item 
        native DzGetCacheModelCount takes nothing returns integer 
        native DzSetMaxFps takes integer max_fps returns nothing 
        native DzEnableDrawSkillPanel takes unit u, boolean is_enable returns nothing 
        native DzEnableDrawSkillPanelByPlayer takes player p, boolean is_enable returns nothing 
        native DzSetEffectFogVisible takes effect eff, boolean is_visible returns nothing 
        native DzSetEffectMaskVisible takes effect eff, boolean is_visible returns nothing 
        native DzFrameBindWidget takes integer frame, widget u, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible, boolean unit_visible, boolean dead_visible returns nothing 
        native DzFrameBindWorldPos takes integer frame, real world_x, real world_y, real world_z, real screen_x, real screen_y, boolean fog_visible returns nothing
        native DzFrameUnBind takes integer frame returns nothing 
        native DzDisableUnitPreselectUi takes nothing returns nothing
        native DzDisableItemPreselectUi takes nothing returns nothing
        native DzFrameGetLowerLevelFrame takes nothing returns integer 
        native DzFrameSetCheckBoxState takes integer check_box_frame, boolean checked returns nothing
        native DzFrameGetCheckBoxState takes integer check_box_frame returns boolean
        native DzFrameIsFocus takes integer frame returns boolean 
        native DzFrameSetEditBoxActive takes integer frame, boolean is_active returns nothing 
        native DzFrameSetEditBoxDisableIme takes integer frame, boolean is_disable returns nothing 
        native DzIsWindowMode takes nothing returns boolean 
        native DzWindowSetPoint takes integer x, integer y returns nothing 
        native DzWindowSetSize takes integer width, integer height returns nothing 
        native DzGetSystemMetricsWidth takes nothing returns integer 
        native DzGetSystemMetricsHeight takes nothing returns integer 
        native DzGetDoodadsCount takes nothing returns integer 
        native DzSetDoodadsMatScale takes integer doodads_index, real x, real y, real z returns nothing 
        native DzSetDoodadsMatRotateX takes integer doodads_index, real x returns nothing 
        native DzSetDoodadsMatRotateY takes integer doodads_index, real y returns nothing 
        native DzSetDoodadsMatRotateZ takes integer doodads_index, real z returns nothing 
        native DzSetDoodadsMatReset takes integer doodads_index returns nothing 


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
//library LBKKAPI:












































        //转换屏幕坐标到世界坐标  


        //监听建筑选位置  

        //等于0时是结束事件  



        //监听技能选目标  

        //等于0时是结束事件  





        // 打开QQ群链接  
















        function DzSetHeroTypeProperName takes integer uid,string name returns nothing
                call EXSetUnitArrayString(uid, 61, 0, name)
                call EXSetUnitInteger(uid, 61, 1)
        endfunction 
        function DzSetUnitTypeName takes integer uid,string name returns nothing
                call EXSetUnitArrayString(uid, 10, 0, name)
                call EXSetUnitInteger(uid, 10, 1)
        endfunction 
        function DzIsUnitAttackType takes unit whichUnit,integer index,attacktype attackType returns boolean
                return ConvertAttackType(R2I(GetUnitState(whichUnit, ConvertUnitState(16 + 19 * index)))) == attackType
        endfunction 
        function DzSetUnitAttackType takes unit whichUnit,integer index,attacktype attackType returns nothing
                call SetUnitState(whichUnit, ConvertUnitState(16 + 19 * index), GetHandleId(attackType))
        endfunction 
        function DzIsUnitDefenseType takes unit whichUnit,integer defenseType returns boolean
                return R2I(GetUnitState(whichUnit, ConvertUnitState(0x50))) == defenseType
        endfunction 
        function DzSetUnitDefenseType takes unit whichUnit,integer defenseType returns nothing
                call SetUnitState(whichUnit, ConvertUnitState(0x50), defenseType)
        endfunction 
        // 地形装饰物




















        // 解锁JASS字节码限制

        // 设置剪切板内容

        //删除装饰物

        //移除科技等级

        
        // 查找单位技能

        // 修改技能数据-字符串

                
        // 启用/禁用技能

        // 设置单位移动类型

        // 获取控件宽度




        function KKWESetUnitDataCacheInteger takes integer uid,integer id,integer v returns nothing
                call DzSetUnitDataCacheInteger(uid, id, 0, v)
        endfunction
        function KKWEUnitUIAddUpgradesIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 94, id, v)
        endfunction
        function KKWEUnitUIAddBuildsIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 100, id, v)
        endfunction
        function KKWEUnitUIAddResearchesIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 112, id, v)
        endfunction
        function KKWEUnitUIAddTrainsIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 106, id, v)
        endfunction
        function KKWEUnitUIAddSellsUnitIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 118, id, v)
        endfunction
        function KKWEUnitUIAddSellsItemIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 124, id, v)
        endfunction
        function KKWEUnitUIAddMakesItemIds takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 130, id, v)
        endfunction
        function KKWEUnitUIAddRequiresUnitCode takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 166, id, v)
        endfunction
        function KKWEUnitUIAddRequiresTechcode takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 166, id, v)
        endfunction
        function KKWEUnitUIAddRequiresAmounts takes integer uid,integer id,integer v returns nothing
                call DzUnitUIAddLevelArrayInteger(uid, 172, id, v)
        endfunction
         // 设置道具模型

        // 设置道具颜色

        // 设置道具透明度

        // 设置道具头像











                
        function DzIsLeapYear takes integer year returns boolean
                return ( ModuloInteger(year, 4) == 0 and ModuloInteger(year, 100) != 0 ) or ( ModuloInteger(year, 400) == 0 )
        endfunction
        function DzGetTimeDateFromTimestamp takes integer timestamp returns string
                local integer totalSeconds= timestamp + 28800
                local integer days= 0
                local integer day= 0
                local integer secondsInDay= 86400
                local integer remainingSeconds= ModuloInteger(totalSeconds, secondsInDay)
                local integer year= 1970
                local integer totalDays= ( totalSeconds + 86399 ) / ( secondsInDay )
                local integer num= 0
                local integer month=0
                local integer hour
                local integer minute
                local integer second
                local string str
                loop
                if DzIsLeapYear(year) then
                        set num=num + 366
                else
                        set num=num + 365
                endif
                if num > totalDays then
                        set totalDays=totalDays - days
                        exitwhen true
                else
                        set days=num
                endif
                set year=year + 1
                endloop
                set month=1
                set num=0
                set days=0
                if ( DzIsLeapYear(year) ) then
                loop
                        set num=num + LBKKAPI___MonthDay[100 + month]
                        if num >= totalDays then
                        set day=totalDays - days
                        exitwhen true
                        else
                        set days=num
                        endif
                        set month=month + 1
                endloop
                else
                loop
                        set num=num + LBKKAPI___MonthDay[month]
                        if num >= totalDays then
                        set day=totalDays - days
                        exitwhen true
                        else
                        set days=num
                        endif
                        set month=month + 1
                endloop
                endif
                if ( day == 0 ) then
                set day=1
                endif
                set hour=remainingSeconds / 3600
                set remainingSeconds=ModuloInteger(remainingSeconds, 3600)
                set minute=remainingSeconds / 60
                set second=ModuloInteger(remainingSeconds, 60)
                set str=I2S(year) + "-" + I2S(month) + "-" + I2S(day) + " " + I2S(hour) + ":" + I2S(minute) + ":" + I2S(second)
                call SaveInteger(LBKKAPI___Hash, timestamp, 1, year)
                call SaveInteger(LBKKAPI___Hash, timestamp, 2, month)
                call SaveInteger(LBKKAPI___Hash, timestamp, 3, day)
                call SaveStr(LBKKAPI___Hash, timestamp, 4, str)
                return str
        endfunction
        function KKAPIGetTimeDateFromTimestamp takes integer timestamp returns string
                set timestamp=IMaxBJ(timestamp, 0)
                if ( HaveSavedString(LBKKAPI___Hash, timestamp, 4) ) then
                        return LoadStr(LBKKAPI___Hash, timestamp, 4)
                else
                        return DzGetTimeDateFromTimestamp(timestamp)
                endif
        endfunction
        function KKAPIGetTimestampYear takes integer timestamp returns integer
                set timestamp=IMaxBJ(timestamp, 0)
                if ( HaveSavedInteger(LBKKAPI___Hash, timestamp, 1) == false ) then
                        call DzGetTimeDateFromTimestamp(timestamp)
                endif
                 return LoadInteger(LBKKAPI___Hash, timestamp, 1)
        endfunction
        function KKAPIGetTimestampMonth takes integer timestamp returns integer
                set timestamp=IMaxBJ(timestamp, 0)
                if ( HaveSavedInteger(LBKKAPI___Hash, timestamp, 2) == false ) then
                        call DzGetTimeDateFromTimestamp(timestamp)
                endif
                 return LoadInteger(LBKKAPI___Hash, timestamp, 2)
        endfunction
        function KKAPIGetTimestampDay takes integer timestamp returns integer
                set timestamp=IMaxBJ(timestamp, 0)
                if ( HaveSavedInteger(LBKKAPI___Hash, timestamp, 3) == false ) then
                        call DzGetTimeDateFromTimestamp(timestamp)
                endif
                 return LoadInteger(LBKKAPI___Hash, timestamp, 3)
        endfunction
        function LBKKAPI___Init takes nothing returns nothing
                set LBKKAPI___MonthDay[1]=31
                set LBKKAPI___MonthDay[2]=28
                set LBKKAPI___MonthDay[3]=31
                set LBKKAPI___MonthDay[4]=30
                set LBKKAPI___MonthDay[5]=31
                set LBKKAPI___MonthDay[6]=30
                set LBKKAPI___MonthDay[7]=31
                set LBKKAPI___MonthDay[8]=31
                set LBKKAPI___MonthDay[9]=30
                set LBKKAPI___MonthDay[10]=31
                set LBKKAPI___MonthDay[11]=30
                set LBKKAPI___MonthDay[12]=31
                set LBKKAPI___MonthDay[101]=31
                set LBKKAPI___MonthDay[102]=29
                set LBKKAPI___MonthDay[103]=31
                set LBKKAPI___MonthDay[104]=30
                set LBKKAPI___MonthDay[105]=31
                set LBKKAPI___MonthDay[106]=30
                set LBKKAPI___MonthDay[107]=31
                set LBKKAPI___MonthDay[108]=31
                set LBKKAPI___MonthDay[109]=30
                set LBKKAPI___MonthDay[110]=31
                set LBKKAPI___MonthDay[111]=30
                set LBKKAPI___MonthDay[112]=31
        endfunction

        // texttag





    
        // group


    
        // unit


    
        // string












    
        // bit











    
        // issue

















        // xlsx









    




























        




        


        
        















        







        function KKConvertInt2AbilId takes integer i returns integer
                return i
        endfunction
        function KKConvertAbilId2Int takes integer i returns integer
                return i
        endfunction
        function KKConvertInt2Color takes integer i returns integer
                return i
        endfunction
        function KKConvertColor2Int takes integer i returns integer
                return i
        endfunction









































        
                







        function KKFrameBindItem takes integer frame,widget u,real world_x,real world_y,real world_z,real screen_x,real screen_y,boolean fog_visible,boolean item_visible returns nothing
                call DzFrameBindWidget(frame, u, world_x, world_y, world_z, screen_x, screen_y, fog_visible, item_visible, false)
        endfunction





















//library LBKKAPI ends
//library YDTriggerSaveLoadSystem:
//#  define YDTRIGGER_handle(SG)                          YDTRIGGER_HT##SG##(HashtableHandle)
    function YDTriggerSaveLoadSystem___Init takes nothing returns nothing
            set YDHT=InitHashtable()
        set YDLOC=InitHashtable()
    endfunction

//library YDTriggerSaveLoadSystem ends
//===========================================================================
// 
// 只是另外一张魔兽争霸的地图
// 
//   Warcraft III map script
//   Generated by the Warcraft III World Editor
//   Date: Fri Dec 26 17:25:20 2025
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
//*  Unit Creation
//*
//***************************************************************************
//===========================================================================
function CreateUnitsForPlayer0 takes nothing returns nothing
    local player p= Player(0)
    local unit u
    local integer unitID
    local trigger t
    local real life
    set u=CreateUnit(p, 'Hpal', - 416.0, - 288.7, 356.825)
//JASSHelper null local processed: endfunction
set t = null
set u = null
set p = null
endfunction
//===========================================================================
function CreatePlayerBuildings takes nothing returns nothing
endfunction
//===========================================================================
function CreatePlayerUnits takes nothing returns nothing
    call CreateUnitsForPlayer0()
endfunction
//===========================================================================
function CreateAllUnits takes nothing returns nothing
    call CreatePlayerBuildings()
    call CreateUnitsForPlayer0() // INLINED!!
endfunction
//***************************************************************************
//*
//*  Triggers
//*
//***************************************************************************
//===========================================================================
// Trigger: 未命名触发器 001
//===========================================================================
function Trig____________________001Func005FT takes nothing returns nothing
    call DisplayTextToPlayer(Player(0), 0, 0, ( ( "绑定的名字:" ) + ( DzFrameGetName(udg_simple_frame) ) + ( "" ) ))
    call DisplayTextToPlayer(Player(0), 0, 0, ( ( "绑定的整数:" ) + ( I2S(DzFrameGetContext(udg_simple_frame)) ) + ( "" ) ))
    call DisplayTextToPlayer(Player(0), 0, 0, ( ( "根据名字查找控件" ) + ( I2S(((DzSimpleFrameFindByName("ABCDE", 12345)))) ) + ( ( " == " + I2S(((udg_simple_frame))) ) ) )) // INLINED!!
endfunction
function Trig____________________001Actions takes nothing returns nothing
    local integer ydl_localvar_step= LoadInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76)
 set ydl_localvar_step=ydl_localvar_step + 3
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xCFDE6C76, ydl_localvar_step)
 call SaveInteger(YDLOC, GetHandleId(GetTriggeringTrigger()), 0xECE825E7, ydl_localvar_step)
    set udg_simple_frame=DzCreateCommandButton(DzFrameGetTopMessage(), "ReplaceableTextures\\CommandButtons\\BTNArthas.blp", "测试按钮", "点击后显示绑定的名字")
    call DzFrameSetNameContext(udg_simple_frame, "ABCDE", 12345)
    call DzFrameSetPoint(udg_simple_frame, 4, DzGetGameUI(), 4, 0, 0)
    call DzFrameSetSize(udg_simple_frame, 0.05, 0.05)
    if GetLocalPlayer() == Player(0) then
    	call DzFrameSetScriptByCode(udg_simple_frame, 1, function Trig____________________001Func005FT, false)
    endif
    call FlushChildHashtable(YDLOC, GetHandleId(GetTriggeringTrigger()) * ydl_localvar_step)
endfunction
//===========================================================================
function InitTrig____________________001 takes nothing returns nothing
    set gg_trg____________________001=CreateTrigger()
    call TriggerRegisterTimerEventSingle(gg_trg____________________001, 0.00)
    call TriggerAddAction(gg_trg____________________001, function Trig____________________001Actions)
endfunction
//===========================================================================
// Trigger: 未命名触发器 002
//===========================================================================
function Trig____________________002Actions takes nothing returns nothing
    call DzEnableWideScreen(true)
endfunction
//===========================================================================
function InitTrig____________________002 takes nothing returns nothing
    set gg_trg____________________002=CreateTrigger()
    call TriggerAddAction(gg_trg____________________002, function Trig____________________002Actions)
endfunction
//===========================================================================
function InitCustomTriggers takes nothing returns nothing
    call InitTrig____________________001()
    call InitTrig____________________002()
endfunction
//===========================================================================
function RunInitializationTriggers takes nothing returns nothing
    call ConditionalTriggerExecute(gg_trg____________________002)
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
    // Force: TRIGSTR_003
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
    call CreateAllUnits()
    call InitBlizzard()

call ExecuteFunc("LBKKAPI___Init")
call ExecuteFunc("YDTriggerSaveLoadSystem___Init")

    call InitGlobals()
    call InitCustomTriggers()
    call ConditionalTriggerExecute(gg_trg____________________002) // INLINED!!
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
    call DefineStartLocation(0, 1728.0, - 3264.0)
    // Player setup
    call InitCustomPlayerSlots()
    call SetPlayerSlotAvailable(Player(0), MAP_CONTROL_USER)
    call InitGenericPlayerSlots()
endfunction
// [DzSetUnitMoveType]  
// title = "设置单位移动类型[NEW]"  
// description = "设置 ${单位} 的移动类型：${movetype} "  
// comment = ""  
// category = TC_KKPRE  
// [[.args]]  
// type = unit  
// [[.args]]  
// type = MoveTypeName  
// default = MoveTypeName01  




//Struct method generated initializers/callers:


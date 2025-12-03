
local ____modules = {}
local ____moduleCache = {}
local ____originalRequire = require
local function require(file, ...)
    if ____moduleCache[file] then
        return ____moduleCache[file].value
    end
    if ____modules[file] then
        local module = ____modules[file]
        local value = nil
        if (select("#", ...) > 0) then value = module(...) else value = module(file) end
        ____moduleCache[file] = { value = value }
        return value
    else
        if ____originalRequire then
            return ____originalRequire(file)
        else
            error("module '" .. file .. "' not found")
        end
    end
end
____modules = {
["lua_modules.@eiriksgata.wc3ts.src.globals.define"] = function(...) 
local ____exports = {}
____exports.MAP_SPEED_NORMAL = function() return ConvertGameSpeed(2) end
____exports.bj_PI = math.pi
____exports.bj_E = 2.718281828459045
____exports.bj_CELLWIDTH = 128
____exports.bj_CLIFFHEIGHT = 128
____exports.bj_UNIT_FACING = 270
____exports.bj_RADTODEG = 180 / ____exports.bj_PI
____exports.bj_DEGTORAD = ____exports.bj_PI / 180
____exports.bj_TEXT_DELAY_QUEST = 20
____exports.bj_TEXT_DELAY_QUESTUPDATE = 20
____exports.bj_TEXT_DELAY_QUESTDONE = 20
____exports.bj_TEXT_DELAY_QUESTFAILED = 20
____exports.bj_TEXT_DELAY_QUESTREQUIREMENT = 20
____exports.bj_TEXT_DELAY_MISSIONFAILED = 20
____exports.bj_TEXT_DELAY_ALWAYSHINT = 12
____exports.bj_TEXT_DELAY_HINT = 12
____exports.bj_TEXT_DELAY_SECRET = 10
____exports.bj_TEXT_DELAY_UNITACQUIRED = 15
____exports.bj_TEXT_DELAY_UNITAVAILABLE = 10
____exports.bj_TEXT_DELAY_ITEMACQUIRED = 10
____exports.bj_TEXT_DELAY_WARNING = 12
____exports.bj_QUEUE_DELAY_QUEST = 5
____exports.bj_QUEUE_DELAY_HINT = 5
____exports.bj_QUEUE_DELAY_SECRET = 3
____exports.bj_HANDICAP_EASY = 60
____exports.bj_GAME_STARTED_THRESHOLD = 0.01
____exports.bj_WAIT_FOR_COND_MIN_INTERVAL = 0.1
____exports.bj_POLLED_WAIT_INTERVAL = 0.1
____exports.bj_POLLED_WAIT_SKIP_THRESHOLD = 2
____exports.bj_MAX_INVENTORY = 6
____exports.bj_MAX_PLAYERS = 12
____exports.bj_PLAYER_NEUTRAL_VICTIM = 13
____exports.bj_PLAYER_NEUTRAL_EXTRA = 14
____exports.bj_MAX_PLAYER_SLOTS = 16
____exports.bj_MAX_SKELETONS = 25
____exports.bj_MAX_STOCK_ITEM_SLOTS = 11
____exports.bj_MAX_STOCK_UNIT_SLOTS = 11
____exports.bj_MAX_ITEM_LEVEL = 10
____exports.bj_TOD_DAWN = 6
____exports.bj_TOD_DUSK = 18
____exports.bj_MELEE_STARTING_TOD = 8
____exports.bj_MELEE_STARTING_GOLD_V0 = 750
____exports.bj_MELEE_STARTING_GOLD_V1 = 500
____exports.bj_MELEE_STARTING_LUMBER_V0 = 200
____exports.bj_MELEE_STARTING_LUMBER_V1 = 150
____exports.bj_MELEE_STARTING_HERO_TOKENS = 1
____exports.bj_MELEE_HERO_LIMIT = 3
____exports.bj_MELEE_HERO_TYPE_LIMIT = 1
____exports.bj_MELEE_MINE_SEARCH_RADIUS = 2000
____exports.bj_MELEE_CLEAR_UNITS_RADIUS = 1500
____exports.bj_MELEE_CRIPPLE_TIMEOUT = 120
____exports.bj_MELEE_CRIPPLE_MSG_DURATION = 20
____exports.bj_MELEE_MAX_TWINKED_HEROES_V0 = 3
____exports.bj_MELEE_MAX_TWINKED_HEROES_V1 = 1
____exports.bj_CREEP_ITEM_DELAY = 0.5
____exports.bj_STOCK_RESTOCK_INITIAL_DELAY = 120
____exports.bj_STOCK_RESTOCK_INTERVAL = 30
____exports.bj_STOCK_MAX_ITERATIONS = 20
____exports.bj_MAX_DEST_IN_REGION_EVENTS = 64
____exports.bj_CAMERA_MIN_FARZ = 100
____exports.bj_CAMERA_DEFAULT_DISTANCE = 1650
____exports.bj_CAMERA_DEFAULT_FARZ = 5000
____exports.bj_CAMERA_DEFAULT_AOA = 304
____exports.bj_CAMERA_DEFAULT_FOV = 70
____exports.bj_CAMERA_DEFAULT_ROLL = 0
____exports.bj_CAMERA_DEFAULT_ROTATION = 90
____exports.bj_RESCUE_PING_TIME = 2
____exports.bj_NOTHING_SOUND_DURATION = 5
____exports.bj_TRANSMISSION_PING_TIME = 1
____exports.bj_TRANSMISSION_IND_RED = 255
____exports.bj_TRANSMISSION_IND_BLUE = 255
____exports.bj_TRANSMISSION_IND_GREEN = 255
____exports.bj_TRANSMISSION_IND_ALPHA = 255
____exports.bj_TRANSMISSION_PORT_HANGTIME = 1.5
____exports.bj_CINEMODE_INTERFACEFADE = 0.5
____exports.bj_CINEMODE_GAMESPEED = ____exports.MAP_SPEED_NORMAL
____exports.bj_CINEMODE_VOLUME_UNITMOVEMENT = 0.4
____exports.bj_CINEMODE_VOLUME_UNITSOUNDS = 0
____exports.bj_CINEMODE_VOLUME_COMBAT = 0.4
____exports.bj_CINEMODE_VOLUME_SPELLS = 0.4
____exports.bj_CINEMODE_VOLUME_UI = 0
____exports.bj_CINEMODE_VOLUME_MUSIC = 0.55
____exports.bj_CINEMODE_VOLUME_AMBIENTSOUNDS = 1
____exports.bj_CINEMODE_VOLUME_FIRE = 0.6
____exports.bj_SPEECH_VOLUME_UNITMOVEMENT = 0.25
____exports.bj_SPEECH_VOLUME_UNITSOUNDS = 0
____exports.bj_SPEECH_VOLUME_COMBAT = 0.25
____exports.bj_SPEECH_VOLUME_SPELLS = 0.25
____exports.bj_SPEECH_VOLUME_UI = 0
____exports.bj_SPEECH_VOLUME_MUSIC = 0.55
____exports.bj_SPEECH_VOLUME_AMBIENTSOUNDS = 1
____exports.bj_SPEECH_VOLUME_FIRE = 0.6
____exports.bj_SMARTPAN_TRESHOLD_PAN = 500
____exports.bj_SMARTPAN_TRESHOLD_SNAP = 3500
____exports.bj_MAX_QUEUED_TRIGGERS = 100
____exports.bj_QUEUED_TRIGGER_TIMEOUT = 180
____exports.bj_CAMPAIGN_INDEX_T = 0
____exports.bj_CAMPAIGN_INDEX_H = 1
____exports.bj_CAMPAIGN_INDEX_U = 2
____exports.bj_CAMPAIGN_INDEX_O = 3
____exports.bj_CAMPAIGN_INDEX_N = 4
____exports.bj_CAMPAIGN_INDEX_XN = 5
____exports.bj_CAMPAIGN_INDEX_XH = 6
____exports.bj_CAMPAIGN_INDEX_XU = 7
____exports.bj_CAMPAIGN_INDEX_XO = 8
____exports.bj_CAMPAIGN_OFFSET_T = 0
____exports.bj_CAMPAIGN_OFFSET_H = 1
____exports.bj_CAMPAIGN_OFFSET_U = 2
____exports.bj_CAMPAIGN_OFFSET_O = 3
____exports.bj_CAMPAIGN_OFFSET_N = 4
____exports.bj_CAMPAIGN_OFFSET_XN = 0
____exports.bj_CAMPAIGN_OFFSET_XH = 1
____exports.bj_CAMPAIGN_OFFSET_XU = 2
____exports.bj_CAMPAIGN_OFFSET_XO = 3
____exports.bj_MISSION_INDEX_T00 = ____exports.bj_CAMPAIGN_OFFSET_T * 1000 + 0
____exports.bj_MISSION_INDEX_T01 = ____exports.bj_CAMPAIGN_OFFSET_T * 1000 + 1
____exports.bj_MISSION_INDEX_H00 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 0
____exports.bj_MISSION_INDEX_H01 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 1
____exports.bj_MISSION_INDEX_H02 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 2
____exports.bj_MISSION_INDEX_H03 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 3
____exports.bj_MISSION_INDEX_H04 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 4
____exports.bj_MISSION_INDEX_H05 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 5
____exports.bj_MISSION_INDEX_H06 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 6
____exports.bj_MISSION_INDEX_H07 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 7
____exports.bj_MISSION_INDEX_H08 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 8
____exports.bj_MISSION_INDEX_H09 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 9
____exports.bj_MISSION_INDEX_H10 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 10
____exports.bj_MISSION_INDEX_H11 = ____exports.bj_CAMPAIGN_OFFSET_H * 1000 + 11
____exports.bj_MISSION_INDEX_U00 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 0
____exports.bj_MISSION_INDEX_U01 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 1
____exports.bj_MISSION_INDEX_U02 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 2
____exports.bj_MISSION_INDEX_U03 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 3
____exports.bj_MISSION_INDEX_U05 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 4
____exports.bj_MISSION_INDEX_U07 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 5
____exports.bj_MISSION_INDEX_U08 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 6
____exports.bj_MISSION_INDEX_U09 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 7
____exports.bj_MISSION_INDEX_U10 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 8
____exports.bj_MISSION_INDEX_U11 = ____exports.bj_CAMPAIGN_OFFSET_U * 1000 + 9
____exports.bj_MISSION_INDEX_O00 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 0
____exports.bj_MISSION_INDEX_O01 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 1
____exports.bj_MISSION_INDEX_O02 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 2
____exports.bj_MISSION_INDEX_O03 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 3
____exports.bj_MISSION_INDEX_O04 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 4
____exports.bj_MISSION_INDEX_O05 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 5
____exports.bj_MISSION_INDEX_O06 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 6
____exports.bj_MISSION_INDEX_O07 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 7
____exports.bj_MISSION_INDEX_O08 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 8
____exports.bj_MISSION_INDEX_O09 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 9
____exports.bj_MISSION_INDEX_O10 = ____exports.bj_CAMPAIGN_OFFSET_O * 1000 + 10
____exports.bj_MISSION_INDEX_N00 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 0
____exports.bj_MISSION_INDEX_N01 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 1
____exports.bj_MISSION_INDEX_N02 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 2
____exports.bj_MISSION_INDEX_N03 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 3
____exports.bj_MISSION_INDEX_N04 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 4
____exports.bj_MISSION_INDEX_N05 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 5
____exports.bj_MISSION_INDEX_N06 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 6
____exports.bj_MISSION_INDEX_N07 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 7
____exports.bj_MISSION_INDEX_N08 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 8
____exports.bj_MISSION_INDEX_N09 = ____exports.bj_CAMPAIGN_OFFSET_N * 1000 + 9
____exports.bj_MISSION_INDEX_XN00 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 0
____exports.bj_MISSION_INDEX_XN01 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 1
____exports.bj_MISSION_INDEX_XN02 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 2
____exports.bj_MISSION_INDEX_XN03 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 3
____exports.bj_MISSION_INDEX_XN04 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 4
____exports.bj_MISSION_INDEX_XN05 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 5
____exports.bj_MISSION_INDEX_XN06 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 6
____exports.bj_MISSION_INDEX_XN07 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 7
____exports.bj_MISSION_INDEX_XN08 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 8
____exports.bj_MISSION_INDEX_XN09 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 9
____exports.bj_MISSION_INDEX_XN10 = ____exports.bj_CAMPAIGN_OFFSET_XN * 1000 + 10
____exports.bj_MISSION_INDEX_XH00 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 0
____exports.bj_MISSION_INDEX_XH01 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 1
____exports.bj_MISSION_INDEX_XH02 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 2
____exports.bj_MISSION_INDEX_XH03 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 3
____exports.bj_MISSION_INDEX_XH04 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 4
____exports.bj_MISSION_INDEX_XH05 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 5
____exports.bj_MISSION_INDEX_XH06 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 6
____exports.bj_MISSION_INDEX_XH07 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 7
____exports.bj_MISSION_INDEX_XH08 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 8
____exports.bj_MISSION_INDEX_XH09 = ____exports.bj_CAMPAIGN_OFFSET_XH * 1000 + 9
____exports.bj_MISSION_INDEX_XU00 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 0
____exports.bj_MISSION_INDEX_XU01 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 1
____exports.bj_MISSION_INDEX_XU02 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 2
____exports.bj_MISSION_INDEX_XU03 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 3
____exports.bj_MISSION_INDEX_XU04 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 4
____exports.bj_MISSION_INDEX_XU05 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 5
____exports.bj_MISSION_INDEX_XU06 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 6
____exports.bj_MISSION_INDEX_XU07 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 7
____exports.bj_MISSION_INDEX_XU08 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 8
____exports.bj_MISSION_INDEX_XU09 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 9
____exports.bj_MISSION_INDEX_XU10 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 10
____exports.bj_MISSION_INDEX_XU11 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 11
____exports.bj_MISSION_INDEX_XU12 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 12
____exports.bj_MISSION_INDEX_XU13 = ____exports.bj_CAMPAIGN_OFFSET_XU * 1000 + 13
____exports.bj_MISSION_INDEX_XO00 = ____exports.bj_CAMPAIGN_OFFSET_XO * 1000 + 0
____exports.bj_CINEMATICINDEX_TOP = 0
____exports.bj_CINEMATICINDEX_HOP = 1
____exports.bj_CINEMATICINDEX_HED = 2
____exports.bj_CINEMATICINDEX_OOP = 3
____exports.bj_CINEMATICINDEX_OED = 4
____exports.bj_CINEMATICINDEX_UOP = 5
____exports.bj_CINEMATICINDEX_UED = 6
____exports.bj_CINEMATICINDEX_NOP = 7
____exports.bj_CINEMATICINDEX_NED = 8
____exports.bj_CINEMATICINDEX_XOP = 9
____exports.bj_CINEMATICINDEX_XED = 10
____exports.bj_ALLIANCE_UNALLIED = 0
____exports.bj_ALLIANCE_UNALLIED_VISION = 1
____exports.bj_ALLIANCE_ALLIED = 2
____exports.bj_ALLIANCE_ALLIED_VISION = 3
____exports.bj_ALLIANCE_ALLIED_UNITS = 4
____exports.bj_ALLIANCE_ALLIED_ADVUNITS = 5
____exports.bj_ALLIANCE_NEUTRAL = 6
____exports.bj_ALLIANCE_NEUTRAL_VISION = 7
____exports.bj_KEYEVENTTYPE_DEPRESS = 0
____exports.bj_KEYEVENTTYPE_RELEASE = 1
____exports.bj_KEYEVENTKEY_LEFT = 0
____exports.bj_KEYEVENTKEY_RIGHT = 1
____exports.bj_KEYEVENTKEY_DOWN = 2
____exports.bj_KEYEVENTKEY_UP = 3
____exports.bj_TIMETYPE_ADD = 0
____exports.bj_TIMETYPE_SET = 1
____exports.bj_TIMETYPE_SUB = 2
____exports.bj_CAMERABOUNDS_ADJUST_ADD = 0
____exports.bj_CAMERABOUNDS_ADJUST_SUB = 1
____exports.bj_QUESTTYPE_REQ_DISCOVERED = 0
____exports.bj_QUESTTYPE_REQ_UNDISCOVERED = 1
____exports.bj_QUESTTYPE_OPT_DISCOVERED = 2
____exports.bj_QUESTTYPE_OPT_UNDISCOVERED = 3
____exports.bj_QUESTMESSAGE_DISCOVERED = 0
____exports.bj_QUESTMESSAGE_UPDATED = 1
____exports.bj_QUESTMESSAGE_COMPLETED = 2
____exports.bj_QUESTMESSAGE_FAILED = 3
____exports.bj_QUESTMESSAGE_REQUIREMENT = 4
____exports.bj_QUESTMESSAGE_MISSIONFAILED = 5
____exports.bj_QUESTMESSAGE_ALWAYSHINT = 6
____exports.bj_QUESTMESSAGE_HINT = 7
____exports.bj_QUESTMESSAGE_SECRET = 8
____exports.bj_QUESTMESSAGE_UNITACQUIRED = 9
____exports.bj_QUESTMESSAGE_UNITAVAILABLE = 10
____exports.bj_QUESTMESSAGE_ITEMACQUIRED = 11
____exports.bj_QUESTMESSAGE_WARNING = 12
____exports.bj_SORTTYPE_SORTBYVALUE = 0
____exports.bj_SORTTYPE_SORTBYPLAYER = 1
____exports.bj_SORTTYPE_SORTBYLABEL = 2
____exports.bj_CINEFADETYPE_FADEIN = 0
____exports.bj_CINEFADETYPE_FADEOUT = 1
____exports.bj_CINEFADETYPE_FADEOUTIN = 2
____exports.bj_REMOVEBUFFS_POSITIVE = 0
____exports.bj_REMOVEBUFFS_NEGATIVE = 1
____exports.bj_REMOVEBUFFS_ALL = 2
____exports.bj_REMOVEBUFFS_NONTLIFE = 3
____exports.bj_BUFF_POLARITY_POSITIVE = 0
____exports.bj_BUFF_POLARITY_NEGATIVE = 1
____exports.bj_BUFF_POLARITY_EITHER = 2
____exports.bj_BUFF_RESIST_MAGIC = 0
____exports.bj_BUFF_RESIST_PHYSICAL = 1
____exports.bj_BUFF_RESIST_EITHER = 2
____exports.bj_BUFF_RESIST_BOTH = 3
____exports.bj_HEROSTAT_STR = 0
____exports.bj_HEROSTAT_AGI = 1
____exports.bj_HEROSTAT_INT = 2
____exports.bj_MODIFYMETHOD_ADD = 0
____exports.bj_MODIFYMETHOD_SUB = 1
____exports.bj_MODIFYMETHOD_SET = 2
____exports.bj_UNIT_STATE_METHOD_ABSOLUTE = 0
____exports.bj_UNIT_STATE_METHOD_RELATIVE = 1
____exports.bj_UNIT_STATE_METHOD_DEFAULTS = 2
____exports.bj_UNIT_STATE_METHOD_MAXIMUM = 3
____exports.bj_GATEOPERATION_CLOSE = 0
____exports.bj_GATEOPERATION_OPEN = 1
____exports.bj_GATEOPERATION_DESTROY = 2
____exports.bj_GAMECACHE_BOOLEAN = 0
____exports.bj_GAMECACHE_INTEGER = 1
____exports.bj_GAMECACHE_REAL = 2
____exports.bj_GAMECACHE_UNIT = 3
____exports.bj_GAMECACHE_STRING = 4
____exports.bj_ITEM_STATUS_HIDDEN = 0
____exports.bj_ITEM_STATUS_OWNED = 1
____exports.bj_ITEM_STATUS_INVULNERABLE = 2
____exports.bj_ITEM_STATUS_POWERUP = 3
____exports.bj_ITEM_STATUS_SELLABLE = 4
____exports.bj_ITEM_STATUS_PAWNABLE = 5
____exports.bj_ITEMCODE_STATUS_POWERUP = 0
____exports.bj_ITEMCODE_STATUS_SELLABLE = 1
____exports.bj_ITEMCODE_STATUS_PAWNABLE = 2
____exports.bj_MINIMAPPINGSTYLE_SIMPLE = 0
____exports.bj_MINIMAPPINGSTYLE_FLASHY = 1
____exports.bj_MINIMAPPINGSTYLE_ATTACK = 2
____exports.bj_CORPSE_MAX_DEATH_TIME = 8
____exports.bj_CORPSETYPE_FLESH = 0
____exports.bj_CORPSETYPE_BONE = 1
____exports.bj_ELEVATOR_BLOCKER_CODE = "DTep"
____exports.bj_ELEVATOR_CODE01 = "DTrf"
____exports.bj_ELEVATOR_CODE02 = "DTrx"
____exports.bj_ELEVATOR_WALL_TYPE_ALL = 0
____exports.bj_ELEVATOR_WALL_TYPE_EAST = 1
____exports.bj_ELEVATOR_WALL_TYPE_NORTH = 2
____exports.bj_ELEVATOR_WALL_TYPE_SOUTH = 3
____exports.bj_ELEVATOR_WALL_TYPE_WEST = 4
____exports.bj_MELEE_MAX_TWINKED_HEROES = 0
____exports.bj_mapInitialPlayableArea = nil
____exports.bj_mapInitialCameraBounds = nil
____exports.bj_forLoopAIndex = 0
____exports.bj_forLoopBIndex = 0
____exports.bj_forLoopAIndexEnd = 0
____exports.bj_forLoopBIndexEnd = 0
____exports.bj_slotControlReady = false
____exports.bj_gameStartedTimer = nil
____exports.bj_gameStarted = false
____exports.bj_isSinglePlayer = false
____exports.bj_dncSoundsDay = nil
____exports.bj_dncSoundsNight = nil
____exports.bj_dayAmbientSound = nil
____exports.bj_nightAmbientSound = nil
____exports.bj_dncSoundsDawn = nil
____exports.bj_dncSoundsDusk = nil
____exports.bj_dawnSound = nil
____exports.bj_duskSound = nil
____exports.bj_useDawnDuskSounds = true
____exports.bj_dncIsDaytime = false
____exports.bj_rescueSound = nil
____exports.bj_questDiscoveredSound = nil
____exports.bj_questUpdatedSound = nil
____exports.bj_questCompletedSound = nil
____exports.bj_questFailedSound = nil
____exports.bj_questHintSound = nil
____exports.bj_questSecretSound = nil
____exports.bj_questItemAcquiredSound = nil
____exports.bj_questWarningSound = nil
____exports.bj_victoryDialogSound = nil
____exports.bj_defeatDialogSound = nil
____exports.bj_rescueUnitBehavior = nil
____exports.bj_rescueChangeColorUnit = true
____exports.bj_rescueChangeColorBldg = true
____exports.bj_cineSceneEndingTimer = nil
____exports.bj_cineSceneLastSound = nil
____exports.bj_cineSceneBeingSkipped = nil
____exports.bj_cineModePriorSpeed = ____exports.MAP_SPEED_NORMAL
____exports.bj_cineModePriorFogSetting = false
____exports.bj_cineModePriorMaskSetting = false
____exports.bj_cineModeAlreadyIn = false
____exports.bj_cineModePriorDawnDusk = false
____exports.bj_cineModeSavedSeed = 0
____exports.bj_cineFadeFinishTimer = nil
____exports.bj_cineFadeContinueTimer = nil
____exports.bj_cineFadeContinueRed = 0
____exports.bj_cineFadeContinueGreen = 0
____exports.bj_cineFadeContinueBlue = 0
____exports.bj_cineFadeContinueTrans = 0
____exports.bj_cineFadeContinueDuration = 0
____exports.bj_cineFadeContinueTex = ""
____exports.JASS_MAX_ARRAY_SIZE = 8192
____exports.PLAYER_NEUTRAL_PASSIVE = 15
____exports.PLAYER_NEUTRAL_AGGRESSIVE = 12
____exports.PLAYER_COLOR_RED = function() return ConvertPlayerColor(0) end
____exports.PLAYER_COLOR_BLUE = function() return ConvertPlayerColor(1) end
____exports.PLAYER_COLOR_CYAN = function() return ConvertPlayerColor(2) end
____exports.PLAYER_COLOR_PURPLE = function() return ConvertPlayerColor(3) end
____exports.PLAYER_COLOR_YELLOW = function() return ConvertPlayerColor(4) end
____exports.PLAYER_COLOR_ORANGE = function() return ConvertPlayerColor(5) end
____exports.PLAYER_COLOR_GREEN = function() return ConvertPlayerColor(6) end
____exports.PLAYER_COLOR_PINK = function() return ConvertPlayerColor(7) end
____exports.PLAYER_COLOR_LIGHT_GRAY = function() return ConvertPlayerColor(8) end
____exports.PLAYER_COLOR_LIGHT_BLUE = function() return ConvertPlayerColor(9) end
____exports.PLAYER_COLOR_AQUA = function() return ConvertPlayerColor(10) end
____exports.PLAYER_COLOR_BROWN = function() return ConvertPlayerColor(11) end
____exports.PLAYER_COLOR_BLACK = function() return ConvertPlayerColor(12) end
____exports.RACE_HUMAN = function() return ConvertRace(1) end
____exports.RACE_ORC = function() return ConvertRace(2) end
____exports.RACE_UNDEAD = function() return ConvertRace(3) end
____exports.RACE_NIGHTELF = function() return ConvertRace(4) end
____exports.RACE_DEMON = function() return ConvertRace(5) end
____exports.RACE_OTHER = function() return ConvertRace(7) end
____exports.PLAYER_GAME_RESULT_VICTORY = function() return ConvertPlayerGameResult(0) end
____exports.PLAYER_GAME_RESULT_DEFEAT = function() return ConvertPlayerGameResult(1) end
____exports.PLAYER_GAME_RESULT_TIE = function() return ConvertPlayerGameResult(2) end
____exports.PLAYER_GAME_RESULT_NEUTRAL = function() return ConvertPlayerGameResult(3) end
____exports.ALLIANCE_PASSIVE = function() return ConvertAllianceType(0) end
____exports.ALLIANCE_HELP_REQUEST = function() return ConvertAllianceType(1) end
____exports.ALLIANCE_HELP_RESPONSE = function() return ConvertAllianceType(2) end
____exports.ALLIANCE_SHARED_XP = function() return ConvertAllianceType(3) end
____exports.ALLIANCE_SHARED_SPELLS = function() return ConvertAllianceType(4) end
____exports.ALLIANCE_SHARED_VISION = function() return ConvertAllianceType(5) end
____exports.ALLIANCE_SHARED_CONTROL = function() return ConvertAllianceType(6) end
____exports.ALLIANCE_SHARED_ADVANCED_CONTROL = function() return ConvertAllianceType(7) end
____exports.ALLIANCE_RESCUABLE = function() return ConvertAllianceType(8) end
____exports.ALLIANCE_SHARED_VISION_FORCED = function() return ConvertAllianceType(9) end
____exports.VERSION_REIGN_OF_CHAOS = function() return ConvertVersion(0) end
____exports.VERSION_FROZEN_THRONE = function() return ConvertVersion(1) end
____exports.ATTACK_TYPE_NORMAL = function() return ConvertAttackType(0) end
____exports.ATTACK_TYPE_MELEE = function() return ConvertAttackType(1) end
____exports.ATTACK_TYPE_PIERCE = function() return ConvertAttackType(2) end
____exports.ATTACK_TYPE_SIEGE = function() return ConvertAttackType(3) end
____exports.ATTACK_TYPE_MAGIC = function() return ConvertAttackType(4) end
____exports.ATTACK_TYPE_CHAOS = function() return ConvertAttackType(5) end
____exports.ATTACK_TYPE_HERO = function() return ConvertAttackType(6) end
____exports.DAMAGE_TYPE_UNKNOWN = function() return ConvertDamageType(0) end
____exports.DAMAGE_TYPE_NORMAL = function() return ConvertDamageType(4) end
____exports.DAMAGE_TYPE_ENHANCED = function() return ConvertDamageType(5) end
____exports.DAMAGE_TYPE_FIRE = function() return ConvertDamageType(8) end
____exports.DAMAGE_TYPE_COLD = function() return ConvertDamageType(9) end
____exports.DAMAGE_TYPE_LIGHTNING = function() return ConvertDamageType(10) end
____exports.DAMAGE_TYPE_POISON = function() return ConvertDamageType(11) end
____exports.DAMAGE_TYPE_DISEASE = function() return ConvertDamageType(12) end
____exports.DAMAGE_TYPE_DIVINE = function() return ConvertDamageType(13) end
____exports.DAMAGE_TYPE_MAGIC = function() return ConvertDamageType(14) end
____exports.DAMAGE_TYPE_SONIC = function() return ConvertDamageType(15) end
____exports.DAMAGE_TYPE_ACID = function() return ConvertDamageType(16) end
____exports.DAMAGE_TYPE_FORCE = function() return ConvertDamageType(17) end
____exports.DAMAGE_TYPE_DEATH = function() return ConvertDamageType(18) end
____exports.DAMAGE_TYPE_MIND = function() return ConvertDamageType(19) end
____exports.DAMAGE_TYPE_PLANT = function() return ConvertDamageType(20) end
____exports.DAMAGE_TYPE_DEFENSIVE = function() return ConvertDamageType(21) end
____exports.DAMAGE_TYPE_DEMOLITION = function() return ConvertDamageType(22) end
____exports.DAMAGE_TYPE_SLOW_POISON = function() return ConvertDamageType(23) end
____exports.DAMAGE_TYPE_SPIRIT_LINK = function() return ConvertDamageType(24) end
____exports.DAMAGE_TYPE_SHADOW_STRIKE = function() return ConvertDamageType(25) end
____exports.DAMAGE_TYPE_UNIVERSAL = function() return ConvertDamageType(26) end
____exports.WEAPON_TYPE_WHOKNOWS = function() return ConvertWeaponType(0) end
____exports.WEAPON_TYPE_METAL_LIGHT_CHOP = function() return ConvertWeaponType(1) end
____exports.WEAPON_TYPE_METAL_MEDIUM_CHOP = function() return ConvertWeaponType(2) end
____exports.WEAPON_TYPE_METAL_HEAVY_CHOP = function() return ConvertWeaponType(3) end
____exports.WEAPON_TYPE_METAL_LIGHT_SLICE = function() return ConvertWeaponType(4) end
____exports.WEAPON_TYPE_METAL_MEDIUM_SLICE = function() return ConvertWeaponType(5) end
____exports.WEAPON_TYPE_METAL_HEAVY_SLICE = function() return ConvertWeaponType(6) end
____exports.WEAPON_TYPE_METAL_MEDIUM_BASH = function() return ConvertWeaponType(7) end
____exports.WEAPON_TYPE_METAL_HEAVY_BASH = function() return ConvertWeaponType(8) end
____exports.WEAPON_TYPE_METAL_MEDIUM_STAB = function() return ConvertWeaponType(9) end
____exports.WEAPON_TYPE_METAL_HEAVY_STAB = function() return ConvertWeaponType(10) end
____exports.WEAPON_TYPE_WOOD_LIGHT_SLICE = function() return ConvertWeaponType(11) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_SLICE = function() return ConvertWeaponType(12) end
____exports.WEAPON_TYPE_WOOD_HEAVY_SLICE = function() return ConvertWeaponType(13) end
____exports.WEAPON_TYPE_WOOD_LIGHT_BASH = function() return ConvertWeaponType(14) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_BASH = function() return ConvertWeaponType(15) end
____exports.WEAPON_TYPE_WOOD_HEAVY_BASH = function() return ConvertWeaponType(16) end
____exports.WEAPON_TYPE_WOOD_LIGHT_STAB = function() return ConvertWeaponType(17) end
____exports.WEAPON_TYPE_WOOD_MEDIUM_STAB = function() return ConvertWeaponType(18) end
____exports.WEAPON_TYPE_CLAW_LIGHT_SLICE = function() return ConvertWeaponType(19) end
____exports.WEAPON_TYPE_CLAW_MEDIUM_SLICE = function() return ConvertWeaponType(20) end
____exports.WEAPON_TYPE_CLAW_HEAVY_SLICE = function() return ConvertWeaponType(21) end
____exports.WEAPON_TYPE_AXE_MEDIUM_CHOP = function() return ConvertWeaponType(22) end
____exports.WEAPON_TYPE_ROCK_HEAVY_BASH = function() return ConvertWeaponType(23) end
____exports.PATHING_TYPE_ANY = function() return ConvertPathingType(0) end
____exports.PATHING_TYPE_WALKABILITY = function() return ConvertPathingType(1) end
____exports.PATHING_TYPE_FLYABILITY = function() return ConvertPathingType(2) end
____exports.PATHING_TYPE_BUILDABILITY = function() return ConvertPathingType(3) end
____exports.PATHING_TYPE_PEONHARVESTPATHING = function() return ConvertPathingType(4) end
____exports.PATHING_TYPE_BLIGHTPATHING = function() return ConvertPathingType(5) end
____exports.PATHING_TYPE_FLOATABILITY = function() return ConvertPathingType(6) end
____exports.PATHING_TYPE_AMPHIBIOUSPATHING = function() return ConvertPathingType(7) end
____exports.RACE_PREF_HUMAN = function() return ConvertRacePref(1) end
____exports.RACE_PREF_ORC = function() return ConvertRacePref(2) end
____exports.RACE_PREF_NIGHTELF = function() return ConvertRacePref(4) end
____exports.RACE_PREF_UNDEAD = function() return ConvertRacePref(8) end
____exports.RACE_PREF_DEMON = function() return ConvertRacePref(16) end
____exports.RACE_PREF_RANDOM = function() return ConvertRacePref(32) end
____exports.RACE_PREF_USER_SELECTABLE = function() return ConvertRacePref(64) end
____exports.MAP_CONTROL_USER = function() return ConvertMapControl(0) end
____exports.MAP_CONTROL_COMPUTER = function() return ConvertMapControl(1) end
____exports.MAP_CONTROL_RESCUABLE = function() return ConvertMapControl(2) end
____exports.MAP_CONTROL_NEUTRAL = function() return ConvertMapControl(3) end
____exports.MAP_CONTROL_CREEP = function() return ConvertMapControl(4) end
____exports.MAP_CONTROL_NONE = function() return ConvertMapControl(5) end
____exports.GAME_TYPE_MELEE = function() return ConvertGameType(1) end
____exports.GAME_TYPE_FFA = function() return ConvertGameType(2) end
____exports.GAME_TYPE_USE_MAP_SETTINGS = function() return ConvertGameType(4) end
____exports.GAME_TYPE_BLIZ = function() return ConvertGameType(8) end
____exports.GAME_TYPE_ONE_ON_ONE = function() return ConvertGameType(16) end
____exports.GAME_TYPE_TWO_TEAM_PLAY = function() return ConvertGameType(32) end
____exports.GAME_TYPE_THREE_TEAM_PLAY = function() return ConvertGameType(64) end
____exports.GAME_TYPE_FOUR_TEAM_PLAY = function() return ConvertGameType(128) end
____exports.MAP_FOG_HIDE_TERRAIN = function() return ConvertMapFlag(1) end
____exports.MAP_FOG_MAP_EXPLORED = function() return ConvertMapFlag(2) end
____exports.MAP_FOG_ALWAYS_VISIBLE = function() return ConvertMapFlag(4) end
____exports.MAP_USE_HANDICAPS = function() return ConvertMapFlag(8) end
____exports.MAP_OBSERVERS = function() return ConvertMapFlag(16) end
____exports.MAP_OBSERVERS_ON_DEATH = function() return ConvertMapFlag(32) end
____exports.MAP_FIXED_COLORS = function() return ConvertMapFlag(128) end
____exports.MAP_LOCK_RESOURCE_TRADING = function() return ConvertMapFlag(256) end
____exports.MAP_RESOURCE_TRADING_ALLIES_ONLY = function() return ConvertMapFlag(512) end
____exports.MAP_LOCK_ALLIANCE_CHANGES = function() return ConvertMapFlag(1024) end
____exports.MAP_ALLIANCE_CHANGES_HIDDEN = function() return ConvertMapFlag(2048) end
____exports.MAP_CHEATS = function() return ConvertMapFlag(4096) end
____exports.MAP_CHEATS_HIDDEN = function() return ConvertMapFlag(8192) end
____exports.MAP_LOCK_SPEED = function() return ConvertMapFlag(8192 * 2) end
____exports.MAP_LOCK_RANDOM_SEED = function() return ConvertMapFlag(8192 * 4) end
____exports.MAP_SHARED_ADVANCED_CONTROL = function() return ConvertMapFlag(8192 * 8) end
____exports.MAP_RANDOM_HERO = function() return ConvertMapFlag(8192 * 16) end
____exports.MAP_RANDOM_RACES = function() return ConvertMapFlag(8192 * 32) end
____exports.MAP_RELOADED = function() return ConvertMapFlag(8192 * 64) end
____exports.MAP_PLACEMENT_RANDOM = function() return ConvertPlacement(0) end
____exports.MAP_PLACEMENT_FIXED = function() return ConvertPlacement(1) end
____exports.MAP_PLACEMENT_USE_MAP_SETTINGS = function() return ConvertPlacement(2) end
____exports.MAP_PLACEMENT_TEAMS_TOGETHER = function() return ConvertPlacement(3) end
____exports.MAP_LOC_PRIO_LOW = function() return ConvertStartLocPrio(0) end
____exports.MAP_LOC_PRIO_HIGH = function() return ConvertStartLocPrio(1) end
____exports.MAP_LOC_PRIO_NOT = function() return ConvertStartLocPrio(2) end
____exports.MAP_DENSITY_NONE = function() return ConvertMapDensity(0) end
____exports.MAP_DENSITY_LIGHT = function() return ConvertMapDensity(1) end
____exports.MAP_DENSITY_MEDIUM = function() return ConvertMapDensity(2) end
____exports.MAP_DENSITY_HEAVY = function() return ConvertMapDensity(3) end
____exports.MAP_DIFFICULTY_EASY = function() return ConvertGameDifficulty(0) end
____exports.MAP_DIFFICULTY_NORMAL = function() return ConvertGameDifficulty(1) end
____exports.MAP_DIFFICULTY_HARD = function() return ConvertGameDifficulty(2) end
____exports.MAP_DIFFICULTY_INSANE = function() return ConvertGameDifficulty(3) end
____exports.MAP_SPEED_SLOWEST = function() return ConvertGameSpeed(0) end
____exports.MAP_SPEED_SLOW = function() return ConvertGameSpeed(1) end
____exports.MAP_SPEED_FAST = function() return ConvertGameSpeed(3) end
____exports.MAP_SPEED_FASTEST = function() return ConvertGameSpeed(4) end
____exports.PLAYER_SLOT_STATE_EMPTY = function() return ConvertPlayerSlotState(0) end
____exports.PLAYER_SLOT_STATE_PLAYING = function() return ConvertPlayerSlotState(1) end
____exports.PLAYER_SLOT_STATE_LEFT = function() return ConvertPlayerSlotState(2) end
____exports.SOUND_VOLUMEGROUP_UNITMOVEMENT = function() return ConvertVolumeGroup(0) end
____exports.SOUND_VOLUMEGROUP_UNITSOUNDS = function() return ConvertVolumeGroup(1) end
____exports.SOUND_VOLUMEGROUP_COMBAT = function() return ConvertVolumeGroup(2) end
____exports.SOUND_VOLUMEGROUP_SPELLS = function() return ConvertVolumeGroup(3) end
____exports.SOUND_VOLUMEGROUP_UI = function() return ConvertVolumeGroup(4) end
____exports.SOUND_VOLUMEGROUP_MUSIC = function() return ConvertVolumeGroup(5) end
____exports.SOUND_VOLUMEGROUP_AMBIENTSOUNDS = function() return ConvertVolumeGroup(6) end
____exports.SOUND_VOLUMEGROUP_FIRE = function() return ConvertVolumeGroup(7) end
____exports.GAME_STATE_DIVINE_INTERVENTION = function() return ConvertIGameState(0) end
____exports.GAME_STATE_DISCONNECTED = function() return ConvertIGameState(1) end
____exports.GAME_STATE_TIME_OF_DAY = function() return ConvertFGameState(2) end
____exports.PLAYER_STATE_GAME_RESULT = function() return ConvertPlayerState(0) end
____exports.PLAYER_STATE_RESOURCE_GOLD = function() return ConvertPlayerState(1) end
____exports.PLAYER_STATE_RESOURCE_LUMBER = function() return ConvertPlayerState(2) end
____exports.PLAYER_STATE_RESOURCE_HERO_TOKENS = function() return ConvertPlayerState(3) end
____exports.PLAYER_STATE_RESOURCE_FOOD_CAP = function() return ConvertPlayerState(4) end
____exports.PLAYER_STATE_RESOURCE_FOOD_USED = function() return ConvertPlayerState(5) end
____exports.PLAYER_STATE_FOOD_CAP_CEILING = function() return ConvertPlayerState(6) end
____exports.PLAYER_STATE_GIVES_BOUNTY = function() return ConvertPlayerState(7) end
____exports.PLAYER_STATE_ALLIED_VICTORY = function() return ConvertPlayerState(8) end
____exports.PLAYER_STATE_PLACED = function() return ConvertPlayerState(9) end
____exports.PLAYER_STATE_OBSERVER_ON_DEATH = function() return ConvertPlayerState(10) end
____exports.PLAYER_STATE_OBSERVER = function() return ConvertPlayerState(11) end
____exports.PLAYER_STATE_UNFOLLOWABLE = function() return ConvertPlayerState(12) end
____exports.PLAYER_STATE_GOLD_UPKEEP_RATE = function() return ConvertPlayerState(13) end
____exports.PLAYER_STATE_LUMBER_UPKEEP_RATE = function() return ConvertPlayerState(14) end
____exports.PLAYER_STATE_GOLD_GATHERED = function() return ConvertPlayerState(15) end
____exports.PLAYER_STATE_LUMBER_GATHERED = function() return ConvertPlayerState(16) end
____exports.PLAYER_STATE_NO_CREEP_SLEEP = function() return ConvertPlayerState(25) end
____exports.UNIT_STATE_LIFE = function() return ConvertUnitState(0) end
____exports.UNIT_STATE_MAX_LIFE = function() return ConvertUnitState(1) end
____exports.UNIT_STATE_MANA = function() return ConvertUnitState(2) end
____exports.UNIT_STATE_MAX_MANA = function() return ConvertUnitState(3) end
____exports.UNIT_STATE_ATTACK_DICE = function() return ConvertUnitState(16) end
____exports.UNIT_STATE_ATTACK_SIDE = function() return ConvertUnitState(17) end
____exports.UNIT_STATE_ATTACK_WHITE = function() return ConvertUnitState(18) end
____exports.UNIT_STATE_ATTACK_BONUS = function() return ConvertUnitState(19) end
____exports.UNIT_STATE_ATTACK_MIX = function() return ConvertUnitState(20) end
____exports.UNIT_STATE_ATTACK_MAX = function() return ConvertUnitState(21) end
____exports.UNIT_STATE_ATTACK_RANGE = function() return ConvertUnitState(22) end
____exports.UNIT_STATE_DEFEND_WHITE = function() return ConvertUnitState(32) end
____exports.UNIT_STATE_ATTACK_SPACE = function() return ConvertUnitState(37) end
____exports.UNIT_STATE_ATTACK_SPEED = function() return ConvertUnitState(81) end
____exports.AI_DIFFICULTY_NEWBIE = function() return ConvertAIDifficulty(0) end
____exports.AI_DIFFICULTY_NORMAL = function() return ConvertAIDifficulty(1) end
____exports.AI_DIFFICULTY_INSANE = function() return ConvertAIDifficulty(2) end
____exports.PLAYER_SCORE_UNITS_TRAINED = function() return ConvertPlayerScore(0) end
____exports.PLAYER_SCORE_UNITS_KILLED = function() return ConvertPlayerScore(1) end
____exports.PLAYER_SCORE_STRUCT_BUILT = function() return ConvertPlayerScore(2) end
____exports.PLAYER_SCORE_STRUCT_RAZED = function() return ConvertPlayerScore(3) end
____exports.PLAYER_SCORE_TECH_PERCENT = function() return ConvertPlayerScore(4) end
____exports.PLAYER_SCORE_FOOD_MAXPROD = function() return ConvertPlayerScore(5) end
____exports.PLAYER_SCORE_FOOD_MAXUSED = function() return ConvertPlayerScore(6) end
____exports.PLAYER_SCORE_HEROES_KILLED = function() return ConvertPlayerScore(7) end
____exports.PLAYER_SCORE_ITEMS_GAINED = function() return ConvertPlayerScore(8) end
____exports.PLAYER_SCORE_MERCS_HIRED = function() return ConvertPlayerScore(9) end
____exports.PLAYER_SCORE_GOLD_MINED_TOTAL = function() return ConvertPlayerScore(10) end
____exports.PLAYER_SCORE_GOLD_MINED_UPKEEP = function() return ConvertPlayerScore(11) end
____exports.PLAYER_SCORE_GOLD_LOST_UPKEEP = function() return ConvertPlayerScore(12) end
____exports.PLAYER_SCORE_GOLD_LOST_TAX = function() return ConvertPlayerScore(13) end
____exports.PLAYER_SCORE_GOLD_GIVEN = function() return ConvertPlayerScore(14) end
____exports.PLAYER_SCORE_GOLD_RECEIVED = function() return ConvertPlayerScore(15) end
____exports.PLAYER_SCORE_LUMBER_TOTAL = function() return ConvertPlayerScore(16) end
____exports.PLAYER_SCORE_LUMBER_LOST_UPKEEP = function() return ConvertPlayerScore(17) end
____exports.PLAYER_SCORE_LUMBER_LOST_TAX = function() return ConvertPlayerScore(18) end
____exports.PLAYER_SCORE_LUMBER_GIVEN = function() return ConvertPlayerScore(19) end
____exports.PLAYER_SCORE_LUMBER_RECEIVED = function() return ConvertPlayerScore(20) end
____exports.PLAYER_SCORE_UNIT_TOTAL = function() return ConvertPlayerScore(21) end
____exports.PLAYER_SCORE_HERO_TOTAL = function() return ConvertPlayerScore(22) end
____exports.PLAYER_SCORE_RESOURCE_TOTAL = function() return ConvertPlayerScore(23) end
____exports.PLAYER_SCORE_TOTAL = function() return ConvertPlayerScore(24) end
____exports.EVENT_GAME_VICTORY = function() return ConvertGameEvent(0) end
____exports.EVENT_GAME_END_LEVEL = function() return ConvertGameEvent(1) end
____exports.EVENT_GAME_VARIABLE_LIMIT = function() return ConvertGameEvent(2) end
____exports.EVENT_GAME_STATE_LIMIT = function() return ConvertGameEvent(3) end
____exports.EVENT_GAME_TIMER_EXPIRED = function() return ConvertGameEvent(4) end
____exports.EVENT_GAME_ENTER_REGION = function() return ConvertGameEvent(5) end
____exports.EVENT_GAME_LEAVE_REGION = function() return ConvertGameEvent(6) end
____exports.EVENT_GAME_TRACKABLE_HIT = function() return ConvertGameEvent(7) end
____exports.EVENT_GAME_TRACKABLE_TRACK = function() return ConvertGameEvent(8) end
____exports.EVENT_GAME_SHOW_SKILL = function() return ConvertGameEvent(9) end
____exports.EVENT_GAME_BUILD_SUBMENU = function() return ConvertGameEvent(10) end
____exports.EVENT_PLAYER_STATE_LIMIT = function() return ConvertPlayerEvent(11) end
____exports.EVENT_PLAYER_ALLIANCE_CHANGED = function() return ConvertPlayerEvent(12) end
____exports.EVENT_PLAYER_DEFEAT = function() return ConvertPlayerEvent(13) end
____exports.EVENT_PLAYER_VICTORY = function() return ConvertPlayerEvent(14) end
____exports.EVENT_PLAYER_LEAVE = function() return ConvertPlayerEvent(15) end
____exports.EVENT_PLAYER_CHAT = function() return ConvertPlayerEvent(16) end
____exports.EVENT_PLAYER_END_CINEMATIC = function() return ConvertPlayerEvent(17) end
____exports.EVENT_PLAYER_UNIT_ATTACKED = function() return ConvertPlayerUnitEvent(18) end
____exports.EVENT_PLAYER_UNIT_RESCUED = function() return ConvertPlayerUnitEvent(19) end
____exports.EVENT_PLAYER_UNIT_DEATH = function() return ConvertPlayerUnitEvent(20) end
____exports.EVENT_PLAYER_UNIT_DECAY = function() return ConvertPlayerUnitEvent(21) end
____exports.EVENT_PLAYER_UNIT_DETECTED = function() return ConvertPlayerUnitEvent(22) end
____exports.EVENT_PLAYER_UNIT_HIDDEN = function() return ConvertPlayerUnitEvent(23) end
____exports.EVENT_PLAYER_UNIT_SELECTED = function() return ConvertPlayerUnitEvent(24) end
____exports.EVENT_PLAYER_UNIT_DESELECTED = function() return ConvertPlayerUnitEvent(25) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_START = function() return ConvertPlayerUnitEvent(26) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL = function() return ConvertPlayerUnitEvent(27) end
____exports.EVENT_PLAYER_UNIT_CONSTRUCT_FINISH = function() return ConvertPlayerUnitEvent(28) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_START = function() return ConvertPlayerUnitEvent(29) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_CANCEL = function() return ConvertPlayerUnitEvent(30) end
____exports.EVENT_PLAYER_UNIT_UPGRADE_FINISH = function() return ConvertPlayerUnitEvent(31) end
____exports.EVENT_PLAYER_UNIT_TRAIN_START = function() return ConvertPlayerUnitEvent(32) end
____exports.EVENT_PLAYER_UNIT_TRAIN_CANCEL = function() return ConvertPlayerUnitEvent(33) end
____exports.EVENT_PLAYER_UNIT_TRAIN_FINISH = function() return ConvertPlayerUnitEvent(34) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_START = function() return ConvertPlayerUnitEvent(35) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_CANCEL = function() return ConvertPlayerUnitEvent(36) end
____exports.EVENT_PLAYER_UNIT_RESEARCH_FINISH = function() return ConvertPlayerUnitEvent(37) end
____exports.EVENT_PLAYER_UNIT_ISSUED_ORDER = function() return ConvertPlayerUnitEvent(38) end
____exports.EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER = function() return ConvertPlayerUnitEvent(39) end
____exports.EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER = function() return ConvertPlayerUnitEvent(40) end
____exports.EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER = function() return ConvertPlayerUnitEvent(40) end
____exports.EVENT_PLAYER_HERO_LEVEL = function() return ConvertPlayerUnitEvent(41) end
____exports.EVENT_PLAYER_HERO_SKILL = function() return ConvertPlayerUnitEvent(42) end
____exports.EVENT_PLAYER_HERO_REVIVABLE = function() return ConvertPlayerUnitEvent(43) end
____exports.EVENT_PLAYER_HERO_REVIVE_START = function() return ConvertPlayerUnitEvent(44) end
____exports.EVENT_PLAYER_HERO_REVIVE_CANCEL = function() return ConvertPlayerUnitEvent(45) end
____exports.EVENT_PLAYER_HERO_REVIVE_FINISH = function() return ConvertPlayerUnitEvent(46) end
____exports.EVENT_PLAYER_UNIT_SUMMON = function() return ConvertPlayerUnitEvent(47) end
____exports.EVENT_PLAYER_UNIT_DROP_ITEM = function() return ConvertPlayerUnitEvent(48) end
____exports.EVENT_PLAYER_UNIT_PICKUP_ITEM = function() return ConvertPlayerUnitEvent(49) end
____exports.EVENT_PLAYER_UNIT_USE_ITEM = function() return ConvertPlayerUnitEvent(50) end
____exports.EVENT_PLAYER_UNIT_LOADED = function() return ConvertPlayerUnitEvent(51) end
____exports.EVENT_UNIT_DAMAGED = function() return ConvertUnitEvent(52) end
____exports.EVENT_UNIT_DEATH = function() return ConvertUnitEvent(53) end
____exports.EVENT_UNIT_DECAY = function() return ConvertUnitEvent(54) end
____exports.EVENT_UNIT_DETECTED = function() return ConvertUnitEvent(55) end
____exports.EVENT_UNIT_HIDDEN = function() return ConvertUnitEvent(56) end
____exports.EVENT_UNIT_SELECTED = function() return ConvertUnitEvent(57) end
____exports.EVENT_UNIT_DESELECTED = function() return ConvertUnitEvent(58) end
____exports.EVENT_UNIT_STATE_LIMIT = function() return ConvertUnitEvent(59) end
____exports.EVENT_UNIT_ACQUIRED_TARGET = function() return ConvertUnitEvent(60) end
____exports.EVENT_UNIT_TARGET_IN_RANGE = function() return ConvertUnitEvent(61) end
____exports.EVENT_UNIT_ATTACKED = function() return ConvertUnitEvent(62) end
____exports.EVENT_UNIT_RESCUED = function() return ConvertUnitEvent(63) end
____exports.EVENT_UNIT_CONSTRUCT_CANCEL = function() return ConvertUnitEvent(64) end
____exports.EVENT_UNIT_CONSTRUCT_FINISH = function() return ConvertUnitEvent(65) end
____exports.EVENT_UNIT_UPGRADE_START = function() return ConvertUnitEvent(66) end
____exports.EVENT_UNIT_UPGRADE_CANCEL = function() return ConvertUnitEvent(67) end
____exports.EVENT_UNIT_UPGRADE_FINISH = function() return ConvertUnitEvent(68) end
____exports.EVENT_UNIT_TRAIN_START = function() return ConvertUnitEvent(69) end
____exports.EVENT_UNIT_TRAIN_CANCEL = function() return ConvertUnitEvent(70) end
____exports.EVENT_UNIT_TRAIN_FINISH = function() return ConvertUnitEvent(71) end
____exports.EVENT_UNIT_RESEARCH_START = function() return ConvertUnitEvent(72) end
____exports.EVENT_UNIT_RESEARCH_CANCEL = function() return ConvertUnitEvent(73) end
____exports.EVENT_UNIT_RESEARCH_FINISH = function() return ConvertUnitEvent(74) end
____exports.EVENT_UNIT_ISSUED_ORDER = function() return ConvertUnitEvent(75) end
____exports.EVENT_UNIT_ISSUED_POINT_ORDER = function() return ConvertUnitEvent(76) end
____exports.EVENT_UNIT_ISSUED_TARGET_ORDER = function() return ConvertUnitEvent(77) end
____exports.EVENT_UNIT_HERO_LEVEL = function() return ConvertUnitEvent(78) end
____exports.EVENT_UNIT_HERO_SKILL = function() return ConvertUnitEvent(79) end
____exports.EVENT_UNIT_HERO_REVIVABLE = function() return ConvertUnitEvent(80) end
____exports.EVENT_UNIT_HERO_REVIVE_START = function() return ConvertUnitEvent(81) end
____exports.EVENT_UNIT_HERO_REVIVE_CANCEL = function() return ConvertUnitEvent(82) end
____exports.EVENT_UNIT_HERO_REVIVE_FINISH = function() return ConvertUnitEvent(83) end
____exports.EVENT_UNIT_SUMMON = function() return ConvertUnitEvent(84) end
____exports.EVENT_UNIT_DROP_ITEM = function() return ConvertUnitEvent(85) end
____exports.EVENT_UNIT_PICKUP_ITEM = function() return ConvertUnitEvent(86) end
____exports.EVENT_UNIT_USE_ITEM = function() return ConvertUnitEvent(87) end
____exports.EVENT_UNIT_LOADED = function() return ConvertUnitEvent(88) end
____exports.EVENT_WIDGET_DEATH = function() return ConvertWidgetEvent(89) end
____exports.EVENT_DIALOG_BUTTON_CLICK = function() return ConvertDialogEvent(90) end
____exports.EVENT_DIALOG_CLICK = function() return ConvertDialogEvent(91) end
____exports.EVENT_GAME_LOADED = function() return ConvertGameEvent(256) end
____exports.EVENT_GAME_TOURNAMENT_FINISH_SOON = function() return ConvertGameEvent(257) end
____exports.EVENT_GAME_TOURNAMENT_FINISH_NOW = function() return ConvertGameEvent(258) end
____exports.EVENT_GAME_SAVE = function() return ConvertGameEvent(259) end
____exports.EVENT_PLAYER_ARROW_LEFT_DOWN = function() return ConvertPlayerEvent(261) end
____exports.EVENT_PLAYER_ARROW_LEFT_UP = function() return ConvertPlayerEvent(262) end
____exports.EVENT_PLAYER_ARROW_RIGHT_DOWN = function() return ConvertPlayerEvent(263) end
____exports.EVENT_PLAYER_ARROW_RIGHT_UP = function() return ConvertPlayerEvent(264) end
____exports.EVENT_PLAYER_ARROW_DOWN_DOWN = function() return ConvertPlayerEvent(265) end
____exports.EVENT_PLAYER_ARROW_DOWN_UP = function() return ConvertPlayerEvent(266) end
____exports.EVENT_PLAYER_ARROW_UP_DOWN = function() return ConvertPlayerEvent(267) end
____exports.EVENT_PLAYER_ARROW_UP_UP = function() return ConvertPlayerEvent(268) end
____exports.EVENT_PLAYER_UNIT_SELL = function() return ConvertPlayerUnitEvent(269) end
____exports.EVENT_PLAYER_UNIT_CHANGE_OWNER = function() return ConvertPlayerUnitEvent(270) end
____exports.EVENT_PLAYER_UNIT_SELL_ITEM = function() return ConvertPlayerUnitEvent(271) end
____exports.EVENT_PLAYER_UNIT_SPELL_CHANNEL = function() return ConvertPlayerUnitEvent(272) end
____exports.EVENT_PLAYER_UNIT_SPELL_CAST = function() return ConvertPlayerUnitEvent(273) end
____exports.EVENT_PLAYER_UNIT_SPELL_EFFECT = function() return ConvertPlayerUnitEvent(274) end
____exports.EVENT_PLAYER_UNIT_SPELL_FINISH = function() return ConvertPlayerUnitEvent(275) end
____exports.EVENT_PLAYER_UNIT_SPELL_ENDCAST = function() return ConvertPlayerUnitEvent(276) end
____exports.EVENT_PLAYER_UNIT_PAWN_ITEM = function() return ConvertPlayerUnitEvent(277) end
____exports.EVENT_UNIT_SELL = function() return ConvertUnitEvent(286) end
____exports.EVENT_UNIT_CHANGE_OWNER = function() return ConvertUnitEvent(287) end
____exports.EVENT_UNIT_SELL_ITEM = function() return ConvertUnitEvent(288) end
____exports.EVENT_UNIT_SPELL_CHANNEL = function() return ConvertUnitEvent(289) end
____exports.EVENT_UNIT_SPELL_CAST = function() return ConvertUnitEvent(290) end
____exports.EVENT_UNIT_SPELL_EFFECT = function() return ConvertUnitEvent(291) end
____exports.EVENT_UNIT_SPELL_FINISH = function() return ConvertUnitEvent(292) end
____exports.EVENT_UNIT_SPELL_ENDCAST = function() return ConvertUnitEvent(293) end
____exports.EVENT_UNIT_PAWN_ITEM = function() return ConvertUnitEvent(294) end
____exports.LESS_THAN = function() return ConvertLimitOp(0) end
____exports.LESS_THAN_OR_EQUAL = function() return ConvertLimitOp(1) end
____exports.EQUAL = function() return ConvertLimitOp(2) end
____exports.GREATER_THAN_OR_EQUAL = function() return ConvertLimitOp(3) end
____exports.GREATER_THAN = function() return ConvertLimitOp(4) end
____exports.NOT_EQUAL = function() return ConvertLimitOp(5) end
____exports.UNIT_TYPE_HERO = function() return ConvertUnitType(0) end
____exports.UNIT_TYPE_DEAD = function() return ConvertUnitType(1) end
____exports.UNIT_TYPE_STRUCTURE = function() return ConvertUnitType(2) end
____exports.UNIT_TYPE_FLYING = function() return ConvertUnitType(3) end
____exports.UNIT_TYPE_GROUND = function() return ConvertUnitType(4) end
____exports.UNIT_TYPE_ATTACKS_FLYING = function() return ConvertUnitType(5) end
____exports.UNIT_TYPE_ATTACKS_GROUND = function() return ConvertUnitType(6) end
____exports.UNIT_TYPE_MELEE_ATTACKER = function() return ConvertUnitType(7) end
____exports.UNIT_TYPE_RANGED_ATTACKER = function() return ConvertUnitType(8) end
____exports.UNIT_TYPE_GIANT = function() return ConvertUnitType(9) end
____exports.UNIT_TYPE_SUMMONED = function() return ConvertUnitType(10) end
____exports.UNIT_TYPE_STUNNED = function() return ConvertUnitType(11) end
____exports.UNIT_TYPE_PLAGUED = function() return ConvertUnitType(12) end
____exports.UNIT_TYPE_SNARED = function() return ConvertUnitType(13) end
____exports.UNIT_TYPE_UNDEAD = function() return ConvertUnitType(14) end
____exports.UNIT_TYPE_MECHANICAL = function() return ConvertUnitType(15) end
____exports.UNIT_TYPE_PEON = function() return ConvertUnitType(16) end
____exports.UNIT_TYPE_SAPPER = function() return ConvertUnitType(17) end
____exports.UNIT_TYPE_TOWNHALL = function() return ConvertUnitType(18) end
____exports.UNIT_TYPE_ANCIENT = function() return ConvertUnitType(19) end
____exports.UNIT_TYPE_TAUREN = function() return ConvertUnitType(20) end
____exports.UNIT_TYPE_POISONED = function() return ConvertUnitType(21) end
____exports.UNIT_TYPE_POLYMORPHED = function() return ConvertUnitType(22) end
____exports.UNIT_TYPE_SLEEPING = function() return ConvertUnitType(23) end
____exports.UNIT_TYPE_RESISTANT = function() return ConvertUnitType(24) end
____exports.UNIT_TYPE_ETHEREAL = function() return ConvertUnitType(25) end
____exports.UNIT_TYPE_MAGIC_IMMUNE = function() return ConvertUnitType(26) end
____exports.ITEM_TYPE_PERMANENT = function() return ConvertItemType(0) end
____exports.ITEM_TYPE_CHARGED = function() return ConvertItemType(1) end
____exports.ITEM_TYPE_POWERUP = function() return ConvertItemType(2) end
____exports.ITEM_TYPE_ARTIFACT = function() return ConvertItemType(3) end
____exports.ITEM_TYPE_PURCHASABLE = function() return ConvertItemType(4) end
____exports.ITEM_TYPE_CAMPAIGN = function() return ConvertItemType(5) end
____exports.ITEM_TYPE_MISCELLANEOUS = function() return ConvertItemType(6) end
____exports.ITEM_TYPE_UNKNOWN = function() return ConvertItemType(7) end
____exports.ITEM_TYPE_ANY = function() return ConvertItemType(8) end
____exports.ITEM_TYPE_TOME = function() return ConvertItemType(2) end
____exports.CAMERA_FIELD_TARGET_DISTANCE = function() return ConvertCameraField(0) end
____exports.CAMERA_FIELD_FARZ = function() return ConvertCameraField(1) end
____exports.CAMERA_FIELD_ANGLE_OF_ATTACK = function() return ConvertCameraField(2) end
____exports.CAMERA_FIELD_FIELD_OF_VIEW = function() return ConvertCameraField(3) end
____exports.CAMERA_FIELD_ROLL = function() return ConvertCameraField(4) end
____exports.CAMERA_FIELD_ROTATION = function() return ConvertCameraField(5) end
____exports.CAMERA_FIELD_ZOFFSET = function() return ConvertCameraField(6) end
____exports.BLEND_MODE_NONE = function() return ConvertBlendMode(0) end
____exports.BLEND_MODE_DONT_CARE = function() return ConvertBlendMode(0) end
____exports.BLEND_MODE_KEYALPHA = function() return ConvertBlendMode(1) end
____exports.BLEND_MODE_BLEND = function() return ConvertBlendMode(2) end
____exports.BLEND_MODE_ADDITIVE = function() return ConvertBlendMode(3) end
____exports.BLEND_MODE_MODULATE = function() return ConvertBlendMode(4) end
____exports.BLEND_MODE_MODULATE_2X = function() return ConvertBlendMode(5) end
____exports.RARITY_FREQUENT = function() return ConvertRarityControl(0) end
____exports.RARITY_RARE = function() return ConvertRarityControl(1) end
____exports.TEXMAP_FLAG_NONE = function() return ConvertTexMapFlags(0) end
____exports.TEXMAP_FLAG_WRAP_U = function() return ConvertTexMapFlags(1) end
____exports.TEXMAP_FLAG_WRAP_V = function() return ConvertTexMapFlags(2) end
____exports.TEXMAP_FLAG_WRAP_UV = function() return ConvertTexMapFlags(3) end
____exports.FOG_OF_WAR_MASKED = function() return ConvertFogState(1) end
____exports.FOG_OF_WAR_FOGGED = function() return ConvertFogState(2) end
____exports.FOG_OF_WAR_VISIBLE = function() return ConvertFogState(4) end
____exports.CAMERA_MARGIN_LEFT = 0
____exports.CAMERA_MARGIN_RIGHT = 1
____exports.CAMERA_MARGIN_TOP = 2
____exports.CAMERA_MARGIN_BOTTOM = 3
____exports.EFFECT_TYPE_EFFECT = function() return ConvertEffectType(0) end
____exports.EFFECT_TYPE_TARGET = function() return ConvertEffectType(1) end
____exports.EFFECT_TYPE_CASTER = function() return ConvertEffectType(2) end
____exports.EFFECT_TYPE_SPECIAL = function() return ConvertEffectType(3) end
____exports.EFFECT_TYPE_AREA_EFFECT = function() return ConvertEffectType(4) end
____exports.EFFECT_TYPE_MISSILE = function() return ConvertEffectType(5) end
____exports.EFFECT_TYPE_LIGHTNING = function() return ConvertEffectType(6) end
____exports.SOUND_TYPE_EFFECT = function() return ConvertSoundType(0) end
____exports.SOUND_TYPE_EFFECT_LOOPED = function() return ConvertSoundType(1) end
____exports.EVENT_DAMAGE_DATA_VAILD = 0
____exports.EVENT_DAMAGE_DATA_IS_PHYSICAL = 1
____exports.EVENT_DAMAGE_DATA_IS_ATTACK = 2
____exports.EVENT_DAMAGE_DATA_IS_RANGED = 3
____exports.EVENT_DAMAGE_DATA_DAMAGE_TYPE = 4
____exports.EVENT_DAMAGE_DATA_WEAPON_TYPE = 5
____exports.EVENT_DAMAGE_DATA_ATTACK_TYPE = 6
____exports.MOVE_TYPE_NONE = 0
____exports.MOVE_TYPE_NOT = 1
____exports.MOVE_TYPE_FOOT = 2
____exports.MOVE_TYPE_FLY = 4
____exports.MOVE_TYPE_MINE = 8
____exports.MOVE_TYPE_WIND = 16
____exports.MOVE_TYPE_UN = 32
____exports.MOVE_TYPE_FLOAT = 64
____exports.MOVE_TYPE_AMPH = 128
____exports.COLLISION_TYPE_UNIT = 1
____exports.COLLISION_TYPE_BUILDING = 3
____exports.FRAME_ALIGN_LEFT_TOP = 0
____exports.FRAME_ALIGN_TOP = 1
____exports.FRAME_ALIGN_RIGHT_TOP = 2
____exports.FRAME_ALIGN_LEFT = 3
____exports.FRAME_ALIGN_CENTER = 4
____exports.FRAME_ALIGN_RIGHT = 5
____exports.FRAME_ALIGN_LEFT_BOTTOM = 6
____exports.FRAME_ALIGN_BOTTOM = 7
____exports.FRAME_ALIGN_RIGHT_BOTTOM = 8
____exports.FRAMEPOINT_BOTTOM = 7
____exports.FRAMEPOINT_BOTTOMLEFT = 6
____exports.FRAMEPOINT_BOTTOMRIGHT = 8
____exports.FRAMEPOINT_CENTER = 4
____exports.FRAMEPOINT_LEFT = 3
____exports.FRAMEPOINT_RIGHT = 5
____exports.FRAMEPOINT_TOP = 1
____exports.FRAMEPOINT_TOPLEFT = 0
____exports.FRAMEPOINT_TOPRIGHT = 2
____exports.MOUSE_ORDER_CLICK = 1
____exports.MOUSE_ORDER_ENTER = 2
____exports.MOUSE_ORDER_LEAVE = 3
____exports.MOUSE_ORDER_RELEASE = 4
____exports.MOUSE_ORDER_SCROLL = 6
____exports.MOUSE_ORDER_DOUBLE_CLICK = 12
____exports.GAME_KEY_MOUSE_LEFT = 1
____exports.GAME_KEY_MOUSE_RIGHT = 2
____exports.GAME_KEY_A = 65
____exports.GAME_KEY_B = 66
____exports.GAME_KEY_C = 67
____exports.GAME_KEY_D = 68
____exports.GAME_KEY_E = 69
____exports.GAME_KEY_F = 70
____exports.GAME_KEY_G = 71
____exports.GAME_KEY_H = 72
____exports.GAME_KEY_I = 73
____exports.GAME_KEY_J = 74
____exports.GAME_KEY_K = 75
____exports.GAME_KEY_L = 76
____exports.GAME_KEY_M = 77
____exports.GAME_KEY_N = 78
____exports.GAME_KEY_O = 79
____exports.GAME_KEY_P = 80
____exports.GAME_KEY_Q = 81
____exports.GAME_KEY_R = 82
____exports.GAME_KEY_S = 83
____exports.GAME_KEY_T = 84
____exports.GAME_KEY_U = 85
____exports.GAME_KEY_V = 86
____exports.GAME_KEY_W = 87
____exports.GAME_KEY_X = 88
____exports.GAME_KEY_Y = 89
____exports.GAME_KEY_Z = 90
____exports.GAME_KEY_0 = 48
____exports.GAME_KEY_1 = 49
____exports.GAME_KEY_2 = 50
____exports.GAME_KEY_3 = 51
____exports.GAME_KEY_4 = 52
____exports.GAME_KEY_5 = 53
____exports.GAME_KEY_6 = 53
____exports.GAME_KEY_7 = 55
____exports.GAME_KEY_8 = 56
____exports.GAME_KEY_9 = 57
____exports.GAME_KEY_TAB = 9
____exports.GAME_KEY_SPACE = 32
____exports.GAME_KEY_ENTER = 513
____exports.GAME_KEY_BACKSPACE = 514
____exports.GAME_KEY_SHIFT = 0
____exports.GAME_KEY_RIGHT = 516
____exports.GAME_KEY_UP = 517
____exports.GAME_KEY_LEFT = 518
____exports.GAME_KEY_DOWN = 519
____exports.GAME_KEY_ACTION_PRESS = 1
____exports.GAME_KEY_ACTION_RELEASE = 0
____exports.TEXT_ALIGN_LEFT_TOP = 11
____exports.TEXT_ALIGN_TOP = 17
____exports.TEXT_ALIGN_RIGHT_TOP = 37
____exports.TEXT_ALIGN_CENTER = 18
____exports.TEXT_ALIGN_LEFT = 10
____exports.TEXT_ALIGN_RIGHT = 34
____exports.TEXT_ALIGN_LEFT_BOTTOM = 12
____exports.TEXT_ALIGN_BOTTOM = 20
____exports.TEXT_ALIGN_RIGHT_BOTTOM = 36
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.handle"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local WeakMap
do
    WeakMap = __TS__Class()
    WeakMap.name = "WeakMap"
    function WeakMap.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "WeakMap"
        self.items = {}
        setmetatable(self.items, {__mode = "k"})
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self.items[value[1]] = value[2]
            end
        else
            for ____, kvp in ipairs(entries) do
                self.items[kvp[1]] = kvp[2]
            end
        end
    end
    function WeakMap.prototype.delete(self, key)
        local contains = self:has(key)
        self.items[key] = nil
        return contains
    end
    function WeakMap.prototype.get(self, key)
        return self.items[key]
    end
    function WeakMap.prototype.has(self, key)
        return self.items[key] ~= nil
    end
    function WeakMap.prototype.set(self, key, value)
        self.items[key] = value
        return self
    end
    WeakMap[Symbol.species] = WeakMap
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
---
-- @noSelfInFile
local map = __TS__New(WeakMap)
____exports.Handle = __TS__Class()
local Handle = ____exports.Handle
Handle.name = "Handle"
function Handle.prototype.____constructor(self, handle)
    self.handle = handle == nil and ____exports.Handle.initHandle or handle
    map:set(self.handle, self)
end
function Handle.initFromHandle(self)
    return ____exports.Handle.initHandle ~= nil
end
function Handle.getObject(self, handle)
    local obj = map:get(handle)
    if obj ~= nil then
        return obj
    end
    ____exports.Handle.initHandle = handle
    local newObj = __TS__New(self)
    ____exports.Handle.initHandle = nil
    return newObj
end
__TS__SetDescriptor(
    Handle.prototype,
    "id",
    {get = function(self)
        return GetHandleId(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.force"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____player = require("lua_modules.@eiriksgata.wc3ts.src.handles.player")
local MapPlayer = ____player.MapPlayer
____exports.Force = __TS__Class()
local Force = ____exports.Force
Force.name = "Force"
__TS__ClassExtends(Force, Handle)
function Force.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateForce()
    if handle == nil then
        Error(nil, "w3ts failed to create force handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Force.create(self)
    local handle = CreateForce()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Force.prototype.addPlayer(self, whichPlayer)
    ForceAddPlayer(self.handle, whichPlayer.handle)
end
function Force.prototype.clear(self)
    ForceClear(self.handle)
end
function Force.prototype.destroy(self)
    DestroyForce(self.handle)
end
function Force.prototype.enumAllies(self, whichPlayer, filter)
    ForceEnumAllies(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Force.prototype.enumEnemies(self, whichPlayer, filter)
    ForceEnumEnemies(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Force.prototype.enumPlayers(self, filter)
    ForceEnumPlayers(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Force.prototype.enumPlayersCounted(self, filter, countLimit)
    ForceEnumPlayersCounted(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
Force.prototype["for"] = function(self, callback)
    ForForce(self.handle, callback)
end
function Force.prototype.getPlayers(self)
    local players = {}
    ForForce(
        self.handle,
        function()
            local pl = MapPlayer:fromEnum()
            if pl then
                players[#players + 1] = pl
            end
        end
    )
    return players
end
function Force.prototype.hasPlayer(self, whichPlayer)
    return IsPlayerInForce(whichPlayer.handle, self.handle)
end
function Force.prototype.removePlayer(self, whichPlayer)
    ForceRemovePlayer(self.handle, whichPlayer.handle)
end
function Force.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.point"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Point = __TS__Class()
local Point = ____exports.Point
Point.name = "Point"
__TS__ClassExtends(Point, Handle)
function Point.prototype.____constructor(self, x, y)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Location(x, y)
    if handle == nil then
        Error(nil, "w3ts failed to create player handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Point.create(self, x, y)
    local handle = Location(x, y)
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Point.prototype.destroy(self)
    RemoveLocation(self.handle)
end
function Point.prototype.setPosition(self, x, y)
    MoveLocation(self.handle, x, y)
end
function Point.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Point.prototype,
    "x",
    {
        get = function(self)
            return GetLocationX(self.handle)
        end,
        set = function(self, value)
            MoveLocation(self.handle, value, self.y)
        end
    },
    true
)
__TS__SetDescriptor(
    Point.prototype,
    "y",
    {
        get = function(self)
            return GetLocationY(self.handle)
        end,
        set = function(self, value)
            MoveLocation(self.handle, self.x, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Point.prototype,
    "z",
    {get = function(self)
        return GetLocationZ(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.player"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.MapPlayer = __TS__Class()
local MapPlayer = ____exports.MapPlayer
MapPlayer.name = "MapPlayer"
__TS__ClassExtends(MapPlayer, Handle)
function MapPlayer.prototype.____constructor(self, index)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Player(index)
    if handle == nil then
        Error(nil, "w3ts failed to create player handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function MapPlayer.create(self, index)
    local handle = Player(index)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function MapPlayer.prototype.addTechResearched(self, techId, levels)
    AddPlayerTechResearched(self.handle, techId, levels)
end
function MapPlayer.prototype.cacheHeroData(self)
    CachePlayerHeroData(self.handle)
end
function MapPlayer.prototype.compareAlliance(self, otherPlayer, whichAllianceSetting)
    return GetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting)
end
function MapPlayer.prototype.coordsFogged(self, x, y)
    return IsFoggedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsMasked(self, x, y)
    return IsMaskedToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.coordsVisible(self, x, y)
    return IsVisibleToPlayer(x, y, self.handle)
end
function MapPlayer.prototype.cripple(self, toWhichPlayers, flag)
    CripplePlayer(self.handle, toWhichPlayers.handle, flag)
end
function MapPlayer.prototype.getScore(self, whichPlayerScore)
    return GetPlayerScore(self.handle, whichPlayerScore)
end
function MapPlayer.prototype.getState(self, whichPlayerState)
    return GetPlayerState(self.handle, whichPlayerState)
end
function MapPlayer.prototype.getStructureCount(self, includeIncomplete)
    return GetPlayerStructureCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getTaxRate(self, otherPlayer, whichResource)
    return GetPlayerTaxRate(self.handle, otherPlayer, whichResource)
end
function MapPlayer.prototype.getTechCount(self, techId, specificonly)
    return GetPlayerTechCount(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getTechMaxAllowed(self, techId)
    return GetPlayerTechMaxAllowed(self.handle, techId)
end
function MapPlayer.prototype.getTechResearched(self, techId, specificonly)
    return GetPlayerTechResearched(self.handle, techId, specificonly)
end
function MapPlayer.prototype.getUnitCount(self, includeIncomplete)
    return GetPlayerUnitCount(self.handle, includeIncomplete)
end
function MapPlayer.prototype.getUnitCountByType(self, unitName, includeIncomplete, includeUpgrades)
    return GetPlayerTypedUnitCount(self.handle, unitName, includeIncomplete, includeUpgrades)
end
function MapPlayer.prototype.inForce(self, whichForce)
    return IsPlayerInForce(self.handle, whichForce.handle)
end
function MapPlayer.prototype.isLocal(self)
    return GetLocalPlayer() == self.handle
end
function MapPlayer.prototype.isObserver(self)
    return IsPlayerObserver(self.handle)
end
function MapPlayer.prototype.isPlayerAlly(self, otherPlayer)
    return IsPlayerAlly(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isPlayerEnemy(self, otherPlayer)
    return IsPlayerEnemy(self.handle, otherPlayer.handle)
end
function MapPlayer.prototype.isRacePrefSet(self, pref)
    return IsPlayerRacePrefSet(self.handle, pref)
end
function MapPlayer.prototype.isSelectable(self)
    return GetPlayerSelectable(self.handle)
end
function MapPlayer.prototype.pointFogged(self, whichPoint)
    return IsLocationFoggedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointMasked(self, whichPoint)
    return IsLocationMaskedToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.pointVisible(self, whichPoint)
    return IsLocationVisibleToPlayer(whichPoint.handle, self.handle)
end
function MapPlayer.prototype.remove(self, gameResult)
    RemovePlayer(self.handle, gameResult)
end
function MapPlayer.prototype.removeAllGuardPositions(self)
    RemoveAllGuardPositions(self.handle)
end
function MapPlayer.prototype.setAbilityAvailable(self, abilId, avail)
    SetPlayerAbilityAvailable(self.handle, abilId, avail)
end
function MapPlayer.prototype.setAlliance(self, otherPlayer, whichAllianceSetting, value)
    SetPlayerAlliance(self.handle, otherPlayer.handle, whichAllianceSetting, value)
end
function MapPlayer.prototype.setOnScoreScreen(self, flag)
    SetPlayerOnScoreScreen(self.handle, flag)
end
function MapPlayer.prototype.setState(self, whichPlayerState, value)
    SetPlayerState(self.handle, whichPlayerState, value)
end
function MapPlayer.prototype.setTaxRate(self, otherPlayer, whichResource, rate)
    SetPlayerTaxRate(self.handle, otherPlayer.handle, whichResource, rate)
end
function MapPlayer.prototype.setTechMaxAllowed(self, techId, maximum)
    SetPlayerTechMaxAllowed(self.handle, techId, maximum)
end
function MapPlayer.prototype.setTechResearched(self, techId, setToLevel)
    SetPlayerTechResearched(self.handle, techId, setToLevel)
end
function MapPlayer.prototype.setUnitsOwner(self, newOwner)
    SetPlayerUnitsOwner(self.handle, newOwner)
end
function MapPlayer.fromEnum(self)
    return ____exports.MapPlayer:fromHandle(GetEnumPlayer())
end
function MapPlayer.fromEvent(self)
    return ____exports.MapPlayer:fromHandle(GetTriggerPlayer())
end
function MapPlayer.fromFilter(self)
    return ____exports.MapPlayer:fromHandle(GetFilterPlayer())
end
function MapPlayer.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function MapPlayer.fromIndex(self, index)
    return self:fromHandle(Player(index))
end
function MapPlayer.fromLocal(self)
    local pl = GetLocalPlayer()
    if pl == nil then
        do
            local i = 0
            while i < 10 do
                DisplayTextToPlayer(
                    Player(0),
                    0,
                    0,
                    "$$$$$$$$$ LOCAL PLAYER IS NULL. TELL ME"
                )
                i = i + 1
            end
        end
    end
    return self:fromHandle(pl)
end
__TS__SetDescriptor(
    MapPlayer.prototype,
    "color",
    {
        get = function(self)
            return GetPlayerColor(self.handle)
        end,
        set = function(self, color)
            SetPlayerColor(self.handle, color)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "controller",
    {get = function(self)
        return GetPlayerController(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "handicap",
    {
        get = function(self)
            return GetPlayerHandicap(self.handle)
        end,
        set = function(self, handicap)
            SetPlayerHandicap(self.handle, handicap)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "handicapXp",
    {
        get = function(self)
            return GetPlayerHandicapXP(self.handle)
        end,
        set = function(self, handicap)
            SetPlayerHandicapXP(self.handle, handicap)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "id",
    {get = function(self)
        return GetPlayerId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "name",
    {
        get = function(self)
            return GetPlayerName(self.handle) or ""
        end,
        set = function(self, value)
            SetPlayerName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "race",
    {get = function(self)
        return GetPlayerRace(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "slotState",
    {get = function(self)
        return GetPlayerSlotState(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocation",
    {get = function(self)
        return GetPlayerStartLocation(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationX",
    {get = function(self)
        return GetStartLocationX(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationY",
    {get = function(self)
        return GetStartLocationY(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "startLocationPoint",
    {get = function(self)
        return GetStartLocationLoc(self.startLocation)
    end},
    true
)
__TS__SetDescriptor(
    MapPlayer.prototype,
    "team",
    {get = function(self)
        return GetPlayerTeam(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.camera"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = type(key) == "number" and key + 1 or key
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = desc.get ~= nil or desc.set ~= nil
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        local ____desc_set_4 = desc.set
        local ____desc_get_5 = desc.get
        local ____desc_configurable_0 = desc.configurable
        if ____desc_configurable_0 == nil then
            ____desc_configurable_0 = valueExists
        end
        local ____desc_enumerable_1 = desc.enumerable
        if ____desc_enumerable_1 == nil then
            ____desc_enumerable_1 = valueExists
        end
        local ____desc_writable_2 = desc.writable
        if ____desc_writable_2 == nil then
            ____desc_writable_2 = valueExists
        end
        local ____temp_3
        if desc.value ~= nil then
            ____temp_3 = desc.value
        else
            ____temp_3 = value
        end
        descriptor = {
            set = ____desc_set_4,
            get = ____desc_get_5,
            configurable = ____desc_configurable_0,
            enumerable = ____desc_enumerable_1,
            writable = ____desc_writable_2,
            value = ____temp_3
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____point = require("lua_modules.@eiriksgata.wc3ts.src.handles.point")
local Point = ____point.Point
____exports.Camera = __TS__Class()
local Camera = ____exports.Camera
Camera.name = "Camera"
function Camera.prototype.____constructor(self)
end
function Camera.adjustField(self, whichField, offset, duration)
    AdjustCameraField(whichField, offset, duration)
end
function Camera.endCinematicScene(self)
    EndCinematicScene()
end
function Camera.forceCinematicSubtitles(self, flag)
    ForceCinematicSubtitles(flag)
end
function Camera.getField(self, field)
    return GetCameraField(field)
end
function Camera.getMargin(self, whichMargin)
    return GetCameraMargin(whichMargin)
end
function Camera.pan(self, x, y, zOffsetDest)
    if zOffsetDest == nil then
        PanCameraTo(x, y)
    else
        PanCameraToWithZ(x, y, zOffsetDest)
    end
end
function Camera.panTimed(self, x, y, duration, zOffsetDest)
    if zOffsetDest == nil then
        PanCameraToTimed(x, y, duration)
    else
        PanCameraToTimedWithZ(x, y, zOffsetDest, duration)
    end
end
function Camera.reset(self, duration)
    ResetToGameCamera(duration)
end
function Camera.setBounds(self, x1, y1, x2, y2, x3, y3, x4, y4)
    SetCameraBounds(
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        x4,
        y4
    )
end
function Camera.setCameraOrientController(self, whichUnit, xOffset, yOffset)
    SetCameraOrientController(whichUnit, xOffset, yOffset)
end
function Camera.setCineFilterBlendMode(self, whichMode)
    SetCineFilterBlendMode(whichMode)
end
function Camera.setCineFilterDuration(self, duration)
    SetCineFilterDuration(duration)
end
function Camera.setCineFilterEndColor(self, red, green, blue, alpha)
    SetCineFilterEndColor(red, green, blue, alpha)
end
function Camera.setCineFilterEndUV(self, minU, minV, maxU, maxV)
    SetCineFilterEndUV(minU, minV, maxU, maxV)
end
function Camera.setCineFilterStartColor(self, red, green, blue, alpha)
    SetCineFilterStartColor(red, green, blue, alpha)
end
function Camera.setCineFilterStartUV(self, minU, minV, maxU, maxV)
    SetCineFilterStartUV(minU, minV, maxU, maxV)
end
function Camera.setCineFilterTexMapFlags(self, whichFlags)
    SetCineFilterTexMapFlags(whichFlags)
end
function Camera.setCineFilterTexture(self, fileName)
    SetCineFilterTexture(fileName)
end
function Camera.setCinematicCamera(self, cameraModelFile)
    SetCinematicCamera(cameraModelFile)
end
function Camera.SetCinematicScene(self, portraitUnitId, color, speakerTitle, text, sceneDuration, voiceoverDuration)
    SetCinematicScene(
        portraitUnitId,
        color,
        speakerTitle,
        text,
        sceneDuration,
        voiceoverDuration
    )
end
function Camera.setField(self, whichField, value, duration)
    SetCameraField(whichField, value, duration)
end
function Camera.setPos(self, x, y)
    SetCameraPosition(x, y)
end
function Camera.setRotateMode(self, x, y, radiansToSweep, duration)
    SetCameraRotateMode(x, y, radiansToSweep, duration)
end
function Camera.setSmoothingFactor(self, factor)
    CameraSetSmoothingFactor(factor)
end
function Camera.setSourceNoise(self, mag, velocity, vertOnly)
    if vertOnly == nil then
        vertOnly = false
    end
    CameraSetSourceNoiseEx(mag, velocity, vertOnly)
end
function Camera.setTargetController(self, whichUnit, xOffset, yOffset, inheritOrientation)
    SetCameraTargetController(whichUnit, xOffset, yOffset, inheritOrientation)
end
function Camera.setTargetNoise(self, mag, velocity, vertOnly)
    if vertOnly == nil then
        vertOnly = false
    end
    CameraSetTargetNoiseEx(mag, velocity, vertOnly)
end
function Camera.stop(self)
    StopCamera()
end
__TS__ObjectDefineProperty(
    Camera,
    "visible",
    {
        get = function(self)
            return IsCineFilterDisplayed()
        end,
        set = function(self, flag)
            DisplayCineFilter(flag)
        end
    }
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMinX",
    {get = function(self)
        return GetCameraBoundMinX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMinY",
    {get = function(self)
        return GetCameraBoundMinY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMaxX",
    {get = function(self)
        return GetCameraBoundMaxX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "boundMaxY",
    {get = function(self)
        return GetCameraBoundMaxY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetX",
    {get = function(self)
        return GetCameraTargetPositionX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetY",
    {get = function(self)
        return GetCameraTargetPositionY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetZ",
    {get = function(self)
        return GetCameraTargetPositionZ()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyeX",
    {get = function(self)
        return GetCameraEyePositionX()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyeY",
    {get = function(self)
        return GetCameraEyePositionY()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyeZ",
    {get = function(self)
        return GetCameraEyePositionZ()
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "eyePoint",
    {get = function(self)
        return Point:fromHandle(GetCameraEyePositionLoc())
    end}
)
__TS__ObjectDefineProperty(
    Camera,
    "targetPoint",
    {get = function(self)
        return Point:fromHandle(GetCameraTargetPositionLoc())
    end}
)
____exports.CameraSetup = __TS__Class()
local CameraSetup = ____exports.CameraSetup
CameraSetup.name = "CameraSetup"
__TS__ClassExtends(CameraSetup, Handle)
function CameraSetup.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateCameraSetup()
    if handle == nil then
        error(
            __TS__New(Error, "w3ts failed to create camerasetup handle."),
            0
        )
    end
    Handle.prototype.____constructor(self, handle)
end
function CameraSetup.create(self)
    local handle = CreateCameraSetup()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function CameraSetup.prototype.apply(self, doPan, panTimed)
    CameraSetupApply(self.handle, doPan, panTimed)
end
function CameraSetup.prototype.applyForceDuration(self, doPan, forceDuration)
    CameraSetupApplyForceDuration(self.handle, doPan, forceDuration)
end
function CameraSetup.prototype.applyForceDurationSmooth(self, doPan, forcedDuration, easeInDuration, easeOutDuration, smoothFactor)
end
function CameraSetup.prototype.applyForceDurationZ(self, zDestOffset, forceDuration)
    CameraSetupApplyForceDurationWithZ(self.handle, zDestOffset, forceDuration)
end
function CameraSetup.prototype.applyZ(self, zDestOffset)
    CameraSetupApplyWithZ(self.handle, zDestOffset)
end
function CameraSetup.prototype.getField(self, whichField)
    return CameraSetupGetField(self.handle, whichField)
end
function CameraSetup.prototype.setDestPos(self, x, y, duration)
    CameraSetupSetDestPosition(self.handle, x, y, duration)
end
function CameraSetup.prototype.setField(self, whichField, value, duration)
    CameraSetupSetField(self.handle, whichField, value, duration)
end
function CameraSetup.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    CameraSetup.prototype,
    "destPoint",
    {get = function(self)
        return Point:fromHandle(CameraSetupGetDestPositionLoc(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    CameraSetup.prototype,
    "destX",
    {
        get = function(self)
            return CameraSetupGetDestPositionX(self.handle)
        end,
        set = function(self, x)
            CameraSetupSetDestPosition(self.handle, x, self.destY, 0)
        end
    },
    true
)
__TS__SetDescriptor(
    CameraSetup.prototype,
    "destY",
    {
        get = function(self)
            return CameraSetupGetDestPositionY(self.handle)
        end,
        set = function(self, y)
            CameraSetupSetDestPosition(self.handle, self.destX, y, 0)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.widget"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Widget = __TS__Class()
local Widget = ____exports.Widget
Widget.name = "Widget"
__TS__ClassExtends(Widget, Handle)
function Widget.fromEvent(self)
    return self:fromHandle(GetTriggerWidget())
end
function Widget.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Widget.prototype,
    "life",
    {
        get = function(self)
            return GetWidgetLife(self.handle)
        end,
        set = function(self, value)
            SetWidgetLife(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Widget.prototype,
    "x",
    {get = function(self)
        return GetWidgetX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Widget.prototype,
    "y",
    {get = function(self)
        return GetWidgetY(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.destructable"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____widget = require("lua_modules.@eiriksgata.wc3ts.src.handles.widget")
local Widget = ____widget.Widget
____exports.Destructable = __TS__Class()
local Destructable = ____exports.Destructable
Destructable.name = "Destructable"
__TS__ClassExtends(Destructable, Widget)
function Destructable.prototype.____constructor(self, objectId, x, y, z, face, scale, variation)
    if Handle:initFromHandle() then
        Widget.prototype.____constructor(self)
        return
    end
    local handle = CreateDestructableZ(
        objectId,
        x,
        y,
        z,
        face,
        scale,
        variation
    )
    if handle == nil then
        Error(nil, "w3ts failed to create destructable handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Destructable.create(self, objectId, x, y, face, scale, variation, skinId)
    if face == nil then
        face = 0
    end
    if scale == nil then
        scale = 1
    end
    if variation == nil then
        variation = 0
    end
    local handle
    if skinId ~= nil then
        handle = CreateDestructable(
            objectId,
            x,
            y,
            face,
            scale,
            variation
        )
    end
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        if skinId ~= nil then
            values.skin = skinId
        end
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Destructable.createZ(self, objectId, x, y, z, face, scale, variation, skinId)
    if face == nil then
        face = 0
    end
    if scale == nil then
        scale = 1
    end
    if variation == nil then
        variation = 0
    end
    local handle
    if skinId ~= nil then
        handle = CreateDestructableZ(
            objectId,
            x,
            y,
            z,
            face,
            scale,
            variation
        )
    end
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        if skinId ~= nil then
            values.skin = skinId
        end
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Destructable.prototype.destroy(self)
    RemoveDestructable(self.handle)
end
function Destructable.prototype.heal(self, life, birth)
    DestructableRestoreLife(self.handle, life, birth)
end
function Destructable.prototype.kill(self)
    KillDestructable(self.handle)
end
function Destructable.prototype.queueAnim(self, whichAnimation)
    QueueDestructableAnimation(self.handle, whichAnimation)
end
function Destructable.prototype.setAnim(self, whichAnimation)
    SetDestructableAnimation(self.handle, whichAnimation)
end
function Destructable.prototype.setAnimSpeed(self, speedFactor)
    SetDestructableAnimationSpeed(self.handle, speedFactor)
end
function Destructable.prototype.show(self, flag)
    ShowDestructable(self.handle, flag)
end
function Destructable.fromEvent(self)
    return self:fromHandle(GetTriggerDestructable())
end
function Destructable.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Destructable.prototype,
    "invulnerable",
    {
        get = function(self)
            return IsDestructableInvulnerable(self.handle)
        end,
        set = function(self, flag)
            SetDestructableInvulnerable(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "life",
    {
        get = function(self)
            return GetDestructableLife(self.handle)
        end,
        set = function(self, value)
            SetDestructableLife(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "maxLife",
    {
        get = function(self)
            return GetDestructableMaxLife(self.handle)
        end,
        set = function(self, value)
            SetDestructableMaxLife(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "name",
    {get = function(self)
        return GetDestructableName(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "occluderHeight",
    {
        get = function(self)
            return GetDestructableOccluderHeight(self.handle)
        end,
        set = function(self, value)
            SetDestructableOccluderHeight(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "typeId",
    {get = function(self)
        return GetDestructableTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "x",
    {get = function(self)
        return GetDestructableX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Destructable.prototype,
    "y",
    {get = function(self)
        return GetDestructableY(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.dialog"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.DialogButton = __TS__Class()
local DialogButton = ____exports.DialogButton
DialogButton.name = "DialogButton"
__TS__ClassExtends(DialogButton, Handle)
function DialogButton.prototype.____constructor(self, whichDialog, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle
    if quit == false then
        handle = DialogAddButton(whichDialog.handle, text, hotkey)
    else
        handle = DialogAddQuitButton(whichDialog.handle, score, text, hotkey)
    end
    if handle == nil then
        Error(nil, "w3ts failed to create button handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function DialogButton.create(self, whichDialog, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    local handle
    if quit == false then
        handle = DialogAddButton(whichDialog.handle, text, hotkey)
    else
        handle = DialogAddQuitButton(whichDialog.handle, score, text, hotkey)
    end
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function DialogButton.fromEvent(self)
    return self:fromHandle(GetClickedButton())
end
function DialogButton.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
---
-- @example Create a simple dialog.
-- ```ts
-- const dialog = Dialog.create();
-- if (dialog) {
-- const trigger = Trigger.create();
-- 
-- trigger.registerDialogEvent(dialog);
-- trigger.addAction(() => {
-- const clicked = DialogButton.fromEvent();
-- });
-- 
-- Timer.create().start(1.00, false, () => {
-- DialogButton.create(dialog, "Stay", 0);
-- DialogButton.create(dialog, "Leave", 0, true);
-- 
-- dialog.setMessage("Welcome to TypeScript!");
-- dialog.display(Players[0], true);
-- });
-- }
-- ```
____exports.Dialog = __TS__Class()
local Dialog = ____exports.Dialog
Dialog.name = "Dialog"
__TS__ClassExtends(Dialog, Handle)
function Dialog.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = DialogCreate()
    if handle == nil then
        Error(nil, "w3ts failed to create dialog handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Dialog.create(self)
    local handle = DialogCreate()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Dialog.prototype.addButton(self, text, hotkey, quit, score)
    if hotkey == nil then
        hotkey = 0
    end
    if quit == nil then
        quit = false
    end
    if score == nil then
        score = false
    end
    return ____exports.DialogButton:create(
        self,
        text,
        hotkey,
        quit,
        score
    )
end
function Dialog.prototype.clear(self)
    DialogClear(self.handle)
end
function Dialog.prototype.destroy(self)
    DialogDestroy(self.handle)
end
function Dialog.prototype.display(self, whichPlayer, flag)
    DialogDisplay(whichPlayer.handle, self.handle, flag)
end
function Dialog.prototype.setMessage(self, whichMessage)
    DialogSetMessage(self.handle, whichMessage)
end
function Dialog.fromEvent(self)
    return self:fromHandle(GetClickedDialog())
end
function Dialog.fromHandle(self, handle)
    local ____handle_1
    if handle then
        ____handle_1 = self:getObject(handle)
    else
        ____handle_1 = nil
    end
    return ____handle_1
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.effect"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Effect = __TS__Class()
local Effect = ____exports.Effect
Effect.name = "Effect"
__TS__ClassExtends(Effect, Handle)
function Effect.prototype.____constructor(self, modelName, a, b)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle
    if type(a) == "number" and type(b) == "number" then
        handle = AddSpecialEffect(modelName, a, b)
    elseif type(a) ~= "number" and type(b) == "string" then
        handle = AddSpecialEffectTarget(modelName, a.handle, b)
    end
    if handle == nil then
        Error(nil, "w3ts failed to create effect handle.")
    end
    Handle.prototype.____constructor(self, handle)
    if type(a) ~= "number" and type(b) == "string" then
        self.attachWidget = a
        self.attachPointName = b
    end
end
function Effect.create(self, modelName, x, y)
    local handle = AddSpecialEffect(modelName, x, y)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.createAttachment(self, modelName, targetWidget, attachPointName)
    local handle = AddSpecialEffectTarget(modelName, targetWidget.handle, attachPointName)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.attachWidget = targetWidget
        values.attachPointName = attachPointName
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.createSpell(self, abilityId, effectType, x, y)
    local handle = AddSpellEffectById(abilityId, effectType, x, y)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.createSpellAttachment(self, abilityId, effectType, targetWidget, attachPointName)
    local handle = AddSpellEffectTargetById(abilityId, effectType, targetWidget.handle, attachPointName)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.attachWidget = targetWidget
        values.attachPointName = attachPointName
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Effect.prototype.addSubAnimation(self, subAnim)
    BlzSpecialEffectAddSubAnimation(self.handle, subAnim)
end
function Effect.prototype.clearSubAnimations(self)
    BlzSpecialEffectClearSubAnimations(self.handle)
end
function Effect.prototype.destroy(self)
    DestroyEffect(self.handle)
end
function Effect.prototype.playAnimation(self, animType)
    BlzPlaySpecialEffect(self.handle, animType)
end
function Effect.prototype.playWithTimeScale(self, animType, timeScale)
    BlzPlaySpecialEffectWithTimeScale(self.handle, animType, timeScale)
end
function Effect.prototype.removeSubAnimation(self, subAnim)
    BlzSpecialEffectRemoveSubAnimation(self.handle, subAnim)
end
function Effect.prototype.resetScaleMatrix(self)
    EXEffectMatReset(self.handle)
end
function Effect.prototype.setAlpha(self, alpha)
    BlzSetSpecialEffectAlpha(self.handle, alpha)
end
function Effect.prototype.setColor(self, red, green, blue)
    BlzSetSpecialEffectColor(self.handle, red, green, blue)
end
function Effect.prototype.setColorByPlayer(self, whichPlayer)
    BlzSetSpecialEffectColorByPlayer(self.handle, whichPlayer.handle)
end
function Effect.prototype.setHeight(self, height)
    BlzSetSpecialEffectHeight(self.handle, height)
end
function Effect.prototype.setOrientation(self, yaw, pitch, roll)
    BlzSetSpecialEffectOrientation(self.handle, yaw, pitch, roll)
end
function Effect.prototype.setPitch(self, pitch)
    BlzSetSpecialEffectPitch(self.handle, pitch)
end
function Effect.prototype.setPoint(self, p)
    BlzSetSpecialEffectPositionLoc(self.handle, p.handle)
end
function Effect.prototype.setPosition(self, x, y, z)
    BlzSetSpecialEffectPosition(self.handle, x, y, z)
end
function Effect.prototype.setRoll(self, roll)
    BlzSetSpecialEffectRoll(self.handle, roll)
end
function Effect.prototype.setScaleMatrix(self, x, y, z)
    EXEffectMatScale(self.handle, x, y, z)
end
function Effect.prototype.setTime(self, value)
    BlzSetSpecialEffectTime(self.handle, value)
end
function Effect.prototype.setTimeScale(self, timeScale)
    BlzSetSpecialEffectTimeScale(self.handle, timeScale)
end
function Effect.prototype.setYaw(self, y)
    BlzSetSpecialEffectYaw(self.handle, y)
end
function Effect.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Effect.prototype,
    "scale",
    {
        get = function(self)
            return EXGetEffectSize(self.handle)
        end,
        set = function(self, scale)
            EXSetEffectSize(self.handle, scale)
        end
    },
    true
)
__TS__SetDescriptor(
    Effect.prototype,
    "x",
    {
        get = function(self)
            return EXGetEffectX(self.handle)
        end,
        set = function(self, x)
            EXSetEffectXY(self.handle, x, self.y)
        end
    },
    true
)
__TS__SetDescriptor(
    Effect.prototype,
    "y",
    {
        get = function(self)
            return EXGetEffectY(self.handle)
        end,
        set = function(self, y)
            EXSetEffectXY(self.handle, self.x, y)
        end
    },
    true
)
__TS__SetDescriptor(
    Effect.prototype,
    "z",
    {
        get = function(self)
            return EXGetEffectZ(self.handle)
        end,
        set = function(self, z)
            EXSetEffectZ(self.handle, z)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.rect"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Rectangle = __TS__Class()
local Rectangle = ____exports.Rectangle
Rectangle.name = "Rectangle"
__TS__ClassExtends(Rectangle, Handle)
function Rectangle.prototype.____constructor(self, minX, minY, maxX, maxY)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = Rect(minX, minY, maxX, maxY)
    if handle == nil then
        Error(nil, "w3ts failed to create rect handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Rectangle.create(self, minX, minY, maxX, maxY)
    local handle = Rect(minX, minY, maxX, maxY)
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Rectangle.prototype.destroy(self)
    RemoveRect(self.handle)
end
function Rectangle.prototype.enumDestructables(self, filter, actionFunc)
    EnumDestructablesInRect(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter,
        actionFunc
    )
end
function Rectangle.prototype.enumItems(self, filter, actionFunc)
    EnumItemsInRect(
        self.handle,
        type(filter) == "function" and Filter(filter) or filter,
        actionFunc
    )
end
function Rectangle.prototype.move(self, newCenterX, newCenterY)
    MoveRectTo(self.handle, newCenterX, newCenterY)
end
function Rectangle.prototype.movePoint(self, newCenterPoint)
    MoveRectToLoc(self.handle, newCenterPoint.handle)
end
function Rectangle.prototype.setRect(self, minX, minY, maxX, maxY)
    SetRect(
        self.handle,
        minX,
        minY,
        maxX,
        maxY
    )
end
function Rectangle.prototype.setRectFromPoint(self, min, max)
    SetRectFromLoc(self.handle, min.handle, max.handle)
end
function Rectangle.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Rectangle.fromPoint(self, min, max)
    return self:fromHandle(RectFromLoc(min.handle, max.handle))
end
function Rectangle.getWorldBounds(self)
    return ____exports.Rectangle:fromHandle(GetWorldBounds())
end
__TS__SetDescriptor(
    Rectangle.prototype,
    "centerX",
    {get = function(self)
        return GetRectCenterX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "centerY",
    {get = function(self)
        return GetRectCenterY(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "maxX",
    {get = function(self)
        return GetRectMaxX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "maxY",
    {get = function(self)
        return GetRectMaxY(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "minX",
    {get = function(self)
        return GetRectMinX(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Rectangle.prototype,
    "minY",
    {get = function(self)
        return GetRectMinY(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.fogmodifier"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.FogModifier = __TS__Class()
local FogModifier = ____exports.FogModifier
FogModifier.name = "FogModifier"
__TS__ClassExtends(FogModifier, Handle)
function FogModifier.prototype.____constructor(self, forWhichPlayer, whichState, centerX, centerY, radius, useSharedVision, afterUnits)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateFogModifierRadius(
        forWhichPlayer.handle,
        whichState,
        centerX,
        centerY,
        radius,
        useSharedVision,
        afterUnits
    )
    if handle == nil then
        Error(nil, "w3ts failed to create fogmodifier handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function FogModifier.create(self, forWhichPlayer, whichState, centerX, centerY, radius, useSharedVision, afterUnits)
    local handle = CreateFogModifierRadius(
        forWhichPlayer.handle,
        whichState,
        centerX,
        centerY,
        radius,
        useSharedVision,
        afterUnits
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function FogModifier.prototype.destroy(self)
    DestroyFogModifier(self.handle)
end
function FogModifier.prototype.start(self)
    FogModifierStart(self.handle)
end
function FogModifier.prototype.stop(self)
    FogModifierStop(self.handle)
end
function FogModifier.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function FogModifier.fromRect(self, forWhichPlayer, whichState, where, useSharedVision, afterUnits)
    return self:fromHandle(CreateFogModifierRect(
        forWhichPlayer.handle,
        whichState,
        where.handle,
        useSharedVision,
        afterUnits
    ))
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.frame"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
--- Warcraft III's UI uses a proprietary format known as FDF (Frame Definition Files).
-- This class provides the ability to manipulate and create them dynamically through code.
-- 
-- @example Create a simple button.
-- ```ts
-- const gameui = Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0);
-- if (gameui) {
-- // Create a "GLUEBUTTON" named "Facebutton", the clickable Button, for game UI
-- const buttonFrame = Frame.createType("FaceButton", gameui, 0, "GLUEBUTTON", "");
-- if (buttonFrame) {
-- // Create a BACKDROP named "FaceButtonIcon", the visible image, for buttonFrame.
-- const buttonIconFrame = Frame.createType("FaceButton", buttonFrame, 0, "BACKDROP", "");
-- // buttonIconFrame will mimic buttonFrame in size and position
-- buttonIconFrame?.setAllPoints(buttonFrame);
-- // Set a Texture
-- buttonIconFrame?.setTexture("ReplaceableTextures\\CommandButtons\\BTNSelectHeroOn", 0, true);
-- // Place the buttonFrame to the center of the screen
-- buttonFrame.setAbsPoint(FRAMEPOINT_CENTER, 0.4, 0.3);
-- // Give that buttonFrame a size
-- buttonFrame.setSize(0.05, 0.05);
-- }
-- }
-- ```
-- 
-- There are many aspects to modifying the UI and it can become complicated, so here are some
-- guides:
-- 
-- https://www.hiveworkshop.com/threads/ui-frames-starting-guide.318603/
-- https://www.hiveworkshop.com/pastebin/913bd439799b3d917e5b522dd9ef458f20598/
-- https://www.hiveworkshop.com/tags/ui-fdf/
____exports.Frame = __TS__Class()
local Frame = ____exports.Frame
Frame.name = "Frame"
__TS__ClassExtends(Frame, Handle)
function Frame.prototype.____constructor(self, name, owner, priority, createContext, typeName, inherits)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle
    if createContext == nil then
        handle = DzCreateSimpleFrame(name, owner.handle, priority)
    elseif typeName ~= nil and inherits ~= nil then
        handle = DzCreateFrameByTagName(
            typeName,
            name,
            owner.handle,
            inherits,
            createContext
        )
    else
        handle = DzCreateFrame(name, owner.handle, priority)
    end
    if handle == nil then
        Error(nil, "w3ts failed to create framehandle handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Frame.create(self, name, owner, priority, createContext)
    local handle = DzCreateFrame(name, owner.handle, priority)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Frame.createSimple(self, name, owner, createContext)
    local handle = DzCreateSimpleFrame(name, owner.handle, createContext)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Frame.createType(self, name, owner, createContext, typeName, inherits)
    local handle = DzCreateFrameByTagName(
        typeName,
        name,
        owner.handle,
        inherits,
        createContext
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Frame.prototype.cageMouse(self, enable)
    DzFrameCageMouse(self.handle, enable)
    return self
end
function Frame.prototype.clearPoints(self)
    DzFrameClearAllPoints(self.handle)
    return self
end
function Frame.prototype.click(self)
    DzClickFrame(self.handle)
    return self
end
function Frame.prototype.destroy(self)
    DzDestroyFrame(self.handle)
    return self
end
function Frame.prototype.setAbsPoint(self, point, x, y)
    DzFrameSetAbsolutePoint(self.handle, point, x, y)
    return self
end
function Frame.prototype.setAllPoints(self, relative)
    DzFrameSetAllPoints(self.handle, relative.handle)
    return self
end
function Frame.prototype.setAlpha(self, alpha)
    DzFrameSetAlpha(self.handle, alpha)
    return self
end
function Frame.prototype.setEnabled(self, flag)
    DzFrameSetEnable(self.handle, flag)
    return self
end
function Frame.prototype.setFocus(self, flag)
    DzFrameSetFocus(self.handle, flag)
    return self
end
function Frame.prototype.setFont(self, filename, height, flags)
    DzFrameSetFont(self.handle, filename, height, flags)
    return self
end
function Frame.prototype.setHeight(self, height)
    DzFrameSetSize(self.handle, self.width, height)
    return self
end
function Frame.prototype.setMinMaxValue(self, minValue, maxValue)
    DzFrameSetMinMaxValue(self.handle, minValue, maxValue)
    return self
end
function Frame.prototype.setTextAlignment(self, vert, horz)
    DzFrameSetTextAlignment(self.handle, vert)
    return self
end
function Frame.prototype.setModel(self, modelFile, cameraIndex)
    DzFrameSetModel(self.handle, modelFile, cameraIndex, 0)
    return self
end
function Frame.prototype.getParent(self)
    return ____exports.Frame:fromHandle(DzFrameGetParent(self.handle))
end
function Frame.prototype.setParent(self, parent)
    DzFrameSetParent(self.handle, parent.handle)
    return self
end
function Frame.prototype.setPoint(self, point, relative, relativePoint, x, y)
    DzFrameSetPoint(
        self.handle,
        point,
        relative.handle,
        relativePoint,
        x,
        y
    )
    return self
end
function Frame.prototype.setScale(self, scale)
    DzFrameSetScale(self.handle, scale)
    return self
end
function Frame.prototype.setSize(self, width, height)
    DzFrameSetSize(self.handle, width, height)
    return self
end
function Frame.prototype.setStepSize(self, stepSize)
    DzFrameSetStepSize(self.handle, stepSize)
    return self
end
function Frame.prototype.setText(self, text)
    DzFrameSetText(self.handle, text)
    return self
end
function Frame.prototype.setTextSizeLimit(self, size)
    DzFrameSetTextSizeLimit(self.handle, size)
    return self
end
function Frame.prototype.setTexture(self, texFile, flag, blend)
    DzFrameSetTexture(self.handle, texFile, flag)
    return self
end
function Frame.prototype.setValue(self, value)
    DzFrameSetValue(self.handle, value)
    return self
end
function Frame.prototype.setVertexColor(self, color)
    DzFrameSetVertexColor(self.handle, color)
    return self
end
function Frame.prototype.setVisible(self, flag)
    DzFrameShow(self.handle, flag)
    return self
end
function Frame.prototype.setWidth(self, width)
    DzFrameSetSize(self.handle, width, self.height)
    return self
end
function Frame.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Frame.fromName(self, name, createContext)
    return self:fromHandle(DzFrameFindByName(name, createContext))
end
function Frame.loadTOC(self, filename)
    return DzLoadToc(filename)
end
function Frame.fromOrigin(self, frameType, index)
    if frameType == ORIGIN_FRAME_GAME_UI then
        return self:fromHandle(DzGetGameUI())
    end
    return nil
end
__TS__SetDescriptor(
    Frame.prototype,
    "alpha",
    {
        get = function(self)
            return DzFrameGetAlpha(self.handle)
        end,
        set = function(self, alpha)
            DzFrameSetAlpha(self.handle, alpha)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "enabled",
    {
        get = function(self)
            return DzFrameGetEnable(self.handle)
        end,
        set = function(self, flag)
            DzFrameSetEnable(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "height",
    {
        get = function(self)
            return DzFrameGetHeight(self.handle)
        end,
        set = function(self, height)
            DzFrameSetSize(self.handle, self.width, height)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "parent",
    {
        get = function(self)
            return ____exports.Frame:fromHandle(DzFrameGetParent(self.handle))
        end,
        set = function(self, parent)
            DzFrameSetParent(self.handle, parent.handle)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "text",
    {
        get = function(self)
            return DzFrameGetText(self.handle) or ""
        end,
        set = function(self, text)
            DzFrameSetText(self.handle, text)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "textSizeLimit",
    {
        get = function(self)
            return DzFrameGetTextSizeLimit(self.handle)
        end,
        set = function(self, size)
            DzFrameSetTextSizeLimit(self.handle, size)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "value",
    {
        get = function(self)
            return DzFrameGetValue(self.handle)
        end,
        set = function(self, value)
            DzFrameSetValue(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "visible",
    {set = function(self, flag)
        DzFrameShow(self.handle, flag)
    end},
    true
)
__TS__SetDescriptor(
    Frame.prototype,
    "width",
    {set = function(self, width)
        DzFrameSetSize(self.handle, width, self.height)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.gamecache"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.GameCache = __TS__Class()
local GameCache = ____exports.GameCache
GameCache.name = "GameCache"
__TS__ClassExtends(GameCache, Handle)
function GameCache.prototype.____constructor(self, campaignFile)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = InitGameCache(campaignFile)
    if handle == nil then
        Error(nil, "w3ts failed to create gamecache handle.")
    end
    Handle.prototype.____constructor(self, handle)
    self.filename = campaignFile
end
function GameCache.create(self, campaignFile)
    local handle = InitGameCache(campaignFile)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.filename = campaignFile
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function GameCache.prototype.flush(self)
    FlushGameCache(self.handle)
end
function GameCache.prototype.flushBoolean(self, missionKey, key)
    FlushStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.flushInteger(self, missionKey, key)
    FlushStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.flushMission(self, missionKey)
    FlushStoredMission(self.handle, missionKey)
end
function GameCache.prototype.flushNumber(self, missionKey, key)
    FlushStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.flushString(self, missionKey, key)
    FlushStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.flushUnit(self, missionKey, key)
    FlushStoredUnit(self.handle, missionKey, key)
end
function GameCache.prototype.getBoolean(self, missionKey, key)
    return GetStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.getInteger(self, missionKey, key)
    return GetStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.getNumber(self, missionKey, key)
    return GetStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.getString(self, missionKey, key)
    return GetStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.hasBoolean(self, missionKey, key)
    return HaveStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.hasInteger(self, missionKey, key)
    return HaveStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.hasNumber(self, missionKey, key)
    return HaveStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.hasString(self, missionKey, key)
    return HaveStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.restoreUnit(self, missionKey, key, forWhichPlayer, x, y, face)
    return RestoreUnit(
        self.handle,
        missionKey,
        key,
        forWhichPlayer.handle,
        x,
        y,
        face
    )
end
function GameCache.prototype.save(self)
    return SaveGameCache(self.handle)
end
function GameCache.prototype.store(self, missionKey, key, value)
    if type(value) == "string" then
        StoreString(self.handle, missionKey, key, value)
    elseif type(value) == "boolean" then
        StoreBoolean(self.handle, missionKey, key, value)
    elseif type(value) == "number" then
        StoreReal(self.handle, missionKey, key, value)
    else
        StoreUnit(self.handle, missionKey, key, value)
    end
end
function GameCache.prototype.syncBoolean(self, missionKey, key)
    return SyncStoredBoolean(self.handle, missionKey, key)
end
function GameCache.prototype.syncInteger(self, missionKey, key)
    return SyncStoredInteger(self.handle, missionKey, key)
end
function GameCache.prototype.syncNumber(self, missionKey, key)
    return SyncStoredReal(self.handle, missionKey, key)
end
function GameCache.prototype.syncString(self, missionKey, key)
    return SyncStoredString(self.handle, missionKey, key)
end
function GameCache.prototype.syncUnit(self, missionKey, key)
    return SyncStoredUnit(self.handle, missionKey, key)
end
function GameCache.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function GameCache.reloadFromDisk(self)
    return ReloadGameCachesFromDisk()
end
local function ____error(arg0, arg1)
    error(
        __TS__New(Error, "Function not implemented."),
        0
    )
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.globals.order"] = function(...) 
local ____exports = {}
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.item"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____widget = require("lua_modules.@eiriksgata.wc3ts.src.handles.widget")
local Widget = ____widget.Widget
____exports.Item = __TS__Class()
local Item = ____exports.Item
Item.name = "Item"
__TS__ClassExtends(Item, Widget)
function Item.prototype.____constructor(self, itemId, x, y)
    if Handle:initFromHandle() then
        Widget.prototype.____constructor(self)
        return
    end
    local handle = CreateItem(itemId, x, y)
    if handle == nil then
        Error(nil, "w3ts failed to create item handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Item.create(self, itemId, x, y)
    local handle = CreateItem(itemId, x, y)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Item.prototype.addAbility(self, abilCode)
    BlzItemAddAbility(self.handle, abilCode)
end
function Item.prototype.getAbility(self, abilCode)
    return BlzGetItemAbility(self.handle, abilCode)
end
function Item.prototype.getAbilityByIndex(self, index)
    return BlzGetItemAbilityByIndex(self.handle, index)
end
function Item.prototype.removeAbility(self, abilCode)
    BlzItemRemoveAbility(self.handle, abilCode)
end
function Item.prototype.destroy(self)
    RemoveItem(self.handle)
end
function Item.prototype.getField(self, field)
    local fieldType = __TS__StringSubstr(
        tostring(field),
        0,
        (string.find(
            tostring(field),
            ":",
            nil,
            true
        ) or 0) - 1
    )
    repeat
        local ____switch13 = fieldType
        local ____cond13 = ____switch13 == "unitbooleanfield"
        if ____cond13 then
            return BlzGetItemBooleanField(self.handle, field)
        end
        ____cond13 = ____cond13 or ____switch13 == "unitintegerfield"
        if ____cond13 then
            return BlzGetItemIntegerField(self.handle, field)
        end
        ____cond13 = ____cond13 or ____switch13 == "unitrealfield"
        if ____cond13 then
            return BlzGetItemRealField(self.handle, field)
        end
        ____cond13 = ____cond13 or ____switch13 == "unitstringfield"
        if ____cond13 then
            return BlzGetItemStringField(self.handle, field)
        end
        do
            return 0
        end
    until true
end
function Item.prototype.isOwned(self)
    return IsItemOwned(self.handle)
end
function Item.prototype.isPawnable(self)
    return IsItemPawnable(self.handle)
end
function Item.prototype.isPowerup(self)
    return IsItemPowerup(self.handle)
end
function Item.prototype.isSellable(self)
    return IsItemSellable(self.handle)
end
function Item.prototype.setDropId(self, unitId)
    SetItemDropID(self.handle, unitId)
end
function Item.prototype.setDropOnDeath(self, flag)
    SetItemDropOnDeath(self.handle, flag)
end
function Item.prototype.setDroppable(self, flag)
    SetItemDroppable(self.handle, flag)
end
function Item.prototype.setField(self, field, value)
    local fieldType = __TS__StringSubstr(
        tostring(field),
        0,
        (string.find(
            tostring(field),
            ":",
            nil,
            true
        ) or 0) - 1
    )
    if fieldType == "unitbooleanfield" and type(value) == "boolean" then
        return BlzSetItemBooleanField(self.handle, field, value)
    end
    if fieldType == "unitintegerfield" and type(value) == "number" then
        return BlzSetItemIntegerField(self.handle, field, value)
    end
    if fieldType == "unitrealfield" and type(value) == "number" then
        return BlzSetItemRealField(self.handle, field, value)
    end
    if fieldType == "unitstringfield" and type(value) == "string" then
        return BlzSetItemStringField(self.handle, field, value)
    end
    return false
end
function Item.prototype.setOwner(self, whichPlayer, changeColor)
    SetItemPlayer(self.handle, whichPlayer.handle, changeColor)
end
function Item.prototype.setPoint(self, whichPoint)
    SetItemPosition(self.handle, whichPoint.x, whichPoint.y)
end
function Item.prototype.setPosition(self, x, y)
    SetItemPosition(self.handle, x, y)
end
function Item.fromEvent(self)
    return self:fromHandle(GetManipulatedItem())
end
function Item.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Item.isIdPawnable(self, itemId)
    return IsItemIdPawnable(itemId)
end
function Item.isIdPowerup(self, itemId)
    return IsItemIdPowerup(itemId)
end
function Item.isIdSellable(self, itemId)
    return IsItemIdSellable(itemId)
end
__TS__SetDescriptor(
    Item.prototype,
    "charges",
    {
        get = function(self)
            return GetItemCharges(self.handle)
        end,
        set = function(self, value)
            SetItemCharges(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "invulnerable",
    {
        get = function(self)
            return IsItemInvulnerable(self.handle)
        end,
        set = function(self, flag)
            SetItemInvulnerable(self.handle, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "level",
    {get = function(self)
        return GetItemLevel(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "extendedTooltip",
    {
        get = function(self)
            local ____BlzGetItemExtendedTooltip_result_1 = BlzGetItemExtendedTooltip(self.handle)
            if ____BlzGetItemExtendedTooltip_result_1 == nil then
                ____BlzGetItemExtendedTooltip_result_1 = ""
            end
            return ____BlzGetItemExtendedTooltip_result_1
        end,
        set = function(self, tooltip)
            BlzSetItemExtendedTooltip(self.handle, tooltip)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "icon",
    {
        get = function(self)
            local ____BlzGetItemIconPath_result_2 = BlzGetItemIconPath(self.handle)
            if ____BlzGetItemIconPath_result_2 == nil then
                ____BlzGetItemIconPath_result_2 = ""
            end
            return ____BlzGetItemIconPath_result_2
        end,
        set = function(self, path)
            BlzSetItemIconPath(self.handle, path)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "name",
    {
        get = function(self)
            return GetItemName(self.handle) or ""
        end,
        set = function(self, value)
            BlzSetItemName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "tooltip",
    {
        get = function(self)
            local ____BlzGetItemTooltip_result_3 = BlzGetItemTooltip(self.handle)
            if ____BlzGetItemTooltip_result_3 == nil then
                ____BlzGetItemTooltip_result_3 = ""
            end
            return ____BlzGetItemTooltip_result_3
        end,
        set = function(self, tooltip)
            BlzSetItemTooltip(self.handle, tooltip)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "pawnable",
    {
        get = function(self)
            return IsItemPawnable(self.handle)
        end,
        set = function(self, flag)
            SetItemPawnable(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "player",
    {get = function(self)
        return GetItemPlayer(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "type",
    {get = function(self)
        return GetItemType(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "typeId",
    {get = function(self)
        return GetItemTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "userData",
    {
        get = function(self)
            return GetItemUserData(self.handle)
        end,
        set = function(self, value)
            SetItemUserData(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "visible",
    {
        get = function(self)
            return IsItemVisible(self.handle)
        end,
        set = function(self, flag)
            SetItemVisible(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "x",
    {
        get = function(self)
            return GetItemX(self.handle)
        end,
        set = function(self, value)
            SetItemPosition(self.handle, value, self.y)
        end
    },
    true
)
__TS__SetDescriptor(
    Item.prototype,
    "y",
    {
        get = function(self)
            return GetItemY(self.handle)
        end,
        set = function(self, value)
            SetItemPosition(self.handle, self.x, value)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.sound"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Sound = __TS__Class()
local Sound = ____exports.Sound
Sound.name = "Sound"
__TS__ClassExtends(Sound, Handle)
function Sound.prototype.____constructor(self, fileName, looping, is3D, stopWhenOutOfRange, fadeInRate, fadeOutRate, eaxSetting)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateSound(
        fileName,
        looping,
        is3D,
        stopWhenOutOfRange,
        fadeInRate,
        fadeOutRate,
        eaxSetting
    )
    if handle == nil then
        Error(nil, "w3ts failed to create sound handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Sound.create(self, fileName, looping, is3D, stopWhenOutOfRange, fadeInRate, fadeOutRate, eaxSetting)
    local handle = CreateSound(
        fileName,
        looping,
        is3D,
        stopWhenOutOfRange,
        fadeInRate,
        fadeOutRate,
        eaxSetting
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Sound.prototype.killWhenDone(self)
    KillSoundWhenDone(self.handle)
end
function Sound.prototype.registerStacked(self, byPosition, rectWidth, rectHeight)
    RegisterStackedSound(self.handle, byPosition, rectWidth, rectHeight)
end
function Sound.prototype.setChannel(self, channel)
    SetSoundDistanceCutoff(self.handle, channel)
end
function Sound.prototype.setConeAngles(self, inside, outside, outsideVolume)
    SetSoundConeAngles(self.handle, inside, outside, outsideVolume)
end
function Sound.prototype.setConeOrientation(self, x, y, z)
    SetSoundConeOrientation(self.handle, x, y, z)
end
function Sound.prototype.setDistanceCutoff(self, cutoff)
    SetSoundDistanceCutoff(self.handle, cutoff)
end
function Sound.prototype.setDistances(self, minDist, maxDist)
    SetSoundDistances(self.handle, minDist, maxDist)
end
function Sound.prototype.setParamsFromLabel(self, soundLabel)
    SetSoundParamsFromLabel(self.handle, soundLabel)
end
function Sound.prototype.setPitch(self, pitch)
    SetSoundPitch(self.handle, pitch)
end
function Sound.prototype.setPlayPosition(self, millisecs)
    SetSoundPlayPosition(self.handle, millisecs)
end
function Sound.prototype.setPosition(self, x, y, z)
    SetSoundPosition(self.handle, x, y, z)
end
function Sound.prototype.setVelocity(self, x, y, z)
    SetSoundVelocity(self.handle, x, y, z)
end
function Sound.prototype.setVolume(self, volume)
    SetSoundVolume(self.handle, volume)
end
function Sound.prototype.start(self)
    StartSound(self.handle)
end
function Sound.prototype.stop(self, killWhenDone, fadeOut)
    StopSound(self.handle, killWhenDone, fadeOut)
end
function Sound.prototype.unregisterStacked(self, byPosition, rectWidth, rectHeight)
    UnregisterStackedSound(self.handle, byPosition, rectWidth, rectHeight)
end
function Sound.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Sound.getFileDuration(self, fileName)
    return GetSoundFileDuration(fileName)
end
__TS__SetDescriptor(
    Sound.prototype,
    "duration",
    {
        get = function(self)
            return GetSoundDuration(self.handle)
        end,
        set = function(self, duration)
            SetSoundDuration(self.handle, duration)
        end
    },
    true
)
__TS__SetDescriptor(
    Sound.prototype,
    "loading",
    {get = function(self)
        return GetSoundIsLoading(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Sound.prototype,
    "playing",
    {get = function(self)
        return GetSoundIsPlaying(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.unit"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____destructable = require("lua_modules.@eiriksgata.wc3ts.src.handles.destructable")
local Destructable = ____destructable.Destructable
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____item = require("lua_modules.@eiriksgata.wc3ts.src.handles.item")
local Item = ____item.Item
local ____player = require("lua_modules.@eiriksgata.wc3ts.src.handles.player")
local MapPlayer = ____player.MapPlayer
local ____point = require("lua_modules.@eiriksgata.wc3ts.src.handles.point")
local Point = ____point.Point
local ____widget = require("lua_modules.@eiriksgata.wc3ts.src.handles.widget")
local Widget = ____widget.Widget
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
local bj_UNIT_FACING = ____define.bj_UNIT_FACING
local UNIT_STATE_ATTACK_BONUS = ____define.UNIT_STATE_ATTACK_BONUS
local UNIT_STATE_ATTACK_SPACE = ____define.UNIT_STATE_ATTACK_SPACE
local UNIT_STATE_ATTACK_SPEED = ____define.UNIT_STATE_ATTACK_SPEED
local UNIT_STATE_ATTACK_WHITE = ____define.UNIT_STATE_ATTACK_WHITE
local UNIT_STATE_DEFEND_WHITE = ____define.UNIT_STATE_DEFEND_WHITE
local UNIT_STATE_MANA = ____define.UNIT_STATE_MANA
local UNIT_STATE_MAX_LIFE = ____define.UNIT_STATE_MAX_LIFE
local UNIT_STATE_MAX_MANA = ____define.UNIT_STATE_MAX_MANA
local UNIT_TYPE_DEAD = ____define.UNIT_TYPE_DEAD
____exports.Unit = __TS__Class()
local Unit = ____exports.Unit
Unit.name = "Unit"
__TS__ClassExtends(Unit, Widget)
function Unit.prototype.____constructor(self, owner, unitId, x, y, face)
    if Handle:initFromHandle() == true then
        Widget.prototype.____constructor(self)
        return
    end
    if face == nil then
        face = bj_UNIT_FACING
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        face
    )
    if handle == nil then
        Error(nil, "w3ts failed to create unit handle.")
    end
    Widget.prototype.____constructor(self, handle)
end
function Unit.create(self, owner, unitId, x, y, face, skinId)
    if face == nil then
        face = bj_UNIT_FACING
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        face
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Unit.prototype.addAbility(self, abilityId)
    return UnitAddAbility(self.handle, abilityId)
end
function Unit.prototype.addAnimationProps(self, animProperties, add)
    AddUnitAnimationProperties(self.handle, animProperties, add)
end
function Unit.prototype.addExperience(self, xpToAdd, showEyeCandy)
    AddHeroXP(self.handle, xpToAdd, showEyeCandy)
end
function Unit.prototype.addIndicator(self, red, blue, green, alpha)
    UnitAddIndicator(
        self.handle,
        red,
        blue,
        green,
        alpha
    )
end
function Unit.prototype.addItem(self, whichItem)
    return UnitAddItem(self.handle, whichItem.handle)
end
function Unit.prototype.addItemById(self, itemId)
    return Item:fromHandle(UnitAddItemById(self.handle, itemId))
end
function Unit.prototype.addItemToSlotById(self, itemId, itemSlot)
    return UnitAddItemToSlotById(self.handle, itemId, itemSlot)
end
function Unit.prototype.addItemToStock(self, itemId, currentStock, stockMax)
    AddItemToStock(self.handle, itemId, currentStock, stockMax)
end
function Unit.prototype.addResourceAmount(self, amount)
    AddResourceAmount(self.handle, amount)
end
function Unit.prototype.addSleepPerm(self, add)
    UnitAddSleepPerm(self.handle, add)
end
function Unit.prototype.addType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.addUnitToStock(self, unitId, currentStock, stockMax)
    AddUnitToStock(self.handle, unitId, currentStock, stockMax)
end
function Unit.prototype.applyTimedLife(self, buffId, duration)
    UnitApplyTimedLife(self.handle, buffId, duration)
end
function Unit.prototype.attachSound(self, sound)
    AttachSoundToUnit(sound.handle, self.handle)
end
function Unit.prototype.canSleepPerm(self)
    return UnitCanSleepPerm(self.handle)
end
function Unit.prototype.countBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitCountBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.damageAt(self, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamagePoint(
        self.handle,
        delay,
        radius,
        x,
        y,
        amount,
        attack,
        ranged,
        attackType,
        damageType,
        weaponType
    )
end
function Unit.prototype.damageTarget(self, target, amount, attack, ranged, attackType, damageType, weaponType)
    return UnitDamageTarget(
        self.handle,
        target,
        amount,
        attack,
        ranged,
        attackType,
        damageType,
        weaponType
    )
end
function Unit.prototype.decAbilityLevel(self, abilCode)
    return DecUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.destroy(self)
    RemoveUnit(self.handle)
end
function Unit.prototype.dropItem(self, whichItem, x, y)
    return UnitDropItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.dropItemFromSlot(self, whichItem, slot)
    return UnitDropItemSlot(self.handle, whichItem.handle, slot)
end
function Unit.prototype.dropItemTarget(self, whichItem, target)
    return UnitDropItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.getAbilityLevel(self, abilCode)
    return GetUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.getAgility(self, includeBonuses)
    return GetHeroAgi(self.handle, includeBonuses)
end
function Unit.prototype.getflyHeight(self)
    return GetUnitFlyHeight(self.handle)
end
function Unit.prototype.getHeroLevel(self)
    return GetHeroLevel(self.handle)
end
function Unit.prototype.getIgnoreAlarm(self, flag)
    return UnitIgnoreAlarm(self.handle, flag)
end
function Unit.prototype.getIntelligence(self, includeBonuses)
    return GetHeroInt(self.handle, includeBonuses)
end
function Unit.prototype.getItemInSlot(self, slot)
    return Item:fromHandle(UnitItemInSlot(self.handle, slot))
end
function Unit.prototype.getState(self, whichUnitState)
    return GetUnitState(self.handle, whichUnitState)
end
function Unit.prototype.getStrength(self, includeBonuses)
    return GetHeroStr(self.handle, includeBonuses)
end
function Unit.prototype.hasBuffs(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    return UnitHasBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.hasItem(self, whichItem)
    return UnitHasItem(self.handle, whichItem.handle)
end
function Unit.prototype.incAbilityLevel(self, abilCode)
    return IncUnitAbilityLevel(self.handle, abilCode)
end
function Unit.prototype.inForce(self, whichForce)
    return IsUnitInForce(self.handle, whichForce.handle)
end
function Unit.prototype.inGroup(self, whichGroup)
    return IsUnitInGroup(self.handle, whichGroup.handle)
end
function Unit.prototype.inRange(self, x, y, distance)
    return IsUnitInRangeXY(self.handle, x, y, distance)
end
function Unit.prototype.inRangeOfPoint(self, whichPoint, distance)
    return IsUnitInRangeLoc(self.handle, whichPoint.handle, distance)
end
function Unit.prototype.inRangeOfUnit(self, otherUnit, distance)
    return IsUnitInRange(self.handle, otherUnit.handle, distance)
end
function Unit.prototype.inTransport(self, whichTransport)
    return IsUnitInTransport(self.handle, whichTransport.handle)
end
function Unit.prototype.isAlive(self)
    return not IsUnitType(
        self.handle,
        UNIT_TYPE_DEAD()
    )
end
function Unit.prototype.isAlly(self, whichPlayer)
    return IsUnitAlly(self.handle, whichPlayer.handle)
end
function Unit.prototype.isEnemy(self, whichPlayer)
    return IsUnitEnemy(self.handle, whichPlayer.handle)
end
function Unit.prototype.isExperienceSuspended(self)
    return IsSuspendedXP(self.handle)
end
function Unit.prototype.isFogged(self, whichPlayer)
    return IsUnitFogged(self.handle, whichPlayer.handle)
end
function Unit.prototype.isHero(self)
    return IsHeroUnitId(self.typeId)
end
function Unit.prototype.isIllusion(self)
    return IsUnitIllusion(self.handle)
end
function Unit.prototype.isLoaded(self)
    return IsUnitLoaded(self.handle)
end
function Unit.prototype.isMasked(self, whichPlayer)
    return IsUnitMasked(self.handle, whichPlayer.handle)
end
function Unit.prototype.isSelected(self, whichPlayer)
    return IsUnitSelected(self.handle, whichPlayer.handle)
end
function Unit.prototype.issueBuildOrder(self, unit, x, y)
    local ____temp_0
    if type(unit) == "string" then
        ____temp_0 = IssueBuildOrder(self.handle, unit, x, y)
    else
        ____temp_0 = IssueBuildOrderById(self.handle, unit, x, y)
    end
    return ____temp_0
end
function Unit.prototype.issueImmediateOrder(self, order)
    local ____temp_1
    if type(order) == "string" then
        ____temp_1 = IssueImmediateOrder(self.handle, order)
    else
        ____temp_1 = IssueImmediateOrderById(self.handle, order)
    end
    return ____temp_1
end
function Unit.prototype.issueInstantOrderAt(self, order, x, y, instantTargetWidget)
    local ____temp_2
    if type(order) == "string" then
        ____temp_2 = IssueInstantPointOrder(
            self.handle,
            order,
            x,
            y,
            instantTargetWidget.handle
        )
    else
        ____temp_2 = IssueInstantPointOrderById(
            self.handle,
            order,
            x,
            y,
            instantTargetWidget.handle
        )
    end
    return ____temp_2
end
function Unit.prototype.issueInstantTargetOrder(self, order, targetWidget, instantTargetWidget)
    local ____temp_3
    if type(order) == "string" then
        ____temp_3 = IssueInstantTargetOrder(self.handle, order, targetWidget.handle, instantTargetWidget.handle)
    else
        ____temp_3 = IssueInstantTargetOrderById(self.handle, order, targetWidget.handle, instantTargetWidget.handle)
    end
    return ____temp_3
end
function Unit.prototype.issueOrderAt(self, order, x, y)
    local ____temp_4
    if type(order) == "string" then
        ____temp_4 = IssuePointOrder(self.handle, order, x, y)
    else
        ____temp_4 = IssuePointOrderById(self.handle, order, x, y)
    end
    return ____temp_4
end
function Unit.prototype.issuePointOrder(self, order, whichPoint)
    local ____temp_5
    if type(order) == "string" then
        ____temp_5 = IssuePointOrderLoc(self.handle, order, whichPoint.handle)
    else
        ____temp_5 = IssuePointOrderByIdLoc(self.handle, order, whichPoint.handle)
    end
    return ____temp_5
end
function Unit.prototype.issueTargetOrder(self, order, targetWidget)
    local ____temp_6
    if type(order) == "string" then
        ____temp_6 = IssueTargetOrder(self.handle, order, targetWidget.handle)
    else
        ____temp_6 = IssueTargetOrderById(self.handle, order, targetWidget.handle)
    end
    return ____temp_6
end
function Unit.prototype.isUnit(self, whichSpecifiedUnit)
    return IsUnit(self.handle, whichSpecifiedUnit.handle)
end
function Unit.prototype.isUnitType(self, whichUnitType)
    return IsUnitType(self.handle, whichUnitType)
end
function Unit.prototype.isVisible(self, whichPlayer)
    return IsUnitVisible(self.handle, whichPlayer.handle)
end
function Unit.prototype.kill(self)
    KillUnit(self.handle)
end
function Unit.prototype.lookAt(self, whichBone, lookAtTarget, offsetX, offsetY, offsetZ)
    SetUnitLookAt(
        self.handle,
        whichBone,
        lookAtTarget.handle,
        offsetX,
        offsetY,
        offsetZ
    )
end
function Unit.prototype.makeAbilityPermanent(self, permanent, abilityId)
    UnitMakeAbilityPermanent(self.handle, permanent, abilityId)
end
function Unit.prototype.modifySkillPoints(self, skillPointDelta)
    return UnitModifySkillPoints(self.handle, skillPointDelta)
end
function Unit.prototype.pauseEx(self, flag)
    PauseUnit(self.handle, flag)
end
function Unit.prototype.pauseTimedLife(self, flag)
    UnitPauseTimedLife(self.handle, flag)
end
function Unit.prototype.queueAnimation(self, whichAnimation)
    QueueUnitAnimation(self.handle, whichAnimation)
end
function Unit.prototype.recycleGuardPosition(self)
    RecycleGuardPosition(self.handle)
end
function Unit.prototype.removeAbility(self, abilityId)
    return UnitRemoveAbility(self.handle, abilityId)
end
function Unit.prototype.removeBuffs(self, removePositive, removeNegative)
    UnitRemoveBuffs(self.handle, removePositive, removeNegative)
end
function Unit.prototype.removeBuffsEx(self, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel)
    UnitRemoveBuffsEx(
        self.handle,
        removePositive,
        removeNegative,
        magic,
        physical,
        timedLife,
        aura,
        autoDispel
    )
end
function Unit.prototype.removeGuardPosition(self)
    RemoveGuardPosition(self.handle)
end
function Unit.prototype.removeItem(self, whichItem)
    UnitRemoveItem(self.handle, whichItem.handle)
end
function Unit.prototype.removeItemFromSlot(self, itemSlot)
    return Item:fromHandle(UnitRemoveItemFromSlot(self.handle, itemSlot))
end
function Unit.prototype.removeItemFromStock(self, itemId)
    RemoveItemFromStock(self.handle, itemId)
end
function Unit.prototype.removeType(self, whichUnitType)
    return UnitAddType(self.handle, whichUnitType)
end
function Unit.prototype.removeUnitFromStock(self, itemId)
    RemoveUnitFromStock(self.handle, itemId)
end
function Unit.prototype.resetCooldown(self)
    UnitResetCooldown(self.handle)
end
function Unit.prototype.resetLookAt(self)
    ResetUnitLookAt(self.handle)
end
function Unit.prototype.revive(self, x, y, doEyecandy)
    return ReviveHero(self.handle, x, y, doEyecandy)
end
function Unit.prototype.reviveAtPoint(self, whichPoint, doEyecandy)
    return ReviveHeroLoc(self.handle, whichPoint.handle, doEyecandy)
end
function Unit.prototype.select(self, flag)
    SelectUnit(self.handle, flag)
end
function Unit.prototype.selectSkill(self, abilCode)
    SelectHeroSkill(self.handle, abilCode)
end
function Unit.prototype.setAbilityLevel(self, abilCode, level)
    return SetUnitAbilityLevel(self.handle, abilCode, level)
end
function Unit.prototype.setAgility(self, value, permanent)
    SetHeroAgi(self.handle, value, permanent)
end
function Unit.prototype.setAnimation(self, whichAnimation)
    if type(whichAnimation) == "string" then
        SetUnitAnimation(self.handle, whichAnimation)
    else
        SetUnitAnimationByIndex(self.handle, whichAnimation)
    end
end
function Unit.prototype.setAnimationWithRarity(self, whichAnimation, rarity)
    SetUnitAnimationWithRarity(self.handle, whichAnimation, rarity)
end
function Unit.prototype.setBaseDamageJAPI(self, baseDamage)
    self:setState(
        UNIT_STATE_ATTACK_WHITE(),
        baseDamage
    )
end
function Unit.prototype.setBonusDamageJAPI(self, bonusDamage)
    self:setState(
        UNIT_STATE_ATTACK_BONUS(),
        bonusDamage
    )
end
function Unit.prototype.setBlendTime(self, timeScale)
    SetUnitBlendTime(self.handle, timeScale)
end
function Unit.prototype.setConstructionProgress(self, constructionPercentage)
    UnitSetConstructionProgress(self.handle, constructionPercentage)
end
function Unit.prototype.setCreepGuard(self, creepGuard)
    SetUnitCreepGuard(self.handle, creepGuard)
end
function Unit.prototype.setExperience(self, newXpVal, showEyeCandy)
    SetHeroXP(self.handle, newXpVal, showEyeCandy)
end
function Unit.prototype.setExploded(self, exploded)
    SetUnitExploded(self.handle, exploded)
end
function Unit.prototype.setFacingEx(self, facingAngle)
    SetUnitFacing(self.handle, facingAngle)
end
function Unit.prototype.setflyHeight(self, value, rate)
    SetUnitFlyHeight(self.handle, value, rate)
end
function Unit.prototype.setHeroLevel(self, level, showEyeCandy)
    SetHeroLevel(self.handle, level, showEyeCandy)
end
function Unit.prototype.setIntelligence(self, value, permanent)
    SetHeroInt(self.handle, value, permanent)
end
function Unit.prototype.setItemTypeSlots(self, slots)
    SetItemTypeSlots(self.handle, slots)
end
function Unit.prototype.setOwner(self, whichPlayer, changeColor)
    if changeColor == nil then
        changeColor = true
    end
    SetUnitOwner(self.handle, whichPlayer.handle, changeColor)
end
function Unit.prototype.getOwner(self)
    return MapPlayer:fromHandle(GetOwningPlayer(self.handle))
end
function Unit.prototype.setPoint(self, point)
    SetUnitPositionLoc(self.handle, point.handle)
end
function Unit.prototype.getPoint(self)
    return Point:fromHandle(GetUnitLoc(self.handle))
end
function Unit.prototype.setPathing(self, flag)
    SetUnitPathing(self.handle, flag)
end
function Unit.prototype.setPosition(self, x, y)
    SetUnitPosition(self.handle, x, y)
end
function Unit.prototype.setRescuable(self, byWhichPlayer, flag)
    SetUnitRescuable(self.handle, byWhichPlayer.handle, flag)
end
function Unit.prototype.setRescueRange(self, range)
    SetUnitRescueRange(self.handle, range)
end
function Unit.prototype.setScale(self, scaleX, scaleY, scaleZ)
    SetUnitScale(self.handle, scaleX, scaleY, scaleZ)
end
function Unit.prototype.setState(self, whichUnitState, newVal)
    SetUnitState(self.handle, whichUnitState, newVal)
end
function Unit.prototype.setStrength(self, value, permanent)
    SetHeroStr(self.handle, value, permanent)
end
function Unit.prototype.setTimeScale(self, timeScale)
    SetUnitTimeScale(self.handle, timeScale)
end
function Unit.prototype.setUnitAttackCooldownJAPI(self, cooldown)
    self:setState(
        UNIT_STATE_ATTACK_SPACE(),
        cooldown
    )
end
function Unit.prototype.setUnitAttackSpeedJAPI(self, attacksPerSecond)
    self:setState(
        UNIT_STATE_ATTACK_SPEED(),
        attacksPerSecond
    )
end
function Unit.prototype.setUnitTypeSlots(self, slots)
    SetUnitTypeSlots(self.handle, slots)
end
function Unit.prototype.setUpgradeProgress(self, upgradePercentage)
    UnitSetUpgradeProgress(self.handle, upgradePercentage)
end
function Unit.prototype.setUseAltIcon(self, flag)
    UnitSetUsesAltIcon(self.handle, flag)
end
function Unit.prototype.setUseFood(self, useFood)
    SetUnitUseFood(self.handle, useFood)
end
function Unit.prototype.setVertexColor(self, red, green, blue, alpha)
    SetUnitVertexColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Unit.prototype.shareVision(self, whichPlayer, share)
    UnitShareVision(self.handle, whichPlayer.handle, share)
end
function Unit.prototype.stripLevels(self, howManyLevels)
    return UnitStripHeroLevel(self.handle, howManyLevels)
end
function Unit.prototype.suspendDecay(self, suspend)
    UnitSuspendDecay(self.handle, suspend)
end
function Unit.prototype.suspendExperience(self, flag)
    SuspendHeroXP(self.handle, flag)
end
function Unit.prototype.useItem(self, whichItem)
    return UnitUseItem(self.handle, whichItem.handle)
end
function Unit.prototype.useItemAt(self, whichItem, x, y)
    return UnitUseItemPoint(self.handle, whichItem.handle, x, y)
end
function Unit.prototype.useItemTarget(self, whichItem, target)
    return UnitUseItemTarget(self.handle, whichItem.handle, target.handle)
end
function Unit.prototype.wakeUp(self)
    UnitWakeUp(self.handle)
end
function Unit.prototype.waygateGetDestinationX(self)
    return WaygateGetDestinationX(self.handle)
end
function Unit.prototype.waygateGetDestinationY(self)
    return WaygateGetDestinationY(self.handle)
end
function Unit.prototype.waygateSetDestination(self, x, y)
    WaygateSetDestination(self.handle, x, y)
end
function Unit.foodMadeByType(self, unitId)
    return GetFoodMade(unitId)
end
function Unit.foodUsedByType(self, unitId)
    return GetFoodUsed(unitId)
end
function Unit.fromEnum(self)
    return self:fromHandle(GetEnumUnit())
end
function Unit.fromEvent(self)
    return self:fromHandle(GetTriggerUnit())
end
function Unit.fromFilter(self)
    return self:fromHandle(GetFilterUnit())
end
function Unit.fromHandle(self, handle)
    local ____handle_7
    if handle then
        ____handle_7 = self:getObject(handle)
    else
        ____handle_7 = nil
    end
    return ____handle_7
end
function Unit.getPointValueByType(self, unitType)
    return GetUnitPointValueByType(unitType)
end
function Unit.isUnitIdHero(self, unitId)
    return IsHeroUnitId(unitId)
end
function Unit.isUnitIdType(self, unitId, whichUnitType)
    return IsUnitIdType(unitId, whichUnitType)
end
function Unit.prototype.setPreselectUIVisible(self, value)
    DzSetUnitPreselectUIVisible(self.handle, value)
end
__TS__SetDescriptor(
    Unit.prototype,
    "acquireRange",
    {
        get = function(self)
            return GetUnitAcquireRange(self.handle)
        end,
        set = function(self, value)
            SetUnitAcquireRange(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "agility",
    {
        get = function(self)
            return GetHeroAgi(self.handle, false)
        end,
        set = function(self, value)
            SetHeroAgi(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "armor",
    {
        get = function(self)
            return GetUnitState(
                self.handle,
                UNIT_STATE_DEFEND_WHITE()
            )
        end,
        set = function(self, armorAmount)
            SetUnitState(
                self.handle,
                UNIT_STATE_DEFEND_WHITE(),
                armorAmount
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "canSleep",
    {
        get = function(self)
            return UnitCanSleep(self.handle)
        end,
        set = function(self, flag)
            UnitAddSleep(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "color",
    {set = function(self, whichColor)
        SetUnitColor(self.handle, whichColor)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "currentOrder",
    {get = function(self)
        return GetUnitCurrentOrder(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultAcquireRange",
    {get = function(self)
        return GetUnitDefaultAcquireRange(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultFlyHeight",
    {get = function(self)
        return GetUnitDefaultFlyHeight(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultMoveSpeed",
    {get = function(self)
        return GetUnitDefaultMoveSpeed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultPropWindow",
    {get = function(self)
        return GetUnitDefaultPropWindow(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "defaultTurnSpeed",
    {get = function(self)
        return GetUnitDefaultTurnSpeed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "experience",
    {
        get = function(self)
            return GetHeroXP(self.handle)
        end,
        set = function(self, newXpVal)
            SetHeroXP(self.handle, newXpVal, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "facing",
    {
        get = function(self)
            return GetUnitFacing(self.handle)
        end,
        set = function(self, value)
            SetUnitFacing(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "foodMade",
    {get = function(self)
        return GetUnitFoodMade(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "foodUsed",
    {get = function(self)
        return GetUnitFoodUsed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "ignoreAlarmToggled",
    {get = function(self)
        return UnitIgnoreAlarmToggled(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "intelligence",
    {
        get = function(self)
            return GetHeroInt(self.handle, false)
        end,
        set = function(self, value)
            SetHeroInt(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "inventorySize",
    {get = function(self)
        return UnitInventorySize(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "invulnerable",
    {set = function(self, flag)
        SetUnitInvulnerable(self.handle, flag)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "level",
    {get = function(self)
        return GetUnitLevel(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "mana",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MANA())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MANA(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "maxLife",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MAX_LIFE())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MAX_LIFE(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "maxMana",
    {
        get = function(self)
            return self:getState(UNIT_STATE_MAX_MANA())
        end,
        set = function(self, value)
            self:setState(
                UNIT_STATE_MAX_MANA(),
                value
            )
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "moveSpeed",
    {
        get = function(self)
            return GetUnitMoveSpeed(self.handle)
        end,
        set = function(self, value)
            SetUnitMoveSpeed(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "name",
    {
        get = function(self)
            return GetUnitName(self.handle) or ""
        end,
        set = function(self, value)
            DzSetUnitName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "nameProper",
    {
        get = function(self)
            return GetHeroProperName(self.handle) or ""
        end,
        set = function(self, value)
            DzSetUnitProperName(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "owner",
    {
        get = function(self)
            return MapPlayer:fromHandle(GetOwningPlayer(self.handle))
        end,
        set = function(self, whichPlayer)
            SetUnitOwner(self.handle, whichPlayer.handle, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "paused",
    {
        get = function(self)
            return IsUnitPaused(self.handle)
        end,
        set = function(self, flag)
            PauseUnit(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "point",
    {
        get = function(self)
            return Point:fromHandle(GetUnitLoc(self.handle))
        end,
        set = function(self, whichPoint)
            SetUnitPositionLoc(self.handle, whichPoint.handle)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "pointValue",
    {get = function(self)
        return GetUnitPointValue(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "propWindow",
    {
        get = function(self)
            return GetUnitPropWindow(self.handle)
        end,
        set = function(self, newPropWindowAngle)
            SetUnitPropWindow(self.handle, newPropWindowAngle)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "race",
    {get = function(self)
        return GetUnitRace(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyDestructable",
    {get = function(self)
        return Destructable:fromHandle(GetUnitRallyDestructable(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyPoint",
    {get = function(self)
        return Point:fromHandle(GetUnitRallyPoint(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "rallyUnit",
    {get = function(self)
        return ____exports.Unit:fromHandle(GetUnitRallyUnit(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "resourceAmount",
    {
        get = function(self)
            return GetResourceAmount(self.handle)
        end,
        set = function(self, amount)
            SetResourceAmount(self.handle, amount)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "show",
    {
        get = function(self)
            return not IsUnitHidden(self.handle)
        end,
        set = function(self, flag)
            ShowUnit(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "skillPoints",
    {
        get = function(self)
            return GetHeroSkillPoints(self.handle)
        end,
        set = function(self, skillPointDelta)
            UnitModifySkillPoints(self.handle, skillPointDelta)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "sleeping",
    {get = function(self)
        return UnitIsSleeping(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "strength",
    {
        get = function(self)
            return GetHeroStr(self.handle, false)
        end,
        set = function(self, value)
            SetHeroStr(self.handle, value, true)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "turnSpeed",
    {
        get = function(self)
            return GetUnitTurnSpeed(self.handle)
        end,
        set = function(self, value)
            SetUnitTurnSpeed(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "typeId",
    {get = function(self)
        return GetUnitTypeId(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "userData",
    {
        get = function(self)
            return GetUnitUserData(self.handle)
        end,
        set = function(self, value)
            SetUnitUserData(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "waygateActive",
    {
        get = function(self)
            return WaygateIsActive(self.handle)
        end,
        set = function(self, flag)
            WaygateActivate(self.handle, flag)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "x",
    {
        get = function(self)
            return GetUnitX(self.handle)
        end,
        set = function(self, value)
            SetUnitX(self.handle, value)
        end
    },
    true
)
__TS__SetDescriptor(
    Unit.prototype,
    "y",
    {
        get = function(self)
            return GetUnitY(self.handle)
        end,
        set = function(self, value)
            SetUnitY(self.handle, value)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.group"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
local ____unit = require("lua_modules.@eiriksgata.wc3ts.src.handles.unit")
local Unit = ____unit.Unit
____exports.Group = __TS__Class()
local Group = ____exports.Group
Group.name = "Group"
__TS__ClassExtends(Group, Handle)
function Group.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateGroup()
    if handle == nil then
        Error(nil, "w3ts failed to create group handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Group.create(self)
    local handle = CreateGroup()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Group.prototype.addUnit(self, whichUnit)
    return GroupAddUnit(self.handle, whichUnit.handle)
end
function Group.prototype.clear(self)
    GroupClear(self.handle)
end
function Group.prototype.destroy(self)
    DestroyGroup(self.handle)
end
function Group.prototype.enumUnitsInRange(self, x, y, radius, filter)
    GroupEnumUnitsInRange(
        self.handle,
        x,
        y,
        radius,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsInRangeCounted(self, x, y, radius, filter, countLimit)
    GroupEnumUnitsInRangeCounted(
        self.handle,
        x,
        y,
        radius,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsInRangeOfPoint(self, whichPoint, radius, filter)
    GroupEnumUnitsInRangeOfLoc(
        self.handle,
        whichPoint.handle,
        radius,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsInRangeOfPointCounted(self, whichPoint, radius, filter, countLimit)
    GroupEnumUnitsInRangeOfLocCounted(
        self.handle,
        whichPoint.handle,
        radius,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsInRect(self, r, filter)
    GroupEnumUnitsInRect(
        self.handle,
        r.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsInRectCounted(self, r, filter, countLimit)
    GroupEnumUnitsInRectCounted(
        self.handle,
        r.handle,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsOfPlayer(self, whichPlayer, filter)
    GroupEnumUnitsOfPlayer(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsOfType(self, unitName, filter)
    GroupEnumUnitsOfType(
        self.handle,
        unitName,
        type(filter) == "function" and Filter(filter) or filter
    )
end
function Group.prototype.enumUnitsOfTypeCounted(self, unitName, filter, countLimit)
    GroupEnumUnitsOfTypeCounted(
        self.handle,
        unitName,
        type(filter) == "function" and Filter(filter) or filter,
        countLimit
    )
end
function Group.prototype.enumUnitsSelected(self, whichPlayer, filter)
    GroupEnumUnitsSelected(
        self.handle,
        whichPlayer.handle,
        type(filter) == "function" and Filter(filter) or filter
    )
end
Group.prototype["for"] = function(self, callback)
    ForGroup(self.handle, callback)
end
function Group.prototype.getUnits(self)
    local units = {}
    self["for"](
        self,
        function()
            local u = Unit:fromFilter()
            if u then
                units[#units + 1] = u
            end
        end
    )
    return units
end
function Group.prototype.hasUnit(self, whichUnit)
    return IsUnitInGroup(whichUnit.handle, self.handle)
end
function Group.prototype.orderCoords(self, order, x, y)
    if type(order) == "string" then
        GroupPointOrder(self.handle, order, x, y)
    else
        GroupPointOrderById(self.handle, order, x, y)
    end
end
function Group.prototype.orderImmediate(self, order)
    if type(order) == "string" then
        GroupImmediateOrder(self.handle, order)
    else
        GroupImmediateOrderById(self.handle, order)
    end
end
function Group.prototype.orderPoint(self, order, whichPoint)
    if type(order) == "string" then
        GroupPointOrderLoc(self.handle, order, whichPoint.handle)
    else
        GroupPointOrderByIdLoc(self.handle, order, whichPoint.handle)
    end
end
function Group.prototype.orderTarget(self, order, targetWidget)
    if type(order) == "string" then
        GroupTargetOrder(self.handle, order, targetWidget.handle)
    else
        GroupTargetOrderById(self.handle, order, targetWidget.handle)
    end
end
function Group.prototype.removeUnit(self, whichUnit)
    return GroupRemoveUnit(self.handle, whichUnit.handle)
end
function Group.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Group.getEnumUnit(self)
    return Unit:fromHandle(GetEnumUnit())
end
function Group.getFilterUnit(self)
    return Unit:fromHandle(GetFilterUnit())
end
__TS__SetDescriptor(
    Group.prototype,
    "first",
    {get = function(self)
        return Unit:fromHandle(FirstOfGroup(self.handle))
    end},
    true
)
__TS__SetDescriptor(
    Group.prototype,
    "size",
    {get = function(self)
        local size = 0
        self["for"](
            self,
            function()
                size = size + 1
            end
        )
        return size
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.image"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.ImageType = ImageType or ({})
____exports.ImageType.Selection = 1
____exports.ImageType[____exports.ImageType.Selection] = "Selection"
____exports.ImageType.Indicator = 2
____exports.ImageType[____exports.ImageType.Indicator] = "Indicator"
____exports.ImageType.OcclusionMask = 3
____exports.ImageType[____exports.ImageType.OcclusionMask] = "OcclusionMask"
____exports.ImageType.Ubersplat = 4
____exports.ImageType[____exports.ImageType.Ubersplat] = "Ubersplat"
____exports.Image = __TS__Class()
local Image = ____exports.Image
Image.name = "Image"
__TS__ClassExtends(Image, Handle)
function Image.prototype.____constructor(self, file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateImage(
        file,
        sizeX,
        sizeY,
        sizeZ,
        posX,
        posY,
        posZ,
        originX,
        originY,
        originZ,
        imageType
    )
    if handle == nil then
        Error(nil, "w3ts failed to create image handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Image.create(self, file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType)
    local handle = CreateImage(
        file,
        sizeX,
        sizeY,
        sizeZ,
        posX,
        posY,
        posZ,
        originX,
        originY,
        originZ,
        imageType
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Image.prototype.destroy(self)
    DestroyImage(self.handle)
end
function Image.prototype.setAboveWater(self, flag, useWaterAlpha)
    SetImageAboveWater(self.handle, flag, useWaterAlpha)
end
function Image.prototype.setColor(self, red, green, blue, alpha)
    SetImageColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Image.prototype.setConstantHeight(self, flag, height)
    SetImageConstantHeight(self.handle, flag, height)
end
function Image.prototype.setPosition(self, x, y, z)
    SetImagePosition(self.handle, x, y, z)
end
function Image.prototype.setRender(self, flag)
    SetImageRenderAlways(self.handle, flag)
end
function Image.prototype.setType(self, imageType)
    SetImageType(self.handle, imageType)
end
function Image.prototype.show(self, flag)
    ShowImage(self.handle, flag)
end
function Image.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.leaderboard"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Leaderboard = __TS__Class()
local Leaderboard = ____exports.Leaderboard
Leaderboard.name = "Leaderboard"
__TS__ClassExtends(Leaderboard, Handle)
function Leaderboard.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateLeaderboard()
    if handle == nil then
        Error(nil, "w3ts failed to create leaderboard handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Leaderboard.create(self)
    local handle = CreateLeaderboard()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Leaderboard.prototype.addItem(self, label, value, p)
    LeaderboardAddItem(self.handle, label, value, p.handle)
end
function Leaderboard.prototype.clear(self)
    LeaderboardClear(self.handle)
end
function Leaderboard.prototype.destroy(self)
    DestroyLeaderboard(self.handle)
end
function Leaderboard.prototype.display(self, flag)
    if flag == nil then
        flag = true
    end
    LeaderboardDisplay(self.handle, flag)
end
function Leaderboard.prototype.getPlayerIndex(self, p)
    return LeaderboardGetPlayerIndex(self.handle, p.handle)
end
function Leaderboard.prototype.hasPlayerItem(self, p)
    LeaderboardHasPlayerItem(self.handle, p.handle)
end
function Leaderboard.prototype.removeItem(self, index)
    LeaderboardRemoveItem(self.handle, index)
end
function Leaderboard.prototype.removePlayerItem(self, p)
    LeaderboardRemovePlayerItem(self.handle, p.handle)
end
function Leaderboard.prototype.setItemLabel(self, item, label)
    LeaderboardSetItemLabel(self.handle, item, label)
end
function Leaderboard.prototype.setItemLabelColor(self, item, red, green, blue, alpha)
    LeaderboardSetItemLabelColor(
        self.handle,
        item,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.setItemStyle(self, item, showLabel, showValues, showIcons)
    if showLabel == nil then
        showLabel = true
    end
    if showValues == nil then
        showValues = true
    end
    if showIcons == nil then
        showIcons = true
    end
    LeaderboardSetItemStyle(
        self.handle,
        item,
        showLabel,
        showValues,
        showIcons
    )
end
function Leaderboard.prototype.setItemValue(self, item, value)
    LeaderboardSetItemValue(self.handle, item, value)
end
function Leaderboard.prototype.setItemValueColor(self, item, red, green, blue, alpha)
    LeaderboardSetItemValueColor(
        self.handle,
        item,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.setLabelColor(self, red, green, blue, alpha)
    LeaderboardSetLabelColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.setPlayerBoard(self, p)
    PlayerSetLeaderboard(p.handle, self.handle)
end
function Leaderboard.prototype.setStyle(self, showLabel, showNames, showValues, showIcons)
    if showLabel == nil then
        showLabel = true
    end
    if showNames == nil then
        showNames = true
    end
    if showValues == nil then
        showValues = true
    end
    if showIcons == nil then
        showIcons = true
    end
    LeaderboardSetStyle(
        self.handle,
        showLabel,
        showNames,
        showValues,
        showIcons
    )
end
function Leaderboard.prototype.setValueColor(self, red, green, blue, alpha)
    LeaderboardSetValueColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Leaderboard.prototype.sortByLabel(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByLabel(self.handle, asc)
end
function Leaderboard.prototype.sortByPlayer(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByPlayer(self.handle, asc)
end
function Leaderboard.prototype.sortByValue(self, asc)
    if asc == nil then
        asc = true
    end
    LeaderboardSortItemsByValue(self.handle, asc)
end
function Leaderboard.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Leaderboard.fromPlayer(self, p)
    return self:fromHandle(PlayerGetLeaderboard(p.handle))
end
__TS__SetDescriptor(
    Leaderboard.prototype,
    "displayed",
    {get = function(self)
        return IsLeaderboardDisplayed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Leaderboard.prototype,
    "itemCount",
    {
        get = function(self)
            return LeaderboardGetItemCount(self.handle)
        end,
        set = function(self, count)
            LeaderboardSetSizeByItemCount(self.handle, count)
        end
    },
    true
)
__TS__SetDescriptor(
    Leaderboard.prototype,
    "label",
    {
        get = function(self)
            return LeaderboardGetLabelText(self.handle) or ""
        end,
        set = function(self, value)
            LeaderboardSetLabel(self.handle, value)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.multiboard"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.MultiboardItem = __TS__Class()
local MultiboardItem = ____exports.MultiboardItem
MultiboardItem.name = "MultiboardItem"
__TS__ClassExtends(MultiboardItem, Handle)
function MultiboardItem.prototype.____constructor(self, board, x, y)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = MultiboardGetItem(board.handle, x - 1, y - 1)
    if handle == nil then
        Error(nil, "w3ts failed to create multiboarditem handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function MultiboardItem.create(self, board, x, y)
    local handle = MultiboardGetItem(board.handle, x - 1, y - 1)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function MultiboardItem.prototype.destroy(self)
    MultiboardReleaseItem(self.handle)
end
function MultiboardItem.prototype.setIcon(self, icon)
    MultiboardSetItemIcon(self.handle, icon)
end
function MultiboardItem.prototype.setStyle(self, showValue, showIcon)
    MultiboardSetItemStyle(self.handle, showValue, showIcon)
end
function MultiboardItem.prototype.setValue(self, val)
    MultiboardSetItemValue(self.handle, val)
end
function MultiboardItem.prototype.setValueColor(self, red, green, blue, alpha)
    MultiboardSetItemValueColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function MultiboardItem.prototype.setWidth(self, width)
    MultiboardSetItemWidth(self.handle, width)
end
function MultiboardItem.fromHandle(self, handle)
    return self:getObject(handle)
end
____exports.Multiboard = __TS__Class()
local Multiboard = ____exports.Multiboard
Multiboard.name = "Multiboard"
__TS__ClassExtends(Multiboard, Handle)
function Multiboard.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateMultiboard()
    if handle == nil then
        Error(nil, "w3ts failed to create multiboard handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Multiboard.create(self)
    local handle = CreateMultiboard()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Multiboard.prototype.clear(self)
    MultiboardClear(self.handle)
end
function Multiboard.prototype.createItem(self, x, y)
    return ____exports.MultiboardItem:create(self, x, y)
end
function Multiboard.prototype.destroy(self)
    DestroyMultiboard(self.handle)
end
function Multiboard.prototype.display(self, show)
    MultiboardDisplay(self.handle, show)
end
function Multiboard.prototype.minimize(self, flag)
    MultiboardMinimize(self.handle, flag)
end
function Multiboard.prototype.minimized(self)
    return IsMultiboardMinimized(self.handle)
end
function Multiboard.prototype.setItemsIcons(self, icon)
    MultiboardSetItemsIcon(self.handle, icon)
end
function Multiboard.prototype.setItemsStyle(self, showValues, showIcons)
    MultiboardSetItemsStyle(self.handle, showValues, showIcons)
end
function Multiboard.prototype.setItemsValue(self, value)
    MultiboardSetItemsValue(self.handle, value)
end
function Multiboard.prototype.setItemsValueColor(self, red, green, blue, alpha)
    MultiboardSetItemsValueColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Multiboard.prototype.setItemsWidth(self, width)
    MultiboardSetItemsWidth(self.handle, width)
end
function Multiboard.prototype.setTitleTextColor(self, red, green, blue, alpha)
    MultiboardSetTitleTextColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function Multiboard.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
function Multiboard.suppressDisplay(self, flag)
    MultiboardSuppressDisplay(flag)
end
__TS__SetDescriptor(
    Multiboard.prototype,
    "columns",
    {
        get = function(self)
            return MultiboardGetColumnCount(self.handle)
        end,
        set = function(self, count)
            MultiboardSetColumnCount(self.handle, count)
        end
    },
    true
)
__TS__SetDescriptor(
    Multiboard.prototype,
    "displayed",
    {get = function(self)
        return IsMultiboardDisplayed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Multiboard.prototype,
    "rows",
    {
        get = function(self)
            return MultiboardGetRowCount(self.handle)
        end,
        set = function(self, count)
            MultiboardSetRowCount(self.handle, count)
        end
    },
    true
)
__TS__SetDescriptor(
    Multiboard.prototype,
    "title",
    {
        get = function(self)
            return MultiboardGetTitleText(self.handle) or ""
        end,
        set = function(self, label)
            MultiboardSetTitleText(self.handle, label)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.quest"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.QuestItem = __TS__Class()
local QuestItem = ____exports.QuestItem
QuestItem.name = "QuestItem"
__TS__ClassExtends(QuestItem, Handle)
function QuestItem.prototype.____constructor(self, whichQuest)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = QuestCreateItem(whichQuest.handle)
    if handle == nil then
        Error(nil, "w3ts failed to create questitem handle.")
    end
    Handle.prototype.____constructor(self, handle)
    self.quest = whichQuest
end
function QuestItem.create(self, whichQuest)
    local handle = QuestCreateItem(whichQuest.handle)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        values.quest = whichQuest
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function QuestItem.prototype.setDescription(self, description)
    QuestItemSetDescription(self.handle, description)
end
__TS__SetDescriptor(
    QuestItem.prototype,
    "completed",
    {
        get = function(self)
            return IsQuestItemCompleted(self.handle)
        end,
        set = function(self, completed)
            QuestItemSetCompleted(self.handle, completed)
        end
    },
    true
)
____exports.Quest = __TS__Class()
local Quest = ____exports.Quest
Quest.name = "Quest"
__TS__ClassExtends(Quest, Handle)
function Quest.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateQuest()
    if handle == nil then
        Error(nil, "w3ts failed to create quest handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Quest.create(self)
    local handle = CreateQuest()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Quest.prototype.addItem(self, description)
    local questItem = ____exports.QuestItem:create(self)
    if questItem ~= nil then
        questItem:setDescription(description)
    end
    return questItem
end
function Quest.prototype.destroy(self)
    DestroyQuest(self.handle)
end
function Quest.prototype.setDescription(self, description)
    QuestSetDescription(self.handle, description)
end
function Quest.prototype.setIcon(self, iconPath)
    QuestSetIconPath(self.handle, iconPath)
end
function Quest.prototype.setTitle(self, title)
    QuestSetTitle(self.handle, title)
end
function Quest.flashQuestDialogButton(self)
    FlashQuestDialogButton()
end
function Quest.forceQuestDialogUpdate(self)
    ForceQuestDialogUpdate()
end
function Quest.fromHandle(self, handle)
    local ____handle_2
    if handle then
        ____handle_2 = self:getObject(handle)
    else
        ____handle_2 = nil
    end
    return ____handle_2
end
__TS__SetDescriptor(
    Quest.prototype,
    "completed",
    {
        get = function(self)
            return IsQuestCompleted(self.handle)
        end,
        set = function(self, completed)
            QuestSetCompleted(self.handle, completed)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "discovered",
    {
        get = function(self)
            return IsQuestDiscovered(self.handle)
        end,
        set = function(self, discovered)
            QuestSetDiscovered(self.handle, discovered)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "enabled",
    {
        get = function(self)
            return IsQuestEnabled(self.handle)
        end,
        set = function(self, enabled)
            QuestSetEnabled(self.handle, enabled)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "failed",
    {
        get = function(self)
            return IsQuestFailed(self.handle)
        end,
        set = function(self, failed)
            QuestSetFailed(self.handle, failed)
        end
    },
    true
)
__TS__SetDescriptor(
    Quest.prototype,
    "required",
    {
        get = function(self)
            return IsQuestRequired(self.handle)
        end,
        set = function(self, required)
            QuestSetRequired(self.handle, required)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.region"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Region = __TS__Class()
local Region = ____exports.Region
Region.name = "Region"
__TS__ClassExtends(Region, Handle)
function Region.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateRegion()
    if handle == nil then
        Error(nil, "w3ts failed to create rect handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Region.create(self)
    local handle = CreateRegion()
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Region.prototype.addCell(self, x, y)
    RegionAddCell(self.handle, x, y)
end
function Region.prototype.addCellPoint(self, whichPoint)
    RegionAddCellAtLoc(self.handle, whichPoint.handle)
end
function Region.prototype.addRect(self, r)
    RegionAddRect(self.handle, r.handle)
end
function Region.prototype.clearCell(self, x, y)
    RegionClearCell(self.handle, x, y)
end
function Region.prototype.clearCellPoint(self, whichPoint)
    RegionClearCellAtLoc(self.handle, whichPoint.handle)
end
function Region.prototype.clearRect(self, r)
    RegionClearRect(self.handle, r.handle)
end
function Region.prototype.containsCoords(self, x, y)
    return IsPointInRegion(self.handle, x, y)
end
function Region.prototype.containsPoint(self, whichPoint)
    IsLocationInRegion(self.handle, whichPoint.handle)
end
function Region.prototype.containsUnit(self, whichUnit)
    return IsUnitInRegion(self.handle, whichUnit.handle)
end
function Region.prototype.destroy(self)
    RemoveRegion(self.handle)
end
function Region.fromEvent(self)
    return self:fromHandle(GetTriggeringRegion())
end
function Region.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.texttag"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
local bj_DEGTORAD = ____define.bj_DEGTORAD
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.TextTag = __TS__Class()
local TextTag = ____exports.TextTag
TextTag.name = "TextTag"
__TS__ClassExtends(TextTag, Handle)
function TextTag.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTextTag()
    if handle == nil then
        Error(nil, "w3ts failed to create texttag handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function TextTag.create(self)
    local handle = CreateTextTag()
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function TextTag.prototype.destroy(self)
    DestroyTextTag(self.handle)
end
function TextTag.prototype.setAge(self, age)
    SetTextTagAge(self.handle, age)
end
function TextTag.prototype.setColor(self, red, green, blue, alpha)
    SetTextTagColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function TextTag.prototype.setFadepoint(self, fadepoint)
    SetTextTagFadepoint(self.handle, fadepoint)
end
function TextTag.prototype.setLifespan(self, lifespan)
    SetTextTagLifespan(self.handle, lifespan)
end
function TextTag.prototype.setPermanent(self, flag)
    SetTextTagPermanent(self.handle, flag)
end
function TextTag.prototype.setPos(self, x, y, heightOffset)
    SetTextTagPos(self.handle, x, y, heightOffset)
end
function TextTag.prototype.setPosUnit(self, u, heightOffset)
    SetTextTagPosUnit(self.handle, u.handle, heightOffset)
end
function TextTag.prototype.setSuspended(self, flag)
    SetTextTagSuspended(self.handle, flag)
end
function TextTag.prototype.setText(self, s, height, adjustHeight)
    if adjustHeight == nil then
        adjustHeight = false
    end
    if adjustHeight then
        height = height * 0.0023
    end
    SetTextTagText(self.handle, s, height)
end
function TextTag.prototype.setVelocity(self, xvel, yvel)
    SetTextTagVelocity(self.handle, xvel, yvel)
end
function TextTag.prototype.setVelocityAngle(self, speed, angle)
    local vel = speed * 0.071 / 128
    self:setVelocity(
        vel * Cos(angle * bj_DEGTORAD),
        vel * Sin(angle * bj_DEGTORAD)
    )
end
function TextTag.prototype.setVisible(self, flag)
    SetTextTagVisibility(self.handle, flag)
end
function TextTag.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.timer"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Timer = __TS__Class()
local Timer = ____exports.Timer
Timer.name = "Timer"
__TS__ClassExtends(Timer, Handle)
function Timer.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTimer()
    if handle == nil then
        Error(nil, "w3ts failed to create timer handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Timer.create(self)
    local handle = CreateTimer()
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Timer.prototype.destroy(self)
    DestroyTimer(self.handle)
    return self
end
function Timer.prototype.pause(self)
    PauseTimer(self.handle)
    return self
end
function Timer.prototype.resume(self)
    ResumeTimer(self.handle)
    return self
end
function Timer.prototype.start(self, timeout, periodic, handlerFunc)
    TimerStart(self.handle, timeout, periodic, handlerFunc)
    return self
end
function Timer.fromExpired(self)
    return self:fromHandle(GetExpiredTimer())
end
function Timer.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Timer.prototype,
    "elapsed",
    {get = function(self)
        return TimerGetElapsed(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Timer.prototype,
    "remaining",
    {get = function(self)
        return TimerGetRemaining(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Timer.prototype,
    "timeout",
    {get = function(self)
        return TimerGetTimeout(self.handle)
    end},
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.timerdialog"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.TimerDialog = __TS__Class()
local TimerDialog = ____exports.TimerDialog
TimerDialog.name = "TimerDialog"
__TS__ClassExtends(TimerDialog, Handle)
function TimerDialog.prototype.____constructor(self, t)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTimerDialog(t.handle)
    if handle == nil then
        Error(nil, "w3ts failed to create timer handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function TimerDialog.create(self, t)
    local handle = CreateTimerDialog(t.handle)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function TimerDialog.prototype.destroy(self)
    DestroyTimerDialog(self.handle)
end
function TimerDialog.prototype.setSpeed(self, speedMultFactor)
    TimerDialogSetSpeed(self.handle, speedMultFactor)
end
function TimerDialog.prototype.setTimeRemaining(self, value)
    TimerDialogSetRealTimeRemaining(self.handle, value)
end
function TimerDialog.prototype.setTitle(self, title)
    TimerDialogSetTitle(self.handle, title)
end
function TimerDialog.prototype.setTitleColor(self, red, green, blue, alpha)
    TimerDialogSetTitleColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function TimerDialog.prototype.setTimeColor(self, red, green, blue, alpha)
    TimerDialogSetTimeColor(
        self.handle,
        red,
        green,
        blue,
        alpha
    )
end
function TimerDialog.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    TimerDialog.prototype,
    "display",
    {
        get = function(self)
            return IsTimerDialogDisplayed(self.handle)
        end,
        set = function(self, display)
            TimerDialogDisplay(self.handle, display)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.trigger"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__ObjectDefineProperty(target, key, desc)
    local luaKey = type(key) == "number" and key + 1 or key
    local value = rawget(target, luaKey)
    local hasGetterOrSetter = desc.get ~= nil or desc.set ~= nil
    local descriptor
    if hasGetterOrSetter then
        if value ~= nil then
            error(
                "Cannot redefine property: " .. tostring(key),
                0
            )
        end
        descriptor = desc
    else
        local valueExists = value ~= nil
        local ____desc_set_4 = desc.set
        local ____desc_get_5 = desc.get
        local ____desc_configurable_0 = desc.configurable
        if ____desc_configurable_0 == nil then
            ____desc_configurable_0 = valueExists
        end
        local ____desc_enumerable_1 = desc.enumerable
        if ____desc_enumerable_1 == nil then
            ____desc_enumerable_1 = valueExists
        end
        local ____desc_writable_2 = desc.writable
        if ____desc_writable_2 == nil then
            ____desc_writable_2 = valueExists
        end
        local ____temp_3
        if desc.value ~= nil then
            ____temp_3 = desc.value
        else
            ____temp_3 = value
        end
        descriptor = {
            set = ____desc_set_4,
            get = ____desc_get_5,
            configurable = ____desc_configurable_0,
            enumerable = ____desc_enumerable_1,
            writable = ____desc_writable_2,
            value = ____temp_3
        }
    end
    __TS__SetDescriptor(target, luaKey, descriptor)
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
local bj_MAX_PLAYER_SLOTS = ____define.bj_MAX_PLAYER_SLOTS
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Trigger = __TS__Class()
local Trigger = ____exports.Trigger
Trigger.name = "Trigger"
__TS__ClassExtends(Trigger, Handle)
function Trigger.prototype.____constructor(self)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateTrigger()
    if handle == nil then
        Error(nil, "w3ts failed to create trigger handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Trigger.create(self)
    local handle = CreateTrigger()
    local obj = self:getObject(handle)
    local values = {}
    values.handle = handle
    return __TS__ObjectAssign(obj, values)
end
function Trigger.prototype.addAction(self, actionFunc)
    return TriggerAddAction(self.handle, actionFunc)
end
function Trigger.prototype.addCondition(self, condition)
    if type(condition) == "function" then
        local cf = Condition(condition)
        return cf ~= nil and TriggerAddCondition(self.handle, cf) or nil
    end
    return TriggerAddCondition(self.handle, condition)
end
function Trigger.prototype.destroy(self)
    DestroyTrigger(self.handle)
end
function Trigger.prototype.eval(self)
    return TriggerEvaluate(self.handle)
end
function Trigger.prototype.exec(self)
    return TriggerExecute(self.handle)
end
function Trigger.prototype.execWait(self)
    TriggerExecuteWait(self.handle)
end
function Trigger.prototype.registerAnyUnitEvent(self, whichPlayerUnitEvent)
    do
        local i = 0
        while i < bj_MAX_PLAYER_SLOTS do
            TriggerRegisterPlayerUnitEvent(
                self.handle,
                Player(i),
                whichPlayerUnitEvent,
                function()
                    return true
                end
            )
            i = i + 1
        end
    end
end
function Trigger.prototype.registerDeathEvent(self, whichWidget)
    return TriggerRegisterDeathEvent(self.handle, whichWidget.handle)
end
function Trigger.prototype.registerDialogButtonEvent(self, whichButton)
    return TriggerRegisterDialogButtonEvent(self.handle, whichButton.handle)
end
function Trigger.prototype.registerDialogEvent(self, whichDialog)
    return TriggerRegisterDialogEvent(self.handle, whichDialog.handle)
end
function Trigger.prototype.registerEnterRegion(self, whichRegion, filter)
    return TriggerRegisterEnterRegion(
        self.handle,
        whichRegion.handle,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerFilterUnitEvent(self, whichUnit, whichEvent, filter)
    return TriggerRegisterFilterUnitEvent(
        self.handle,
        whichUnit.handle,
        whichEvent,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerGameEvent(self, whichGameEvent)
    return TriggerRegisterGameEvent(self.handle, whichGameEvent)
end
function Trigger.prototype.registerGameStateEvent(self, whichState, opcode, limitval)
    return TriggerRegisterGameStateEvent(self.handle, whichState, opcode, limitval)
end
function Trigger.prototype.registerLeaveRegion(self, whichRegion, filter)
    return TriggerRegisterLeaveRegion(
        self.handle,
        whichRegion.handle,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerPlayerAllianceChange(self, whichPlayer, whichAlliance)
    return TriggerRegisterPlayerAllianceChange(self.handle, whichPlayer.handle, whichAlliance)
end
function Trigger.prototype.registerPlayerChatEvent(self, whichPlayer, chatMessageToDetect, exactMatchOnly)
    return TriggerRegisterPlayerChatEvent(self.handle, whichPlayer.handle, chatMessageToDetect, exactMatchOnly)
end
function Trigger.prototype.registerPlayerEvent(self, whichPlayer, whichPlayerEvent)
    return TriggerRegisterPlayerEvent(self.handle, whichPlayer.handle, whichPlayerEvent)
end
function Trigger.prototype.registerPlayerKeyEvent(self, trig, key, status, sync, funcHandle)
    return DzTriggerRegisterKeyEventByCode(
        trig,
        key,
        status,
        sync,
        funcHandle
    )
end
function Trigger.prototype.registerPlayerMouseEvent(self, trig, btn, status, sync, funcHandle)
    return DzTriggerRegisterMouseEventByCode(
        trig,
        btn,
        status,
        sync,
        funcHandle
    )
end
function Trigger.prototype.registerPlayerStateEvent(self, whichPlayer, whichState, opcode, limitval)
    return TriggerRegisterPlayerStateEvent(
        self.handle,
        whichPlayer.handle,
        whichState,
        opcode,
        limitval
    )
end
function Trigger.prototype.registerPlayerUnitEvent(self, whichPlayer, whichPlayerUnitEvent, filter)
    return TriggerRegisterPlayerUnitEvent(
        self.handle,
        whichPlayer.handle,
        whichPlayerUnitEvent,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerTimerEvent(self, timeout, periodic)
    return TriggerRegisterTimerEvent(self.handle, timeout, periodic)
end
function Trigger.prototype.registerTimerExpireEvent(self, t)
    return TriggerRegisterTimerExpireEvent(self.handle, t)
end
function Trigger.prototype.registerTrackableHitEvent(self, whichTrackable)
    return TriggerRegisterTrackableHitEvent(self.handle, whichTrackable)
end
function Trigger.prototype.registerTrackableTrackEvent(self, whichTrackable)
    return TriggerRegisterTrackableTrackEvent(self.handle, whichTrackable)
end
function Trigger.prototype.registerUnitEvent(self, whichUnit, whichEvent)
    return TriggerRegisterUnitEvent(self.handle, whichUnit.handle, whichEvent)
end
function Trigger.prototype.registerUnitInRange(self, whichUnit, range, filter)
    return TriggerRegisterUnitInRange(
        self.handle,
        whichUnit.handle,
        range,
        type(filter) == "function" and Filter(filter) or (filter or nil)
    )
end
function Trigger.prototype.registerUnitStateEvent(self, whichUnit, whichState, opcode, limitval)
    return TriggerRegisterUnitStateEvent(
        self.handle,
        whichUnit.handle,
        whichState,
        opcode,
        limitval
    )
end
function Trigger.prototype.registerVariableEvent(self, varName, opcode, limitval)
    return TriggerRegisterVariableEvent(self.handle, varName, opcode, limitval)
end
function Trigger.prototype.removeAction(self, whichAction)
    return TriggerRemoveAction(self.handle, whichAction)
end
function Trigger.prototype.removeActions(self)
    return TriggerClearActions(self.handle)
end
function Trigger.prototype.removeCondition(self, whichCondition)
    return TriggerRemoveCondition(self.handle, whichCondition)
end
function Trigger.prototype.removeConditions(self)
    return TriggerClearConditions(self.handle)
end
function Trigger.prototype.reset(self)
    ResetTrigger(self.handle)
end
function Trigger.fromEvent(self)
    return self:fromHandle(GetTriggeringTrigger())
end
function Trigger.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
__TS__SetDescriptor(
    Trigger.prototype,
    "enabled",
    {
        get = function(self)
            return IsTriggerEnabled(self.handle)
        end,
        set = function(self, flag)
            if flag then
                EnableTrigger(self.handle)
            else
                DisableTrigger(self.handle)
            end
        end
    },
    true
)
__TS__SetDescriptor(
    Trigger.prototype,
    "evalCount",
    {get = function(self)
        return GetTriggerEvalCount(self.handle)
    end},
    true
)
__TS__ObjectDefineProperty(
    Trigger,
    "eventId",
    {get = function(self)
        return GetTriggerEventId()
    end}
)
__TS__SetDescriptor(
    Trigger.prototype,
    "execCount",
    {get = function(self)
        return GetTriggerExecCount(self.handle)
    end},
    true
)
__TS__SetDescriptor(
    Trigger.prototype,
    "waitOnSleeps",
    {
        get = function(self)
            return IsTriggerWaitOnSleeps(self.handle)
        end,
        set = function(self, flag)
            TriggerWaitOnSleeps(self.handle, flag)
        end
    },
    true
)
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.ubersplat"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.Ubersplat = __TS__Class()
local Ubersplat = ____exports.Ubersplat
Ubersplat.name = "Ubersplat"
__TS__ClassExtends(Ubersplat, Handle)
function Ubersplat.prototype.____constructor(self, x, y, name, red, green, blue, alpha, forcePaused, noBirthTime)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = CreateUbersplat(
        x,
        y,
        name,
        red,
        green,
        blue,
        alpha,
        forcePaused,
        noBirthTime
    )
    if handle == nil then
        Error(nil, "w3ts failed to create ubersplat handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function Ubersplat.create(self, x, y, name, red, green, blue, alpha, forcePaused, noBirthTime)
    local handle = CreateUbersplat(
        x,
        y,
        name,
        red,
        green,
        blue,
        alpha,
        forcePaused,
        noBirthTime
    )
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function Ubersplat.prototype.destroy(self)
    DestroyUbersplat(self.handle)
end
function Ubersplat.prototype.finish(self)
    FinishUbersplat(self.handle)
end
function Ubersplat.prototype.render(self, flag, always)
    if always == nil then
        always = false
    end
    if always then
        SetUbersplatRenderAlways(self.handle, flag)
    else
        SetUbersplatRender(self.handle, flag)
    end
end
function Ubersplat.prototype.reset(self)
    ResetUbersplat(self.handle)
end
function Ubersplat.prototype.show(self, flag)
    ShowUbersplat(self.handle, flag)
end
function Ubersplat.fromHandle(self, handle)
    local ____handle_0
    if handle then
        ____handle_0 = self:getObject(handle)
    else
        ____handle_0 = nil
    end
    return ____handle_0
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.weathereffect"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____handle = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
local Handle = ____handle.Handle
____exports.WeatherEffect = __TS__Class()
local WeatherEffect = ____exports.WeatherEffect
WeatherEffect.name = "WeatherEffect"
__TS__ClassExtends(WeatherEffect, Handle)
function WeatherEffect.prototype.____constructor(self, where, effectID)
    if Handle:initFromHandle() then
        Handle.prototype.____constructor(self)
        return
    end
    local handle = AddWeatherEffect(where.handle, effectID)
    if handle == nil then
        Error(nil, "w3ts failed to create unit handle.")
    end
    Handle.prototype.____constructor(self, handle)
end
function WeatherEffect.create(self, where, effectID)
    local handle = AddWeatherEffect(where.handle, effectID)
    if handle ~= nil then
        local obj = self:getObject(handle)
        local values = {}
        values.handle = handle
        return __TS__ObjectAssign(obj, values)
    end
    return nil
end
function WeatherEffect.prototype.destroy(self)
    RemoveWeatherEffect(self.handle)
end
function WeatherEffect.prototype.enable(self, flag)
    EnableWeatherEffect(self.handle, flag)
end
function WeatherEffect.fromHandle(self, handle)
    return self:getObject(handle)
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.handles.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.camera")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.destructable")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.dialog")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.effect")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.fogmodifier")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.force")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.frame")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.gamecache")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.group")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.handle")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.image")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.item")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.leaderboard")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.multiboard")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.player")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.point")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.quest")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.rect")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.region")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.sound")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.texttag")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.timer")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.timerdialog")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.trigger")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.ubersplat")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.unit")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.weathereffect")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.widget")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.system.base64"] = function(...) 
-- Lua Library inline imports
local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or 0 / 0
end

local function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local function __TS__StringSubstr(self, from, length)
    if from ~= from then
        from = 0
    end
    if length ~= nil then
        if length ~= length or length <= 0 then
            return ""
        end
        length = length + from
    end
    if from >= 0 then
        from = from + 1
    end
    return string.sub(self, from, length)
end
-- End of Lua Library inline imports
local ____exports = {}
---
-- @noSelfInFile
local chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
--- Encode a string to base64.
-- 
-- @param input The string to encode.
function ____exports.base64Encode(input)
    local output = ""
    do
        local block = 0
        local charCode = 0
        local idx = 0
        local map = chars
        while true do
            local ____temp_1 = #__TS__StringCharAt(
                input,
                math.floor(idx) | 0
            ) > 0
            if not ____temp_1 then
                map = "="
                local ____ = map
                ____temp_1 = idx % 1
            end
            if not ____temp_1 then
                break
            end
            local ____input_0 = input
            idx = idx + 3 / 4
            charCode = __TS__StringCharCodeAt(
                ____input_0,
                math.floor(idx)
            ) or 0
            if math.floor(idx) > #input and charCode == 0 then
                if #output % 4 == 1 then
                    return output .. "="
                end
                return output .. "=="
            end
            if charCode > 255 then
                return output
            end
            block = block << 8 | charCode
            output = output .. __TS__StringCharAt(
                map,
                math.floor(63 & block >> 8 - idx % 1 * 8)
            )
        end
    end
    return output
end
--- Decode a base64 string.
-- 
-- @param input The base64 string to decode.
function ____exports.base64Decode(input)
    local i = #input
    do
        while i > 0 and __TS__StringAccess(input, i) ~= "=" do
            i = i - 1
        end
    end
    local str = __TS__StringSubstr(input, 0, i - 1)
    local output = ""
    if #str % 4 == 1 then
        return output
    end
    local bs = 0
    do
        local bc = 0
        local buffer
        local idx = 0
        while true do
            buffer = __TS__StringCharAt(str, idx)
            if not buffer then
                break
            end
            if #buffer == 0 then
                break
            end
            buffer = (string.find(chars, buffer, nil, true) or 0) - 1
            idx = idx + 1
            local ____temp_4
            local ____temp_3 = ~buffer
            if ____temp_3 then
                bs = bc % 4 ~= 0 and bs * 64 + buffer or buffer
                local ____ = bs
                local ____bc_2 = bc
                bc = ____bc_2 + 1
                ____temp_3 = ____bc_2 % 4 ~= 0
            end
            if ____temp_3 then
                output = output .. string.char(255 & bs >> (-2 * bc & 6))
                ____temp_4 = output
            else
                ____temp_4 = 0
            end
        end
    end
    return output
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.system.binaryreader"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or 0 / 0
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
--- Reads primitive types from a packed binary string.
-- 
-- @example ```ts
-- // Write the values
-- const writer = new BinaryWriter();
-- writer.writeUInt8(5);
-- writer.writeUInt8(32);
-- writer.writeUInt8(78);
-- writer.writeUInt8(200);
-- writer.writeUInt32(12345678);
-- writer.writeString("hello");
-- writer.writeUInt16(45000);
-- 
-- // Read the values
-- const binaryString = writer.toString();
-- const reader = new BinaryReader(binaryString);
-- const values: any[] = [];
-- 
-- values[0] = reader.readUInt8(); // 5
-- values[1] = reader.readUInt8(); // 32
-- values[2] = reader.readUInt8(); // 78
-- values[3] = reader.readUInt8(); // 200
-- values[4] = reader.readUInt32(); // 12345678
-- values[5] = reader.readString(); // hello
-- values[6] = reader.readUInt16(); // 45000
-- ```
____exports.BinaryReader = __TS__Class()
local BinaryReader = ____exports.BinaryReader
BinaryReader.name = "BinaryReader"
function BinaryReader.prototype.____constructor(self, binaryString)
    self.pos = 0
    self.data = binaryString
end
function BinaryReader.prototype.readBytes(self, size)
    local bytes = {}
    do
        local i = 0
        while i < size do
            if self.pos + i >= #self.data then
                bytes[#bytes + 1] = 0
            else
                bytes[#bytes + 1] = __TS__StringCharCodeAt(self.data, self.pos + i)
            end
            i = i + 1
        end
    end
    self.pos = self.pos + size
    return bytes
end
function BinaryReader.prototype.readDouble(self)
    local bytes = self:readBytes(8)
    local arrayBuffer = __TS__New(ArrayBuffer, 8)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 8 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getFloat64(0, false)
end
function BinaryReader.prototype.readFloat(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getFloat32(0, false)
end
function BinaryReader.prototype.readInt16(self)
    local bytes = self:readBytes(2)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 2 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getInt16(0, false)
end
function BinaryReader.prototype.readInt32(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getInt32(0, false)
end
function BinaryReader.prototype.readInt8(self)
    local bytes = self:readBytes(1)
    local arrayBuffer = __TS__New(ArrayBuffer, 1)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint8(0, bytes[1])
    return view:getInt8(0)
end
function BinaryReader.prototype.readString(self)
    local result = ""
    local charCode = __TS__StringCharCodeAt(self.data, self.pos)
    while charCode ~= 0 and self.pos < #self.data do
        result = result .. string.char(charCode)
        self.pos = self.pos + 1
        charCode = __TS__StringCharCodeAt(self.data, self.pos)
    end
    self.pos = self.pos + 1
    return result
end
function BinaryReader.prototype.readUInt16(self)
    local bytes = self:readBytes(2)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 2 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getUint16(0, false)
end
function BinaryReader.prototype.readUInt32(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getUint32(0, false)
end
function BinaryReader.prototype.readUInt8(self)
    local bytes = self:readBytes(1)
    return bytes[1]
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.system.binarywriter"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__StringCharCodeAt(self, index)
    if index ~= index then
        index = 0
    end
    if index < 0 then
        return 0 / 0
    end
    return string.byte(self, index + 1) or 0 / 0
end
-- End of Lua Library inline imports
local ____exports = {}
--- Packs primitive types into a binary string.
-- 
-- @example ```ts
-- // Write the values
-- const writer = new BinaryWriter();
-- writer.writeUInt8(5);
-- writer.writeUInt8(32);
-- writer.writeUInt8(78);
-- writer.writeUInt8(200);
-- writer.writeUInt32(12345678);
-- writer.writeString("hello");
-- writer.writeUInt16(45000);
-- 
-- // Read the values
-- const binaryString = writer.toString();
-- const reader = new BinaryReader(binaryString);
-- const values: any[] = [];
-- 
-- values[0] = reader.readUInt8(); // 5
-- values[1] = reader.readUInt8(); // 32
-- values[2] = reader.readUInt8(); // 78
-- values[3] = reader.readUInt8(); // 200
-- values[4] = reader.readUInt32(); // 12345678
-- values[5] = reader.readString(); // hello
-- values[6] = reader.readUInt16(); // 45000
-- ```
____exports.BinaryWriter = __TS__Class()
local BinaryWriter = ____exports.BinaryWriter
BinaryWriter.name = "BinaryWriter"
function BinaryWriter.prototype.____constructor(self)
    self.buffer = {}
end
function BinaryWriter.prototype.__tostring(self)
    return string.char(table.unpack(self.buffer))
end
function BinaryWriter.prototype.writeDouble(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 8)
    local view = __TS__New(DataView, arrayBuffer)
    view:setFloat64(0, value, false)
    do
        local i = 0
        while i < 8 do
            local ____self_buffer_0 = self.buffer
            ____self_buffer_0[#____self_buffer_0 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeFloat(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setFloat32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_1 = self.buffer
            ____self_buffer_1[#____self_buffer_1 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt16(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt16(0, value, false)
    do
        local i = 0
        while i < 2 do
            local ____self_buffer_2 = self.buffer
            ____self_buffer_2[#____self_buffer_2 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt32(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_3 = self.buffer
            ____self_buffer_3[#____self_buffer_3 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt8(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 1)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt8(0, value)
    local ____self_buffer_4 = self.buffer
    ____self_buffer_4[#____self_buffer_4 + 1] = view:getUint8(0)
end
function BinaryWriter.prototype.writeString(self, value)
    do
        local i = 0
        while i < #value do
            local ____self_buffer_5 = self.buffer
            ____self_buffer_5[#____self_buffer_5 + 1] = __TS__StringCharCodeAt(value, i)
            i = i + 1
        end
    end
    local ____self_buffer_6 = self.buffer
    ____self_buffer_6[#____self_buffer_6 + 1] = 0
end
function BinaryWriter.prototype.writeUInt16(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint16(0, value, false)
    do
        local i = 0
        while i < 2 do
            local ____self_buffer_7 = self.buffer
            ____self_buffer_7[#____self_buffer_7 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeUInt32(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_8 = self.buffer
            ____self_buffer_8[#____self_buffer_8 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeUInt8(self, value)
    local ____self_buffer_9 = self.buffer
    ____self_buffer_9[#____self_buffer_9 + 1] = value & 255
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.system.file"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end
-- End of Lua Library inline imports
local ____exports = {}
---
-- @noSelfInFile
____exports.File = __TS__Class()
local File = ____exports.File
File.name = "File"
function File.prototype.____constructor(self)
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.system.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.system.base64")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.system.binaryreader")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.system.binarywriter")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.system.file")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.utils.color"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local __TS__MathModf = math.modf

local __TS__NumberToString
do
    local radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
    function __TS__NumberToString(self, radix)
        if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
            return tostring(self)
        end
        radix = math.floor(radix)
        if radix < 2 or radix > 36 then
            error("toString() radix argument must be between 2 and 36", 0)
        end
        local integer, fraction = __TS__MathModf(math.abs(self))
        local result = ""
        if radix == 8 then
            result = string.format("%o", integer)
        elseif radix == 16 then
            result = string.format("%x", integer)
        else
            repeat
                do
                    result = __TS__StringAccess(radixChars, integer % radix) .. result
                    integer = math.floor(integer / radix)
                end
            until not (integer ~= 0)
        end
        if fraction ~= 0 then
            result = result .. "."
            local delta = 1e-16
            repeat
                do
                    fraction = fraction * radix
                    delta = delta * radix
                    local digit = math.floor(fraction)
                    result = result .. __TS__StringAccess(radixChars, digit)
                    fraction = fraction - digit
                end
            until not (fraction >= delta)
        end
        if self < 0 then
            result = "-" .. result
        end
        return result
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local toHex, orderedPlayerColors
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
local PLAYER_COLOR_AQUA = ____define.PLAYER_COLOR_AQUA
local PLAYER_COLOR_BLUE = ____define.PLAYER_COLOR_BLUE
local PLAYER_COLOR_BROWN = ____define.PLAYER_COLOR_BROWN
local PLAYER_COLOR_CYAN = ____define.PLAYER_COLOR_CYAN
local PLAYER_COLOR_GREEN = ____define.PLAYER_COLOR_GREEN
local PLAYER_COLOR_LIGHT_BLUE = ____define.PLAYER_COLOR_LIGHT_BLUE
local PLAYER_COLOR_LIGHT_GRAY = ____define.PLAYER_COLOR_LIGHT_GRAY
local PLAYER_COLOR_ORANGE = ____define.PLAYER_COLOR_ORANGE
local PLAYER_COLOR_PINK = ____define.PLAYER_COLOR_PINK
local PLAYER_COLOR_PURPLE = ____define.PLAYER_COLOR_PURPLE
local PLAYER_COLOR_RED = ____define.PLAYER_COLOR_RED
local PLAYER_COLOR_YELLOW = ____define.PLAYER_COLOR_YELLOW
function toHex(value)
    local hex = __TS__NumberToString(value, 16)
    if #hex < 2 then
        hex = "0" .. hex
    end
    return hex
end
____exports.Color = __TS__Class()
local Color = ____exports.Color
Color.name = "Color"
function Color.prototype.____constructor(self, red, green, blue, alpha)
    self.red = red
    self.green = green
    self.blue = blue
    if alpha then
        self.alpha = alpha
    else
        self.alpha = 255
    end
end
function Color.prototype.equals(self, other)
    return self.red == other.red and self.green == other.green and self.blue == other.blue and self.alpha == other.alpha
end
function Color.prototype.playerColorIndex(self)
    local i = 0
    do
        while i < #____exports.playerColors do
            if ____exports.playerColors[i + 1]:equals(self) then
                break
            end
            i = i + 1
        end
    end
    return i
end
__TS__SetDescriptor(
    Color.prototype,
    "code",
    {get = function(self)
        return (("|c" .. toHex(self.alpha)) .. toHex(self.red)) .. toHex(self.green) .. toHex(self.blue)
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "name",
    {get = function(self)
        local index = self:playerColorIndex()
        if index < #____exports.playerColors then
            return ____exports.playerColorNames[index + 1]
        end
        return "unknown"
    end},
    true
)
__TS__SetDescriptor(
    Color.prototype,
    "playerColor",
    {get = function(self)
        local index = self:playerColorIndex()
        if index < #____exports.playerColors then
            return orderedPlayerColors[index + 1]
        end
        return PLAYER_COLOR_RED
    end},
    true
)
____exports.color = function(red, green, blue, alpha) return __TS__New(
    ____exports.Color,
    red,
    green,
    blue,
    alpha
) end
--- The player colors sorted by index. Does not include
-- neutrals colors.
____exports.playerColors = {
    ____exports.color(255, 3, 3),
    ____exports.color(0, 66, 255),
    ____exports.color(28, 230, 185),
    ____exports.color(84, 0, 129),
    ____exports.color(255, 252, 0),
    ____exports.color(254, 138, 14),
    ____exports.color(32, 192, 0),
    ____exports.color(229, 91, 176),
    ____exports.color(149, 150, 151),
    ____exports.color(126, 191, 241),
    ____exports.color(16, 98, 70),
    ____exports.color(78, 42, 3),
    ____exports.color(155, 0, 0),
    ____exports.color(0, 0, 195),
    ____exports.color(0, 234, 255),
    ____exports.color(190, 0, 254),
    ____exports.color(235, 205, 135),
    ____exports.color(248, 164, 139),
    ____exports.color(191, 255, 128),
    ____exports.color(220, 185, 235),
    ____exports.color(80, 79, 85),
    ____exports.color(235, 240, 255),
    ____exports.color(0, 120, 30),
    ____exports.color(164, 111, 51)
}
--- The names of players colors sorted by player index.
____exports.playerColorNames = {
    "red",
    "blue",
    "teal",
    "purple",
    "yellow",
    "orange",
    "green",
    "pink",
    "gray",
    "light blue",
    "dark green",
    "brown",
    "maroon",
    "navy",
    "turquoise",
    "violet",
    "wheat",
    "peach",
    "mint",
    "lavender",
    "coal",
    "snow",
    "emerald",
    "peanut"
}
--- An ordered list of `playercolor`s, for lookup
orderedPlayerColors = {
    PLAYER_COLOR_RED,
    PLAYER_COLOR_BLUE,
    PLAYER_COLOR_CYAN,
    PLAYER_COLOR_PURPLE,
    PLAYER_COLOR_YELLOW,
    PLAYER_COLOR_ORANGE,
    PLAYER_COLOR_GREEN,
    PLAYER_COLOR_PINK,
    PLAYER_COLOR_LIGHT_GRAY,
    PLAYER_COLOR_LIGHT_BLUE,
    PLAYER_COLOR_AQUA,
    PLAYER_COLOR_BROWN
}
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.utils.kkwe"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
function ____exports.DzSetHeroTypeProperName(uid, name)
    EXSetUnitArrayString(uid, 61, 0, name)
    EXSetUnitInteger(uid, 61, 1)
end
--- 设置单位类型名称
-- 设置单位类型ID${单位ID}的名称为${名称}
-- 修改单位类型的显示名称
function ____exports.DzSetUnitTypeName(uid, name)
    EXSetUnitArrayString(uid, 10, 0, name)
    EXSetUnitInteger(uid, 10, 1)
end
--- 判断单位攻击类型
-- 判断${单位}的第${索引}个攻击是否为${攻击类型}
-- 检查单位指定索引的攻击类型
function ____exports.DzIsUnitAttackType(whichUnit, index, attackType)
    return ConvertAttackType(math.floor(GetUnitState(
        whichUnit,
        ConvertUnitState(16 + 19 * index)
    ))) == attackType
end
--- 设置单位攻击类型
-- 设置${单位}的第${索引}个攻击类型为${攻击类型}
-- 修改单位指定索引的攻击类型
function ____exports.DzSetUnitAttackType(whichUnit, index, attackType)
    SetUnitState(
        whichUnit,
        ConvertUnitState(16 + 19 * index),
        GetHandleId(attackType)
    )
end
--- 判断单位防御类型
-- 判断${单位}的防御类型是否为${防御类型}
-- 检查单位的防御类型
function ____exports.DzIsUnitDefenseType(whichUnit, defenseType)
    return math.floor(GetUnitState(
        whichUnit,
        ConvertUnitState(80)
    )) == defenseType
end
--- 设置单位防御类型
-- 设置${单位}的防御类型为${防御类型}
-- 修改单位的防御类型
function ____exports.DzSetUnitDefenseType(whichUnit, defenseType)
    SetUnitState(
        whichUnit,
        ConvertUnitState(80),
        defenseType
    )
end
--- 设置单位数据缓存整数 - 简化版
-- 设置单位ID${单位ID}的数据ID${数据ID}值为${值}
-- 简化版的单位数据缓存设置函数，索引固定为0
function ____exports.KKWESetUnitDataCacheInteger(uid, id, v)
    DzSetUnitDataCacheInteger(uid, id, 0, v)
end
--- 单位UI添加升级IDs
-- 为单位ID${单位ID}在索引${索引}添加升级ID${值}
-- 向单位的升级列表添加新的升级ID
function ____exports.KKWEUnitUIAddUpgradesIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 94, id, v)
end
--- 单位UI添加建造IDs
-- 为单位ID${单位ID}在索引${索引}添加建造ID${值}
-- 向单位的建造列表添加新的建造ID
function ____exports.KKWEUnitUIAddBuildsIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 100, id, v)
end
--- 单位UI添加研究IDs
-- 为单位ID${单位ID}在索引${索引}添加研究ID${值}
-- 向单位的研究列表添加新的研究ID
function ____exports.KKWEUnitUIAddResearchesIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 112, id, v)
end
--- 单位UI添加训练IDs
-- 为单位ID${单位ID}在索引${索引}添加训练ID${值}
-- 向单位的训练列表添加新的训练ID
function ____exports.KKWEUnitUIAddTrainsIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 106, id, v)
end
--- 单位UI添加出售单位IDs
-- 为单位ID${单位ID}在索引${索引}添加出售单位ID${值}
-- 向单位的出售单位列表添加新的单位ID
function ____exports.KKWEUnitUIAddSellsUnitIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 118, id, v)
end
--- 单位UI添加出售物品IDs
-- 为单位ID${单位ID}在索引${索引}添加出售物品ID${值}
-- 向单位的出售物品列表添加新的物品ID
function ____exports.KKWEUnitUIAddSellsItemIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 124, id, v)
end
--- 单位UI添加制造物品IDs
-- 为单位ID${单位ID}在索引${索引}添加制造物品ID${值}
-- 向单位的制造物品列表添加新的物品ID
function ____exports.KKWEUnitUIAddMakesItemIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 130, id, v)
end
--- 单位UI添加需求单位代码
-- 为单位ID${单位ID}在索引${索引}添加需求单位代码${值}
-- 向单位的需求列表添加新的单位代码
function ____exports.KKWEUnitUIAddRequiresUnitCode(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 166, id, v)
end
--- 单位UI添加需求科技代码
-- 为单位ID${单位ID}在索引${索引}添加需求科技代码${值}
-- 向单位的需求列表添加新的科技代码
function ____exports.KKWEUnitUIAddRequiresTechcode(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 166, id, v)
end
--- 单位UI添加需求数量
-- 为单位ID${单位ID}在索引${索引}添加需求数量${值}
-- 向单位的需求数量列表添加新的数量值
function ____exports.KKWEUnitUIAddRequiresAmounts(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 172, id, v)
end
--- 判断是否为闰年
-- 判断年份${年份}是否为闰年
-- 根据闰年规则判断指定年份是否为闰年
function ____exports.DzIsLeapYear(year)
    return year % 4 == 0 and year % 100 ~= 0 or year % 400 == 0
end
--- 从时间戳获取时间日期字符串（内部实现）
-- 从时间戳${时间戳}获取时间日期字符串
-- 将UNIX时间戳转换为可读的日期时间字符串
function ____exports.DzGetTimeDateFromTimestamp(timestamp)
    local totalSeconds = timestamp + 28800
    local secondsInDay = 86400
    local remainingSeconds = totalSeconds % secondsInDay
    local year = 1970
    local totalDays = math.floor((totalSeconds + 86399) / secondsInDay)
    local num = 0
    local month = 0
    local days = 0
    while true do
        if ____exports.DzIsLeapYear(year) then
            num = num + 366
        else
            num = num + 365
        end
        if num > totalDays then
            break
        end
        days = num
        year = year + 1
    end
    month = 1
    num = 0
    days = totalDays - days
    local monthDays = ____exports.DzIsLeapYear(year) and ({
        31,
        29,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    }) or ({
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    })
    do
        local i = 0
        while i < 12 do
            if num + monthDays[i + 1] >= days then
                break
            end
            num = num + monthDays[i + 1]
            month = month + 1
            i = i + 1
        end
    end
    local day = days - num or 1
    local hour = math.floor(remainingSeconds / 3600)
    local minute = math.floor(remainingSeconds % 3600 / 60)
    local second = remainingSeconds % 60
    return (((((((((tostring(year) .. "-") .. tostring(month)) .. "-") .. tostring(day)) .. " ") .. tostring(hour)) .. ":") .. tostring(minute)) .. ":") .. tostring(second)
end
local timestampCache = __TS__New(Map)
--- 从时间戳获取时间日期字符串（缓存版）
-- 从时间戳${时间戳}获取时间日期字符串
-- 带缓存的时间戳转换函数，提高性能
function ____exports.KKAPIGetTimeDateFromTimestamp(timestamp)
    timestamp = math.max(timestamp, 0)
    local cached = timestampCache:get(timestamp)
    if cached then
        return cached.str
    end
    local str = ____exports.DzGetTimeDateFromTimestamp(timestamp)
    return str
end
--- 从时间戳获取年份
-- 从时间戳${时间戳}获取年份
-- 从UNIX时间戳中提取年份信息
function ____exports.KKAPIGetTimestampYear(timestamp)
    timestamp = math.max(timestamp, 0)
    local date = __TS__New(Date, timestamp * 1000)
    return date:getFullYear()
end
--- 从时间戳获取月份
-- 从时间戳${时间戳}获取月份
-- 从UNIX时间戳中提取月份信息
function ____exports.KKAPIGetTimestampMonth(timestamp)
    timestamp = math.max(timestamp, 0)
    local date = __TS__New(Date, timestamp * 1000)
    return date:getMonth() + 1
end
--- 从时间戳获取日期
-- 从时间戳${时间戳}获取日期
-- 从UNIX时间戳中提取日期信息
function ____exports.KKAPIGetTimestampDay(timestamp)
    timestamp = math.max(timestamp, 0)
    local date = __TS__New(Date, timestamp * 1000)
    return date:getDate()
end
--- 整数转技能ID
-- 将整数${整数}转换为技能ID
-- 简单的类型转换函数
function ____exports.KKConvertInt2AbilId(i)
    return i
end
--- 技能ID转整数
-- 将技能ID${技能ID}转换为整数
-- 简单的类型转换函数
function ____exports.KKConvertAbilId2Int(i)
    return i
end
--- 整数转颜色
-- 将整数${整数}转换为颜色
-- 简单的类型转换函数
function ____exports.KKConvertInt2Color(i)
    return i
end
--- 颜色转整数
-- 将颜色${颜色}转换为整数
-- 简单的类型转换函数
function ____exports.KKConvertColor2Int(i)
    return i
end
--- 防御类型：小型
____exports.DEFENSE_TYPE_SMALL = 0
--- 防御类型：中型
____exports.DEFENSE_TYPE_MEDIUM = 1
--- 防御类型：大型
____exports.DEFENSE_TYPE_LARGE = 2
--- 防御类型：要塞
____exports.DEFENSE_TYPE_FORT = 3
--- 防御类型：普通
____exports.DEFENSE_TYPE_NORMAL = 4
--- 防御类型：英雄
____exports.DEFENSE_TYPE_HERO = 5
--- 防御类型：神圣
____exports.DEFENSE_TYPE_DIVINE = 6
--- 防御类型：无
____exports.DEFENSE_TYPE_NONE = 7
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.utils.index"] = function(...) 
-- Lua Library inline imports
local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Promise
do
    local function makeDeferredPromiseFactory()
        local resolve
        local reject
        local function executor(____, res, rej)
            resolve = res
            reject = rej
        end
        return function()
            local promise = __TS__New(__TS__Promise, executor)
            return promise, resolve, reject
        end
    end
    local makeDeferredPromise = makeDeferredPromiseFactory()
    local function isPromiseLike(value)
        return __TS__InstanceOf(value, __TS__Promise)
    end
    local function doNothing(self)
    end
    local ____pcall = _G.pcall
    __TS__Promise = __TS__Class()
    __TS__Promise.name = "__TS__Promise"
    function __TS__Promise.prototype.____constructor(self, executor)
        self.state = 0
        self.fulfilledCallbacks = {}
        self.rejectedCallbacks = {}
        self.finallyCallbacks = {}
        local success, ____error = ____pcall(
            executor,
            nil,
            function(____, v) return self:resolve(v) end,
            function(____, err) return self:reject(err) end
        )
        if not success then
            self:reject(____error)
        end
    end
    function __TS__Promise.resolve(value)
        if __TS__InstanceOf(value, __TS__Promise) then
            return value
        end
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 1
        promise.value = value
        return promise
    end
    function __TS__Promise.reject(reason)
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 2
        promise.rejectionReason = reason
        return promise
    end
    __TS__Promise.prototype["then"] = function(self, onFulfilled, onRejected)
        local promise, resolve, reject = makeDeferredPromise()
        self:addCallbacks(
            onFulfilled and self:createPromiseResolvingCallback(onFulfilled, resolve, reject) or resolve,
            onRejected and self:createPromiseResolvingCallback(onRejected, resolve, reject) or reject
        )
        return promise
    end
    function __TS__Promise.prototype.addCallbacks(self, fulfilledCallback, rejectedCallback)
        if self.state == 1 then
            return fulfilledCallback(nil, self.value)
        end
        if self.state == 2 then
            return rejectedCallback(nil, self.rejectionReason)
        end
        local ____self_fulfilledCallbacks_0 = self.fulfilledCallbacks
        ____self_fulfilledCallbacks_0[#____self_fulfilledCallbacks_0 + 1] = fulfilledCallback
        local ____self_rejectedCallbacks_1 = self.rejectedCallbacks
        ____self_rejectedCallbacks_1[#____self_rejectedCallbacks_1 + 1] = rejectedCallback
    end
    function __TS__Promise.prototype.catch(self, onRejected)
        return self["then"](self, nil, onRejected)
    end
    function __TS__Promise.prototype.finally(self, onFinally)
        if onFinally then
            local ____self_finallyCallbacks_2 = self.finallyCallbacks
            ____self_finallyCallbacks_2[#____self_finallyCallbacks_2 + 1] = onFinally
            if self.state ~= 0 then
                onFinally(nil)
            end
        end
        return self
    end
    function __TS__Promise.prototype.resolve(self, value)
        if isPromiseLike(value) then
            return value:addCallbacks(
                function(____, v) return self:resolve(v) end,
                function(____, err) return self:reject(err) end
            )
        end
        if self.state == 0 then
            self.state = 1
            self.value = value
            return self:invokeCallbacks(self.fulfilledCallbacks, value)
        end
    end
    function __TS__Promise.prototype.reject(self, reason)
        if self.state == 0 then
            self.state = 2
            self.rejectionReason = reason
            return self:invokeCallbacks(self.rejectedCallbacks, reason)
        end
    end
    function __TS__Promise.prototype.invokeCallbacks(self, callbacks, value)
        local callbacksLength = #callbacks
        local finallyCallbacks = self.finallyCallbacks
        local finallyCallbacksLength = #finallyCallbacks
        if callbacksLength ~= 0 then
            for i = 1, callbacksLength - 1 do
                callbacks[i](callbacks, value)
            end
            if finallyCallbacksLength == 0 then
                return callbacks[callbacksLength](callbacks, value)
            end
            callbacks[callbacksLength](callbacks, value)
        end
        if finallyCallbacksLength ~= 0 then
            for i = 1, finallyCallbacksLength - 1 do
                finallyCallbacks[i](finallyCallbacks)
            end
            return finallyCallbacks[finallyCallbacksLength](finallyCallbacks)
        end
    end
    function __TS__Promise.prototype.createPromiseResolvingCallback(self, f, resolve, reject)
        return function(____, value)
            local success, resultOrError = ____pcall(f, nil, value)
            if not success then
                return reject(nil, resultOrError)
            end
            return self:handleCallbackValue(resultOrError, resolve, reject)
        end
    end
    function __TS__Promise.prototype.handleCallbackValue(self, value, resolve, reject)
        if isPromiseLike(value) then
            local nextpromise = value
            if nextpromise.state == 1 then
                return resolve(nil, nextpromise.value)
            elseif nextpromise.state == 2 then
                return reject(nil, nextpromise.rejectionReason)
            else
                return nextpromise:addCallbacks(resolve, reject)
            end
        else
            return resolve(nil, value)
        end
    end
end

local __TS__AsyncAwaiter, __TS__Await
do
    local ____coroutine = _G.coroutine or ({})
    local cocreate = ____coroutine.create
    local coresume = ____coroutine.resume
    local costatus = ____coroutine.status
    local coyield = ____coroutine.yield
    function __TS__AsyncAwaiter(generator)
        return __TS__New(
            __TS__Promise,
            function(____, resolve, reject)
                local fulfilled, step, resolved, asyncCoroutine
                function fulfilled(self, value)
                    local success, resultOrError = coresume(asyncCoroutine, value)
                    if success then
                        return step(resultOrError)
                    end
                    return reject(nil, resultOrError)
                end
                function step(result)
                    if resolved then
                        return
                    end
                    if costatus(asyncCoroutine) == "dead" then
                        return resolve(nil, result)
                    end
                    return __TS__Promise.resolve(result):addCallbacks(fulfilled, reject)
                end
                resolved = false
                asyncCoroutine = cocreate(generator)
                local success, resultOrError = coresume(
                    asyncCoroutine,
                    function(____, v)
                        resolved = true
                        return __TS__Promise.resolve(v):addCallbacks(resolve, reject)
                    end
                )
                if success then
                    return step(resultOrError)
                else
                    return reject(nil, resultOrError)
                end
            end
        )
    end
    function __TS__Await(thing)
        return coyield(thing)
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____timer = require("lua_modules.@eiriksgata.wc3ts.src.handles.timer")
local Timer = ____timer.Timer
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.utils.color")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.utils.kkwe")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
function ____exports.sleep(howMuch)
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        return ____awaiter_resolve(
            nil,
            __TS__New(
                __TS__Promise,
                function(____, resolve)
                    local t = Timer:create()
                    t:start(
                        howMuch,
                        false,
                        function()
                            t:destroy()
                            resolve(nil, nil)
                        end
                    )
                end
            )
        )
    end)
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.globals.const"] = function(...) 
local ____exports = {}
____exports.EPlayerColor = EPlayerColor or ({})
____exports.EPlayerColor.COLOR1 = "|cFFFF0303"
____exports.EPlayerColor.COLOR2 = "|cFF0042FF"
____exports.EPlayerColor.COLOR3 = "|cFF1CE6B9"
____exports.EPlayerColor.COLOR4 = "|cFF540081"
____exports.EPlayerColor.COLOR5 = "|cFFFFFC01"
____exports.EPlayerColor.COLOR6 = "|cFFFE8A0E"
____exports.EPlayerColor.COLOR7 = "|cFF20C000"
____exports.EPlayerColor.COLOR8 = "|cFFE55BB0"
____exports.EPlayerColor.COLOR9 = "|cFF959697"
____exports.EPlayerColor.COLOR10 = "|cFF7EBFF1"
____exports.EPlayerColor.COLOR11 = "|cFFFFFC01"
____exports.EPlayerColor.COLOR12 = "|cFF0042FF"
____exports.EPlayerColor.COLOR13 = "|cFF282828"
____exports.EPlayerColor.COLOR14 = "|cFF282828"
____exports.EPlayerColor.COLOR15 = "|cFF282828"
____exports.EPlayerColor.COLOR16 = "|cFF282828"
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.globals.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.globals.const")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.globals.order")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["lua_modules.@eiriksgata.wc3ts.src.index"] = function(...) 
local ____exports = {}
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.globals.define")
local bj_MAX_PLAYER_SLOTS = ____define.bj_MAX_PLAYER_SLOTS
local ____player = require("lua_modules.@eiriksgata.wc3ts.src.handles.player")
local MapPlayer = ____player.MapPlayer
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.handles.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.system.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.utils.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("lua_modules.@eiriksgata.wc3ts.src.globals.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
____exports.Players = {}
do
    local i = 0
    while i < bj_MAX_PLAYER_SLOTS do
        local pl = MapPlayer:fromHandle(Player(i))
        if pl then
            ____exports.Players[i + 1] = pl
        end
        i = i + 1
    end
end
return ____exports
 end,
["src.types.index"] = function(...) 
local ____exports = {}
return ____exports
 end,
["src.config.index"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
--- 默认应用配置
local DEFAULT_CONFIG = {debug = true, console = true, runtime = {debuggerPort = 4279, sleep = false, catchCrash = true}, map = {name = "WC3 TypeScript Map", version = "1.0.0", description = "A Warcraft III map built with TypeScript"}}
--- 配置管理器
-- 提供应用程序配置的统一管理
____exports.ConfigManager = __TS__Class()
local ConfigManager = ____exports.ConfigManager
ConfigManager.name = "ConfigManager"
function ConfigManager.prototype.____constructor(self)
    self.config = __TS__ObjectAssign({}, DEFAULT_CONFIG)
end
function ConfigManager.getInstance(self)
    if not ____exports.ConfigManager.instance then
        ____exports.ConfigManager.instance = __TS__New(____exports.ConfigManager)
    end
    return ____exports.ConfigManager.instance
end
function ConfigManager.prototype.getConfig(self)
    return __TS__ObjectAssign({}, self.config)
end
function ConfigManager.prototype.isDebugMode(self)
    return self.config.debug
end
function ConfigManager.prototype.isConsoleEnabled(self)
    return self.config.console
end
function ConfigManager.prototype.getRuntimeConfig(self)
    return __TS__ObjectAssign({}, self.config.runtime)
end
function ConfigManager.prototype.getMapConfig(self)
    return __TS__ObjectAssign({}, self.config.map)
end
function ConfigManager.prototype.updateConfig(self, updates)
    self.config = __TS__ObjectAssign({}, self.config, updates)
end
function ConfigManager.prototype.resetToDefault(self)
    self.config = __TS__ObjectAssign({}, DEFAULT_CONFIG)
end
return ____exports
 end,
["src.ydlua.index"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
local ____config = require("src.config.index")
local ConfigManager = ____config.ConfigManager
local ydcommon = require("jass.common")
local ydai = require("jass.ai")
local ydglobals = require("jass.globals")
local ydjapi = require("jass.japi")
local ydhook = require("jass.hook")
local ydruntime = require("jass.runtime")
local ydslk = require("jass.slk")
local ydconsole = require("jass.console")
local yddebug = require("jass.debug")
local ydlog = require("jass.log")
local ydmessage = require("jass.message")
local ydbignum = require("jass.bignum")
____exports.ydlua = __TS__Class()
local ydlua = ____exports.ydlua
ydlua.name = "ydlua"
function ydlua.prototype.____constructor(self)
    self.configManager = ConfigManager:getInstance()
end
function ydlua.getInstance(self)
    if not ____exports.ydlua.instance then
        ____exports.ydlua.instance = __TS__New(____exports.ydlua)
    end
    return ____exports.ydlua.instance
end
function ydlua.prototype.initializeRuntime(self)
    local config = self.configManager:getConfig()
    local runtimeConfig = config.runtime
    ydruntime.console = config.console
    ydruntime.sleep = runtimeConfig.sleep
    ydruntime.debugger = runtimeConfig.debuggerPort
    ydruntime.catch_crash = runtimeConfig.catchCrash
    ydruntime.error_hanlde = function(self, msg)
        print("========lua-err========")
        print(tostring(msg))
        print("=========================")
    end
    print(((">>> Runtime configured: debugger=" .. tostring(runtimeConfig.debuggerPort)) .. ", crash_catch=") .. tostring(runtimeConfig.catchCrash))
end
function ydlua.prototype.initialize(self)
    self:initializeConsole()
    self:initializeRuntime()
    self:registerGlobals()
end
function ydlua.prototype.initializeConsole(self)
    local isConsoleEnabled = self.configManager:isConsoleEnabled()
    ydconsole.enable = isConsoleEnabled
    if isConsoleEnabled then
        _G.print = function(message) return ydconsole.write(message) end
        print(">>> Console enabled")
    end
end
function ydlua.prototype.registerGlobals(self)
    print(">>> Global APIs registered")
end
return ____exports
 end,
["src.system.console"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Players = _____2A.Players
____exports.Console = __TS__Class()
local Console = ____exports.Console
Console.name = "Console"
function Console.prototype.____constructor(self)
end
function Console.log(self, message, player)
    if player == nil then
        player = Players[1]
    end
    DisplayTextToPlayer(player.handle, 0, 0, ("|cff00ff00" .. message) .. "|r")
end
function Console.error(self, message, player)
    if player == nil then
        player = Players[1]
    end
    DisplayTextToPlayer(player.handle, 0, 0, ("|cffff0000" .. message) .. "|r")
end
function Console.warn(self, message, player)
    if player == nil then
        player = Players[1]
    end
    DisplayTextToPlayer(player.handle, 0, 0, ("|cffffff00" .. message) .. "|r")
end
return ____exports
 end,
["src.utils.CameraControl"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end
-- End of Lua Library inline imports
local ____exports = {}
--- 镜头控制工具类
-- 提供鼠标滚轮控制镜头距离和宽屏设置功能
____exports.CameraControl = __TS__Class()
local CameraControl = ____exports.CameraControl
CameraControl.name = "CameraControl"
function CameraControl.prototype.____constructor(self)
end
function CameraControl.initMouseControl(self)
    SetCameraField(
        ConvertCameraField(1),
        20000,
        0
    )
    local mouseTrigger = CreateTrigger()
    DzTriggerRegisterMouseWheelEventByCode(
        mouseTrigger,
        false,
        function()
            ____exports.CameraControl:onWheel()
        end
    )
    print("CameraControl: 鼠标控制已初始化")
end
function CameraControl.onWheel(self)
    local delta = DzGetWheelDelta()
    if not DzIsMouseOverUI() then
        return
    end
    self.resetCam = true
    if delta < 0 then
        if self.viewLevel < self.viewLevelMax then
            self.viewLevel = self.viewLevel + 1
        end
    else
        if self.viewLevel > self.viewLevelMin then
            self.viewLevel = self.viewLevel - 1
        end
    end
    self.xAngle = self:rad2Deg(GetCameraField(ConvertCameraField(1)))
end
function CameraControl.update(self)
    if self.resetCam then
        SetCameraField(
            ConvertCameraField(1),
            self:degToRad(self.xAngle),
            0
        )
        SetCameraField(
            ConvertCameraField(0),
            self.viewLevel * 200,
            self.wheelSpeed
        )
        self.resetCam = false
    end
end
function CameraControl.setWideScreen(self)
    self.wideScr = not self.wideScr
    DzEnableWideScreen(self.wideScr)
    print("CameraControl: 宽屏模式" .. (self.wideScr and "开启" or "关闭"))
    return self.wideScr
end
function CameraControl.rad2Deg(self, rad)
    return rad * 180 / math.pi
end
function CameraControl.degToRad(self, deg)
    return deg * math.pi / 180
end
function CameraControl.getViewLevel(self)
    return self.viewLevel
end
function CameraControl.setViewLevel(self, level)
    if level >= self.viewLevelMin and level <= self.viewLevelMax then
        self.viewLevel = level
        self.resetCam = true
        print("CameraControl: 视野等级设置为 " .. tostring(level))
    else
        print(((("CameraControl: 视野等级必须在 " .. tostring(self.viewLevelMin)) .. "-") .. tostring(self.viewLevelMax)) .. " 之间")
    end
end
function CameraControl.isWideScreen(self)
    return self.wideScr
end
function CameraControl.resetCamera(self)
    self.viewLevel = 8
    self.xAngle = 306
    self.resetCam = true
    print("CameraControl: 镜头已重置到默认设置")
end
function CameraControl.setWheelSpeed(self, speed)
    if speed >= 0 and speed <= 1 then
        self.wheelSpeed = speed
        print("CameraControl: 镜头平滑度设置为 " .. tostring(speed))
    else
        print("CameraControl: 镜头平滑度必须在 0-1 之间")
    end
end
CameraControl.viewLevel = 8
CameraControl.resetCam = false
CameraControl.wheelSpeed = 0.1
CameraControl.wideScr = false
CameraControl.xAngle = 306
CameraControl.viewLevelMax = 13
CameraControl.viewLevelMin = 4
return ____exports
 end,
["src.utils.helper"] = function(...) 
local ____exports = {}
function ____exports.c2i(char)
    return (string.unpack(">I4", char))
end
function ____exports.i2c(id)
    return string.pack("I4", id)
end
function ____exports.FourCC(id)
    return ____exports.c2i(id)
end
function ____exports.worldToScreen(x, y, z)
    local eyex = GetCameraEyePositionX()
    local eyey = GetCameraEyePositionZ()
    local eyez = GetCameraEyePositionY()
    local upx = 0
    local upy = 1
    local upz = 0
    local centerx = GetCameraTargetPositionX()
    local centery = GetCameraTargetPositionZ()
    local centerz = GetCameraTargetPositionY()
    local z0 = eyex - centerx
    local z1 = eyey - centery
    local z2 = eyez - centerz
    local length = math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
    local len = 1
    local x0
    local x1
    local x2
    local y0
    local y1
    local y2
    local rhw = 1
    local ratio = 1
    local clientHeight = DzGetClientHeight()
    if clientHeight ~= 0 then
        ratio = DzGetClientWidth() / clientHeight * 600 / 800
    end
    if length > 0 then
        len = 1 / length
    else
        len = 1
    end
    z0 = z0 * len
    z1 = z1 * len
    z2 = z2 * len
    x0 = upy * z2 - upz * z1
    x1 = upz * z0 - upx * z2
    x2 = upx * z1 - upy * z0
    len = math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
    if len > 0 then
        len = 1 / len
    else
        len = 1
    end
    x0 = x0 * len
    x1 = x1 * len
    x2 = x2 * len
    y0 = z1 * x2 - z2 * x1
    y1 = z2 * x0 - z0 * x2
    y2 = z0 * x1 - z1 * x0
    rhw = -z0 * x - z1 * y - z2 * z + (z0 * eyex + z1 * eyey + z2 * eyez)
    if math.abs(rhw) ~= 0 then
        rhw = 1 / math.abs(rhw)
    else
        rhw = 1
    end
    if ratio == 0 then
        ratio = 1
    end
    local UIx = 0.8 - (2 / ratio * (x0 * x + x1 * y + x2 * z - (x0 * eyex + x1 * eyey + x2 * eyez)) * rhw + 1) * 0.4
    local UIy = (2.5613 * (y0 * x + y1 * y + y2 * z - (y0 * eyex + y1 * eyey + y2 * eyez)) * rhw + 1) * 0.3
    local UIz = (1001 / -999 * (z0 * x + z1 * y + z2 * z + 2 - (z0 * eyex + z1 * eyey + z2 * eyez)) * rhw + 1) * 0.5
    return {screenX = UIx, screenY = UIy, z = UIz}
end
return ____exports
 end,
["src.system.actor"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

local function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                __TS__New(
                    TypeError,
                    ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. "."
                ),
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    target[key] = nil
    return true
end

local function __TS__CloneDescriptor(____bindingPattern0)
    local value
    local writable
    local set
    local get
    local configurable
    local enumerable
    enumerable = ____bindingPattern0.enumerable
    configurable = ____bindingPattern0.configurable
    get = ____bindingPattern0.get
    set = ____bindingPattern0.set
    writable = ____bindingPattern0.writable
    value = ____bindingPattern0.value
    local descriptor = {enumerable = enumerable == true, configurable = configurable == true}
    local hasGetterOrSetter = get ~= nil or set ~= nil
    local hasValueOrWritableAttribute = writable ~= nil or value ~= nil
    if hasGetterOrSetter and hasValueOrWritableAttribute then
        error("Invalid property descriptor. Cannot both specify accessors and a value or writable attribute.", 0)
    end
    if get or set then
        descriptor.get = get
        descriptor.set = set
    else
        descriptor.value = value
        descriptor.writable = writable == true
    end
    return descriptor
end

local __TS__DescriptorGet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    function __TS__DescriptorGet(self, metatable, key)
        while metatable do
            local rawResult = ____rawget(metatable, key)
            if rawResult ~= nil then
                return rawResult
            end
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.get then
                        return descriptor.get(self)
                    end
                    return descriptor.value
                end
            end
            metatable = getmetatable(metatable)
        end
    end
end

local __TS__DescriptorSet
do
    local getmetatable = _G.getmetatable
    local ____rawget = _G.rawget
    local rawset = _G.rawset
    function __TS__DescriptorSet(self, metatable, key, value)
        while metatable do
            local descriptors = ____rawget(metatable, "_descriptors")
            if descriptors then
                local descriptor = descriptors[key]
                if descriptor ~= nil then
                    if descriptor.set then
                        descriptor.set(self, value)
                    else
                        if descriptor.writable == false then
                            error(
                                ((("Cannot assign to read only property '" .. key) .. "' of object '") .. tostring(self)) .. "'",
                                0
                            )
                        end
                        descriptor.value = value
                    end
                    return
                end
            end
            metatable = getmetatable(metatable)
        end
        rawset(self, key, value)
    end
end

local __TS__SetDescriptor
do
    local getmetatable = _G.getmetatable
    local function descriptorIndex(self, key)
        return __TS__DescriptorGet(
            self,
            getmetatable(self),
            key
        )
    end
    local function descriptorNewIndex(self, key, value)
        return __TS__DescriptorSet(
            self,
            getmetatable(self),
            key,
            value
        )
    end
    function __TS__SetDescriptor(target, key, desc, isPrototype)
        if isPrototype == nil then
            isPrototype = false
        end
        local ____isPrototype_0
        if isPrototype then
            ____isPrototype_0 = target
        else
            ____isPrototype_0 = getmetatable(target)
        end
        local metatable = ____isPrototype_0
        if not metatable then
            metatable = {}
            setmetatable(target, metatable)
        end
        local value = rawget(target, key)
        if value ~= nil then
            rawset(target, key, nil)
        end
        if not rawget(metatable, "_descriptors") then
            metatable._descriptors = {}
        end
        metatable._descriptors[key] = __TS__CloneDescriptor(desc)
        metatable.__index = descriptorIndex
        metatable.__newindex = descriptorNewIndex
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Unit = _____2A.Unit
local MapPlayer = _____2A.MapPlayer
local ____UnitBlood = require("src.system.ui.component.UnitBlood")
local UnitBlood = ____UnitBlood.UnitBlood
____exports.Actor = __TS__Class()
local Actor = ____exports.Actor
Actor.name = "Actor"
__TS__ClassExtends(Actor, Unit)
function Actor.prototype.____constructor(self, owner, unitId, x, y, face)
    Unit.prototype.____constructor(
        self,
        owner,
        unitId,
        x,
        y,
        face
    )
    self._hpBarUIHeight = 150
    self._size = 1
    self.label = ""
    self.bloodBarUI = nil
    ____exports.Actor.allActors[self.id] = self
end
function Actor.create(self, owner, unitId, x, y, facing)
    if facing == nil then
        facing = 0
    end
    if owner == nil or owner == nil then
        owner = MapPlayer:fromHandle(Player(owner))
    end
    local handle = CreateUnit(
        owner.handle,
        unitId,
        x,
        y,
        facing
    )
    if handle == nil then
        return nil
    end
    local unitId_handle = GetHandleId(handle)
    local existingActor = ____exports.Actor.allActors[unitId_handle]
    if existingActor ~= nil then
        return existingActor
    end
    local actor = ____exports.Actor:getObject(handle)
    if actor ~= nil then
        local values = {}
        values.handle = handle
        __TS__ObjectAssign(actor, values)
        ____exports.Actor.allActors[actor.id] = actor
        return actor
    end
    return nil
end
function Actor.fromUnit(self, unit)
    local existingActor = ____exports.Actor.allActors[unit.id]
    if existingActor ~= nil then
        return existingActor
    end
    return ____exports.Actor:fromHandle(unit.handle)
end
function Actor.fromHandle(self, handle)
    if handle == nil then
        return nil
    end
    local unitId = GetHandleId(handle)
    local existingActor = ____exports.Actor.allActors[unitId]
    if existingActor ~= nil then
        return existingActor
    end
    local actor = ____exports.Actor:getObject(handle)
    if actor ~= nil then
        local values = {}
        values.handle = handle
        __TS__ObjectAssign(actor, values)
        ____exports.Actor.allActors[actor.id] = actor
        return actor
    end
    return nil
end
function Actor.getById(self, unitId)
    return ____exports.Actor.allActors[unitId]
end
function Actor.prototype.destroy(self)
    __TS__Delete(____exports.Actor.allActors, self.id)
    UnitBlood:remove(self)
    Unit.prototype.destroy(self)
end
function Actor.prototype.setLabel(self, value)
    self.label = value
    if self.bloodBarUI then
        self.bloodBarUI.nameFrame:setText(value)
    end
end
function Actor.prototype.getLabel(self)
    return self.label
end
function Actor.prototype.createBloodBar(self)
    self.bloodBarUI = UnitBlood:create(self)
end
Actor.allActors = {}
__TS__SetDescriptor(
    Actor.prototype,
    "hpBarUIHeight",
    {
        get = function(self)
            return self._hpBarUIHeight
        end,
        set = function(self, value)
            self._hpBarUIHeight = value
        end
    },
    true
)
__TS__SetDescriptor(
    Actor.prototype,
    "size",
    {
        get = function(self)
            return self._size
        end,
        set = function(self, value)
            self._size = value
        end
    },
    true
)
return ____exports
 end,
["src.system.ui.component.UnitBlood"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end

local function __TS__ObjectGetOwnPropertyDescriptors(object)
    local metatable = getmetatable(object)
    if not metatable then
        return {}
    end
    return rawget(metatable, "_descriptors") or ({})
end

local function __TS__Delete(target, key)
    local descriptors = __TS__ObjectGetOwnPropertyDescriptors(target)
    local descriptor = descriptors[key]
    if descriptor then
        if not descriptor.configurable then
            error(
                __TS__New(
                    TypeError,
                    ((("Cannot delete property " .. tostring(key)) .. " of ") .. tostring(target)) .. "."
                ),
                0
            )
        end
        descriptors[key] = nil
        return true
    end
    target[key] = nil
    return true
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Frame = _____2A.Frame
local FRAME_ALIGN_BOTTOM = _____2A.FRAME_ALIGN_BOTTOM
local FRAME_ALIGN_CENTER = _____2A.FRAME_ALIGN_CENTER
local FRAME_ALIGN_LEFT_TOP = _____2A.FRAME_ALIGN_LEFT_TOP
local FRAME_ALIGN_RIGHT_BOTTOM = _____2A.FRAME_ALIGN_RIGHT_BOTTOM
local FRAME_ALIGN_TOP = _____2A.FRAME_ALIGN_TOP
local MapPlayer = _____2A.MapPlayer
local UNIT_TYPE_DEAD = _____2A.UNIT_TYPE_DEAD
local ____CameraControl = require("src.utils.CameraControl")
local CameraControl = ____CameraControl.CameraControl
local ____helper = require("src.utils.helper")
local worldToScreen = ____helper.worldToScreen
____exports.UnitBlood = __TS__Class()
local UnitBlood = ____exports.UnitBlood
UnitBlood.name = "UnitBlood"
function UnitBlood.prototype.____constructor(self, actor)
    self.actor = actor
    actor:setPreselectUIVisible(false)
    self.frame = Frame:createType(
        "UnitBloodFrame",
        Frame:fromHandle(DzGetGameUI()),
        0,
        "BACKDROP",
        ""
    )
    self.frame:setSize(130 / 2400, 28 / 1800)
    self.frame:setTexture("map\\UI\\hpbar\\01.tga", 0, false)
    self.frame:setVisible(true)
    self.lifeFrame = Frame:createType(
        "LifeFrame",
        self.frame,
        0,
        "BACKDROP",
        ""
    )
    self.lifeFrame:setSize(100 / 2400, 12 / 1800)
    self.lifeFrame:setTexture("map\\UI\\hpbar\\02.tga", 0, false)
    self.lifeFrame:setPoint(
        FRAME_ALIGN_LEFT_TOP,
        self.frame,
        FRAME_ALIGN_LEFT_TOP,
        26 / 2400,
        -4 / 1800
    )
    self.manaFrame = Frame:createType(
        "ManaFrame",
        self.frame,
        0,
        "BACKDROP",
        ""
    )
    self.manaFrame:setSize(100 / 2400, 8 / 1800)
    self.manaFrame:setTexture("map\\UI\\hpbar\\03.tga", 0, false)
    self.manaFrame:setPoint(
        FRAME_ALIGN_LEFT_TOP,
        self.frame,
        FRAME_ALIGN_LEFT_TOP,
        26 / 2400,
        -16 / 1800
    )
    self.levelFrame = Frame:createType(
        "LevelFrame",
        self.frame,
        0,
        "TEXT",
        ""
    )
    self.levelFrame:setTextAlignment(50, 0)
    self.levelFrame:setText(tostring(actor.level))
    self.levelFrame:setFont("UI\\hpbar\\ZiTi.ttf", 0.01, 0)
    self.levelFrame:setPoint(
        FRAME_ALIGN_CENTER,
        self.frame,
        FRAME_ALIGN_LEFT_TOP,
        14 / 2400,
        -14 / 1800
    )
    self.nameBoxFrame = Frame:createType(
        "NameBoxFrame",
        self.frame,
        0,
        "BACKDROP",
        ""
    )
    self.nameBoxFrame:setTexture("map\\UI\\hpbar\\07.tga", 0, false)
    self.nameBoxFrame.alpha = 75
    self.nameFrame = Frame:createType(
        "NameFrame",
        self.nameBoxFrame,
        0,
        "TEXT",
        ""
    )
    self.nameFrame:setText(actor:getLabel())
    self.nameFrame:setTextAlignment(18, 0)
    self.nameFrame:setFont("UI\\hpbar\\ZiTi.ttf", 0.01, 0)
    self.nameFrame.alpha = 255
    self.nameFrame:setPoint(
        FRAME_ALIGN_BOTTOM,
        self.frame,
        FRAME_ALIGN_TOP,
        0.003,
        10 / 1800
    )
    self.nameBoxFrame:setPoint(
        FRAME_ALIGN_LEFT_TOP,
        self.nameFrame,
        FRAME_ALIGN_LEFT_TOP,
        -0.003,
        0.004
    )
    self.nameBoxFrame:setPoint(
        FRAME_ALIGN_RIGHT_BOTTOM,
        self.nameFrame,
        FRAME_ALIGN_RIGHT_BOTTOM,
        0.004,
        -0.004
    )
    if actor.owner == MapPlayer:fromLocal() then
        self.lifeFrame:setTexture("map\\UI\\hpbar\\02.tga", 0, false)
    else
        if actor:isAlly(MapPlayer:fromLocal()) then
            self.lifeFrame:setTexture("map\\UI\\hpbar\\06.tga", 0, false)
        else
            self.lifeFrame:setTexture("map\\UI\\hpbar\\05.tga", 0, false)
        end
    end
    ____exports.UnitBlood.allUnitBlood[actor.id] = self
end
function UnitBlood.create(self, actor)
    if ____exports.UnitBlood.allUnitBlood[actor.id] ~= nil then
        return ____exports.UnitBlood.allUnitBlood[actor.id]
    end
    return __TS__New(____exports.UnitBlood, actor)
end
function UnitBlood.get(self, unit)
    return ____exports.UnitBlood.allUnitBlood[unit.id]
end
function UnitBlood.remove(self, unit)
    local unitBlood = ____exports.UnitBlood.allUnitBlood[unit.id]
    if unitBlood ~= nil then
        unitBlood:destroy()
        __TS__Delete(____exports.UnitBlood.allUnitBlood, unit.id)
    end
end
function UnitBlood.prototype.destroy(self)
    self.frame:destroy()
    self.actor:setPreselectUIVisible(true)
    __TS__Delete(____exports.UnitBlood.allUnitBlood, self.actor.id)
end
function UnitBlood.registerLocalDrawEvent(self)
    if ____exports.UnitBlood.isDrawEventRegistered then
        print("UnitBlood: 绘制事件已经注册过，重复调用被忽略")
        return false
    end
    ____exports.UnitBlood.isDrawEventRegistered = true
    DzFrameSetUpdateCallbackByCode(function()
        CameraControl:update()
        ____exports.UnitBlood:updateAllUnitBloods()
    end)
    print("UnitBlood: 绘制事件注册成功")
    return true
end
function UnitBlood.isRegistered(self)
    return ____exports.UnitBlood.isDrawEventRegistered
end
function UnitBlood.updateAllUnitBloods(self)
    for unitId in pairs(____exports.UnitBlood.allUnitBlood) do
        local unitBlood = ____exports.UnitBlood.allUnitBlood[unitId]
        if unitBlood ~= nil then
            unitBlood:updateUI()
        end
    end
end
function UnitBlood.prototype.updateUI(self)
    if self.actor.life <= 0 or not self.actor.handle or self.actor.id == 0 then
        self:destroy()
        return
    end
    self:updateLifeBar()
    self:updateManaBar()
    self:updatePosition()
    self.levelFrame:setText(tostring(self.actor.level))
end
function UnitBlood.prototype.updateLifeBar(self)
    local lifePercent = self.actor.life / self.actor.maxLife
    self.lifeFrame:setSize(100 / 2400 * lifePercent, 12 / 1800)
end
function UnitBlood.prototype.updateManaBar(self)
    local manaPercent = self.actor.mana / self.actor.maxMana
    self.manaFrame:setSize(100 / 2400 * manaPercent, 8 / 1800)
end
function UnitBlood.prototype.updatePosition(self)
    local unitX = self.actor.x
    local unitY = self.actor.y
    local screenPos = worldToScreen(unitX, 0, unitY)
    local unitHeight = self.actor.hpBarUIHeight
    local sizeMultiplier = self.actor.size
    local baseOffset = 2200 + 800
    local unitHeightOffset = unitHeight * sizeMultiplier
    local totalHeight = baseOffset + unitHeightOffset
    local cameraEyeZ = GetCameraEyePositionZ()
    local heightDifference = totalHeight - cameraEyeZ
    local yAdjustment = heightDifference * 0.00006
    local finalScreenY = screenPos.screenY + yAdjustment
    if finalScreenY >= 1000 / 1800 or finalScreenY <= 300 / 1800 or self.actor.life < 0.05 or self.actor:isUnitType(UNIT_TYPE_DEAD()) or screenPos.screenX >= 1850 / 2400 or screenPos.screenX <= 70 / 2400 then
        self.frame:setVisible(false)
        return
    end
    if self.actor == nil or self.actor.id == 0 then
        self:destroy()
        return
    end
    if DzFrameIsVisible(self.frame.handle) == false then
        self.frame:setVisible(true)
    end
    self.frame:setAbsPoint(FRAME_ALIGN_BOTTOM, screenPos.screenX, finalScreenY)
end
UnitBlood.allUnitBlood = {}
UnitBlood.isDrawEventRegistered = false
return ____exports
 end,
["src.system.ModuleManager"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local __TS__ArrayFrom
do
    local function arrayLikeStep(self, index)
        index = index + 1
        if index > self.length then
            return
        end
        return index, self[index]
    end
    local function arrayLikeIterator(arr)
        if type(arr.length) == "number" then
            return arrayLikeStep, arr, 0
        end
        return __TS__Iterator(arr)
    end
    function __TS__ArrayFrom(arrayLike, mapFn, thisArg)
        local result = {}
        if mapFn == nil then
            for ____, v in arrayLikeIterator(arrayLike) do
                result[#result + 1] = v
            end
        else
            local i = 0
            for ____, v in arrayLikeIterator(arrayLike) do
                local ____mapFn_3 = mapFn
                local ____thisArg_1 = thisArg
                local ____v_2 = v
                local ____i_0 = i
                i = ____i_0 + 1
                result[#result + 1] = ____mapFn_3(____thisArg_1, ____v_2, ____i_0)
            end
        end
        return result
    end
end

local Set
do
    Set = __TS__Class()
    Set.name = "Set"
    function Set.prototype.____constructor(self, values)
        self[Symbol.toStringTag] = "Set"
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if values == nil then
            return
        end
        local iterable = values
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                self:add(result.value)
            end
        else
            local array = values
            for ____, value in ipairs(array) do
                self:add(value)
            end
        end
    end
    function Set.prototype.add(self, value)
        local isNewValue = not self:has(value)
        if isNewValue then
            self.size = self.size + 1
        end
        if self.firstKey == nil then
            self.firstKey = value
            self.lastKey = value
        elseif isNewValue then
            self.nextKey[self.lastKey] = value
            self.previousKey[value] = self.lastKey
            self.lastKey = value
        end
        return self
    end
    function Set.prototype.clear(self)
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Set.prototype.delete(self, value)
        local contains = self:has(value)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[value]
            local previous = self.previousKey[value]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[value] = nil
            self.previousKey[value] = nil
        end
        return contains
    end
    function Set.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, key, key, self)
        end
    end
    function Set.prototype.has(self, value)
        return self.nextKey[value] ~= nil or self.lastKey == value
    end
    Set.prototype[Symbol.iterator] = function(self)
        return self:values()
    end
    function Set.prototype.entries(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, key}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.values(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Set.prototype.union(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:add(item)
        end
        return result
    end
    function Set.prototype.intersection(self, other)
        local result = __TS__New(Set)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.difference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            result:delete(item)
        end
        return result
    end
    function Set.prototype.symmetricDifference(self, other)
        local result = __TS__New(Set, self)
        for ____, item in __TS__Iterator(other) do
            if self:has(item) then
                result:delete(item)
            else
                result:add(item)
            end
        end
        return result
    end
    function Set.prototype.isSubsetOf(self, other)
        for ____, item in __TS__Iterator(self) do
            if not other:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isSupersetOf(self, other)
        for ____, item in __TS__Iterator(other) do
            if not self:has(item) then
                return false
            end
        end
        return true
    end
    function Set.prototype.isDisjointFrom(self, other)
        for ____, item in __TS__Iterator(self) do
            if other:has(item) then
                return false
            end
        end
        return true
    end
    Set[Symbol.species] = Set
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end
-- End of Lua Library inline imports
local ____exports = {}
____exports.ModuleManager = __TS__Class()
local ModuleManager = ____exports.ModuleManager
ModuleManager.name = "ModuleManager"
function ModuleManager.prototype.____constructor(self)
    self.modules = __TS__New(Map)
    self.initializationOrder = {}
    print(">>> ModuleManager: Instance created")
end
function ModuleManager.getInstance(self)
    if not ____exports.ModuleManager.instance then
        print(">>> ModuleManager: Creating new instance")
        ____exports.ModuleManager.instance = __TS__New(____exports.ModuleManager)
    end
    return ____exports.ModuleManager.instance
end
function ModuleManager.prototype.registerModule(self, name, module, options)
    if options == nil then
        options = {}
    end
    local moduleInfo = {
        name = name,
        module = module,
        initializeFunction = options.initialize,
        cleanupFunction = options.cleanup,
        hotReloadFunction = options.onHotReload,
        dependencies = options.dependencies or ({}),
        initialized = false
    }
    self.modules:set(name, moduleInfo)
    print(">>> ModuleManager: Module registered: " .. name)
    print(">>> ModuleManager: Total registered modules: " .. tostring(self.modules.size))
    print(">>> ModuleManager: Current modules: " .. table.concat(
        __TS__ArrayFrom(self.modules:keys()),
        ", "
    ))
end
function ModuleManager.prototype.initializeAllModules(self)
    self:calculateInitializationOrder()
    for ____, moduleName in ipairs(self.initializationOrder) do
        self:initializeModule(moduleName)
    end
end
function ModuleManager.prototype.initializeModule(self, name)
    local moduleInfo = self.modules:get(name)
    if not moduleInfo then
        print(("Warning: Module " .. name) .. " not found")
        return
    end
    if moduleInfo.initialized then
        return
    end
    for ____, depName in ipairs(moduleInfo.dependencies or ({})) do
        self:initializeModule(depName)
    end
    do
        local function ____catch(____error)
            print((("Error initializing module " .. name) .. ": ") .. tostring(____error))
        end
        local ____try, ____hasReturned = pcall(function()
            if moduleInfo.initializeFunction then
                moduleInfo:initializeFunction()
            end
            moduleInfo.initialized = true
            print("Module initialized: " .. name)
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
function ModuleManager.prototype.hotReloadModule(self, name)
    local moduleInfo = self.modules:get(name)
    if not moduleInfo then
        print(("Warning: Module " .. name) .. " not registered for hot reload")
        return
    end
    do
        local function ____catch(____error)
            print((("Error during hot reload of module " .. name) .. ": ") .. tostring(____error))
        end
        local ____try, ____hasReturned = pcall(function()
            if moduleInfo.cleanupFunction then
                moduleInfo:cleanupFunction()
                print("Cleaned up module: " .. name)
            end
            local modulePath = self:getModulePathFromName(name)
            if modulePath then
                _G.package.loaded[modulePath] = nil
                local newModule = require(modulePath)
                moduleInfo.module = newModule
                print((("Reloaded module: " .. name) .. " from ") .. modulePath)
            end
            if moduleInfo.hotReloadFunction then
                moduleInfo:hotReloadFunction()
                print("Hot reload handled for module: " .. name)
            end
            if moduleInfo.initializeFunction then
                moduleInfo.initialized = false
                self:initializeModule(name)
            end
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
end
function ModuleManager.prototype.hotReloadModules(self, moduleNames)
    print(("Hot reloading " .. tostring(#moduleNames)) .. " modules...")
    local successCount = 0
    local failCount = 0
    for ____, moduleName in ipairs(moduleNames) do
        do
            local function ____catch(____error)
                failCount = failCount + 1
                print((("Failed to hot reload module " .. moduleName) .. ": ") .. tostring(____error))
            end
            local ____try, ____hasReturned = pcall(function()
                self:hotReloadModule(moduleName)
                successCount = successCount + 1
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
    print(((("Hot reload completed: " .. tostring(successCount)) .. " succeeded, ") .. tostring(failCount)) .. " failed")
end
function ModuleManager.prototype.getModulePathFromName(self, name)
    local pathMappings = {
        TemplateUI = "src.examples.TemplateUi",
        UnitBlood = "src.system.ui.UnitBlood",
        CameraControl = "src.utils.CameraControl",
        Actor = "src.system.actor",
        ModuleManager = "src.system.ModuleManager",
        HotReload = "src.system.HotReload"
    }
    if pathMappings[name] then
        return pathMappings[name]
    end
    local possiblePaths = {"src.system.ui." .. name, "src.system." .. name, "src.utils." .. name, "src." .. name}
    return possiblePaths[1]
end
function ModuleManager.prototype.calculateInitializationOrder(self)
    local visited = __TS__New(Set)
    local visiting = __TS__New(Set)
    local order = {}
    local visit
    visit = function(name)
        if visiting:has(name) then
            error(
                __TS__New(Error, "Circular dependency detected involving " .. name),
                0
            )
        end
        if visited:has(name) then
            return
        end
        visiting:add(name)
        local moduleInfo = self.modules:get(name)
        if moduleInfo then
            for ____, depName in ipairs(moduleInfo.dependencies or ({})) do
                visit(depName)
            end
        end
        visiting:delete(name)
        visited:add(name)
        order[#order + 1] = name
    end
    for ____, moduleName in __TS__Iterator(self.modules:keys()) do
        if not visited:has(moduleName) then
            visit(moduleName)
        end
    end
    self.initializationOrder = order
end
function ModuleManager.prototype.getRegisteredModules(self)
    return __TS__ArrayFrom(self.modules:keys())
end
function ModuleManager.prototype.isModuleRegistered(self, name)
    return self.modules:has(name)
end
return ____exports
 end,
["src.system.HotReload"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__StringCharAt(self, pos)
    if pos ~= pos then
        pos = 0
    end
    if pos < 0 then
        return ""
    end
    return string.sub(self, pos + 1, pos + 1)
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__Match = string.match

local __TS__ParseInt
do
    local parseIntBasePattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
    function __TS__ParseInt(numberString, base)
        if base == nil then
            base = 10
            local hexMatch = __TS__Match(numberString, "^%s*-?0[xX]")
            if hexMatch ~= nil then
                base = 16
                numberString = (__TS__Match(hexMatch, "-")) and "-" .. __TS__StringSubstring(numberString, #hexMatch) or __TS__StringSubstring(numberString, #hexMatch)
            end
        end
        if base < 2 or base > 36 then
            return 0 / 0
        end
        local allowedDigits = base <= 10 and __TS__StringSubstring(parseIntBasePattern, 0, base) or __TS__StringSubstring(parseIntBasePattern, 0, 10 + 2 * (base - 10))
        local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
        local number = tonumber((__TS__Match(numberString, pattern)), base)
        if number == nil then
            return 0 / 0
        end
        if number >= 0 then
            return math.floor(number)
        else
            return math.ceil(number)
        end
    end
end

local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Timer = _____2A.Timer
local ____ModuleManager = require("src.system.ModuleManager")
local ModuleManager = ____ModuleManager.ModuleManager
--- 热更新管理器
-- 负责检测外部热更新通知并重新加载指定模块
____exports.HotReload = __TS__Class()
local HotReload = ____exports.HotReload
HotReload.name = "HotReload"
function HotReload.prototype.____constructor(self)
    self.timer = nil
    self.checkInterval = 1
    self.lastProcessedTimestamp = 0
    self.enabled = true
end
function HotReload.getInstance(self)
    if not ____exports.HotReload.instance then
        ____exports.HotReload.instance = __TS__New(____exports.HotReload)
    end
    return ____exports.HotReload.instance
end
function HotReload.prototype.start(self)
    if not self.enabled then
        print(">>> HotReload: Hot reload is disabled")
        return
    end
    if self.timer then
        print(">>> HotReload: Hot reload is already running")
        return
    end
    print(">>> HotReload: Starting hot reload system...")
    print((">>> HotReload: Check interval: " .. tostring(self.checkInterval)) .. " seconds")
    print(">>> HotReload: PROJECT_PATH: " .. PROJECT_PATH)
    self.timer = Timer:create()
    self.timer:start(
        self.checkInterval,
        true,
        function()
            self:checkForUpdates()
        end
    )
    print(">>> HotReload: Hot reload system started successfully")
end
function HotReload.prototype.stop(self)
    if self.timer then
        self.timer:destroy()
        self.timer = nil
        print("Hot reload system stopped")
    end
end
function HotReload.prototype.setEnabled(self, enabled)
    self.enabled = enabled
    if not enabled then
        self:stop()
    end
    print("Hot reload " .. (enabled and "enabled" or "disabled"))
end
function HotReload.prototype.checkForUpdates(self)
    do
        local function ____catch(____error)
            print(">>> HotReload: Error in checkForUpdates: " .. tostring(____error))
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            local notificationContent = self:readHotReloadFile()
            if not notificationContent then
                return true
            end
            local notification = self:parseNotification(notificationContent)
            if not notification then
                print(">>> HotReload: Failed to parse notification")
                return true
            end
            if notification.timestamp <= self.lastProcessedTimestamp then
                return true
            end
            print(">>> HotReload: New notification detected!")
            print(((">>> HotReload: Timestamp: " .. tostring(notification.timestamp)) .. ", Last: ") .. tostring(self.lastProcessedTimestamp))
            print(">>> HotReload: Action: " .. notification.action)
            print(">>> HotReload: Modules: " .. table.concat(notification.modules, ", "))
            self:processHotReload(notification)
            self:markAsProcessed(notification)
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
end
function HotReload.prototype.readHotReloadFile(self)
    do
        local function ____catch(____error)
            print(">>> HotReload: Error reading hot reload file: " .. tostring(____error))
            return true, nil
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            local filePath = PROJECT_PATH .. "/hot-reload.json"
            local file = {io.open(filePath, "r")}
            if not file then
                return true, nil
            end
            local content = ""
            local line
            while true do
                local ____opt_0 = file[1]
                line = ____opt_0 and ____opt_0:read("l") or nil
                if not line then
                    break
                end
                content = content .. line .. "\n"
            end
            local ____opt_2 = file[1]
            if ____opt_2 ~= nil then
                ____opt_2:close()
            end
            return true, content
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
end
function HotReload.prototype.parseNotification(self, content)
    do
        local function ____catch(____error)
            return true, nil
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            return true, self:parseJsonManually(content)
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
end
function HotReload.prototype.parseJsonManually(self, jsonStr)
    do
        local function ____catch(____error)
            return true, nil
        end
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            local str = self:removeWhitespace(jsonStr)
            local timestamp = self:extractNumber(str, "\"timestamp\":")
            local action = self:extractString(str, "\"action\":\"")
            local modules = self:extractModules(str)
            local processed = self:extractBoolean(str, "\"processed\":")
            return true, {timestamp = timestamp or 0, action = action or "", modules = modules or ({}), processed = processed or false}
        end)
        if not ____try then
            ____hasReturned, ____returnValue = ____catch(____hasReturned)
        end
        if ____hasReturned then
            return ____returnValue
        end
    end
end
function HotReload.prototype.removeWhitespace(self, str)
    local result = ""
    do
        local i = 0
        while i < #str do
            local char = __TS__StringCharAt(str, i)
            if char ~= " " and char ~= "\n" and char ~= "\r" and char ~= "\t" then
                result = result .. char
            end
            i = i + 1
        end
    end
    return result
end
function HotReload.prototype.extractNumber(self, str, key)
    local startIndex = (string.find(str, key, nil, true) or 0) - 1
    if startIndex == -1 then
        return nil
    end
    local valueStart = startIndex + #key
    local valueEnd = valueStart
    while valueEnd < #str do
        local char = __TS__StringCharAt(str, valueEnd)
        if char >= "0" and char <= "9" then
            valueEnd = valueEnd + 1
        else
            break
        end
    end
    local numberStr = __TS__StringSubstring(str, valueStart, valueEnd)
    return numberStr and __TS__ParseInt(numberStr) or nil
end
function HotReload.prototype.extractString(self, str, key)
    local startIndex = (string.find(str, key, nil, true) or 0) - 1
    if startIndex == -1 then
        return nil
    end
    local valueStart = startIndex + #key
    local valueEnd = (string.find(
        str,
        "\"",
        math.max(valueStart + 1, 1),
        true
    ) or 0) - 1
    if valueEnd == -1 then
        return nil
    end
    return __TS__StringSubstring(str, valueStart, valueEnd)
end
function HotReload.prototype.extractModules(self, str)
    local modules = {}
    local startKey = "\"modules\":["
    local startIndex = (string.find(str, startKey, nil, true) or 0) - 1
    if startIndex == -1 then
        return modules
    end
    local arrayStart = startIndex + #startKey
    local arrayEnd = (string.find(
        str,
        "]",
        math.max(arrayStart + 1, 1),
        true
    ) or 0) - 1
    if arrayEnd == -1 then
        return modules
    end
    local arrayContent = __TS__StringSubstring(str, arrayStart, arrayEnd)
    local inString = false
    local currentString = ""
    do
        local i = 0
        while i < #arrayContent do
            local char = __TS__StringCharAt(arrayContent, i)
            if char == "\"" then
                if inString then
                    if currentString then
                        modules[#modules + 1] = currentString
                        currentString = ""
                    end
                    inString = false
                else
                    inString = true
                end
            elseif inString then
                currentString = currentString .. char
            end
            i = i + 1
        end
    end
    return modules
end
function HotReload.prototype.extractBoolean(self, str, key)
    local startIndex = (string.find(str, key, nil, true) or 0) - 1
    if startIndex == -1 then
        return nil
    end
    local valueStart = startIndex + #key
    if __TS__StringSubstring(str, valueStart, valueStart + 4) == "true" then
        return true
    elseif __TS__StringSubstring(str, valueStart, valueStart + 5) == "false" then
        return false
    end
    return nil
end
function HotReload.prototype.processHotReload(self, notification)
    print((">>> HotReload: Processing hot reload for " .. tostring(#notification.modules)) .. " modules...")
    local moduleNames = __TS__ArrayMap(
        notification.modules,
        function(____, fullPath)
            local parts = __TS__StringSplit(fullPath, ".")
            local fileName = parts[#parts]
            local nameMapping = {
                TemplateUi = "TemplateUI",
                UnitBlood = "UnitBlood",
                CameraControl = "CameraControl",
                Actor = "Actor",
                ModuleManager = "ModuleManager",
                HotReload = "HotReload"
            }
            local mappedName = nameMapping[fileName] or fileName
            print((((">>> HotReload: Mapping \"" .. fileName) .. "\" -> \"") .. mappedName) .. "\"")
            return mappedName
        end
    )
    print(">>> HotReload: Extracted module names: " .. table.concat(moduleNames, ", "))
    local moduleManager = ModuleManager:getInstance()
    local registeredModules = moduleManager:getRegisteredModules()
    print(">>> HotReload: All registered modules: " .. table.concat(registeredModules, ", "))
    local matchedModules = __TS__ArrayFilter(
        moduleNames,
        function(____, name)
            local isRegistered = moduleManager:isModuleRegistered(name)
            print(((">>> HotReload: Checking \"" .. name) .. "\" - registered: ") .. tostring(isRegistered))
            return isRegistered
        end
    )
    print(">>> HotReload: Matched registered modules: " .. table.concat(matchedModules, ", "))
    if #matchedModules == 0 then
        print(">>> HotReload: No registered modules to hot reload")
        print(">>> HotReload: Attempting direct Lua module reload...")
        for ____, modulePath in ipairs(notification.modules) do
            do
                local function ____catch(____error)
                    print(((">>> HotReload: ✗ Failed to reload: " .. modulePath) .. " - ") .. tostring(____error))
                end
                local ____try, ____hasReturned = pcall(function()
                    self:reloadModule(modulePath)
                    print(">>> HotReload: ✓ Direct reloaded: " .. modulePath)
                end)
                if not ____try then
                    ____catch(____hasReturned)
                end
            end
        end
        return
    end
    print(">>> HotReload: Calling ModuleManager.hotReloadModules...")
    moduleManager:hotReloadModules(matchedModules)
end
function HotReload.prototype.reloadModule(self, moduleName)
    _G.package.loaded[moduleName] = nil
    local newModule = require(moduleName)
    if newModule and type(newModule.initialize) == "function" then
        newModule.initialize()
    end
    if newModule and type(newModule.onHotReload) == "function" then
        newModule.onHotReload()
    end
end
function HotReload.prototype.markAsProcessed(self, notification)
    self.lastProcessedTimestamp = notification.timestamp
    print(("Marked notification with timestamp " .. tostring(notification.timestamp)) .. " as processed in memory")
end
return ____exports
 end,
["src.config.Players"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end
-- End of Lua Library inline imports
local ____exports = {}
local ____CameraControl = require("src.utils.CameraControl")
local CameraControl = ____CameraControl.CameraControl
____exports.PlayersConfig = __TS__Class()
local PlayersConfig = ____exports.PlayersConfig
PlayersConfig.name = "PlayersConfig"
function PlayersConfig.prototype.____constructor(self)
end
function PlayersConfig.CameraControl(self)
    CameraControl:initMouseControl()
end
return ____exports
 end,
["src.config.Map"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end
-- End of Lua Library inline imports
local ____exports = {}
____exports.MapGeneral = __TS__Class()
local MapGeneral = ____exports.MapGeneral
MapGeneral.name = "MapGeneral"
function MapGeneral.prototype.____constructor(self)
end
function MapGeneral.sceneVisionInit(self)
    FogMaskEnable(false)
    FogEnable(false)
end
return ____exports
 end,
["src.system.ui.ScreenCoordinates"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__StringIncludes(self, searchString, position)
    if not position then
        position = 1
    else
        position = position + 1
    end
    local index = string.find(self, searchString, position, true)
    return index ~= nil
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__ClassExtends(target, base)
    target.____super = base
    local staticMetatable = setmetatable({__index = base}, base)
    setmetatable(target, staticMetatable)
    local baseMetatable = getmetatable(base)
    if baseMetatable then
        if type(baseMetatable.__index) == "function" then
            staticMetatable.__index = baseMetatable.__index
        end
        if type(baseMetatable.__newindex) == "function" then
            staticMetatable.__newindex = baseMetatable.__newindex
        end
    end
    setmetatable(target.prototype, base.prototype)
    if type(base.prototype.__index) == "function" then
        target.prototype.__index = base.prototype.__index
    end
    if type(base.prototype.__newindex) == "function" then
        target.prototype.__newindex = base.prototype.__newindex
    end
    if type(base.prototype.__tostring) == "function" then
        target.prototype.__tostring = base.prototype.__tostring
    end
end

local Error, RangeError, ReferenceError, SyntaxError, TypeError, URIError
do
    local function getErrorStack(self, constructor)
        if debug == nil then
            return nil
        end
        local level = 1
        while true do
            local info = debug.getinfo(level, "f")
            level = level + 1
            if not info then
                level = 1
                break
            elseif info.func == constructor then
                break
            end
        end
        if __TS__StringIncludes(_VERSION, "Lua 5.0") then
            return debug.traceback(("[Level " .. tostring(level)) .. "]")
        elseif _VERSION == "Lua 5.1" then
            return string.sub(
                debug.traceback("", level),
                2
            )
        else
            return debug.traceback(nil, level)
        end
    end
    local function wrapErrorToString(self, getDescription)
        return function(self)
            local description = getDescription(self)
            local caller = debug.getinfo(3, "f")
            local isClassicLua = __TS__StringIncludes(_VERSION, "Lua 5.0")
            if isClassicLua or caller and caller.func ~= error then
                return description
            else
                return (description .. "\n") .. tostring(self.stack)
            end
        end
    end
    local function initErrorClass(self, Type, name)
        Type.name = name
        return setmetatable(
            Type,
            {__call = function(____, _self, message) return __TS__New(Type, message) end}
        )
    end
    local ____initErrorClass_1 = initErrorClass
    local ____class_0 = __TS__Class()
    ____class_0.name = ""
    function ____class_0.prototype.____constructor(self, message)
        if message == nil then
            message = ""
        end
        self.message = message
        self.name = "Error"
        self.stack = getErrorStack(nil, __TS__New)
        local metatable = getmetatable(self)
        if metatable and not metatable.__errorToStringPatched then
            metatable.__errorToStringPatched = true
            metatable.__tostring = wrapErrorToString(nil, metatable.__tostring)
        end
    end
    function ____class_0.prototype.__tostring(self)
        return self.message ~= "" and (self.name .. ": ") .. self.message or self.name
    end
    Error = ____initErrorClass_1(nil, ____class_0, "Error")
    local function createErrorClass(self, name)
        local ____initErrorClass_3 = initErrorClass
        local ____class_2 = __TS__Class()
        ____class_2.name = ____class_2.name
        __TS__ClassExtends(____class_2, Error)
        function ____class_2.prototype.____constructor(self, ...)
            ____class_2.____super.prototype.____constructor(self, ...)
            self.name = name
        end
        return ____initErrorClass_3(nil, ____class_2, name)
    end
    RangeError = createErrorClass(nil, "RangeError")
    ReferenceError = createErrorClass(nil, "ReferenceError")
    SyntaxError = createErrorClass(nil, "SyntaxError")
    TypeError = createErrorClass(nil, "TypeError")
    URIError = createErrorClass(nil, "URIError")
end
-- End of Lua Library inline imports
local ____exports = {}
--- 屏幕坐标系统转换工具
-- 将常规的像素坐标转换为魔兽争霸3的相对坐标
____exports.ScreenCoordinates = __TS__Class()
local ScreenCoordinates = ____exports.ScreenCoordinates
ScreenCoordinates.name = "ScreenCoordinates"
function ScreenCoordinates.prototype.____constructor(self)
end
function ScreenCoordinates.pixelToWC3(self, pixelX, pixelY, origin)
    if origin == nil then
        origin = ____exports.ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local wc3X
    local wc3Y
    repeat
        local ____switch4 = origin
        local centerX, centerY
        local ____cond4 = ____switch4 == ____exports.ScreenCoordinates.ORIGIN_TOP_LEFT
        if ____cond4 then
            wc3X = pixelX / ____exports.ScreenCoordinates.STANDARD_WIDTH * ____exports.ScreenCoordinates.WC3_SCREEN_WIDTH
            wc3Y = ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT - pixelY / ____exports.ScreenCoordinates.STANDARD_HEIGHT * ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT
            break
        end
        ____cond4 = ____cond4 or ____switch4 == ____exports.ScreenCoordinates.ORIGIN_BOTTOM_LEFT
        if ____cond4 then
            wc3X = pixelX / ____exports.ScreenCoordinates.STANDARD_WIDTH * ____exports.ScreenCoordinates.WC3_SCREEN_WIDTH
            wc3Y = pixelY / ____exports.ScreenCoordinates.STANDARD_HEIGHT * ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT
            break
        end
        ____cond4 = ____cond4 or ____switch4 == ____exports.ScreenCoordinates.ORIGIN_CENTER
        if ____cond4 then
            centerX = ____exports.ScreenCoordinates.STANDARD_WIDTH / 2
            centerY = ____exports.ScreenCoordinates.STANDARD_HEIGHT / 2
            wc3X = (pixelX + centerX) / ____exports.ScreenCoordinates.STANDARD_WIDTH * ____exports.ScreenCoordinates.WC3_SCREEN_WIDTH
            wc3Y = ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT - (pixelY + centerY) / ____exports.ScreenCoordinates.STANDARD_HEIGHT * ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT
            break
        end
        do
            error(
                __TS__New(Error, "Unsupported origin type: " .. origin),
                0
            )
        end
    until true
    return {
        x = math.max(
            0,
            math.min(____exports.ScreenCoordinates.WC3_SCREEN_WIDTH, wc3X)
        ),
        y = math.max(
            0,
            math.min(____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT, wc3Y)
        )
    }
end
function ScreenCoordinates.wc3ToPixel(self, wc3X, wc3Y, origin)
    if origin == nil then
        origin = ____exports.ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local pixelX
    local pixelY
    repeat
        local ____switch6 = origin
        local centerX, centerY
        local ____cond6 = ____switch6 == ____exports.ScreenCoordinates.ORIGIN_TOP_LEFT
        if ____cond6 then
            pixelX = wc3X / ____exports.ScreenCoordinates.WC3_SCREEN_WIDTH * ____exports.ScreenCoordinates.STANDARD_WIDTH
            pixelY = (1 - wc3Y / ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT) * ____exports.ScreenCoordinates.STANDARD_HEIGHT
            break
        end
        ____cond6 = ____cond6 or ____switch6 == ____exports.ScreenCoordinates.ORIGIN_BOTTOM_LEFT
        if ____cond6 then
            pixelX = wc3X / ____exports.ScreenCoordinates.WC3_SCREEN_WIDTH * ____exports.ScreenCoordinates.STANDARD_WIDTH
            pixelY = wc3Y / ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT * ____exports.ScreenCoordinates.STANDARD_HEIGHT
            break
        end
        ____cond6 = ____cond6 or ____switch6 == ____exports.ScreenCoordinates.ORIGIN_CENTER
        if ____cond6 then
            centerX = ____exports.ScreenCoordinates.STANDARD_WIDTH / 2
            centerY = ____exports.ScreenCoordinates.STANDARD_HEIGHT / 2
            pixelX = wc3X / ____exports.ScreenCoordinates.WC3_SCREEN_WIDTH * ____exports.ScreenCoordinates.STANDARD_WIDTH - centerX
            pixelY = (1 - wc3Y / ____exports.ScreenCoordinates.WC3_SCREEN_HEIGHT) * ____exports.ScreenCoordinates.STANDARD_HEIGHT - centerY
            break
        end
        do
            error(
                __TS__New(Error, "Unsupported origin type: " .. origin),
                0
            )
        end
    until true
    return {
        x = math.floor(pixelX + 0.5),
        y = math.floor(pixelY + 0.5)
    }
end
function ScreenCoordinates.getPresetPosition(self, preset)
    local positions = {
        TOP_LEFT = {x = 0, y = 0},
        TOP_RIGHT = {x = 1820, y = 0},
        BOTTOM_LEFT = {x = 0, y = 1080},
        BOTTOM_RIGHT = {x = 1820, y = 1080},
        TOP_CENTER = {x = 960, y = 0},
        BOTTOM_CENTER = {x = 960, y = 1080},
        LEFT_CENTER = {x = 0, y = 540},
        RIGHT_CENTER = {x = 1820, y = 540},
        CENTER = {x = 960, y = 540},
        UI_TOP_LEFT = {x = 50, y = 50},
        UI_TOP_RIGHT = {x = 1770, y = 50},
        UI_BOTTOM_LEFT = {x = 50, y = 950},
        UI_BOTTOM_RIGHT = {x = 1770, y = 950}
    }
    if not (positions[preset] ~= nil) then
        error(
            __TS__New(Error, "Unknown preset position: " .. preset),
            0
        )
    end
    return positions[preset]
end
function ScreenCoordinates.distance(self, x1, y1, x2, y2)
    return math.sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)
end
function ScreenCoordinates.isInRect(self, pointX, pointY, rectX, rectY, rectWidth, rectHeight)
    return pointX >= rectX and pointX <= rectX + rectWidth and pointY >= rectY and pointY <= rectY + rectHeight
end
ScreenCoordinates.WC3_SCREEN_WIDTH = 0.8
ScreenCoordinates.WC3_SCREEN_HEIGHT = 0.6
ScreenCoordinates.STANDARD_WIDTH = 1920
ScreenCoordinates.STANDARD_HEIGHT = 1080
ScreenCoordinates.ORIGIN_TOP_LEFT = "TOP_LEFT"
ScreenCoordinates.ORIGIN_BOTTOM_LEFT = "BOTTOM_LEFT"
ScreenCoordinates.ORIGIN_CENTER = "CENTER"
return ____exports
 end,
["src.system.ui.UILayout"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end
-- End of Lua Library inline imports
local ____exports = {}
local ____ScreenCoordinates = require("src.system.ui.ScreenCoordinates")
local ScreenCoordinates = ____ScreenCoordinates.ScreenCoordinates
____exports.UILayout = __TS__Class()
local UILayout = ____exports.UILayout
UILayout.name = "UILayout"
function UILayout.prototype.____constructor(self)
end
function UILayout.createButton(self, x, y, sizePreset, origin)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local size = ____exports.UILayout.BUTTON_SIZES[sizePreset]
    local wc3Pos = ScreenCoordinates:pixelToWC3(x, y, origin)
    local wc3Size = {width = size.width / ScreenCoordinates.STANDARD_WIDTH * ScreenCoordinates.WC3_SCREEN_WIDTH, height = size.height / ScreenCoordinates.STANDARD_HEIGHT * ScreenCoordinates.WC3_SCREEN_HEIGHT}
    return {x = wc3Pos.x, y = wc3Pos.y, width = wc3Size.width, height = wc3Size.height}
end
function UILayout.createPanel(self, x, y, sizePreset, origin)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local size = ____exports.UILayout.PANEL_SIZES[sizePreset]
    local wc3Pos = ScreenCoordinates:pixelToWC3(x, y, origin)
    local wc3Size = {width = size.width / ScreenCoordinates.STANDARD_WIDTH * ScreenCoordinates.WC3_SCREEN_WIDTH, height = size.height / ScreenCoordinates.STANDARD_HEIGHT * ScreenCoordinates.WC3_SCREEN_HEIGHT}
    return {x = wc3Pos.x, y = wc3Pos.y, width = wc3Size.width, height = wc3Size.height}
end
function UILayout.createHorizontalButtonGroup(self, startX, y, buttonCount, sizePreset, spacing, origin)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if spacing == nil then
        spacing = ____exports.UILayout.SPACING.MEDIUM
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local buttons = {}
    local buttonSize = ____exports.UILayout.BUTTON_SIZES[sizePreset]
    do
        local i = 0
        while i < buttonCount do
            local x = startX + i * (buttonSize.width + spacing)
            buttons[#buttons + 1] = ____exports.UILayout:createButton(x, y, sizePreset, origin)
            i = i + 1
        end
    end
    return buttons
end
function UILayout.createVerticalButtonGroup(self, x, startY, buttonCount, sizePreset, spacing, origin)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if spacing == nil then
        spacing = ____exports.UILayout.SPACING.MEDIUM
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local buttons = {}
    local buttonSize = ____exports.UILayout.BUTTON_SIZES[sizePreset]
    do
        local i = 0
        while i < buttonCount do
            local y = startY + i * (buttonSize.height + spacing)
            buttons[#buttons + 1] = ____exports.UILayout:createButton(x, y, sizePreset, origin)
            i = i + 1
        end
    end
    return buttons
end
function UILayout.createGridLayout(self, startX, startY, rows, cols, sizePreset, spacing, origin)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if spacing == nil then
        spacing = ____exports.UILayout.SPACING.MEDIUM
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local grid = {}
    local buttonSize = ____exports.UILayout.BUTTON_SIZES[sizePreset]
    do
        local row = 0
        while row < rows do
            local rowButtons = {}
            do
                local col = 0
                while col < cols do
                    local x = startX + col * (buttonSize.width + spacing)
                    local y = startY + row * (buttonSize.height + spacing)
                    rowButtons[#rowButtons + 1] = ____exports.UILayout:createButton(x, y, sizePreset, origin)
                    col = col + 1
                end
            end
            grid[#grid + 1] = rowButtons
            row = row + 1
        end
    end
    return grid
end
function UILayout.centerAlign(self, elementWidth, elementHeight, containerWidth, containerHeight)
    if containerWidth == nil then
        containerWidth = ScreenCoordinates.STANDARD_WIDTH
    end
    if containerHeight == nil then
        containerHeight = ScreenCoordinates.STANDARD_HEIGHT
    end
    return {x = (containerWidth - elementWidth) / 2, y = (containerHeight - elementHeight) / 2}
end
function UILayout.getSafeArea(self, margin)
    if margin == nil then
        margin = 50
    end
    return {x = margin, y = margin, width = ScreenCoordinates.STANDARD_WIDTH - 2 * margin, height = ScreenCoordinates.STANDARD_HEIGHT - 2 * margin}
end
function UILayout.arrangeInArea(self, area, elementCount, elementSize, spacing, direction)
    if spacing == nil then
        spacing = ____exports.UILayout.SPACING.MEDIUM
    end
    if direction == nil then
        direction = "horizontal"
    end
    local positions = {}
    repeat
        local ____switch19 = direction
        local totalWidth, startX, centerY, totalHeight, centerX, startY, cols, rows, gridWidth, gridHeight, gridStartX, gridStartY
        local ____cond19 = ____switch19 == "horizontal"
        if ____cond19 then
            totalWidth = elementCount * elementSize.width + (elementCount - 1) * spacing
            startX = area.x + (area.width - totalWidth) / 2
            centerY = area.y + (area.height - elementSize.height) / 2
            do
                local i = 0
                while i < elementCount do
                    positions[#positions + 1] = {x = startX + i * (elementSize.width + spacing), y = centerY}
                    i = i + 1
                end
            end
            break
        end
        ____cond19 = ____cond19 or ____switch19 == "vertical"
        if ____cond19 then
            totalHeight = elementCount * elementSize.height + (elementCount - 1) * spacing
            centerX = area.x + (area.width - elementSize.width) / 2
            startY = area.y + (area.height - totalHeight) / 2
            do
                local i = 0
                while i < elementCount do
                    positions[#positions + 1] = {x = centerX, y = startY + i * (elementSize.height + spacing)}
                    i = i + 1
                end
            end
            break
        end
        ____cond19 = ____cond19 or ____switch19 == "grid"
        if ____cond19 then
            cols = math.floor((area.width + spacing) / (elementSize.width + spacing))
            rows = math.ceil(elementCount / cols)
            gridWidth = cols * elementSize.width + (cols - 1) * spacing
            gridHeight = rows * elementSize.height + (rows - 1) * spacing
            gridStartX = area.x + (area.width - gridWidth) / 2
            gridStartY = area.y + (area.height - gridHeight) / 2
            do
                local i = 0
                while i < elementCount do
                    local row = math.floor(i / cols)
                    local col = i % cols
                    positions[#positions + 1] = {x = gridStartX + col * (elementSize.width + spacing), y = gridStartY + row * (elementSize.height + spacing)}
                    i = i + 1
                end
            end
            break
        end
    until true
    return positions
end
UILayout.BUTTON_SIZES = {SMALL = {width = 80, height = 32}, MEDIUM = {width = 120, height = 40}, LARGE = {width = 160, height = 48}, EXTRA_LARGE = {width = 200, height = 56}}
UILayout.PANEL_SIZES = {SMALL = {width = 300, height = 200}, MEDIUM = {width = 500, height = 350}, LARGE = {width = 700, height = 500}, FULLSCREEN = {width = 1820, height = 980}}
UILayout.SPACING = {
    TINY = 4,
    SMALL = 8,
    MEDIUM = 16,
    LARGE = 24,
    EXTRA_LARGE = 32
}
return ____exports
 end,
["src.constants.frame.events"] = function(...) 
local ____exports = {}
--- 功能键 F1-F12
____exports.KEY_F1 = 112
____exports.KEY_F2 = 113
____exports.KEY_F3 = 114
____exports.KEY_F4 = 115
____exports.KEY_F5 = 116
____exports.KEY_F6 = 117
____exports.KEY_F7 = 118
____exports.KEY_F8 = 119
____exports.KEY_F9 = 120
____exports.KEY_F10 = 121
____exports.KEY_F11 = 122
____exports.KEY_F12 = 123
--- 数字键 0-9 (主键盘区)
____exports.KEY_0 = 48
____exports.KEY_1 = 49
____exports.KEY_2 = 50
____exports.KEY_3 = 51
____exports.KEY_4 = 52
____exports.KEY_5 = 53
____exports.KEY_6 = 54
____exports.KEY_7 = 55
____exports.KEY_8 = 56
____exports.KEY_9 = 57
--- 小键盘数字键 0-9
____exports.KEY_NUMPAD0 = 96
____exports.KEY_NUMPAD1 = 97
____exports.KEY_NUMPAD2 = 98
____exports.KEY_NUMPAD3 = 99
____exports.KEY_NUMPAD4 = 100
____exports.KEY_NUMPAD5 = 101
____exports.KEY_NUMPAD6 = 102
____exports.KEY_NUMPAD7 = 103
____exports.KEY_NUMPAD8 = 104
____exports.KEY_NUMPAD9 = 105
--- 字母键 A-Z
____exports.KEY_A = 65
____exports.KEY_B = 66
____exports.KEY_C = 67
____exports.KEY_D = 68
____exports.KEY_E = 69
____exports.KEY_F = 70
____exports.KEY_G = 71
____exports.KEY_H = 72
____exports.KEY_I = 73
____exports.KEY_J = 74
____exports.KEY_K = 75
____exports.KEY_L = 76
____exports.KEY_M = 77
____exports.KEY_N = 78
____exports.KEY_O = 79
____exports.KEY_P = 80
____exports.KEY_Q = 81
____exports.KEY_R = 82
____exports.KEY_S = 83
____exports.KEY_T = 84
____exports.KEY_U = 85
____exports.KEY_V = 86
____exports.KEY_W = 87
____exports.KEY_X = 88
____exports.KEY_Y = 89
____exports.KEY_Z = 90
--- 方向键
____exports.KEY_LEFT = 37
____exports.KEY_UP = 38
____exports.KEY_RIGHT = 39
____exports.KEY_DOWN = 40
--- 控制键
____exports.KEY_ESCAPE = 27
____exports.KEY_ENTER = 13
____exports.KEY_SPACE = 32
____exports.KEY_TAB = 9
____exports.KEY_BACKSPACE = 8
____exports.KEY_DELETE = 46
____exports.KEY_INSERT = 45
____exports.KEY_HOME = 36
____exports.KEY_END = 35
____exports.KEY_PAGEUP = 33
____exports.KEY_PAGEDOWN = 34
--- 修饰键
____exports.KEY_SHIFT = 16
____exports.KEY_CTRL = 17
____exports.KEY_ALT = 18
____exports.KEY_CAPSLOCK = 20
--- 小键盘运算符
____exports.KEY_NUMPAD_MULTIPLY = 106
____exports.KEY_NUMPAD_ADD = 107
____exports.KEY_NUMPAD_SUBTRACT = 109
____exports.KEY_NUMPAD_DECIMAL = 110
____exports.KEY_NUMPAD_DIVIDE = 111
--- 按键元状态 (用于 metaKey 参数)
____exports.META_KEY_NONE = 0
____exports.META_KEY_SHIFT = 1
____exports.META_KEY_CTRL = 2
____exports.META_KEY_ALT = 4
____exports.META_KEY_SHIFT_CTRL = 3
____exports.META_KEY_SHIFT_ALT = 5
____exports.META_KEY_CTRL_ALT = 6
____exports.META_KEY_SHIFT_CTRL_ALT = 7
--- 当控件（如按钮）被点击时触发
____exports.FRAMEEVENT_CONTROL_CLICK = 1
--- 当鼠标光标移入框架区域时触发
____exports.FRAMEEVENT_MOUSE_ENTER = 2
--- 当鼠标光标移出框架区域时触发
____exports.FRAMEEVENT_MOUSE_LEAVE = 3
--- 当鼠标按钮在框架上松开时触发
____exports.FRAMEEVENT_MOUSE_UP = 4
--- 当在框架上滚动鼠标滚轮时触发
____exports.FRAMEEVENT_MOUSE_WHEEL = 5
--- 当复选框被勾选时触发（适用于复选框控件）
____exports.FRAMEEVENT_CHECKBOX_CHECKED = 6
--- 当编辑框内的文本发生变化时触发
____exports.FRAMEEVENT_EDITBOX_TEXT_CHANGED = 7
--- Frame事件类型枚举
____exports.FrameEventType = FrameEventType or ({})
____exports.FrameEventType.CONTROL_CLICK = 1
____exports.FrameEventType[____exports.FrameEventType.CONTROL_CLICK] = "CONTROL_CLICK"
____exports.FrameEventType.MOUSE_ENTER = 2
____exports.FrameEventType[____exports.FrameEventType.MOUSE_ENTER] = "MOUSE_ENTER"
____exports.FrameEventType.MOUSE_LEAVE = 3
____exports.FrameEventType[____exports.FrameEventType.MOUSE_LEAVE] = "MOUSE_LEAVE"
____exports.FrameEventType.MOUSE_UP = 4
____exports.FrameEventType[____exports.FrameEventType.MOUSE_UP] = "MOUSE_UP"
____exports.FrameEventType.MOUSE_WHEEL = 5
____exports.FrameEventType[____exports.FrameEventType.MOUSE_WHEEL] = "MOUSE_WHEEL"
____exports.FrameEventType.CHECKBOX_CHECKED = 6
____exports.FrameEventType[____exports.FrameEventType.CHECKBOX_CHECKED] = "CHECKBOX_CHECKED"
____exports.FrameEventType.EDITBOX_TEXT_CHANGED = 7
____exports.FrameEventType[____exports.FrameEventType.EDITBOX_TEXT_CHANGED] = "EDITBOX_TEXT_CHANGED"
return ____exports
 end,
["src.constants.frame.types"] = function(...) 
local ____exports = {}
return ____exports
 end,
["src.constants.frame.utils"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____events = require("src.constants.frame.events")
local FRAMEEVENT_CONTROL_CLICK = ____events.FRAMEEVENT_CONTROL_CLICK
local FRAMEEVENT_MOUSE_ENTER = ____events.FRAMEEVENT_MOUSE_ENTER
local FRAMEEVENT_MOUSE_LEAVE = ____events.FRAMEEVENT_MOUSE_LEAVE
local FRAMEEVENT_MOUSE_UP = ____events.FRAMEEVENT_MOUSE_UP
local FRAMEEVENT_MOUSE_WHEEL = ____events.FRAMEEVENT_MOUSE_WHEEL
local FRAMEEVENT_CHECKBOX_CHECKED = ____events.FRAMEEVENT_CHECKBOX_CHECKED
local FRAMEEVENT_EDITBOX_TEXT_CHANGED = ____events.FRAMEEVENT_EDITBOX_TEXT_CHANGED
--- Frame事件工具类
-- 提供便捷的事件绑定方法
____exports.FrameEventUtils = __TS__Class()
local FrameEventUtils = ____exports.FrameEventUtils
FrameEventUtils.name = "FrameEventUtils"
function FrameEventUtils.prototype.____constructor(self)
end
function FrameEventUtils.bindClickEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_CONTROL_CLICK, handler, false)
end
function FrameEventUtils.bindMouseEnterEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_MOUSE_ENTER, handler, false)
end
function FrameEventUtils.bindMouseLeaveEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_MOUSE_LEAVE, handler, false)
end
function FrameEventUtils.bindMouseUpEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_MOUSE_UP, handler, false)
end
function FrameEventUtils.bindMouseWheelEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_MOUSE_WHEEL, handler, false)
end
function FrameEventUtils.bindCheckboxCheckedEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_CHECKBOX_CHECKED, handler, false)
end
function FrameEventUtils.bindTextChangedEvent(self, frame, handler)
    DzFrameSetScriptByCode(frame.handle, FRAMEEVENT_EDITBOX_TEXT_CHANGED, handler, false)
end
function FrameEventUtils.bindEvents(self, frame, events)
    if events.onClick then
        self:bindClickEvent(frame, events.onClick)
    end
    if events.onMouseEnter then
        self:bindMouseEnterEvent(frame, events.onMouseEnter)
    end
    if events.onMouseLeave then
        self:bindMouseLeaveEvent(frame, events.onMouseLeave)
    end
    if events.onMouseUp then
        self:bindMouseUpEvent(frame, events.onMouseUp)
    end
    if events.onMouseWheel then
        self:bindMouseWheelEvent(frame, events.onMouseWheel)
    end
    if events.onCheckboxChecked then
        self:bindCheckboxCheckedEvent(frame, events.onCheckboxChecked)
    end
    if events.onTextChanged then
        self:bindTextChangedEvent(frame, events.onTextChanged)
    end
end
function FrameEventUtils.unbindAllEvents(self, frame)
    local events = {
        FRAMEEVENT_CONTROL_CLICK,
        FRAMEEVENT_MOUSE_ENTER,
        FRAMEEVENT_MOUSE_LEAVE,
        FRAMEEVENT_MOUSE_UP,
        FRAMEEVENT_MOUSE_WHEEL,
        FRAMEEVENT_CHECKBOX_CHECKED,
        FRAMEEVENT_EDITBOX_TEXT_CHANGED
    }
    local function emptyHandler()
    end
    __TS__ArrayForEach(
        events,
        function(____, eventType)
            DzFrameSetScriptByCode(frame.handle, eventType, emptyHandler, false)
        end
    )
end
return ____exports
 end,
["src.system.ui.component.Buttom"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Frame = _____2A.Frame
local FRAME_ALIGN_LEFT_TOP = _____2A.FRAME_ALIGN_LEFT_TOP
local FRAME_ALIGN_RIGHT_BOTTOM = _____2A.FRAME_ALIGN_RIGHT_BOTTOM
local ____ScreenCoordinates = require("src.system.ui.ScreenCoordinates")
local ScreenCoordinates = ____ScreenCoordinates.ScreenCoordinates
local ____UILayout = require("src.system.ui.UILayout")
local UILayout = ____UILayout.UILayout
local ____console = require("src.system.console")
local Console = ____console.Console
local ____utils = require("src.constants.frame.utils")
local FrameEventUtils = ____utils.FrameEventUtils
--- 常用背景纹理预设
____exports.ButtonTextures = {
    HUMAN_BORDER = "UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp",
    HUMAN_BACKGROUND = "UI\\Widgets\\Console\\Human\\human-transport-slot.blp",
    ORC_BACKGROUND = "UI\\Widgets\\Console\\Orc\\orc-transport-slot.blp",
    NIGHTELF_BACKGROUND = "UI\\Widgets\\Console\\NightElf\\nightelf-transport-slot.blp",
    UNDEAD_BACKGROUND = "UI\\Widgets\\Console\\Undead\\undead-transport-slot.blp",
    BLACK_TRANSPARENT = "UI\\Widgets\\EscMenu\\Human\\editbox-background.blp",
    TOOLTIP_BACKGROUND = "UI\\Widgets\\ToolTips\\Human\\human-tooltip-background.blp",
    DIALOG_BACKGROUND = "UI\\Widgets\\Glues\\GlueScreen-DialogBackground.blp",
    QUEST_BACKGROUND = "UI\\Widgets\\Quests\\QuestMainBackdrop.blp",
    TRANSPARENT = ""
}
--- Button类 - 三层结构按钮组件
-- 包含: 背景框架(Backdrop) + 文本框架(Text) + 按钮框架(Button)
____exports.Button = __TS__Class()
local Button = ____exports.Button
Button.name = "Button"
function Button.prototype.____constructor(self, label, x, y, width, height, origin)
    if width == nil then
        width = 120
    end
    if height == nil then
        height = 40
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    self.backdropFrame = nil
    self.textFrame = nil
    self.buttonFrame = nil
    self.onClick = nil
    self.onHover = nil
    self.onLeave = nil
    self.isEnabled = true
    self.isVisible = true
    self.texture = ____exports.ButtonTextures.HUMAN_BORDER
    self.textAlignment = 50
    self.textColor = "FFFFFF"
    self.tooltip = ""
    self.origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    self.label = label
    self.pixelX = x
    self.pixelY = y
    self.pixelWidth = width
    self.pixelHeight = height
    self.origin = origin
end
function Button.createWithPreset(self, label, x, y, sizePreset, origin, parent)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if origin == nil then
        origin = ScreenCoordinates.ORIGIN_TOP_LEFT
    end
    local size = UILayout.BUTTON_SIZES[sizePreset]
    local button = __TS__New(
        ____exports.Button,
        label,
        x,
        y,
        size.width,
        size.height,
        origin
    )
    button:create(parent)
    return button
end
function Button.createAtPresetPosition(self, label, positionPreset, sizePreset, centered, parent)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    if centered == nil then
        centered = true
    end
    local position = ScreenCoordinates:getPresetPosition(positionPreset)
    local size = UILayout.BUTTON_SIZES[sizePreset]
    local x = position.x
    local y = position.y
    if centered then
        x = position.x - size.width / 2
        y = position.y - size.height / 2
    end
    Console:log((((((("Creating button at preset: " .. positionPreset) .. " -> pixel(") .. tostring(x)) .. ", ") .. tostring(y)) .. "), centered=") .. (centered and "true" or "false"))
    local button = __TS__New(
        ____exports.Button,
        label,
        x,
        y,
        size.width,
        size.height
    )
    button:create(parent)
    return button
end
function Button.createCentered(self, label, sizePreset, parent)
    if sizePreset == nil then
        sizePreset = "MEDIUM"
    end
    return ____exports.Button:createAtPresetPosition(
        label,
        "CENTER",
        sizePreset,
        true,
        parent
    )
end
function Button.prototype.create(self, parent)
    if self.backdropFrame then
        Console:log("Button already created")
        return
    end
    local parentFrame = parent or Frame:fromHandle(DzGetGameUI())
    local wc3Pos = ScreenCoordinates:pixelToWC3(self.pixelX, self.pixelY, self.origin)
    local wc3Width = self.pixelWidth / ScreenCoordinates.STANDARD_WIDTH * ScreenCoordinates.WC3_SCREEN_WIDTH
    local wc3Height = self.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT * ScreenCoordinates.WC3_SCREEN_HEIGHT
    self.backdropFrame = Frame:createType(
        "BACKDROP",
        parentFrame,
        0,
        "BACKDROP",
        ""
    )
    if not self.backdropFrame then
        Console:log("Error: Failed to create backdrop frame")
        return
    end
    local rightX = wc3Pos.x + wc3Width
    local bottomY = wc3Pos.y - wc3Height
    self.backdropFrame:setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y):setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY):setTexture(self.texture, 0, true)
    self.textFrame = Frame:createType(
        "TEXT",
        self.backdropFrame,
        0,
        "TEXT",
        ""
    )
    if not self.textFrame then
        Console:log("Error: Failed to create text frame")
        return
    end
    self.textFrame:setAllPoints(self.backdropFrame):setText((("|cff" .. self.textColor) .. self.label) .. "|r"):setTextAlignment(self.textAlignment, 0)
    self.buttonFrame = Frame:createType(
        "BUTTON",
        self.backdropFrame,
        0,
        "BUTTON",
        ""
    )
    if not self.buttonFrame then
        Console:log("Error: Failed to create button frame")
        return
    end
    self.buttonFrame:setAllPoints(self.backdropFrame)
    self:setVisible(self.isVisible)
    self:setEnabled(self.isEnabled)
    self:setupEventListeners()
    Console:log(("Button \"" .. self.label) .. "\" created successfully with 3-layer structure")
end
function Button.prototype.setOnClick(self, callback)
    self.onClick = callback
    if self.buttonFrame then
        self:setupEventListeners()
    end
    return self
end
function Button.prototype.setOnHover(self, callback)
    self.onHover = callback
    if self.buttonFrame then
        self:setupEventListeners()
    end
    return self
end
function Button.prototype.setOnLeave(self, callback)
    self.onLeave = callback
    if self.buttonFrame then
        self:setupEventListeners()
    end
    return self
end
function Button.prototype.setText(self, text)
    self.label = text
    if self.textFrame then
        self.textFrame:setText((("|cff" .. self.textColor) .. text) .. "|r")
    end
    return self
end
function Button.prototype.getText(self)
    return self.label
end
function Button.prototype.setTextColor(self, hexColor)
    self.textColor = hexColor
    if self.textFrame then
        self.textFrame:setText((("|cff" .. self.textColor) .. self.label) .. "|r")
    end
    return self
end
function Button.prototype.setTextAlignment(self, alignment)
    self.textAlignment = alignment
    if self.textFrame then
        self.textFrame:setTextAlignment(alignment, 0)
    end
    return self
end
function Button.prototype.setPosition(self, x, y)
    self.pixelX = x
    self.pixelY = y
    if self.backdropFrame then
        local wc3Pos = ScreenCoordinates:pixelToWC3(self.pixelX, self.pixelY, self.origin)
        local wc3Width = self.pixelWidth / ScreenCoordinates.STANDARD_WIDTH * ScreenCoordinates.WC3_SCREEN_WIDTH
        local wc3Height = self.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT * ScreenCoordinates.WC3_SCREEN_HEIGHT
        local rightX = wc3Pos.x + wc3Width
        local bottomY = wc3Pos.y - wc3Height
        self.backdropFrame:setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y):setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
    end
    return self
end
function Button.prototype.setSize(self, width, height)
    self.pixelWidth = width
    self.pixelHeight = height
    if self.backdropFrame then
        local wc3Pos = ScreenCoordinates:pixelToWC3(self.pixelX, self.pixelY, self.origin)
        local wc3Width = self.pixelWidth / ScreenCoordinates.STANDARD_WIDTH * ScreenCoordinates.WC3_SCREEN_WIDTH
        local wc3Height = self.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT * ScreenCoordinates.WC3_SCREEN_HEIGHT
        local rightX = wc3Pos.x + wc3Width
        local bottomY = wc3Pos.y - wc3Height
        self.backdropFrame:setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y):setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
    end
    return self
end
function Button.prototype.setTexture(self, texturePath)
    self.texture = texturePath
    if self.backdropFrame then
        self.backdropFrame:setTexture(texturePath, 0, true)
    end
    return self
end
function Button.prototype.setTexturePreset(self, preset)
    return self:setTexture(____exports.ButtonTextures[preset])
end
function Button.prototype.setBackdropAlpha(self, alpha)
    if self.backdropFrame then
        self.backdropFrame:setAlpha(alpha)
    end
    return self
end
function Button.prototype.hideBackdrop(self)
    return self:setTexture("")
end
function Button.prototype.setBackground(self, path)
    return self:setTexture(path)
end
function Button.prototype.setTooltip(self, tooltip)
    self.tooltip = tooltip
    return self
end
function Button.prototype.setEnabled(self, enabled)
    self.isEnabled = enabled
    if self.buttonFrame then
        if enabled then
            local ____opt_0 = self.backdropFrame
            if ____opt_0 ~= nil then
                ____opt_0:setAlpha(255)
            end
            local ____opt_2 = self.textFrame
            if ____opt_2 ~= nil then
                ____opt_2:setAlpha(255)
            end
        else
            local ____opt_4 = self.backdropFrame
            if ____opt_4 ~= nil then
                ____opt_4:setAlpha(128)
            end
            local ____opt_6 = self.textFrame
            if ____opt_6 ~= nil then
                ____opt_6:setAlpha(128)
            end
        end
    end
    return self
end
function Button.prototype.setVisible(self, visible)
    self.isVisible = visible
    if self.backdropFrame then
        self.backdropFrame:setVisible(visible)
    end
    if self.textFrame then
        self.textFrame:setVisible(visible)
    end
    if self.buttonFrame then
        self.buttonFrame:setVisible(visible)
    end
    return self
end
function Button.prototype.getEnabled(self)
    return self.isEnabled
end
function Button.prototype.getVisible(self)
    return self.isVisible
end
function Button.prototype.getBackdropFrame(self)
    return self.backdropFrame
end
function Button.prototype.getTextFrame(self)
    return self.textFrame
end
function Button.prototype.getButtonFrame(self)
    return self.buttonFrame
end
function Button.prototype.getPosition(self)
    return {x = self.pixelX, y = self.pixelY}
end
function Button.prototype.getSize(self)
    return {width = self.pixelWidth, height = self.pixelHeight}
end
function Button.prototype.destroy(self)
    if self.buttonFrame then
        self.buttonFrame:destroy()
        self.buttonFrame = nil
    end
    if self.textFrame then
        self.textFrame:destroy()
        self.textFrame = nil
    end
    if self.backdropFrame then
        self.backdropFrame:destroy()
        self.backdropFrame = nil
    end
    self.onClick = nil
    self.onHover = nil
    self.onLeave = nil
end
function Button.prototype.setupEventListeners(self)
    if not self.buttonFrame then
        return
    end
    FrameEventUtils:bindEvents(
        self.buttonFrame,
        {
            onClick = self.onClick and (function()
                if self.isEnabled and self.onClick then
                    self.onClick()
                end
            end) or nil,
            onMouseEnter = self.onHover and (function()
                if self.isEnabled and self.onHover then
                    self.onHover()
                end
            end) or nil,
            onMouseLeave = self.onLeave and (function()
                if self.isEnabled and self.onLeave then
                    self.onLeave()
                end
            end) or nil
        }
    )
end
function Button.prototype.click(self)
    if self.isEnabled and self.onClick then
        self.onClick()
        Console:log(("Button \"" .. self.label) .. "\" clicked")
    end
end
function Button.prototype.addHoverEffect(self, hoverAlpha, normalAlpha)
    if hoverAlpha == nil then
        hoverAlpha = 200
    end
    if normalAlpha == nil then
        normalAlpha = 255
    end
    self:setOnHover(function()
        if self.backdropFrame and self.isEnabled then
            self.backdropFrame:setAlpha(hoverAlpha)
        end
    end)
    self:setOnLeave(function()
        if self.backdropFrame and self.isEnabled then
            self.backdropFrame:setAlpha(normalAlpha)
        end
    end)
    return self
end
function Button.prototype.configure(self, config)
    if config.text ~= nil then
        self:setText(config.text)
    end
    if config.textColor ~= nil then
        self:setTextColor(config.textColor)
    end
    if config.texture ~= nil then
        self:setTexture(config.texture)
    end
    if config.onClick ~= nil then
        self:setOnClick(config.onClick)
    end
    if config.onHover ~= nil then
        self:setOnHover(config.onHover)
    end
    if config.onLeave ~= nil then
        self:setOnLeave(config.onLeave)
    end
    if config.enabled ~= nil then
        self:setEnabled(config.enabled)
    end
    if config.visible ~= nil then
        self:setVisible(config.visible)
    end
    return self
end
return ____exports
 end,
["src.examples.TemplateUi"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
local ____ModuleManager = require("src.system.ModuleManager")
local ModuleManager = ____ModuleManager.ModuleManager
local ____console = require("src.system.console")
local Console = ____console.Console
--- 热更新模板
-- 
-- 热重载设计要点：
-- 1. 需要在热重载时销毁的资源（如UI组件）应保存为类的成员变量
-- 2. 在 cleanup() 中销毁所有需要清理的资源
-- 3. 在 initialize() 中重新创建资源
local TemplateUI = __TS__Class()
TemplateUI.name = "TemplateUI"
function TemplateUI.prototype.____constructor(self)
    self.testButton = nil
    self.buttons = {}
end
function TemplateUI.prototype.TestButton(self)
end
function TemplateUI.prototype.cleanup(self)
    Console:log("TemplateUI: Cleanup called, destroying resources...")
    if self.testButton then
        self.testButton:destroy()
        self.testButton = nil
        Console:log("TemplateUI: testButton destroyed")
    end
    for ____, btn in ipairs(self.buttons) do
        btn:destroy()
    end
    self.buttons = {}
    Console:log("TemplateUI: All resources cleaned up")
end
function TemplateUI.prototype.initialize(self)
    Console:log("TemplateUI: Initializing...")
    self:TestButton()
    print("TemplateUI initialized")
end
function TemplateUI.onHotReload(self)
    Console:log("TemplateUI hot reloaded!")
end
local templateUIInstance = nil
print(">>> TemplateUI: Module file loaded, about to register...")
local manager = ModuleManager:getInstance()
print(">>> TemplateUI: Got ModuleManager instance")
manager:registerModule(
    "TemplateUI",
    TemplateUI,
    {
        initialize = function()
            print(">>> TemplateUI: Initialize callback called")
            if not templateUIInstance then
                templateUIInstance = __TS__New(TemplateUI)
            end
            templateUIInstance:initialize()
        end,
        cleanup = function()
            print(">>> TemplateUI: Cleanup callback called")
            if templateUIInstance then
                templateUIInstance:cleanup()
            end
        end,
        onHotReload = function()
            print(">>> TemplateUI: onHotReload callback called")
            TemplateUI:onHotReload()
        end,
        dependencies = {}
    }
)
print(">>> TemplateUI: Module registration completed")
____exports.TemplateUI = TemplateUI
return ____exports
 end,
["src.constants.frame.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("src.constants.frame.events")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("src.constants.frame.types")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("src.constants.frame.utils")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
 end,
["src.constants.game.units"] = function(...) 
local ____exports = {}
--- 游戏单位相关常量定义
____exports.HERO_ARCHMAGE = "Hamg"
____exports.HERO_MOUNTAIN_KING = "Hmkg"
____exports.HERO_PALADIN = "Hpal"
____exports.HERO_BLOOD_MAGE = "Hblm"
____exports.UNIT_PEASANT = "hpea"
____exports.UNIT_FOOTMAN = "hfoo"
____exports.UNIT_RIFLEMAN = "hrif"
____exports.UNIT_KNIGHT = "hkni"
____exports.UNIT_STATE_LIFE = ConvertUnitState(0)
____exports.UNIT_STATE_MAX_LIFE = ConvertUnitState(1)
____exports.UNIT_STATE_MANA = ConvertUnitState(2)
____exports.UNIT_STATE_MAX_MANA = ConvertUnitState(3)
____exports.UNIT_TYPE_HERO = ConvertUnitType(0)
____exports.UNIT_TYPE_DEAD = ConvertUnitType(1)
____exports.UNIT_TYPE_STRUCTURE = ConvertUnitType(2)
____exports.UNIT_TYPE_FLYING = ConvertUnitType(3)
____exports.UNIT_TYPE_GROUND = ConvertUnitType(4)
____exports.ATTACK_TYPE_NORMAL = ConvertAttackType(0)
____exports.ATTACK_TYPE_PIERCE = ConvertAttackType(1)
____exports.ATTACK_TYPE_SIEGE = ConvertAttackType(2)
____exports.ATTACK_TYPE_MAGIC = ConvertAttackType(5)
____exports.ARMOR_TYPE_UNARMORED = ConvertDamageType(0)
____exports.ARMOR_TYPE_LIGHT = ConvertDamageType(1)
____exports.ARMOR_TYPE_MEDIUM = ConvertDamageType(2)
____exports.ARMOR_TYPE_HEAVY = ConvertDamageType(3)
____exports.ARMOR_TYPE_FORTIFIED = ConvertDamageType(4)
____exports.ARMOR_TYPE_HERO = ConvertDamageType(5)
return ____exports
 end,
["src.constants.ui.colors"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__StringAccess(self, index)
    if index >= 0 and index < #self then
        return string.sub(self, index + 1, index + 1)
    end
end

local __TS__MathModf = math.modf

local __TS__NumberToString
do
    local radixChars = "0123456789abcdefghijklmnopqrstuvwxyz"
    function __TS__NumberToString(self, radix)
        if radix == nil or radix == 10 or self == math.huge or self == -math.huge or self ~= self then
            return tostring(self)
        end
        radix = math.floor(radix)
        if radix < 2 or radix > 36 then
            error("toString() radix argument must be between 2 and 36", 0)
        end
        local integer, fraction = __TS__MathModf(math.abs(self))
        local result = ""
        if radix == 8 then
            result = string.format("%o", integer)
        elseif radix == 16 then
            result = string.format("%x", integer)
        else
            repeat
                do
                    result = __TS__StringAccess(radixChars, integer % radix) .. result
                    integer = math.floor(integer / radix)
                end
            until not (integer ~= 0)
        end
        if fraction ~= 0 then
            result = result .. "."
            local delta = 1e-16
            repeat
                do
                    fraction = fraction * radix
                    delta = delta * radix
                    local digit = math.floor(fraction)
                    result = result .. __TS__StringAccess(radixChars, digit)
                    fraction = fraction - digit
                end
            until not (fraction >= delta)
        end
        if self < 0 then
            result = "-" .. result
        end
        return result
    end
end

local __TS__StringReplace
do
    local sub = string.sub
    function __TS__StringReplace(source, searchValue, replaceValue)
        local startPos, endPos = string.find(source, searchValue, nil, true)
        if not startPos then
            return source
        end
        local before = sub(source, 1, startPos - 1)
        local replacement = type(replaceValue) == "string" and replaceValue or replaceValue(nil, searchValue, startPos - 1, source)
        local after = sub(source, endPos + 1)
        return (before .. replacement) .. after
    end
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__Match = string.match

local __TS__ParseInt
do
    local parseIntBasePattern = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTvVwWxXyYzZ"
    function __TS__ParseInt(numberString, base)
        if base == nil then
            base = 10
            local hexMatch = __TS__Match(numberString, "^%s*-?0[xX]")
            if hexMatch ~= nil then
                base = 16
                numberString = (__TS__Match(hexMatch, "-")) and "-" .. __TS__StringSubstring(numberString, #hexMatch) or __TS__StringSubstring(numberString, #hexMatch)
            end
        end
        if base < 2 or base > 36 then
            return 0 / 0
        end
        local allowedDigits = base <= 10 and __TS__StringSubstring(parseIntBasePattern, 0, base) or __TS__StringSubstring(parseIntBasePattern, 0, 10 + 2 * (base - 10))
        local pattern = ("^%s*(-?[" .. allowedDigits) .. "]*)"
        local number = tonumber((__TS__Match(numberString, pattern)), base)
        if number == nil then
            return 0 / 0
        end
        if number >= 0 then
            return math.floor(number)
        else
            return math.ceil(number)
        end
    end
end
-- End of Lua Library inline imports
local ____exports = {}
--- UI颜色常量定义
____exports.COLOR_WHITE = "#FFFFFF"
____exports.COLOR_BLACK = "#000000"
____exports.COLOR_RED = "#FF0000"
____exports.COLOR_GREEN = "#00FF00"
____exports.COLOR_BLUE = "#0000FF"
____exports.COLOR_YELLOW = "#FFFF00"
____exports.COLOR_CYAN = "#00FFFF"
____exports.COLOR_MAGENTA = "#FF00FF"
____exports.PLAYER_COLOR_RED = "#FF0303"
____exports.PLAYER_COLOR_BLUE = "#0042FF"
____exports.PLAYER_COLOR_TEAL = "#1CE6B9"
____exports.PLAYER_COLOR_PURPLE = "#540081"
____exports.PLAYER_COLOR_YELLOW = "#FFFC01"
____exports.PLAYER_COLOR_ORANGE = "#FEBA0E"
____exports.PLAYER_COLOR_GREEN = "#20C000"
____exports.PLAYER_COLOR_PINK = "#E55BB0"
____exports.PLAYER_COLOR_GRAY = "#959697"
____exports.PLAYER_COLOR_LIGHT_BLUE = "#7EBFF1"
____exports.PLAYER_COLOR_DARK_GREEN = "#106246"
____exports.PLAYER_COLOR_BROWN = "#4E2A04"
____exports.UI_COLOR_PRIMARY = "#1890FF"
____exports.UI_COLOR_SUCCESS = "#52C41A"
____exports.UI_COLOR_WARNING = "#FAAD14"
____exports.UI_COLOR_ERROR = "#FF4D4F"
____exports.UI_COLOR_INFO = "#1890FF"
____exports.ALPHA_TRANSPARENT = 0
____exports.ALPHA_QUARTER = 64
____exports.ALPHA_HALF = 128
____exports.ALPHA_THREE_QUARTERS = 192
____exports.ALPHA_OPAQUE = 255
____exports.ColorUtils = __TS__Class()
local ColorUtils = ____exports.ColorUtils
ColorUtils.name = "ColorUtils"
function ColorUtils.prototype.____constructor(self)
end
function ColorUtils.rgbToHex(self, r, g, b)
    return "#" .. string.sub(
        __TS__NumberToString((1 << 24) + (r << 16) + (g << 8) + b, 16),
        2
    )
end
function ColorUtils.hexToRgba(self, hex, alpha)
    if alpha == nil then
        alpha = 255
    end
    local cleanHex = __TS__StringReplace(hex, "#", "")
    if #cleanHex ~= 6 then
        return {r = 0, g = 0, b = 0, a = alpha}
    end
    local r = __TS__ParseInt(
        __TS__StringSubstring(cleanHex, 0, 2),
        16
    )
    local g = __TS__ParseInt(
        __TS__StringSubstring(cleanHex, 2, 4),
        16
    )
    local b = __TS__ParseInt(
        __TS__StringSubstring(cleanHex, 4, 6),
        16
    )
    return {r = r, g = g, b = b, a = alpha}
end
function ColorUtils.getPlayerColorCode(self, playerIndex)
    local colors = {
        "|cFFFF0303",
        "|cFF0042FF",
        "|cFF1CE6B9",
        "|cFF540081",
        "|cFFFFFC01",
        "|cFFFEBA0E",
        "|cFF20C000",
        "|cFFE55BB0",
        "|cFF959697",
        "|cFF7EBFF1",
        "|cFF106246",
        "|cFF4E2A04"
    }
    return colors[playerIndex + 1] or "|cFFFFFFFF"
end
return ____exports
 end,
["src.constants.index"] = function(...) 
local ____exports = {}
do
    local ____export = require("src.constants.frame.index")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("src.constants.game.units")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("src.constants.ui.colors")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
____exports.FrameConstants = require("src.constants.frame.index")
____exports.GameConstants = require("src.constants.game.units")
____exports.UIConstants = require("src.constants.ui.colors")
return ____exports
 end,
["src.test.ExportUI"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Frame = _____2A.Frame
local FRAMEPOINT_BOTTOMRIGHT = _____2A.FRAMEPOINT_BOTTOMRIGHT
local FRAMEPOINT_TOPLEFT = _____2A.FRAMEPOINT_TOPLEFT
local Trigger = _____2A.Trigger
local ____constants = require("src.constants.index")
local KEY_9 = ____constants.KEY_9
local ____Buttom = require("src.system.ui.component.Buttom")
local ButtonTextures = ____Buttom.ButtonTextures
____exports.ExportUI = __TS__Class()
local ExportUI = ____exports.ExportUI
ExportUI.name = "ExportUI"
function ExportUI.prototype.____constructor(self)
    self.frameWidthUnit = 0.053
    self.frameHightUnit = 0.03
    self.frameSrcX = 0.22
    self.frameSrcY = 0.54
    self.playerCount = 0
    self.frameDataList = {}
    self.show = true
    self.BackdropSemiTrans = Frame:createType(
        "BACKDROP",
        Frame:fromOrigin(ORIGIN_FRAME_GAME_UI, 0),
        0,
        "BACKDROP",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.21503, 0.52599):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.58836, 0.12655):setTexture(ButtonTextures.BLACK_TRANSPARENT, 0, true)
    self.FrameTitleByRank = __TS__New(
        Frame,
        "FrameTitleByRank",
        self.BackdropSemiTrans,
        0,
        0,
        "TEXT",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.22842, 0.51246):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.27446, 0.49046):setText("|cffFFCC00排名|r"):setEnabled(false):setScale(1):setTextAlignment(50, 0)
    self.FrameTitleByNickname = __TS__New(
        Frame,
        "FrameTitleByNickname",
        self.BackdropSemiTrans,
        0,
        0,
        "TEXT",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.2753, 0.51246):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.35231, 0.49046):setText("|cffFFCC00用户|r"):setEnabled(false):setScale(1):setTextAlignment(50, 0)
    self.FrameTitleByUserPoints = __TS__New(
        Frame,
        "FrameTitleByUserPoints",
        self.BackdropSemiTrans,
        0,
        0,
        "TEXT",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.35147, 0.51246):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.40421, 0.49046):setText("|cffFFCC00金币|r"):setEnabled(false):setScale(1):setTextAlignment(50, 0)
    self.FrameTitleByHeroXp = __TS__New(
        Frame,
        "FrameTitleByHeroXp",
        self.BackdropSemiTrans,
        0,
        0,
        "TEXT",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.40421, 0.51246):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.46532, 0.49046):setText("|cffFFCC00积分|r"):setEnabled(false):setScale(1):setTextAlignment(50, 0)
    self.FrameTitleByHeroXp = __TS__New(
        Frame,
        "FrameTitleByHeroXp",
        self.BackdropSemiTrans,
        0,
        0,
        "TEXT",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.46531, 0.51162):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.52139, 0.48962):setText("|cffFFCC00世界排名|r"):setEnabled(false):setScale(1):setTextAlignment(50, 0)
    self.FrameTitleByHeroXp = __TS__New(
        Frame,
        "FrameTitleByHeroXp",
        self.BackdropSemiTrans,
        0,
        0,
        "TEXT",
        ""
    ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.52223, 0.51246):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.5758, 0.49046):setText("|cffFFCC00当前船只|r"):setEnabled(false):setScale(1):setTextAlignment(50, 0)
    self:registerShowBtn()
end
function ExportUI.prototype.updateList(self)
end
function ExportUI.prototype.addUser(self, userId)
    if self.playerCount > 10 then
        return
    end
    self.playerCount = self.playerCount + 1
    local frame = {
        userId = userId,
        currentRank = __TS__New(
            Frame,
            "currentRank",
            self.BackdropSemiTrans,
            0,
            0,
            "TEXT",
            ""
        ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.22842, 0.51246 - self.playerCount * self.frameHightUnit):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.27446, 0.49046 - self.playerCount * self.frameHightUnit):setText("0"):setEnabled(false):setScale(1),
        nickname = __TS__New(
            Frame,
            "nickname",
            self.BackdropSemiTrans,
            0,
            0,
            "TEXT",
            ""
        ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.2753, 0.51246 - self.playerCount * self.frameHightUnit):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.35231, 0.49046 - self.playerCount * self.frameHightUnit):setText(""):setEnabled(false):setScale(1),
        gold = __TS__New(
            Frame,
            "gold",
            self.BackdropSemiTrans,
            0,
            0,
            "TEXT",
            ""
        ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.35147, 0.51246 - self.playerCount * self.frameHightUnit):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.40421, 0.49046 - self.playerCount * self.frameHightUnit):setText("0"):setEnabled(false):setScale(1),
        giftRewardPoints = __TS__New(
            Frame,
            "giftRewardPoints",
            self.BackdropSemiTrans,
            0,
            0,
            "TEXT",
            ""
        ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.40421, 0.51246 - self.playerCount * self.frameHightUnit):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.46532, 0.49046 - self.playerCount * self.frameHightUnit):setText("0"):setEnabled(false):setScale(1),
        rank = __TS__New(
            Frame,
            "rank",
            self.BackdropSemiTrans,
            0,
            0,
            "TEXT",
            ""
        ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.46531, 0.51162 - self.playerCount * self.frameHightUnit):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.52139, 0.48962 - self.playerCount * self.frameHightUnit):setText("|cffFFCC00无|r"):setEnabled(false):setScale(1),
        heroName = __TS__New(
            Frame,
            "heroName",
            self.BackdropSemiTrans,
            0,
            0,
            "TEXT",
            ""
        ):setAbsPoint(FRAMEPOINT_TOPLEFT, 0.52223, 0.51246 - self.playerCount * self.frameHightUnit):setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.5758, 0.49046 - self.playerCount * self.frameHightUnit):setText("|cffFFCC00无|r"):setEnabled(false):setScale(1)
    }
    local ____self_frameDataList_0 = self.frameDataList
    ____self_frameDataList_0[#____self_frameDataList_0 + 1] = frame
end
function ExportUI.prototype.registerShowBtn(self)
    local _this = self
    local trg = Trigger:create()
    do
        local i = 0
        while i < 24 do
            trg:registerPlayerKeyEvent(
                trg.handle,
                KEY_9,
                1,
                true,
                function()
                    if _this.show then
                        _this.BackdropSemiTrans:setVisible(false)
                        _this.show = false
                    else
                        _this.BackdropSemiTrans:setVisible(true)
                        _this.show = true
                    end
                end
            )
            i = i + 1
        end
    end
end
return ____exports
 end,
["src.main"] = function(...) 
-- Lua Library inline imports
local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local function __TS__InstanceOf(obj, classTbl)
    if type(classTbl) ~= "table" then
        error("Right-hand side of 'instanceof' is not an object", 0)
    end
    if classTbl[Symbol.hasInstance] ~= nil then
        return not not classTbl[Symbol.hasInstance](classTbl, obj)
    end
    if type(obj) == "table" then
        local luaClass = obj.constructor
        while luaClass ~= nil do
            if luaClass == classTbl then
                return true
            end
            luaClass = luaClass.____super
        end
    end
    return false
end

local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local __TS__Promise
do
    local function makeDeferredPromiseFactory()
        local resolve
        local reject
        local function executor(____, res, rej)
            resolve = res
            reject = rej
        end
        return function()
            local promise = __TS__New(__TS__Promise, executor)
            return promise, resolve, reject
        end
    end
    local makeDeferredPromise = makeDeferredPromiseFactory()
    local function isPromiseLike(value)
        return __TS__InstanceOf(value, __TS__Promise)
    end
    local function doNothing(self)
    end
    local ____pcall = _G.pcall
    __TS__Promise = __TS__Class()
    __TS__Promise.name = "__TS__Promise"
    function __TS__Promise.prototype.____constructor(self, executor)
        self.state = 0
        self.fulfilledCallbacks = {}
        self.rejectedCallbacks = {}
        self.finallyCallbacks = {}
        local success, ____error = ____pcall(
            executor,
            nil,
            function(____, v) return self:resolve(v) end,
            function(____, err) return self:reject(err) end
        )
        if not success then
            self:reject(____error)
        end
    end
    function __TS__Promise.resolve(value)
        if __TS__InstanceOf(value, __TS__Promise) then
            return value
        end
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 1
        promise.value = value
        return promise
    end
    function __TS__Promise.reject(reason)
        local promise = __TS__New(__TS__Promise, doNothing)
        promise.state = 2
        promise.rejectionReason = reason
        return promise
    end
    __TS__Promise.prototype["then"] = function(self, onFulfilled, onRejected)
        local promise, resolve, reject = makeDeferredPromise()
        self:addCallbacks(
            onFulfilled and self:createPromiseResolvingCallback(onFulfilled, resolve, reject) or resolve,
            onRejected and self:createPromiseResolvingCallback(onRejected, resolve, reject) or reject
        )
        return promise
    end
    function __TS__Promise.prototype.addCallbacks(self, fulfilledCallback, rejectedCallback)
        if self.state == 1 then
            return fulfilledCallback(nil, self.value)
        end
        if self.state == 2 then
            return rejectedCallback(nil, self.rejectionReason)
        end
        local ____self_fulfilledCallbacks_0 = self.fulfilledCallbacks
        ____self_fulfilledCallbacks_0[#____self_fulfilledCallbacks_0 + 1] = fulfilledCallback
        local ____self_rejectedCallbacks_1 = self.rejectedCallbacks
        ____self_rejectedCallbacks_1[#____self_rejectedCallbacks_1 + 1] = rejectedCallback
    end
    function __TS__Promise.prototype.catch(self, onRejected)
        return self["then"](self, nil, onRejected)
    end
    function __TS__Promise.prototype.finally(self, onFinally)
        if onFinally then
            local ____self_finallyCallbacks_2 = self.finallyCallbacks
            ____self_finallyCallbacks_2[#____self_finallyCallbacks_2 + 1] = onFinally
            if self.state ~= 0 then
                onFinally(nil)
            end
        end
        return self
    end
    function __TS__Promise.prototype.resolve(self, value)
        if isPromiseLike(value) then
            return value:addCallbacks(
                function(____, v) return self:resolve(v) end,
                function(____, err) return self:reject(err) end
            )
        end
        if self.state == 0 then
            self.state = 1
            self.value = value
            return self:invokeCallbacks(self.fulfilledCallbacks, value)
        end
    end
    function __TS__Promise.prototype.reject(self, reason)
        if self.state == 0 then
            self.state = 2
            self.rejectionReason = reason
            return self:invokeCallbacks(self.rejectedCallbacks, reason)
        end
    end
    function __TS__Promise.prototype.invokeCallbacks(self, callbacks, value)
        local callbacksLength = #callbacks
        local finallyCallbacks = self.finallyCallbacks
        local finallyCallbacksLength = #finallyCallbacks
        if callbacksLength ~= 0 then
            for i = 1, callbacksLength - 1 do
                callbacks[i](callbacks, value)
            end
            if finallyCallbacksLength == 0 then
                return callbacks[callbacksLength](callbacks, value)
            end
            callbacks[callbacksLength](callbacks, value)
        end
        if finallyCallbacksLength ~= 0 then
            for i = 1, finallyCallbacksLength - 1 do
                finallyCallbacks[i](finallyCallbacks)
            end
            return finallyCallbacks[finallyCallbacksLength](finallyCallbacks)
        end
    end
    function __TS__Promise.prototype.createPromiseResolvingCallback(self, f, resolve, reject)
        return function(____, value)
            local success, resultOrError = ____pcall(f, nil, value)
            if not success then
                return reject(nil, resultOrError)
            end
            return self:handleCallbackValue(resultOrError, resolve, reject)
        end
    end
    function __TS__Promise.prototype.handleCallbackValue(self, value, resolve, reject)
        if isPromiseLike(value) then
            local nextpromise = value
            if nextpromise.state == 1 then
                return resolve(nil, nextpromise.value)
            elseif nextpromise.state == 2 then
                return reject(nil, nextpromise.rejectionReason)
            else
                return nextpromise:addCallbacks(resolve, reject)
            end
        else
            return resolve(nil, value)
        end
    end
end

local __TS__AsyncAwaiter, __TS__Await
do
    local ____coroutine = _G.coroutine or ({})
    local cocreate = ____coroutine.create
    local coresume = ____coroutine.resume
    local costatus = ____coroutine.status
    local coyield = ____coroutine.yield
    function __TS__AsyncAwaiter(generator)
        return __TS__New(
            __TS__Promise,
            function(____, resolve, reject)
                local fulfilled, step, resolved, asyncCoroutine
                function fulfilled(self, value)
                    local success, resultOrError = coresume(asyncCoroutine, value)
                    if success then
                        return step(resultOrError)
                    end
                    return reject(nil, resultOrError)
                end
                function step(result)
                    if resolved then
                        return
                    end
                    if costatus(asyncCoroutine) == "dead" then
                        return resolve(nil, result)
                    end
                    return __TS__Promise.resolve(result):addCallbacks(fulfilled, reject)
                end
                resolved = false
                asyncCoroutine = cocreate(generator)
                local success, resultOrError = coresume(
                    asyncCoroutine,
                    function(____, v)
                        resolved = true
                        return __TS__Promise.resolve(v):addCallbacks(resolve, reject)
                    end
                )
                if success then
                    return step(resultOrError)
                else
                    return reject(nil, resultOrError)
                end
            end
        )
    end
    function __TS__Await(thing)
        return coyield(thing)
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Frame = _____2A.Frame
local Timer = _____2A.Timer
local ____ydlua = require("src.ydlua.index")
local ydlua = ____ydlua.ydlua
local ____UnitBlood = require("src.system.ui.component.UnitBlood")
local UnitBlood = ____UnitBlood.UnitBlood
local ____HotReload = require("src.system.HotReload")
local HotReload = ____HotReload.HotReload
local ____ModuleManager = require("src.system.ModuleManager")
local ModuleManager = ____ModuleManager.ModuleManager
local ____Players = require("src.config.Players")
local PlayersConfig = ____Players.PlayersConfig
local ____Map = require("src.config.Map")
local MapGeneral = ____Map.MapGeneral
local ____console = require("src.system.console")
local Console = ____console.Console
--- 应用程序主入口
-- 负责引导整个应用程序的启动
-- 测试自动重新编译功能
local function main()
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        Timer:create():start(
            2,
            false,
            function()
            end
        )
    end)
end
--- 初始化函数 - 供模块化加载使用
function ____exports.initialize()
    ydlua:getInstance():initialize()
    do
        local function ____catch(e)
            print("Error loading FDF TOC: " .. tostring(e))
        end
        local ____try, ____hasReturned = pcall(function()
            Frame:loadTOC("UI\\fdf\\path.toc")
            Console:log("FDF TOC loaded successfully")
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
    print(">>> Main: Initializing all modules...")
    ModuleManager:getInstance():initializeAllModules()
    print(">>> Main: All registered modules: " .. table.concat(
        ModuleManager:getInstance():getRegisteredModules(),
        ", "
    ))
    Timer:create():start(
        2,
        false,
        function()
            print(">>> Main: Starting hot reload system...")
            print(">>> Main: Registered modules at start: " .. table.concat(
                ModuleManager:getInstance():getRegisteredModules(),
                ", "
            ))
            HotReload:getInstance():start()
        end
    )
    PlayersConfig:CameraControl()
    UnitBlood:registerLocalDrawEvent()
    MapGeneral:sceneVisionInit()
    DzEnableWideScreen(true)
    print(">>> Main: Main module initialized")
    main()
end
--- 热重载处理函数
-- 当模块被热重载时调用
function ____exports.onHotReload()
    print("Main module hot reloaded!")
end
return ____exports
 end,
["src.config.MapUnit"] = function(...) 
local ____exports = {}
____exports.MAP_UNITS_INIT_CREATE = {}
return ____exports
 end,
["src.examples.ButtonExample"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end
-- End of Lua Library inline imports
local ____exports = {}
local ____Buttom = require("src.system.ui.component.Buttom")
local Button = ____Buttom.Button
local ButtonTextures = ____Buttom.ButtonTextures
local ____console = require("src.system.console")
local Console = ____console.Console
--- Button使用示例
-- 演示三层结构按钮的创建和使用
____exports.ButtonExample = __TS__Class()
local ButtonExample = ____exports.ButtonExample
ButtonExample.name = "ButtonExample"
function ButtonExample.prototype.____constructor(self)
    self.testButton = nil
    self.centerButton = nil
end
function ButtonExample.prototype.initialize(self)
    Console:log("ButtonExample: 初始化按钮示例")
    self.testButton = __TS__New(
        Button,
        "测试按钮",
        400,
        300,
        100,
        36
    )
    self.testButton:setTextColor("FFCC00"):setTexturePreset("HUMAN_BACKGROUND"):setOnClick(function()
        Console:log("测试按钮被点击了!")
    end):setOnHover(function()
        Console:log("鼠标进入测试按钮")
    end):setOnLeave(function()
        Console:log("鼠标离开测试按钮")
    end):addHoverEffect()
    self.testButton:create()
    self.centerButton = Button:createCentered("屏幕中心按钮", "LARGE")
    self.centerButton:setTextColor("00FF00"):setBackground(ButtonTextures.DIALOG_BACKGROUND):setOnClick(function()
        Console:log("中心按钮被点击!")
    end)
    self.centerButton:create()
    Console:log("ButtonExample: 按钮已创建")
end
function ButtonExample.prototype.cleanup(self)
    if self.testButton then
        self.testButton:destroy()
        self.testButton = nil
    end
    if self.centerButton then
        self.centerButton:destroy()
        self.centerButton = nil
    end
    Console:log("ButtonExample: 清理完成")
end
return ____exports
 end,
["src.system.ui.fdf.FDFButton"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end

local Map
do
    Map = __TS__Class()
    Map.name = "Map"
    function Map.prototype.____constructor(self, entries)
        self[Symbol.toStringTag] = "Map"
        self.items = {}
        self.size = 0
        self.nextKey = {}
        self.previousKey = {}
        if entries == nil then
            return
        end
        local iterable = entries
        if iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            while true do
                local result = iterator:next()
                if result.done then
                    break
                end
                local value = result.value
                self:set(value[1], value[2])
            end
        else
            local array = entries
            for ____, kvp in ipairs(array) do
                self:set(kvp[1], kvp[2])
            end
        end
    end
    function Map.prototype.clear(self)
        self.items = {}
        self.nextKey = {}
        self.previousKey = {}
        self.firstKey = nil
        self.lastKey = nil
        self.size = 0
    end
    function Map.prototype.delete(self, key)
        local contains = self:has(key)
        if contains then
            self.size = self.size - 1
            local next = self.nextKey[key]
            local previous = self.previousKey[key]
            if next ~= nil and previous ~= nil then
                self.nextKey[previous] = next
                self.previousKey[next] = previous
            elseif next ~= nil then
                self.firstKey = next
                self.previousKey[next] = nil
            elseif previous ~= nil then
                self.lastKey = previous
                self.nextKey[previous] = nil
            else
                self.firstKey = nil
                self.lastKey = nil
            end
            self.nextKey[key] = nil
            self.previousKey[key] = nil
        end
        self.items[key] = nil
        return contains
    end
    function Map.prototype.forEach(self, callback)
        for ____, key in __TS__Iterator(self:keys()) do
            callback(nil, self.items[key], key, self)
        end
    end
    function Map.prototype.get(self, key)
        return self.items[key]
    end
    function Map.prototype.has(self, key)
        return self.nextKey[key] ~= nil or self.lastKey == key
    end
    function Map.prototype.set(self, key, value)
        local isNewValue = not self:has(key)
        if isNewValue then
            self.size = self.size + 1
        end
        self.items[key] = value
        if self.firstKey == nil then
            self.firstKey = key
            self.lastKey = key
        elseif isNewValue then
            self.nextKey[self.lastKey] = key
            self.previousKey[key] = self.lastKey
            self.lastKey = key
        end
        return self
    end
    Map.prototype[Symbol.iterator] = function(self)
        return self:entries()
    end
    function Map.prototype.entries(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = {key, items[key]}}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.keys(self)
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = key}
                key = nextKey[key]
                return result
            end
        }
    end
    function Map.prototype.values(self)
        local items = self.items
        local nextKey = self.nextKey
        local key = self.firstKey
        return {
            [Symbol.iterator] = function(self)
                return self
            end,
            next = function(self)
                local result = {done = not key, value = items[key]}
                key = nextKey[key]
                return result
            end
        }
    end
    Map[Symbol.species] = Map
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Frame = _____2A.Frame
local FRAME_ALIGN_CENTER = _____2A.FRAME_ALIGN_CENTER
local ____frame = require("src.constants.frame.index")
local FrameEventUtils = ____frame.FrameEventUtils
--- 按钮模板类型枚举
____exports.ButtonTemplateType = ButtonTemplateType or ({})
____exports.ButtonTemplateType.STANDARD = "StandardButtonTemplate"
____exports.ButtonTemplateType.ICON = "IconButtonTemplate"
____exports.ButtonTemplateType.LARGE = "LargeButtonTemplate"
____exports.ButtonTemplateType.SMALL = "SmallButtonTemplate"
____exports.ButtonTemplateType.SCRIPT = "ScriptButtonTemplate"
--- FDF按钮创建工具类
-- 用于创建和管理基于FDF模板的按钮
____exports.FDFButtonBuilder = __TS__Class()
local FDFButtonBuilder = ____exports.FDFButtonBuilder
FDFButtonBuilder.name = "FDFButtonBuilder"
function FDFButtonBuilder.prototype.____constructor(self)
    self.buttonFrame = nil
    self.textFrame = nil
    self.iconFrame = nil
    self.hotkeyFrame = nil
end
function FDFButtonBuilder.createButton(self, name, config, events)
    return __TS__New(____exports.FDFButtonBuilder):build(name, ____exports.ButtonTemplateType.STANDARD, config, events)
end
function FDFButtonBuilder.createIconButton(self, name, config, events)
    return __TS__New(____exports.FDFButtonBuilder):build(name, ____exports.ButtonTemplateType.ICON, config, events)
end
function FDFButtonBuilder.createLargeButton(self, name, config, events)
    return __TS__New(____exports.FDFButtonBuilder):build(name, ____exports.ButtonTemplateType.LARGE, config, events)
end
function FDFButtonBuilder.createSmallButton(self, name, config, events)
    return __TS__New(____exports.FDFButtonBuilder):build(name, ____exports.ButtonTemplateType.SMALL, config, events)
end
function FDFButtonBuilder.prototype.build(self, name, template, config, events)
    local parent = config.parent or Frame:fromHandle(DzGetGameUI())
    local buttonFrame
    if template == ____exports.ButtonTemplateType.SCRIPT then
        buttonFrame = Frame:createType(
            name,
            parent,
            0,
            "BACKDROP",
            template
        )
    elseif template == ____exports.ButtonTemplateType.ICON then
        buttonFrame = Frame:createType(
            name,
            parent,
            0,
            "BUTTON",
            template
        )
    else
        buttonFrame = Frame:createType(
            name,
            parent,
            0,
            "GLUETEXTBUTTON",
            template
        )
    end
    self.buttonFrame = buttonFrame or nil
    if not self.buttonFrame then
        print("Failed to create button: " .. name)
        return self
    end
    if config.x ~= nil and config.y ~= nil then
        local anchor = config.anchor or FRAME_ALIGN_CENTER
        self.buttonFrame:setAbsPoint(anchor, config.x, config.y)
    end
    if config.width ~= nil and config.height ~= nil then
        self.buttonFrame:setSize(config.width, config.height)
    end
    if config.text then
        self:setText(config.text)
    end
    if config.icon and template == ____exports.ButtonTemplateType.ICON then
        self:setIcon(config.icon)
    end
    if config.hotkey then
        self:setHotkey(config.hotkey)
    end
    if config.tooltip then
        self:setTooltip(config.tooltip)
    end
    if config.visible ~= nil then
        self:setVisible(config.visible)
    end
    if config.enabled ~= nil then
        self:setEnabled(config.enabled)
    end
    if events then
        self:bindEvents(events)
    end
    return self
end
function FDFButtonBuilder.prototype.setText(self, text)
    if not self.buttonFrame then
        return self
    end
    self.buttonFrame:setText(text)
    return self
end
function FDFButtonBuilder.prototype.setIcon(self, iconPath)
    if not self.buttonFrame then
        return self
    end
    local iconHandle = DzFrameFindByName("IconButtonIcon", 0)
    if iconHandle then
        DzFrameSetTexture(iconHandle, iconPath, 0)
    end
    return self
end
function FDFButtonBuilder.prototype.setHotkey(self, hotkey)
    if not self.buttonFrame then
        return self
    end
    local hotkeyHandle = DzFrameFindByName("ButtonHotkey", 0)
    if hotkeyHandle then
        DzFrameSetText(hotkeyHandle, hotkey)
    end
    return self
end
function FDFButtonBuilder.prototype.setTooltip(self, tooltip)
    if not self.buttonFrame then
        return self
    end
    DzFrameSetTooltip(
        self.buttonFrame.handle,
        DzCreateFrameByTagName(
            "TEXT",
            "",
            self.buttonFrame.handle,
            "",
            0
        )
    )
    return self
end
function FDFButtonBuilder.prototype.setVisible(self, visible)
    if not self.buttonFrame then
        return self
    end
    self.buttonFrame:setVisible(visible)
    return self
end
function FDFButtonBuilder.prototype.setEnabled(self, enabled)
    if not self.buttonFrame then
        return self
    end
    self.buttonFrame:setEnabled(enabled)
    return self
end
function FDFButtonBuilder.prototype.setPosition(self, x, y, anchor)
    if not self.buttonFrame then
        return self
    end
    local alignType = anchor or FRAME_ALIGN_CENTER
    self.buttonFrame:setAbsPoint(alignType, x, y)
    return self
end
function FDFButtonBuilder.prototype.setSize(self, width, height)
    if not self.buttonFrame then
        return self
    end
    self.buttonFrame:setSize(width, height)
    return self
end
function FDFButtonBuilder.prototype.bindEvents(self, events)
    if not self.buttonFrame then
        return self
    end
    FrameEventUtils:bindEvents(self.buttonFrame, {onClick = events.onClick, onMouseEnter = events.onMouseEnter, onMouseLeave = events.onMouseLeave})
    return self
end
function FDFButtonBuilder.prototype.getFrame(self)
    return self.buttonFrame
end
function FDFButtonBuilder.prototype.destroy(self)
    if self.buttonFrame then
        self.buttonFrame:destroy()
        self.buttonFrame = nil
    end
    self.textFrame = nil
    self.iconFrame = nil
    self.hotkeyFrame = nil
end
--- 按钮组管理器
-- 用于批量管理多个按钮
____exports.ButtonGroup = __TS__Class()
local ButtonGroup = ____exports.ButtonGroup
ButtonGroup.name = "ButtonGroup"
function ButtonGroup.prototype.____constructor(self)
    self.buttons = __TS__New(Map)
end
function ButtonGroup.prototype.addButton(self, id, button)
    self.buttons:set(id, button)
    return self
end
function ButtonGroup.prototype.getButton(self, id)
    return self.buttons:get(id)
end
function ButtonGroup.prototype.removeButton(self, id)
    local button = self.buttons:get(id)
    if button then
        button:destroy()
        self.buttons:delete(id)
        return true
    end
    return false
end
function ButtonGroup.prototype.showAll(self)
    self.buttons:forEach(function(____, button) return button:setVisible(true) end)
    return self
end
function ButtonGroup.prototype.hideAll(self)
    self.buttons:forEach(function(____, button) return button:setVisible(false) end)
    return self
end
function ButtonGroup.prototype.enableAll(self)
    self.buttons:forEach(function(____, button) return button:setEnabled(true) end)
    return self
end
function ButtonGroup.prototype.disableAll(self)
    self.buttons:forEach(function(____, button) return button:setEnabled(false) end)
    return self
end
function ButtonGroup.prototype.destroyAll(self)
    self.buttons:forEach(function(____, button) return button:destroy() end)
    self.buttons:clear()
end
function ButtonGroup.prototype.size(self)
    return self.buttons.size
end
return ____exports
 end,
["src.examples.FDFButtonExample"] = function(...) 
-- Lua Library inline imports
local function __TS__Class(self)
    local c = {prototype = {}}
    c.prototype.__index = c.prototype
    c.prototype.constructor = c
    return c
end

local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local FRAME_ALIGN_CENTER = _____2A.FRAME_ALIGN_CENTER
local ____FDFButton = require("src.system.ui.fdf.FDFButton")
local FDFButtonBuilder = ____FDFButton.FDFButtonBuilder
local ButtonGroup = ____FDFButton.ButtonGroup
local ____console = require("src.system.console")
local Console = ____console.Console
--- FDF按钮使用示例
____exports.FDFButtonExample = __TS__Class()
local FDFButtonExample = ____exports.FDFButtonExample
FDFButtonExample.name = "FDFButtonExample"
function FDFButtonExample.prototype.____constructor(self)
    self.buttonGroup = __TS__New(ButtonGroup)
end
function FDFButtonExample.prototype.createExampleButtons(self)
    Console:log("Creating FDF button examples...")
    self:createLargeButton()
    self:createSmallButton()
    self:createIconButton()
    self:createButtonArray()
    Console:log("FDF button examples created!")
end
function FDFButtonExample.prototype.createStandardButton(self)
    local button = FDFButtonBuilder:createButton(
        "StandardButtonExample",
        {
            text = "标准按钮",
            x = 0.4,
            y = 0.5,
            anchor = FRAME_ALIGN_CENTER,
            tooltip = "这是一个标准按钮",
            visible = true,
            enabled = true
        },
        {
            onClick = function()
                Console:log("标准按钮被点击了!")
                DisplayTimedTextToPlayer(
                    GetLocalPlayer(),
                    0,
                    0,
                    5,
                    "标准按钮被点击!"
                )
            end,
            onMouseEnter = function()
                Console:log("鼠标进入标准按钮")
            end,
            onMouseLeave = function()
                Console:log("鼠标离开标准按钮")
            end
        }
    )
    self.buttonGroup:addButton("standard", button)
end
function FDFButtonExample.prototype.createLargeButton(self)
    local button = FDFButtonBuilder:createLargeButton(
        "LargeButtonExample",
        {
            text = "大型按钮",
            x = 0.4,
            y = 0.4,
            anchor = FRAME_ALIGN_CENTER,
            tooltip = "这是一个大型按钮",
            hotkey = "Q",
            visible = true,
            enabled = true
        },
        {onClick = function()
            Console:log("大型按钮被点击了!")
            DisplayTimedTextToPlayer(
                GetLocalPlayer(),
                0,
                0,
                5,
                "大型按钮被点击!"
            )
        end}
    )
    self.buttonGroup:addButton("large", button)
end
function FDFButtonExample.prototype.createSmallButton(self)
    local button = FDFButtonBuilder:createSmallButton(
        "SmallButtonExample",
        {
            text = "小型按钮",
            x = 0.4,
            y = 0.3,
            anchor = FRAME_ALIGN_CENTER,
            tooltip = "这是一个小型按钮"
        },
        {onClick = function()
            Console:log("小型按钮被点击了!")
            DisplayTimedTextToPlayer(
                GetLocalPlayer(),
                0,
                0,
                5,
                "小型按钮被点击!"
            )
        end}
    )
    self.buttonGroup:addButton("small", button)
end
function FDFButtonExample.prototype.createIconButton(self)
    local button = FDFButtonBuilder:createIconButton(
        "IconButtonExample",
        {
            x = 0.5,
            y = 0.5,
            anchor = FRAME_ALIGN_CENTER,
            icon = "ReplaceableTextures\\CommandButtons\\BTNHeroArchMage.blp",
            tooltip = "这是一个图标按钮"
        },
        {onClick = function()
            Console:log("图标按钮被点击了!")
            DisplayTimedTextToPlayer(
                GetLocalPlayer(),
                0,
                0,
                5,
                "图标按钮被点击!"
            )
        end}
    )
    self.buttonGroup:addButton("icon", button)
end
function FDFButtonExample.prototype.createButtonArray(self)
    local startX = 0.3
    local startY = 0.2
    local spacing = 0.04
    do
        local i = 0
        while i < 6 do
            local button = FDFButtonBuilder:createIconButton(
                "SkillButton" .. tostring(i),
                {
                    x = startX + i * spacing,
                    y = startY,
                    icon = self:getSkillIcon(i),
                    tooltip = "技能 " .. tostring(i + 1),
                    hotkey = self:getSkillHotkey(i)
                },
                {onClick = function()
                    Console:log(("技能按钮 " .. tostring(i + 1)) .. " 被点击!")
                    DisplayTimedTextToPlayer(
                        GetLocalPlayer(),
                        0,
                        0,
                        3,
                        "使用技能 " .. tostring(i + 1)
                    )
                end}
            )
            self.buttonGroup:addButton(
                "skill" .. tostring(i),
                button
            )
            i = i + 1
        end
    end
end
function FDFButtonExample.prototype.getSkillIcon(self, index)
    local icons = {
        "ReplaceableTextures\\CommandButtons\\BTNHeroArchMage.blp",
        "ReplaceableTextures\\CommandButtons\\BTNHeroPaladin.blp",
        "ReplaceableTextures\\CommandButtons\\BTNHeroMountainKing.blp",
        "ReplaceableTextures\\CommandButtons\\BTNHeroBloodElfPrince.blp",
        "ReplaceableTextures\\CommandButtons\\BTNPeasant.blp",
        "ReplaceableTextures\\CommandButtons\\BTNFootman.blp"
    }
    return icons[index + 1] or icons[1]
end
function FDFButtonExample.prototype.getSkillHotkey(self, index)
    local hotkeys = {
        "Q",
        "W",
        "E",
        "R",
        "D",
        "F"
    }
    return hotkeys[index + 1] or ""
end
function FDFButtonExample.prototype.showAllButtons(self)
    self.buttonGroup:showAll()
    Console:log("All buttons shown")
end
function FDFButtonExample.prototype.hideAllButtons(self)
    self.buttonGroup:hideAll()
    Console:log("All buttons hidden")
end
function FDFButtonExample.prototype.enableAllButtons(self)
    self.buttonGroup:enableAll()
    Console:log("All buttons enabled")
end
function FDFButtonExample.prototype.disableAllButtons(self)
    self.buttonGroup:disableAll()
    Console:log("All buttons disabled")
end
function FDFButtonExample.prototype.cleanup(self)
    self.buttonGroup:destroyAll()
    Console:log("All buttons destroyed")
end
--- 高级示例：动态菜单系统
____exports.DynamicMenuExample = __TS__Class()
local DynamicMenuExample = ____exports.DynamicMenuExample
DynamicMenuExample.name = "DynamicMenuExample"
function DynamicMenuExample.prototype.____constructor(self)
    self.menuButtons = __TS__New(ButtonGroup)
    self.currentMenu = "main"
end
function DynamicMenuExample.prototype.createMainMenu(self)
    self:clearMenu()
    local menuItems = {
        {
            text = "开始游戏",
            action = function() return self:startGame() end
        },
        {
            text = "选项设置",
            action = function() return self:showOptions() end
        },
        {
            text = "关于",
            action = function() return self:showAbout() end
        },
        {
            text = "退出",
            action = function() return self:exitGame() end
        }
    }
    local startY = 0.45
    local spacing = 0.05
    __TS__ArrayForEach(
        menuItems,
        function(____, item, index)
            local button = FDFButtonBuilder:createLargeButton(
                "MainMenu" .. tostring(index),
                {text = item.text, x = 0.4, y = startY - index * spacing, anchor = FRAME_ALIGN_CENTER},
                {onClick = item.action}
            )
            self.menuButtons:addButton(
                "menu" .. tostring(index),
                button
            )
        end
    )
    self.currentMenu = "main"
end
function DynamicMenuExample.prototype.clearMenu(self)
    self.menuButtons:destroyAll()
end
function DynamicMenuExample.prototype.startGame(self)
    Console:log("Starting game...")
    DisplayTimedTextToPlayer(
        GetLocalPlayer(),
        0,
        0,
        3,
        "游戏开始!"
    )
    self:clearMenu()
end
function DynamicMenuExample.prototype.showOptions(self)
    Console:log("Showing options...")
    DisplayTimedTextToPlayer(
        GetLocalPlayer(),
        0,
        0,
        3,
        "打开选项菜单"
    )
end
function DynamicMenuExample.prototype.showAbout(self)
    Console:log("Showing about...")
    DisplayTimedTextToPlayer(
        GetLocalPlayer(),
        0,
        0,
        3,
        "关于本游戏"
    )
end
function DynamicMenuExample.prototype.exitGame(self)
    Console:log("Exiting game...")
    DisplayTimedTextToPlayer(
        GetLocalPlayer(),
        0,
        0,
        3,
        "退出游戏"
    )
end
function ____exports.createFDFButtonExamples()
    local example = __TS__New(____exports.FDFButtonExample)
    example:createExampleButtons()
    return example
end
function ____exports.createDynamicMenu()
    local menu = __TS__New(____exports.DynamicMenuExample)
    menu:createMainMenu()
    return menu
end
return ____exports
 end,
["src.system.damage"] = function(...) 
 end,
["src.test.ButtonTest"] = function(...) 
-- Lua Library inline imports
local function __TS__New(target, ...)
    local instance = setmetatable({}, target.prototype)
    instance:____constructor(...)
    return instance
end

local function __TS__NumberToFixed(self, fractionDigits)
    if math.abs(self) >= 1e+21 or self ~= self then
        return tostring(self)
    end
    local f = math.floor(fractionDigits or 0)
    if f < 0 or f > 99 then
        error("toFixed() digits argument must be between 0 and 99", 0)
    end
    return string.format(
        ("%." .. tostring(f)) .. "f",
        self
    )
end

local function __TS__ObjectEntries(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = {key, obj[key]}
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end
-- End of Lua Library inline imports
local ____exports = {}
local ____Buttom = require("src.system.ui.component.Buttom")
local Button = ____Buttom.Button
local ____ScreenCoordinates = require("src.system.ui.ScreenCoordinates")
local ScreenCoordinates = ____ScreenCoordinates.ScreenCoordinates
local ____UILayout = require("src.system.ui.UILayout")
local UILayout = ____UILayout.UILayout
function ____exports.testButton()
    print("=== Button Component Test ===")
    local basicButton = __TS__New(
        Button,
        "Basic Button",
        100,
        100,
        120,
        40,
        ScreenCoordinates.ORIGIN_TOP_LEFT
    )
    print(((((((("Basic Button: Position(" .. tostring(basicButton:getPosition().x)) .. ", ") .. tostring(basicButton:getPosition().y)) .. "), Size(") .. tostring(basicButton:getSize().width)) .. ", ") .. tostring(basicButton:getSize().height)) .. ")")
    local simpleButton = __TS__New(Button, "Simple Button", 200, 200)
    print(((("Simple Button: Position(" .. tostring(simpleButton:getPosition().x)) .. ", ") .. tostring(simpleButton:getPosition().y)) .. ")")
    local customButton = __TS__New(
        Button,
        "Custom Button",
        200,
        250,
        150,
        50
    )
    print(((("Custom Button: Position(" .. tostring(customButton:getPosition().x)) .. ", ") .. tostring(customButton:getPosition().y)) .. ")")
    local centerButton = __TS__New(
        Button,
        "Center Button",
        960,
        540,
        160,
        50,
        ScreenCoordinates.ORIGIN_CENTER
    )
    local centerPos = centerButton:getPosition()
    local wc3Pos = ScreenCoordinates:pixelToWC3(centerPos.x, centerPos.y, ScreenCoordinates.ORIGIN_CENTER)
    print(((((((("Center Button: Pixel(" .. tostring(centerPos.x)) .. ", ") .. tostring(centerPos.y)) .. ") -> WC3(") .. __TS__NumberToFixed(wc3Pos.x, 3)) .. ", ") .. __TS__NumberToFixed(wc3Pos.y, 3)) .. ")")
    local dynamicButton = __TS__New(Button, "Dynamic Button", 400, 100)
    dynamicButton:setPosition(500, 200)
    dynamicButton:setSize(180, 60)
    local newPos = dynamicButton:getPosition()
    local newSize = dynamicButton:getSize()
    print(((((((("Dynamic Button after changes: Position(" .. tostring(newPos.x)) .. ", ") .. tostring(newPos.y)) .. "), Size(") .. tostring(newSize.width)) .. ", ") .. tostring(newSize.height)) .. ")")
    local presetButtons = {}
    local offsetY = 300
    __TS__ArrayForEach(
        __TS__ObjectEntries(UILayout.BUTTON_SIZES),
        function(____, ____bindingPattern0)
            local size
            local sizeName
            sizeName = ____bindingPattern0[1]
            size = ____bindingPattern0[2]
            local button = __TS__New(
                Button,
                sizeName .. " Button",
                50,
                offsetY,
                size.width,
                size.height,
                ScreenCoordinates.ORIGIN_TOP_LEFT
            )
            presetButtons[#presetButtons + 1] = button
            print(((((sizeName .. " Button: Size(") .. tostring(size.width)) .. "x") .. tostring(size.height)) .. ")")
            offsetY = offsetY + (size.height + 10)
        end
    )
    local gridButtons = {}
    local startX = 50
    local startY = 350
    local buttonWidth = 100
    local buttonHeight = 35
    local spacing = 20
    do
        local row = 0
        while row < 2 do
            do
                local col = 0
                while col < 3 do
                    local x = startX + col * (buttonWidth + spacing)
                    local y = startY + row * (buttonHeight + spacing)
                    local button = __TS__New(
                        Button,
                        "Grid " .. tostring(row * 3 + col + 1),
                        x,
                        y,
                        buttonWidth,
                        buttonHeight,
                        ScreenCoordinates.ORIGIN_TOP_LEFT
                    )
                    gridButtons[#gridButtons + 1] = button
                    print(((((("Grid Button " .. tostring(row * 3 + col + 1)) .. ": Position(") .. tostring(x)) .. ", ") .. tostring(y)) .. ")")
                    col = col + 1
                end
            end
            row = row + 1
        end
    end
    print("=== Button Test Complete ===")
end
return ____exports
 end,
}
return require("src.main", ...)

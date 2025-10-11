local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ObjectKeys = ____lualib.__TS__ObjectKeys
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____define = require("lua_modules.@eiriksgata.wc3ts.src.index")
local bj_MAX_PLAYER_SLOTS = ____define.bj_MAX_PLAYER_SLOTS
local MapPlayer = ____define.MapPlayer
local Players = ____define.Players
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
    do
        local i = 0
        while i < bj_MAX_PLAYER_SLOTS do
            local pl = MapPlayer:fromHandle(Player(i))
            if pl then
                Players[i + 1] = pl
            end
            i = i + 1
        end
    end
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
    __TS__ArrayForEach(
        __TS__ObjectKeys(ydcommon),
        function(____, key)
            _G[key] = ydcommon[key]
        end
    )
    __TS__ArrayForEach(
        __TS__ObjectKeys(ydjapi),
        function(____, key)
            _G[key] = ydjapi[key]
        end
    )
    print(">>> Global APIs registered")
end
return ____exports


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
["lualib_bundle"] = function(...) 
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

local function __TS__ObjectKeys(obj)
    local result = {}
    local len = 0
    for key in pairs(obj) do
        len = len + 1
        result[len] = key
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
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

return {
  __TS__Class = __TS__Class,
  __TS__ObjectAssign = __TS__ObjectAssign,
  __TS__New = __TS__New,
  __TS__ObjectKeys = __TS__ObjectKeys,
  __TS__ArrayForEach = __TS__ArrayForEach,
  __TS__AsyncAwaiter = __TS__AsyncAwaiter,
  __TS__Await = __TS__Await
}
 end,
["src.types.index"] = function(...) 
local ____exports = {}
return ____exports
 end,
["src.config.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__New = ____lualib.__TS__New
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
local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__ObjectKeys = ____lualib.__TS__ObjectKeys
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local ____config = require("src.config.index")
local ConfigManager = ____config.ConfigManager
____exports.ydcommon = require("jass.common")
____exports.ydai = require("jass.ai")
____exports.ydglobals = require("jass.globals")
____exports.ydjapi = require("jass.japi")
____exports.ydhook = require("jass.hook")
____exports.ydruntime = require("jass.runtime")
____exports.ydslk = require("jass.slk")
____exports.ydconsole = require("jass.console")
____exports.yddebug = require("jass.debug")
____exports.ydlog = require("jass.log")
____exports.ydmessage = require("jass.message")
____exports.ydbignum = require("jass.bignum")
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
    ____exports.ydruntime.console = config.console
    ____exports.ydruntime.sleep = runtimeConfig.sleep
    ____exports.ydruntime.debugger = runtimeConfig.debuggerPort
    ____exports.ydruntime.catch_crash = runtimeConfig.catchCrash
    ____exports.ydruntime.error_hanlde = function(self, msg)
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
    ____exports.ydconsole.enable = isConsoleEnabled
    if isConsoleEnabled then
        _G.print = function() return ____exports.ydconsole:write() end
        print(">>> Console enabled")
    end
end
function ydlua.prototype.registerGlobals(self)
    __TS__ArrayForEach(
        __TS__ObjectKeys(____exports.ydcommon),
        function(____, key)
            _G[key] = ____exports.ydcommon[key]
        end
    )
    __TS__ArrayForEach(
        __TS__ObjectKeys(____exports.ydjapi),
        function(____, key)
            _G[key] = ____exports.ydjapi[key]
        end
    )
    print(">>> Global APIs registered")
end
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
return ____exports
 end,
["src.index"] = function(...) 
local ____lualib = require("lualib_bundle")
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local ____wc3ts_2D1_2E27a = require("wc3ts-1.27a")
local Unit = ____wc3ts_2D1_2E27a.Unit
local ____ydlua = require("src.ydlua.index")
local ydlua = ____ydlua.ydlua
local ____globals = require("wc3ts-1.27a/globals")
local Players = ____globals.Players
local ____helper = require("src.utils.helper")
local FourCC = ____helper.FourCC
--- 应用程序主入口
-- 负责引导整个应用程序的启动
local function main()
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        print("hello ts")
        DisplayTextToPlayer(
            Player(0),
            0,
            0,
            "hello ts"
        )
        Unit:create(
            Players[1],
            FourCC("hfoo"),
            0,
            0,
            0
        )
    end)
end
ydlua:getInstance():initialize()
main()
return ____exports
 end,
}
return require("src.index", ...)

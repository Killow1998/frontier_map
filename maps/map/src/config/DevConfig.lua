local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__StringSplit = ____lualib.__TS__StringSplit
local __TS__NumberToFixed = ____lualib.__TS__NumberToFixed
local __TS__StringPadStart = ____lualib.__TS__StringPadStart
local __TS__ArrayIndexOf = ____lualib.__TS__ArrayIndexOf
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local ____exports = {}
--- 默认开发配置
____exports.DEFAULT_DEV_CONFIG = {hotReload = {enabled = true, autoStart = true, checkInterval = 2, preserveState = true}, debug = {enabled = true, logLevel = "info", showTimestamps = true}, commands = {enabled = true, adminOnly = true}}
--- 开发环境管理器
____exports.DevEnvironment = __TS__Class()
local DevEnvironment = ____exports.DevEnvironment
DevEnvironment.name = "DevEnvironment"
function DevEnvironment.prototype.____constructor(self, config)
    self.config = config
    self.startTime = os.time()
end
function DevEnvironment.getInstance(self, config)
    if not ____exports.DevEnvironment.instance then
        ____exports.DevEnvironment.instance = __TS__New(____exports.DevEnvironment, config or ____exports.DEFAULT_DEV_CONFIG)
    end
    return ____exports.DevEnvironment.instance
end
function DevEnvironment.prototype.initialize(self)
    self:log("info", "=== 开发环境初始化开始 ===")
    self:printConfig()
    if self.config.debug.enabled then
        self:setupDebugEnvironment()
    end
    if self.config.commands.enabled then
        self:setupDevelopmentCommands()
    end
    self:log("info", "=== 开发环境初始化完成 ===")
end
function DevEnvironment.prototype.printConfig(self)
    self:log("info", "开发环境配置:")
    self:log("info", "  热更新: " .. (self.config.hotReload.enabled and "启用" or "禁用"))
    self:log("info", "  调试模式: " .. (self.config.debug.enabled and "启用" or "禁用"))
    self:log("info", "  开发命令: " .. (self.config.commands.enabled and "启用" or "禁用"))
end
function DevEnvironment.prototype.setupDebugEnvironment(self)
    if self.config.debug.showTimestamps then
        local originalPrint = print
        _G.print = function(message)
            local timestamp = self:getFormattedTime()
            originalPrint((("[" .. timestamp) .. "] ") .. message)
        end
    end
    self:log("info", "调试环境已设置")
end
function DevEnvironment.prototype.setupDevelopmentCommands(self)
    local trigger = CreateTrigger()
    do
        local i = 0
        while i < 8 do
            TriggerRegisterPlayerChatEvent(
                trigger,
                Player(i),
                "-dev",
                false
            )
            i = i + 1
        end
    end
    TriggerAddAction(
        trigger,
        function()
            local chatString = GetEventPlayerChatString()
            local player = GetTriggerPlayer()
            if self.config.commands.adminOnly and GetPlayerId(player) ~= 0 then
                return
            end
            self:handleDevCommand(chatString)
        end
    )
    self:log("info", "开发命令已注册")
    self:log("info", "可用命令: -dev help")
end
function DevEnvironment.prototype.handleDevCommand(self, command)
    local parts = __TS__StringSplit(command, " ")
    local cmd = parts[2] or "help"
    repeat
        local ____switch18 = cmd
        local ____cond18 = ____switch18 == "help"
        if ____cond18 then
            self:showHelpMenu()
            break
        end
        ____cond18 = ____cond18 or ____switch18 == "status"
        if ____cond18 then
            self:showStatus()
            break
        end
        ____cond18 = ____cond18 or ____switch18 == "config"
        if ____cond18 then
            self:showCurrentConfig()
            break
        end
        ____cond18 = ____cond18 or ____switch18 == "performance"
        if ____cond18 then
            self:showPerformanceInfo()
            break
        end
        ____cond18 = ____cond18 or ____switch18 == "memory"
        if ____cond18 then
            self:showMemoryInfo()
            break
        end
        ____cond18 = ____cond18 or ____switch18 == "time"
        if ____cond18 then
            self:showTimeInfo()
            break
        end
        do
            self:log("warn", ("未知命令: " .. cmd) .. "。输入 -dev help 查看帮助")
            break
        end
    until true
end
function DevEnvironment.prototype.showHelpMenu(self)
    self:log("info", "=== 开发命令帮助 ===")
    self:log("info", "-dev help        - 显示此帮助")
    self:log("info", "-dev status      - 显示系统状态")
    self:log("info", "-dev config      - 显示当前配置")
    self:log("info", "-dev performance - 显示性能信息")
    self:log("info", "-dev memory      - 显示内存信息")
    self:log("info", "-dev time        - 显示时间信息")
end
function DevEnvironment.prototype.showStatus(self)
    local uptime = os.time() - self.startTime
    self:log("info", "=== 系统状态 ===")
    self:log(
        "info",
        ("运行时间: " .. tostring(uptime)) .. " 秒"
    )
    self:log("info", "热更新: " .. (self.config.hotReload.enabled and "活跃" or "未启用"))
    self:log("info", "调试模式: " .. (self.config.debug.enabled and "开启" or "关闭"))
end
function DevEnvironment.prototype.showCurrentConfig(self)
    self:log("info", "=== 当前配置 ===")
    self:log(
        "info",
        JSON:stringify(self.config, nil, 2)
    )
end
function DevEnvironment.prototype.showPerformanceInfo(self)
    self:log("info", "=== 性能信息 ===")
    local memoryKB = collectgarbage("count")
    self:log(
        "info",
        ("Lua 内存使用: " .. __TS__NumberToFixed(memoryKB, 2)) .. " KB"
    )
    self:log(
        "info",
        ("FPS: " .. GetLocalizedString("GAMEERR_FRAME_RATE")) .. " (模拟)"
    )
end
function DevEnvironment.prototype.showMemoryInfo(self)
    self:log("info", "=== 内存信息 ===")
    local beforeGC = collectgarbage("count")
    collectgarbage("collect")
    local afterGC = collectgarbage("count")
    self:log(
        "info",
        ("GC 前: " .. __TS__NumberToFixed(beforeGC, 2)) .. " KB"
    )
    self:log(
        "info",
        ("GC 后: " .. __TS__NumberToFixed(afterGC, 2)) .. " KB"
    )
    self:log(
        "info",
        ("释放: " .. __TS__NumberToFixed(beforeGC - afterGC, 2)) .. " KB"
    )
end
function DevEnvironment.prototype.showTimeInfo(self)
    local current = os.time()
    local uptime = current - self.startTime
    self:log("info", "=== 时间信息 ===")
    self:log(
        "info",
        "当前时间戳: " .. tostring(current)
    )
    self:log(
        "info",
        "启动时间戳: " .. tostring(self.startTime)
    )
    self:log(
        "info",
        ("运行时长: " .. tostring(uptime)) .. " 秒"
    )
    self:log(
        "info",
        "格式化时间: " .. self:getFormattedTime()
    )
end
function DevEnvironment.prototype.getFormattedTime(self)
    local time = os.time()
    local minutes = math.floor(time / 60) % 60
    local seconds = time % 60
    return (__TS__StringPadStart(
        tostring(minutes),
        2,
        "0"
    ) .. ":") .. __TS__StringPadStart(
        tostring(seconds),
        2,
        "0"
    )
end
function DevEnvironment.prototype.log(self, level, message)
    if self:shouldLog(level) then
        local prefix = self:getLogPrefix(level)
        print(prefix .. message)
    end
end
function DevEnvironment.prototype.shouldLog(self, level)
    local levels = {"info", "warn", "error"}
    local currentLevelIndex = __TS__ArrayIndexOf(levels, self.config.debug.logLevel)
    local messageLevelIndex = __TS__ArrayIndexOf(levels, level)
    return messageLevelIndex >= currentLevelIndex
end
function DevEnvironment.prototype.getLogPrefix(self, level)
    local prefixes = {info = "[INFO] ", warn = "[WARN] ", error = "[ERROR] "}
    return prefixes[level]
end
function DevEnvironment.prototype.updateConfig(self, newConfig)
    self.config = __TS__ObjectAssign({}, self.config, newConfig)
    self:log("info", "开发配置已更新")
end
function DevEnvironment.prototype.getConfig(self)
    return __TS__ObjectAssign({}, self.config)
end
return ____exports

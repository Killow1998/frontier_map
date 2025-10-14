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

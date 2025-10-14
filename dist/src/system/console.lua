local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
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
function Console.err(self, message, player)
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

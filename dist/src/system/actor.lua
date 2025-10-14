local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__Delete = ____lualib.__TS__Delete
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Unit = _____2A.Unit
local ____UnitBlood = require("src.system.ui.UnitBlood")
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
    ____exports.Actor.allActors[self.id] = self
end
function Actor.create(self, owner, unitId, x, y, facing)
    if facing == nil then
        facing = 0
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
function Actor.prototype.createBloodBar(self)
    UnitBlood:create(self)
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

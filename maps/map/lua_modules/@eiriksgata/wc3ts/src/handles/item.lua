local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local Error = ____lualib.Error
local RangeError = ____lualib.RangeError
local ReferenceError = ____lualib.ReferenceError
local SyntaxError = ____lualib.SyntaxError
local TypeError = ____lualib.TypeError
local URIError = ____lualib.URIError
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__StringSubstr = ____lualib.__TS__StringSubstr
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
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

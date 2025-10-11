local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__Delete = ____lualib.__TS__Delete
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
    self.frame:setTexture("hpbar\\01.tga", 0, false)
    self.frame:setVisible(true)
    self.lifeFrame = Frame:createType(
        "LifeFrame",
        self.frame,
        0,
        "BACKDROP",
        ""
    )
    self.lifeFrame:setSize(100 / 2400, 12 / 1800)
    self.lifeFrame:setTexture("hpbar\\02.tga", 0, false)
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
    self.manaFrame:setTexture("hpbar\\03.tga", 0, false)
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
    self.levelFrame:setFont("hpbar\\ZiTi.ttf", 0.08, 0)
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
    self.nameBoxFrame:setTexture("hpbar\\07.tga", 0, false)
    self.nameBoxFrame.alpha = 75
    self.nameFrame = Frame:createType(
        "NameFrame",
        self.nameBoxFrame,
        0,
        "TEXT",
        ""
    )
    self.nameFrame:setText(actor.name)
    self.nameFrame:setTextAlignment(18, 0)
    self.nameFrame:setFont("hpbar\\ZiTi.ttf", 0.01, 0)
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
        self.lifeFrame:setTexture("hpbar\\02.tga", 0, false)
    else
        if actor:isAlly(MapPlayer:fromLocal()) then
            self.lifeFrame:setTexture("hpbar\\06.tga", 0, false)
        else
            self.lifeFrame:setTexture("hpbar\\05.tga", 0, false)
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

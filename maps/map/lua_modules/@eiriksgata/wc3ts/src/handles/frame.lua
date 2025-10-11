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
local __TS__SetDescriptor = ____lualib.__TS__SetDescriptor
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

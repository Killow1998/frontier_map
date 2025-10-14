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

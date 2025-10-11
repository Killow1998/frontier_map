local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__StringCharCodeAt = ____lualib.__TS__StringCharCodeAt
local __TS__New = ____lualib.__TS__New
local ____exports = {}
--- Reads primitive types from a packed binary string.
-- 
-- @example ```ts
-- // Write the values
-- const writer = new BinaryWriter();
-- writer.writeUInt8(5);
-- writer.writeUInt8(32);
-- writer.writeUInt8(78);
-- writer.writeUInt8(200);
-- writer.writeUInt32(12345678);
-- writer.writeString("hello");
-- writer.writeUInt16(45000);
-- 
-- // Read the values
-- const binaryString = writer.toString();
-- const reader = new BinaryReader(binaryString);
-- const values: any[] = [];
-- 
-- values[0] = reader.readUInt8(); // 5
-- values[1] = reader.readUInt8(); // 32
-- values[2] = reader.readUInt8(); // 78
-- values[3] = reader.readUInt8(); // 200
-- values[4] = reader.readUInt32(); // 12345678
-- values[5] = reader.readString(); // hello
-- values[6] = reader.readUInt16(); // 45000
-- ```
____exports.BinaryReader = __TS__Class()
local BinaryReader = ____exports.BinaryReader
BinaryReader.name = "BinaryReader"
function BinaryReader.prototype.____constructor(self, binaryString)
    self.pos = 0
    self.data = binaryString
end
function BinaryReader.prototype.readBytes(self, size)
    local bytes = {}
    do
        local i = 0
        while i < size do
            if self.pos + i >= #self.data then
                bytes[#bytes + 1] = 0
            else
                bytes[#bytes + 1] = __TS__StringCharCodeAt(self.data, self.pos + i)
            end
            i = i + 1
        end
    end
    self.pos = self.pos + size
    return bytes
end
function BinaryReader.prototype.readDouble(self)
    local bytes = self:readBytes(8)
    local arrayBuffer = __TS__New(ArrayBuffer, 8)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 8 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getFloat64(0, false)
end
function BinaryReader.prototype.readFloat(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getFloat32(0, false)
end
function BinaryReader.prototype.readInt16(self)
    local bytes = self:readBytes(2)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 2 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getInt16(0, false)
end
function BinaryReader.prototype.readInt32(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getInt32(0, false)
end
function BinaryReader.prototype.readInt8(self)
    local bytes = self:readBytes(1)
    local arrayBuffer = __TS__New(ArrayBuffer, 1)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint8(0, bytes[1])
    return view:getInt8(0)
end
function BinaryReader.prototype.readString(self)
    local result = ""
    local charCode = __TS__StringCharCodeAt(self.data, self.pos)
    while charCode ~= 0 and self.pos < #self.data do
        result = result .. string.char(charCode)
        self.pos = self.pos + 1
        charCode = __TS__StringCharCodeAt(self.data, self.pos)
    end
    self.pos = self.pos + 1
    return result
end
function BinaryReader.prototype.readUInt16(self)
    local bytes = self:readBytes(2)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 2 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getUint16(0, false)
end
function BinaryReader.prototype.readUInt32(self)
    local bytes = self:readBytes(4)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    do
        local i = 0
        while i < 4 do
            view:setUint8(i, bytes[i + 1])
            i = i + 1
        end
    end
    return view:getUint32(0, false)
end
function BinaryReader.prototype.readUInt8(self)
    local bytes = self:readBytes(1)
    return bytes[1]
end
return ____exports

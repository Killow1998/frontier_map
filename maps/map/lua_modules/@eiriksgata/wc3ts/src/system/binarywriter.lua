local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__StringCharCodeAt = ____lualib.__TS__StringCharCodeAt
local ____exports = {}
--- Packs primitive types into a binary string.
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
____exports.BinaryWriter = __TS__Class()
local BinaryWriter = ____exports.BinaryWriter
BinaryWriter.name = "BinaryWriter"
function BinaryWriter.prototype.____constructor(self)
    self.buffer = {}
end
function BinaryWriter.prototype.__tostring(self)
    return string.char(table.unpack(self.buffer))
end
function BinaryWriter.prototype.writeDouble(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 8)
    local view = __TS__New(DataView, arrayBuffer)
    view:setFloat64(0, value, false)
    do
        local i = 0
        while i < 8 do
            local ____self_buffer_0 = self.buffer
            ____self_buffer_0[#____self_buffer_0 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeFloat(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setFloat32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_1 = self.buffer
            ____self_buffer_1[#____self_buffer_1 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt16(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt16(0, value, false)
    do
        local i = 0
        while i < 2 do
            local ____self_buffer_2 = self.buffer
            ____self_buffer_2[#____self_buffer_2 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt32(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_3 = self.buffer
            ____self_buffer_3[#____self_buffer_3 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeInt8(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 1)
    local view = __TS__New(DataView, arrayBuffer)
    view:setInt8(0, value)
    local ____self_buffer_4 = self.buffer
    ____self_buffer_4[#____self_buffer_4 + 1] = view:getUint8(0)
end
function BinaryWriter.prototype.writeString(self, value)
    do
        local i = 0
        while i < #value do
            local ____self_buffer_5 = self.buffer
            ____self_buffer_5[#____self_buffer_5 + 1] = __TS__StringCharCodeAt(value, i)
            i = i + 1
        end
    end
    local ____self_buffer_6 = self.buffer
    ____self_buffer_6[#____self_buffer_6 + 1] = 0
end
function BinaryWriter.prototype.writeUInt16(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 2)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint16(0, value, false)
    do
        local i = 0
        while i < 2 do
            local ____self_buffer_7 = self.buffer
            ____self_buffer_7[#____self_buffer_7 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeUInt32(self, value)
    local arrayBuffer = __TS__New(ArrayBuffer, 4)
    local view = __TS__New(DataView, arrayBuffer)
    view:setUint32(0, value, false)
    do
        local i = 0
        while i < 4 do
            local ____self_buffer_8 = self.buffer
            ____self_buffer_8[#____self_buffer_8 + 1] = view:getUint8(i)
            i = i + 1
        end
    end
end
function BinaryWriter.prototype.writeUInt8(self, value)
    local ____self_buffer_9 = self.buffer
    ____self_buffer_9[#____self_buffer_9 + 1] = value & 255
end
return ____exports

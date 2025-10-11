local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local ____exports = {}
function ____exports.DzSetHeroTypeProperName(uid, name)
    EXSetUnitArrayString(uid, 61, 0, name)
    EXSetUnitInteger(uid, 61, 1)
end
--- 设置单位类型名称
-- 设置单位类型ID${单位ID}的名称为${名称}
-- 修改单位类型的显示名称
function ____exports.DzSetUnitTypeName(uid, name)
    EXSetUnitArrayString(uid, 10, 0, name)
    EXSetUnitInteger(uid, 10, 1)
end
--- 判断单位攻击类型
-- 判断${单位}的第${索引}个攻击是否为${攻击类型}
-- 检查单位指定索引的攻击类型
function ____exports.DzIsUnitAttackType(whichUnit, index, attackType)
    return ConvertAttackType(math.floor(GetUnitState(
        whichUnit,
        ConvertUnitState(16 + 19 * index)
    ))) == attackType
end
--- 设置单位攻击类型
-- 设置${单位}的第${索引}个攻击类型为${攻击类型}
-- 修改单位指定索引的攻击类型
function ____exports.DzSetUnitAttackType(whichUnit, index, attackType)
    SetUnitState(
        whichUnit,
        ConvertUnitState(16 + 19 * index),
        GetHandleId(attackType)
    )
end
--- 判断单位防御类型
-- 判断${单位}的防御类型是否为${防御类型}
-- 检查单位的防御类型
function ____exports.DzIsUnitDefenseType(whichUnit, defenseType)
    return math.floor(GetUnitState(
        whichUnit,
        ConvertUnitState(80)
    )) == defenseType
end
--- 设置单位防御类型
-- 设置${单位}的防御类型为${防御类型}
-- 修改单位的防御类型
function ____exports.DzSetUnitDefenseType(whichUnit, defenseType)
    SetUnitState(
        whichUnit,
        ConvertUnitState(80),
        defenseType
    )
end
--- 设置单位数据缓存整数 - 简化版
-- 设置单位ID${单位ID}的数据ID${数据ID}值为${值}
-- 简化版的单位数据缓存设置函数，索引固定为0
function ____exports.KKWESetUnitDataCacheInteger(uid, id, v)
    DzSetUnitDataCacheInteger(uid, id, 0, v)
end
--- 单位UI添加升级IDs
-- 为单位ID${单位ID}在索引${索引}添加升级ID${值}
-- 向单位的升级列表添加新的升级ID
function ____exports.KKWEUnitUIAddUpgradesIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 94, id, v)
end
--- 单位UI添加建造IDs
-- 为单位ID${单位ID}在索引${索引}添加建造ID${值}
-- 向单位的建造列表添加新的建造ID
function ____exports.KKWEUnitUIAddBuildsIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 100, id, v)
end
--- 单位UI添加研究IDs
-- 为单位ID${单位ID}在索引${索引}添加研究ID${值}
-- 向单位的研究列表添加新的研究ID
function ____exports.KKWEUnitUIAddResearchesIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 112, id, v)
end
--- 单位UI添加训练IDs
-- 为单位ID${单位ID}在索引${索引}添加训练ID${值}
-- 向单位的训练列表添加新的训练ID
function ____exports.KKWEUnitUIAddTrainsIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 106, id, v)
end
--- 单位UI添加出售单位IDs
-- 为单位ID${单位ID}在索引${索引}添加出售单位ID${值}
-- 向单位的出售单位列表添加新的单位ID
function ____exports.KKWEUnitUIAddSellsUnitIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 118, id, v)
end
--- 单位UI添加出售物品IDs
-- 为单位ID${单位ID}在索引${索引}添加出售物品ID${值}
-- 向单位的出售物品列表添加新的物品ID
function ____exports.KKWEUnitUIAddSellsItemIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 124, id, v)
end
--- 单位UI添加制造物品IDs
-- 为单位ID${单位ID}在索引${索引}添加制造物品ID${值}
-- 向单位的制造物品列表添加新的物品ID
function ____exports.KKWEUnitUIAddMakesItemIds(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 130, id, v)
end
--- 单位UI添加需求单位代码
-- 为单位ID${单位ID}在索引${索引}添加需求单位代码${值}
-- 向单位的需求列表添加新的单位代码
function ____exports.KKWEUnitUIAddRequiresUnitCode(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 166, id, v)
end
--- 单位UI添加需求科技代码
-- 为单位ID${单位ID}在索引${索引}添加需求科技代码${值}
-- 向单位的需求列表添加新的科技代码
function ____exports.KKWEUnitUIAddRequiresTechcode(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 166, id, v)
end
--- 单位UI添加需求数量
-- 为单位ID${单位ID}在索引${索引}添加需求数量${值}
-- 向单位的需求数量列表添加新的数量值
function ____exports.KKWEUnitUIAddRequiresAmounts(uid, id, v)
    DzUnitUIAddLevelArrayInteger(uid, 172, id, v)
end
--- 判断是否为闰年
-- 判断年份${年份}是否为闰年
-- 根据闰年规则判断指定年份是否为闰年
function ____exports.DzIsLeapYear(year)
    return year % 4 == 0 and year % 100 ~= 0 or year % 400 == 0
end
--- 从时间戳获取时间日期字符串（内部实现）
-- 从时间戳${时间戳}获取时间日期字符串
-- 将UNIX时间戳转换为可读的日期时间字符串
function ____exports.DzGetTimeDateFromTimestamp(timestamp)
    local totalSeconds = timestamp + 28800
    local secondsInDay = 86400
    local remainingSeconds = totalSeconds % secondsInDay
    local year = 1970
    local totalDays = math.floor((totalSeconds + 86399) / secondsInDay)
    local num = 0
    local month = 0
    local days = 0
    while true do
        if ____exports.DzIsLeapYear(year) then
            num = num + 366
        else
            num = num + 365
        end
        if num > totalDays then
            break
        end
        days = num
        year = year + 1
    end
    month = 1
    num = 0
    days = totalDays - days
    local monthDays = ____exports.DzIsLeapYear(year) and ({
        31,
        29,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    }) or ({
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    })
    do
        local i = 0
        while i < 12 do
            if num + monthDays[i + 1] >= days then
                break
            end
            num = num + monthDays[i + 1]
            month = month + 1
            i = i + 1
        end
    end
    local day = days - num or 1
    local hour = math.floor(remainingSeconds / 3600)
    local minute = math.floor(remainingSeconds % 3600 / 60)
    local second = remainingSeconds % 60
    return (((((((((tostring(year) .. "-") .. tostring(month)) .. "-") .. tostring(day)) .. " ") .. tostring(hour)) .. ":") .. tostring(minute)) .. ":") .. tostring(second)
end
local timestampCache = __TS__New(Map)
--- 从时间戳获取时间日期字符串（缓存版）
-- 从时间戳${时间戳}获取时间日期字符串
-- 带缓存的时间戳转换函数，提高性能
function ____exports.KKAPIGetTimeDateFromTimestamp(timestamp)
    timestamp = math.max(timestamp, 0)
    local cached = timestampCache:get(timestamp)
    if cached then
        return cached.str
    end
    local str = ____exports.DzGetTimeDateFromTimestamp(timestamp)
    return str
end
--- 从时间戳获取年份
-- 从时间戳${时间戳}获取年份
-- 从UNIX时间戳中提取年份信息
function ____exports.KKAPIGetTimestampYear(timestamp)
    timestamp = math.max(timestamp, 0)
    local date = __TS__New(Date, timestamp * 1000)
    return date:getFullYear()
end
--- 从时间戳获取月份
-- 从时间戳${时间戳}获取月份
-- 从UNIX时间戳中提取月份信息
function ____exports.KKAPIGetTimestampMonth(timestamp)
    timestamp = math.max(timestamp, 0)
    local date = __TS__New(Date, timestamp * 1000)
    return date:getMonth() + 1
end
--- 从时间戳获取日期
-- 从时间戳${时间戳}获取日期
-- 从UNIX时间戳中提取日期信息
function ____exports.KKAPIGetTimestampDay(timestamp)
    timestamp = math.max(timestamp, 0)
    local date = __TS__New(Date, timestamp * 1000)
    return date:getDate()
end
--- 整数转技能ID
-- 将整数${整数}转换为技能ID
-- 简单的类型转换函数
function ____exports.KKConvertInt2AbilId(i)
    return i
end
--- 技能ID转整数
-- 将技能ID${技能ID}转换为整数
-- 简单的类型转换函数
function ____exports.KKConvertAbilId2Int(i)
    return i
end
--- 整数转颜色
-- 将整数${整数}转换为颜色
-- 简单的类型转换函数
function ____exports.KKConvertInt2Color(i)
    return i
end
--- 颜色转整数
-- 将颜色${颜色}转换为整数
-- 简单的类型转换函数
function ____exports.KKConvertColor2Int(i)
    return i
end
--- 防御类型：小型
____exports.DEFENSE_TYPE_SMALL = 0
--- 防御类型：中型
____exports.DEFENSE_TYPE_MEDIUM = 1
--- 防御类型：大型
____exports.DEFENSE_TYPE_LARGE = 2
--- 防御类型：要塞
____exports.DEFENSE_TYPE_FORT = 3
--- 防御类型：普通
____exports.DEFENSE_TYPE_NORMAL = 4
--- 防御类型：英雄
____exports.DEFENSE_TYPE_HERO = 5
--- 防御类型：神圣
____exports.DEFENSE_TYPE_DIVINE = 6
--- 防御类型：无
____exports.DEFENSE_TYPE_NONE = 7
return ____exports

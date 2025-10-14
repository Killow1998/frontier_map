local ____lualib = require("lualib_bundle")
local __TS__AsyncAwaiter = ____lualib.__TS__AsyncAwaiter
local __TS__Await = ____lualib.__TS__Await
local ____exports = {}
local _____2A = require("lua_modules.@eiriksgata.wc3ts.src.index")
local Players = _____2A.Players
local Timer = _____2A.Timer
local ____ydlua = require("src.ydlua.index")
local ydlua = ____ydlua.ydlua
local ____helper = require("src.utils.helper")
local FourCC = ____helper.FourCC
local ____UnitBlood = require("src.system.ui.UnitBlood")
local UnitBlood = ____UnitBlood.UnitBlood
local ____CameraControl = require("src.utils.CameraControl")
local CameraControl = ____CameraControl.CameraControl
local ____actor = require("src.system.actor")
local Actor = ____actor.Actor
--- 应用程序主入口
-- 负责引导整个应用程序的启动
-- 测试自动重新编译功能
local function main()
    return __TS__AsyncAwaiter(function(____awaiter_resolve)
        Timer:create():start(
            1,
            false,
            function()
                FogMaskEnable(false)
                FogEnable(false)
                DzEnableWideScreen(true)
                CameraControl:initMouseControl()
                UnitBlood:registerLocalDrawEvent()
                local unit = Actor:create(
                    Players[1],
                    FourCC("Hpal"),
                    0,
                    0,
                    0
                )
                print("Created unit: " .. unit.name)
                PanCameraToTimed(unit.x, unit.y, 0)
                SetCameraQuickPosition(unit.x, unit.y)
                unit:setBaseDamageJAPI(100)
                unit:createBloodBar()
                local testUnit = Actor:create(
                    Players[2],
                    FourCC("Hpal"),
                    300,
                    300,
                    0
                )
                testUnit:createBloodBar()
                print("hello ! test")
            end
        )
    end)
end
--- 初始化函数 - 供模块化加载使用
function ____exports.initialize()
    ydlua:getInstance():initialize()
    main()
end
return ____exports

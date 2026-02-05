PROJECT_PATH = "D:/work/github/wc3-map-ts-template/dist"
package.path = package.path .. ";D:/work/github/wc3-map-ts-template/dist/?.lua;"
-- Bootstrap script for loading TSTL output
-- Supports both dev (modular) and prod (bundled) modes

-- Debugging: Enable console output
local console = require("jass.console")


local ydcommon = require("jass.common")
local ydjapi = require("jass.japi")

-- register jass.common
for key, value in pairs(ydcommon) do
  _G[key] = value
end

-- register jass.japi
for key, value in pairs(ydjapi) do
  _G[key] = value
end

-- 自动检测模式：如果存在 PROJECT_PATH 则为 dev 模式，否则为 prod 模式
local main
if PROJECT_PATH then
  -- Dev mode: 使用模块化加载
  print(">>> Bootstrap: Dev mode detected")
  main = require("src.main")
  console.enable = true;
else
  -- Prod mode: 使用打包后的单文件
  print(">>> Bootstrap: Prod mode detected")
  main = require("main")
end

-- Initialize the application
if main and main.initialize then
  main.initialize()
else
  print("ERROR: Failed to load main module or initialize function not found")
end

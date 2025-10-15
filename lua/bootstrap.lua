-- Bootstrap script for loading modular TSTL output
-- This script initializes the main application from the compiled Lua modules

-- Debugging: Enable console output_ar
local console = require("jass.console")
console.enable = true;
-- print("Bootstrap script started")
-- print("package.path:", package.path)

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


-- Load the main application module
local main = require("src.main")

-- Initialize the application
if main and main.initialize then
  main.initialize()
else
  print("ERROR: Failed to load main module or initialize function not found")
end

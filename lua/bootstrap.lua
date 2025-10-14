-- Bootstrap script for loading modular TSTL output
-- This script initializes the main application from the compiled Lua modules

-- Debugging: Enable console output_ar
-- local console = require("jass.console")
-- console.enable = true;
-- print("Bootstrap script started")
-- print("package.path:", package.path)


-- Load the main application module
local main = require("src.main")

-- Initialize the application
if main and main.initialize then
    main.initialize()
else
    print("ERROR: Failed to load main module or initialize function not found")
end
-- Bootstrap script for loading modular TSTL output
-- This script initializes the main application from the compiled Lua modules

-- Load the main application module
local main = require("src.main")

-- Initialize the application
if main and main.initialize then
    main.initialize()
else
    print("ERROR: Failed to load main module or initialize function not found")
end
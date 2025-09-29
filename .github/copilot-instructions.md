# Warcraft III TypeScript Map Development Template

## Project Architecture

This is a Warcraft III 1.27a map development template using TypeScript-to-Lua compilation. The project integrates multiple specialized tools for WC3 modding:

- **KKWE (Kunkka World Editor)** - Enhanced world editor with JAPI extensions
- **w3x2lni** - Map format converter for LNI (Lua Nested Interface) editing
- **typescript-to-lua (tstl)** - Compiles TypeScript to Lua for WC3 execution
- **@eiriksgata/wc3ts** - TypeScript definitions for Warcraft III APIs

## Development Workflow

### Build Commands
- `yarn build` - Compile TypeScript to Lua and package into `dist/map.w3x`
- `yarn dev` - Development build (preserves debug symbols)
- `yarn test` - Build and launch map in Warcraft III via KKWE
- `yarn watch` - Watch mode compilation

### Key Build Process
1. TypeScript compiles to Lua via tstl into `maps/map/main.lua`
2. w3x2lni packages LNI project files from `maps/` into final `.w3x`
3. KKWE launches Warcraft III with the compiled map

## Project Structure

```
src/index.ts          # Main entry point - imports ydlua and starts application
src/ydlua/            # JAPI integration layer for extended Warcraft III APIs
src/utils/helper.ts   # FourCC conversion utilities (c2i, i2c, FourCC functions)
src/config/           # Configuration management
scripts/build.ts      # Build orchestration script
scripts/test.ts       # Map testing via KKWE launcher
maps/                 # LNI project files (terrain, objects, triggers)
dev_lib/              # Development tools (KKWE, w3x2lni)
```

## Critical Integration Points

### JAPI Integration (`src/ydlua/`)
The ydlua module provides access to extended Warcraft III APIs through KKWE:
- `ydjapi` - Extended JAPI functions beyond standard WC3
- `ydruntime` - Runtime environment access
- `ydconsole` - Console I/O for debugging
- Must call `ydlua.getInstance().initialize()` before using extended APIs

### TypeScript-to-Lua Configuration
Key `tsconfig.json` settings:
- `luaTarget: "5.3"` - Lua version for WC3
- `luaBundle: "maps/map/main.lua"` - Single output file
- `noResolvePaths` - Excludes JAPI modules from bundling (loaded at runtime)

### FourCC Utilities
Use `FourCC("hfoo")` for unit/ability/item IDs instead of raw strings. Helper functions:
- `c2i(char)` - Convert 4-character string to integer
- `i2c(id)` - Convert integer back to 4-character string

## Development Patterns

### Unit Creation
```typescript
// Use @eiriksgata/wc3ts wrapper classes
import { Unit } from "@eiriksgata/wc3ts";
Unit.create(Players[0], FourCC("hfoo"), x, y, facing);

// For raw JAPI calls, use ydlua imports
DisplayTextToPlayer(Player(0), 0, 0, "message");
```

### Configuration Management
Environment paths configured in `config.json`:
- `w2l.path` - Path to w3x2lni converter
- `kkwe.path` - Path to KKWE installation
- `outputFolder` - Build output directory

## Common Issues

### Build Failures
- Ensure KKWE and w3x2lni paths in `config.json` are correct
- Check that Warcraft III 1.27a is installed for testing
- Verify Node.js and yarn dependencies are installed

### JAPI Integration
- Always initialize ydlua before using extended APIs
- JAPI functions only work in KKWE environment, not standard WC3
- Use `ydconsole` for debugging output in KKWE

### Map Testing
- Maps launch via `YDWEConfig.exe -launchwar3 -loadfile`
- Ensure Warcraft III is properly associated with KKWE
- Check KKWE plugin configuration for JAPI support

## File Conventions

- Entry point: `src/index.ts` 
- JAPI integration: `src/ydlua/`
- Build scripts: `scripts/` directory
- Map data: `maps/` directory (LNI format)
- Output: `dist/map.w3x`
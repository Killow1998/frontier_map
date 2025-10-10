# Warcraft III TypeScript Map Development Template

## Project Architecture

This is a Warcraft III 1.27a map development template using TypeScript-to-Lua compilation. The project integrates multiple specialized tools for WC3 modding:

- **KKWE (Kunkka World Editor)** - Enhanced world editor with JAPI extensions
- **w3x2lni** - Map format converter for LNI (Lua Nested Interface) editing
- **typescript-to-lua (tstl)** - Compiles TypeScript to Lua for WC3 execution
- **@eiriksgata/wc3ts** - TypeScript definitions for Warcraft III APIs

## @eiriksgata/wc3ts Library Reference

When developing with this template, always reference the @eiriksgata/wc3ts library for:

### Core API Structure
- **handles/** - Wrapper classes for WC3 objects (Unit, Effect, Player, etc.)
- **globals/** - Global constants, enums, and predefined values
- **system/** - Utility systems (base64, binary readers/writers, file operations)
- **utils/** - Helper utilities (color management, KKWE extensions)
- **types/** - TypeScript type definitions for JASS functions

### Documentation Patterns
Follow the library's documentation style:
- Use JSDoc comments with `@param`, `@returns`, `@deprecated`, `@note` tags
- Include detailed parameter descriptions
- Mark deprecated methods and suggest alternatives
- Use `/** @noSelfInFile */` for files that shouldn't have implicit `self`

### Naming Conventions
- Classes use PascalCase: `Unit`, `Effect`, `MapPlayer`
- Methods use camelCase: `addAbility()`, `setColor()`
- Constants use UPPER_SNAKE_CASE: `UNIT_STATE_LIFE`, `PLAYER_COLOR_RED`
- Handle properties are readonly: `readonly handle: unit`

### Code Examples from wc3ts
```typescript
// Unit creation pattern
const unit = Unit.create(Players[0], FourCC('hfoo'), x, y, facing);

// Effect with attachment
const effect = Effect.createAttachment("path/to/model.mdl", unit, "chest");

// Color utilities
const playerColor = new Color(255, 0, 0, 255); // Red color
const colorCode = playerColor.code; // Returns color code string

// Proper error handling
if (handle === undefined) {
  Error("Failed to create handle.");
}
```

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

### Unit Management
```typescript
// Preferred: Use wc3ts wrapper classes
import { Unit, MapPlayer } from "@eiriksgata/wc3ts";
const unit = Unit.create(Players[0], FourCC("hfoo"), x, y, facing);

// Setting unit properties
unit.acquireRange = 600;
unit.life = unit.maxLife;
unit.addAbility(FourCC('A000'));

// Unit state management
if (unit.typeId === UNIT_TYPE_DEAD) {
  // Handle dead unit
}
```

### Effect System
```typescript
import { Effect } from "@eiriksgata/wc3ts";

// Create effects at coordinates
const groundEffect = Effect.create("Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl", x, y);

// Attach effects to units
const attachedEffect = Effect.createAttachment("Effects\\Explosion.mdl", unit, "chest");

// Clean up effects
effect.destroy();
```

### Player and Color Management
```typescript
import { MapPlayer, Color, playerColors } from "@eiriksgata/wc3ts";

// Access predefined players
const player = Players[0];
player.setName("New Player Name");

// Use color utilities
const customColor = new Color(255, 128, 0, 255); // Orange
const coloredText = `${customColor.code}Colored Text|r`;

// Use predefined player colors
const playerColor = playerColors[player.id];
```

### JAPI Integration and Raw Calls
```typescript
// For extended JAPI calls, use ydlua imports
import { ydlua } from "./ydlua";

// Initialize JAPI environment first
ydlua.getInstance().initialize();

// Then use raw JAPI functions
DisplayTextToPlayer(Player(0), 0, 0, "message");
CreateUnit(Players[0].handle, FourCC("hfoo"), x, y, facing);
```

### System Utilities
```typescript
import { BinaryWriter, BinaryReader, base64Encode, base64Decode } from "@eiriksgata/wc3ts";

// Binary data handling
const writer = new BinaryWriter();
writer.writeUInt32(12345);
writer.writeString("hello");
const binaryData = writer.toString();

const reader = new BinaryReader(binaryData);
const value = reader.readUInt32(); // 12345
const text = reader.readString(); // "hello"

// Base64 encoding
const encoded = base64Encode("Hello World");
const decoded = base64Decode(encoded);
```

### Handle Management Best Practices
```typescript
import { Handle } from "@eiriksgata/wc3ts";

// Always check handle validity
if (unit.handle === undefined) {
  Error("Invalid unit handle");
  return;
}

// Use Handle.fromHandle for existing handles
const existingUnit = Unit.fromHandle(someUnitHandle);

// Proper cleanup
unit.destroy(); // For units
effect.destroy(); // For effects
```

### Constants and Enums Usage
```typescript
import { 
  UNIT_STATE_LIFE, 
  UNIT_STATE_MANA,
  PLAYER_COLOR_RED,
  PLAYER_COLOR_BLUE 
} from "@eiriksgata/wc3ts";

// Use predefined constants instead of raw values
unit.setState(UNIT_STATE_LIFE, 100);
unit.setState(UNIT_STATE_MANA, 50);

// Player color management
player.setColor(PLAYER_COLOR_RED);
```

### wc3ts Specific Annotations and Best Practices

#### Required Annotations
```typescript
/** @noSelfInFile */
// Use this at the top of files that don't need implicit 'self' parameter

/**
 * @deprecated use `Unit.create` instead.
 * @param owner The owner of the unit.
 * @param unitId The rawcode of the unit.
 */
// Follow wc3ts deprecation patterns

/**
 * @note Important implementation details or warnings
 * @example
 * ```typescript
 * const unit = Unit.create(Players[0], FourCC('hfoo'), 0, 0);
 * ```
 */
// Include examples and notes for complex APIs
```

#### Error Handling Patterns
```typescript
// wc3ts style error handling
if (handle === undefined) {
  Error("w3ts failed to create handle.");
  return;
}

// Handle optional returns
const unit = Unit.create(Players[0], FourCC('hfoo'), x, y);
if (unit === undefined) {
  print("Failed to create unit");
  return;
}
```

#### Static vs Instance Methods
```typescript
// Static creation methods (preferred)
const unit = Unit.create(Players[0], FourCC('hfoo'), x, y);
const effect = Effect.create("path/to/model.mdl", x, y);

// Instance methods for operations
unit.addAbility(FourCC('A000'));
unit.acquireRange = 600;
effect.destroy();
```

### Advanced wc3ts Patterns

#### Frame System (UI Components)
```typescript
import { Frame } from "@eiriksgata/wc3ts";

// Create UI frames for custom interfaces
const frame = Frame.create("BUTTON", "MyButton", parentFrame);
frame.setPoint("CENTER", parentFrame, "CENTER", 0, 0);
frame.setText("Click Me");
```

#### Timer and Trigger Management
```typescript
import { Timer, Trigger } from "@eiriksgata/wc3ts";

// Create and manage timers
const timer = Timer.create();
timer.start(5.0, false, () => {
  print("Timer expired!");
});

// Event handling with triggers
const trigger = Trigger.create();
trigger.registerAnyUnitEvent(PLAYER_UNIT_EVENT_DEATH);
trigger.addAction(() => {
  const dyingUnit = Unit.fromEvent();
  print(`Unit died: ${dyingUnit.name}`);
});
```

#### Group and Force Operations
```typescript
import { Group, Force } from "@eiriksgata/wc3ts";

// Unit group management
const group = Group.create();
group.enumUnitsInRect(someRect, null);
group.forEach(unit => {
  unit.life = unit.maxLife;
});

// Player force management
const force = Force.create();
force.addPlayer(Players[0]);
force.forEach(player => {
  player.setGold(1000);
});
```

#### Quest and Dialog Systems
```typescript
import { Quest, Dialog } from "@eiriksgata/wc3ts";

// Create quest systems
const quest = Quest.create();
quest.setTitle("Main Quest");
quest.setDescription("Complete the mission");
quest.setIcon("ReplaceableTextures\\CommandButtons\\BTNHeroArchMage.blp");

// Dialog interactions
const dialog = Dialog.create();
dialog.setMessage("Choose your path:");
dialog.addButton("Path of Light", 0);
dialog.addButton("Path of Darkness", 1);
```

## Configuration Management
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

## Referencing @eiriksgata/wc3ts Source Code

### Using wc3ts Function Signatures and Documentation

When developing, always refer to the actual function signatures and JSDoc comments from the wc3ts source code located in `node_modules/@eiriksgata/wc3ts/src/`:

#### Key Directories to Reference:
- `handles/` - Core Warcraft III object wrappers
  - `unit.ts` - Unit creation, manipulation, and state management
  - `effect.ts` - Visual effects and animations
  - `player.ts` - Player management and properties
  - `trigger.ts` - Event handling and game triggers
  - `frame.ts` - UI frame creation and management
  - `timer.ts` - Timer utilities and scheduling

- `globals/` - Constants, enums, and global definitions
  - `define.ts` - UNIT_STATE_*, PLAYER_COLOR_*, etc.
  - `order.ts` - Unit order IDs and commands

- `utils/` - Utility functions and helper classes
  - `color.ts` - Color management and player colors
  - `kkwe.ts` - KKWE-specific extensions

- `system/` - Low-level system utilities
  - `base64.ts` - Base64 encoding/decoding
  - `binaryreader.ts` / `binarywriter.ts` - Binary data handling

#### Following wc3ts Patterns:

1. **Method Naming**: Follow the exact camelCase naming as in wc3ts
   ```typescript
   // Correct: Following wc3ts naming
   unit.addAbility(abilityId);
   unit.setColor(PLAYER_COLOR_RED);
   
   // Incorrect: Don't deviate from wc3ts patterns
   unit.AddAbility(abilityId); // Wrong casing
   ```

2. **Error Handling**: Use the same error patterns as wc3ts
   ```typescript
   // wc3ts pattern for handle validation
   if (handle === undefined) {
     Error("w3ts failed to create handle.");
     return;
   }
   ```

3. **Return Types**: Respect optional return types from wc3ts
   ```typescript
   // wc3ts often returns T | undefined for creation methods
   const unit = Unit.create(player, unitId, x, y);
   if (unit === undefined) {
     // Handle creation failure
     return;
   }
   ```

4. **Deprecation Warnings**: Follow wc3ts deprecation guidance
   ```typescript
   // Prefer static creation methods over constructors
   const unit = Unit.create(player, unitId, x, y); // ✓ Preferred
   const unit = new Unit(player, unitId, x, y);    // ⚠ Deprecated
   ```

### Reading wc3ts JSDoc Comments

Always check the JSDoc comments in wc3ts source files for:
- Parameter descriptions and types
- Return value specifications  
- Usage examples with `@example` tags
- Important notes with `@note` tags
- Deprecation warnings with `@deprecated` tags

Example from wc3ts Unit class:
```typescript
/**
 * Sets a unit's acquire range. This is the value that a unit uses to choose targets to
 * engage with. Note that this is not the attack range.
 * 
 * @note It is a myth that reducing acquire range with this native can limit a unit's attack range.
 */
public set acquireRange(value: number) {
  SetUnitAcquireRange(this.handle, value);
}
```
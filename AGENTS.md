# Repository Guidelines

This repository is a Warcraft III 1.27a map development template using TypeScript-to-Lua.

## Project Identity

- Project: wc3-map-ts-template
- Primary goal: build Warcraft III maps with TypeScript, compile to Lua, then package to w3x.
- Core stack: TypeScript, typescript-to-lua, @eiriksgata/wc3ts, KKWE, w3x2lni.
- Package manager: Yarn (see packageManager in package.json).

## Project Structure

- src/: TypeScript source code for gameplay, systems, UI, and examples.
- src/main.ts: main runtime entry, exports initialize and onHotReload.
- src/ydlua/: JAPI bridge layer. Initialize before using extended JAPI APIs.
- scripts/: build and dev orchestration.
- scripts/build.ts: production build pipeline.
- scripts/dev.ts: development watch and hot-reload notification pipeline.
- scripts/common.ts: shared build helpers.
- lua/bootstrap.lua: Lua bootstrap entry, handles dev and prod loading differences.
- maps/: w3x2lni LNI map project sources.
- maps/map/: map data including generated Lua main.lua in production mode.
- dist/: generated build outputs, including dist/map.w3x and dev-mode Lua outputs.
- dev_lib/: local tool binaries (KKWE, w3x2lni).
- config.json: paths for w3x2lni and KKWE.

## Build And Run Commands

Use only scripts that exist in package.json.

- yarn dev: development mode with initial build + tstl watch + hot-reload notification generation.
- yarn build: production build (compile, inject Lua call, bootstrap copy, minify, package map).
- yarn build:dev: one-off development build for agent validation and local debug packaging.
- yarn build:prod: explicit production alias for build.ts prod mode.
- yarn test: compile and then launch map through scripts/test.ts.
- yarn watch: raw tstl watch.
- yarn build:map: package maps to dist/map.w3x through w3x2lni.
- yarn test:map: launch Warcraft III with dist/map.w3x via KKWE.

If a command fails because tools are missing, verify config.json paths and local binaries under dev_lib.

## TypeScript-To-Lua Constraints

- Keep luaTarget aligned with Warcraft III runtime expectations (Lua 5.3 in tsconfig).
- Keep noImplicitSelf enabled unless there is a proven compatibility reason.
- Keep noResolvePaths entries for jass modules consistent between tsconfig.json and tsconfig.prod.json.
- Dev mode emits modular Lua to dist/src; production mode bundles to maps/map/main.lua.
- For routine agent compile validation, prefer yarn build:dev; rerun yarn build only when validating the production bundle path.

## Runtime And Hot Reload Rules

- Development hot reload is driven by scripts/dev.ts and dist/hot-reload.json.
- Modules that need safe reload should expose initialize and cleanup lifecycle behavior.
- Avoid global side effects without cleanup in reloadable modules (timers, triggers, frames, listeners).
- Keep module registration names stable to avoid stale reload mappings.
- Production mode should not depend on dev-only hot-reload files.

## wc3ts And Gameplay Coding Rules

- Prefer Players[index] from wc3ts for player access.
- Remember Players[0] is Player 1 in Warcraft III UI.
- Use FourCC helper conversion for raw ids instead of magic integers.
- Prefer wc3ts wrapper classes (Unit, Effect, Frame, Timer, Trigger) over raw handle usage when practical.
- When using raw handles, validate and guard against undefined returns.
- Do not add fallback logic to hide mapping or state issues; implement the correct source-of-truth logic directly.

## Frame/UI Safety Rules

- Frame.createType parameter order must be correct.
- Frame instance name must be unique per runtime context.
- typeName must be a valid frame type string and must not be empty.
- Invalid frame type or empty typeName can crash with GetLayoutFrameTypeTagID errors.
- For complex UI, prefer existing component abstractions under src/system/ui before creating ad-hoc frames.

## JAPI Integration Rules

- Extended JAPI usage requires ydlua initialization at startup.
- Keep bootstrap behavior intact for dev versus prod loading paths.
- Do not assume JAPI features work outside the intended KKWE runtime environment.
- If adding new JAPI usage, verify both compile-time types and runtime availability.

## Build Pipeline Expectations

Production flow should remain conceptually:

1. Compile TypeScript to Lua.
2. Inject Lua execution call into war3map.j.
3. Copy and configure bootstrap.lua for production.
4. Minify bundled Lua when enabled.
5. Package maps into dist/map.w3x.

Any change to this flow must be validated with yarn build and a real map launch test.

For routine AI-agent verification, default to yarn build:dev first, then use yarn build when changes may affect bundled production output.

## Common Failure Checks

- test:map fails: ensure dist/map.w3x exists and KKWE path is valid.
- build:map fails: ensure w3x2lni path is valid and maps structure is intact.
- hot reload does not trigger: verify dist/hot-reload.json generation and module registration consistency.
- frame-related runtime errors: verify createType arguments and unique names.
- jass/japi missing symbols: verify noResolvePaths config and ydlua initialization.

## Documentation And References

- Primary project overview: README.md
- AI/project coding conventions: .github/copilot-instructions.md
- Hot reload docs: docs/hot-reload-usage.md and docs/hot-reload-troubleshooting.md
- UI component docs: docs/Button-Usage.md, docs/Dialog-Usage.md, docs/panel-usage.md

## Minimal Collaboration And Safety Rules

- Do not run destructive git commands (for example hard reset) unless explicitly requested.
- Do not revert unrelated user changes.
- Keep edits scoped to the requested task.
- Do not edit generated third-party tool binaries under dev_lib unless explicitly requested.
- Prefer small, reviewable commits with task-focused messages.

## File Reference Convention In Chat

- Use repository-root relative paths when referencing files.
- Include line numbers when discussing specific code locations.

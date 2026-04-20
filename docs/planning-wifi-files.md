# Planning Wifi Files

## Current Requirements

- Opening prepare text should display once for the local player, not four times.
- Day/night should use the original fixed jump behavior for stability:
  - During each phase countdown, Warcraft time-of-day flow is paused.
  - Night countdown jumps to 11.98 and resumes flow so day_come can trigger at 12.00.
  - Day countdown jumps to 23.98 and resumes flow so night_come can trigger at 0.00.
- The first night must start immediately after difficulty selection and show the night-to-dawn countdown.
- Keep both countdown windows:
  - `距离黎明还有：`
  - `距离黄昏还有：`
- Add in-game debug info so future fixes are based on observed state rather than guessing.

## Current Debug Commands

- `-dn1`: print one day/night debug snapshot.
- `-dn`: toggle repeated day/night debug snapshots every second.
- `-tod1`: alias for one day/night debug snapshot.
- `-tod`: alias for repeated day/night debug snapshots.

Debug snapshot fields:

- `difficulty`: current `udg_difficulty`.
- `TOD`: current `GAME_STATE_TIME_OF_DAY`.
- `SCALE`: current `GetTimeOfDayScale()`.
- `nightActive`: current `udg_Night_Phase_Active`.
- `forceDay`: current `udg_force_day`.
- `dayLeft`: remaining seconds of `udg_Day_Timer`, or `-1` when absent.
- `nightLeft`: remaining seconds of `udg_Night_Timer`, or `-1` when absent.

## Latest Changes

- Disabled the global message-throttle hook during startup.
- Changed opening prepare text to `DisplayTextToPlayer(GetLocalPlayer(), ...)` exactly once.
- Reverted day/night to fixed jump mode and paused time flow during countdowns.
- Changed difficulty selection to start the first night directly instead of waiting for an exact 0.00 time event.
- Added day/night debug snapshots through chat commands.
- 2026-04-16 (codex):
  - fixed crit label loss by removing critical-text throttle in `showDa`;
  - fixed `A063` slash cone angle (wrong direction caused “no damage” feel);
  - tightened `A06N` passive trigger to magic damage only (no normal attack proc);
  - upgraded `A07R` fallback leap to parabolic jump (no linear walk-like movement);
  - improved `A071` countdown readability (large red text);
  - added visible `+X攻/-X攻` feedback for `A073` and `A065`;
  - aligned `shadow_return` absorb visuals to original behavior;
  - added sin hero post-spawn recovery check for missing `A053` / knife items.
- 2026-04-16 (codex, follow-up):
  - normalized boss skill localization text in `maps/table/ability.ini`;
  - added/updated `Tip` + `Ubertip` for all staged boss skills and wild crocodile skills;
  - also completed final-boss custom skill text (`A016/A017/A018/A04L/A04M/A04N`);
  - fixed malformed boss editor suffix strings like `（boss` to `（boss）`.
- 2026-04-16 (codex, native-boss-text):
  - localized boss-used native abilities to boss-name-first titles;
  - updated `Name/Tip/Ubertip/EditorSuffix` for lion king crit, crocodile evasion, xiaoxiao passives, death knight native skill, and decay boss native pair;
  - going forward, boss skill reports should use skill names instead of raw ids.
- 2026-04-16 (codex, migration-audit):
  - verified migration bootstrap runs before original initialization triggers;
  - checked explicit trigger takeover pairs: `disableLegacyTrigger=174`, `replaceGlobalTrigger=174`, no missing same-name disable found;
  - added idempotent guard for dynamic neutral initialization to prevent duplicate wild monster spawns;
  - added active-wave lock and stale timer-dialog cleanup for enemy wave progression;
  - gated gameplay-mutating debug/test commands behind `udg_enable_migration_test_content`;
  - restored artificial sun owner-only messages to match original trigger behavior;
  - removed the respawn-time self-created fallback timer and now requires the original game-time source;
  - removed the approximate heal/second-damage fallback from `show_da`; damage rewrites now require same-event damage APIs;
  - removed unused day/night scale conversion code from the fixed-timer day/night config.
- 2026-04-16 (codex, artificial-sun-broadcast):
  - changed artificial sun start/end messages to broadcast to all players;
  - changed the start message to identify only the mercenary unit, not the player name;
  - simplified the end message to only say that artificial sun light faded;
  - added a global timer dialog titled `人造太阳光芒消散还有`;
  - kept invalid-use feedback local to the player who tried to use the item.

## Pending Concerns For Copilot

- Boss AI currently uses native timer polling after each boss appears instead of the original `YDWEAddAIOrder` event-driven behavior. This reduces YDWE dependency, but spell frequency, target selection, and trigger timing may differ from the original map.
- Resource-node damage normalization and some sin-mercenary damage prevention still use life-adjustment fallback when same-event damage rewrite APIs are missing. `show_da` has already been tightened to require same-event damage rewrite; these remaining sites should be reviewed for strict original equivalence.
- Gameplay-mutating debug commands are gated behind `udg_enable_migration_test_content`. This is safer for normal games, but differs from always-available test triggers.
- Dynamic wild neutral initialization and enemy-wave start now have duplicate-execution guards. This prevents double spawns, but repeated manual test execution would require an explicit reset path.

## Verification

- Run `corepack yarn build:prod` after every gameplay-flow change.
- In game after selecting difficulty:
  - Expect one prepare text line.
  - Expect `距离黎明还有：` immediately for the first night.
  - Run `-dn1`; expect `nightActive=true`, `nightLeft > 0`, `SCALE=1`.
  - During countdown, TOD should remain near the phase start because time flow is paused.
- Build note (2026-04-16): `npm run build:dev` compilation passed; packaging step failed under sandbox EPERM on `cmd.exe` spawn.
- Build note (2026-04-16, codex): `yarn build:dev` was unavailable because `yarn` was not on PATH; `corepack yarn build:dev` failed under sandbox with `EPERM` on `C:\Users\42432`, and the escalation request timed out.

## Latest Fixes (2026-04-19, codex, respawn-desync)

- Respawn now reuses one timer per hero slot and stores the hero handle locally for the timer callback; this prevents “countdown ends but no revive/camera/text” when `udg_diedhero[x]` gets overwritten by other flows.
- Removed the `throw` path from respawn game-time reading; when the original YDWE game-time source is missing, it falls back to a local long timer with a one-time warning to avoid multiplayer divergence.
- Removed remaining `throw new Error` sites inside `src/migration` (soul collector + debug triggers); they now `print` and return to avoid client-only script aborts.

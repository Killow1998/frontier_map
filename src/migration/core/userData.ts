import { getGlobal } from "./helpers"

const YDHT_GLOBAL = "YDHT"
const LEGACY_BOOL_KEY_USE_HEX = 0x8376128b
let cachedUseKey: number | undefined

/**
 * The original JASS stores several "use" flags in YDHT using a precomputed key (0x8376128B).
 * In most cases this is equivalent to StringHash("use"), but we keep the legacy constant as
 * the source of truth to avoid TS/JASS mixed-run divergence.
 */
export function getLegacyUseBoolKey(): number {
  if (cachedUseKey !== undefined) {
    return cachedUseKey
  }
  const hashed = StringHash("use")
  if (hashed !== LEGACY_BOOL_KEY_USE_HEX) {
    print(
      "[migration] Warning: StringHash('use') != 0x8376128B (got " +
        I2S(hashed) +
        "); fallback to legacy constant to stay compatible with JASS."
    )
    cachedUseKey = LEGACY_BOOL_KEY_USE_HEX
    return cachedUseKey
  }
  cachedUseKey = hashed
  return cachedUseKey
}

export function ydhtLoadBool(tableId: number, key: number): boolean {
  const ydht = getGlobal<hashtable>(YDHT_GLOBAL)
  if (!ydht) {
    return false
  }
  return LoadBoolean(ydht, tableId, key)
}

export function ydhtSaveBool(tableId: number, key: number, value: boolean): void {
  const ydht = getGlobal<hashtable>(YDHT_GLOBAL)
  if (!ydht) {
    return
  }
  SaveBoolean(ydht, tableId, key, value)
}

/**
 * Unified "use" flag for itemId-based user data, matching original JASS.
 */
export function ydhtLoadItemUseFlag(itemId: number): boolean {
  return ydhtLoadBool(itemId, getLegacyUseBoolKey())
}

export function ydhtSaveItemUseFlag(itemId: number, used: boolean): void {
  ydhtSaveBool(itemId, getLegacyUseBoolKey(), used)
}


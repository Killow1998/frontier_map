/**
 * Buff 展示用元数据（名称、图标、描述），按 typeId 注册；未知类型有占位。
 */

import { Buff } from "./Buff";
import { ShieldBuff } from "./ShieldBuff";
import { BuffTypeId } from "./types";

export interface BuffDisplayDefinition {
  name: string;
  description: string;
  icon: string;
}

const FALLBACK_ICON =
  "ReplaceableTextures\\CommandButtons\\BTNSelectHeroOn.blp";

const registry = new Map<string, BuffDisplayDefinition>();

const DEFAULT_UNKNOWN: BuffDisplayDefinition = {
  name: "未知 Buff",
  description: "",
  icon: FALLBACK_ICON,
};

export function registerBuffDisplay(
  typeId: string,
  def: BuffDisplayDefinition
): void {
  registry.set(typeId, def);
}

/** 注册内置类型（护盾等）；可多次调用，后写覆盖 */
export function registerDefaultBuffDisplays(): void {
  registerBuffDisplay(BuffTypeId.SHIELD, {
    name: "护盾",
    description: "吸收一定伤害；护盾耗尽或持续时间结束时移除。",
    icon: "ReplaceableTextures\\CommandButtons\\BTNSpell_ShieldWall.blp",
  });
}

export function getBuffDisplay(typeId: string): BuffDisplayDefinition {
  return registry.get(typeId) ?? DEFAULT_UNKNOWN;
}

/** 未知类型时用 typeId 作为标题 */
export function resolveBuffDisplay(buff: Buff): BuffDisplayDefinition {
  const base = registry.get(buff.typeId);
  if (base) return base;
  return { ...DEFAULT_UNKNOWN, name: buff.typeId };
}

/** 剩余秒数；永久 Buff 为 null */
export function getRemainingSeconds(buff: Buff): number | null {
  if (buff.duration < 0) return null;
  return Math.max(0, buff.duration - buff.elapsed);
}

/** 槽位角标：简短时间或 ∞ */
export function formatSlotTimeShort(buff: Buff): string {
  if (buff.duration < 0) return "∞";
  const r = getRemainingSeconds(buff)!;
  if (r >= 100) return `${math.floor(r)}`;
  if (r >= 10) return `${math.floor(r)}`;
  return `${r.toFixed(1)}`;
}

/** Tips 正文：名称、描述、剩余时间、护盾数值 */
export function buildBuffTooltipText(buff: Buff): string {
  const d = resolveBuffDisplay(buff);
  let t = `${d.name}\n\n${d.description}`;
  const rem = getRemainingSeconds(buff);
  if (rem !== null) {
    t += `\n\n剩余时间：${rem.toFixed(1)} 秒`;
  } else {
    t += `\n\n剩余时间：永久`;
  }
  if (buff instanceof ShieldBuff) {
    t += `\n护盾：${math.floor(buff.current)} / ${math.floor(buff.max)}`;
  }
  return t;
}

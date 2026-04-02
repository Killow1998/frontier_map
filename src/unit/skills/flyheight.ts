import { FourCC } from "src/utils/helper";
import { UNIT_TYPE_DEAD } from "src/constants/game/units";

const STORM_CROW_ABILITY = FourCC("Arav");

function isUnitAlive(u: unit): boolean {
  // 复用你项目里常用的“单位不死 + 生命值足够”判定
  return !IsUnitType(u, UNIT_TYPE_DEAD) && GetWidgetLife(u) > 0.405;
}

/**
 * 以“风暴乌鸦形态（Arav）”的能力桥接飞行高度：
 * - 若单位当前没有 Arav，就临时添加
 * - fn 内部可以在任意时刻调用 dispose() 来恢复飞行高度并移除 Arav（如果原本没有）
 */
export function ensureStormCrowFlyHeight(
  u: unit,
  fn: (baseFlyHeight: number, dispose: () => void) => void
): void {
  const baseFlyHeight = GetUnitFlyHeight(u);
  const hadAbility = GetUnitAbilityLevel(u, STORM_CROW_ABILITY) > 0;

  if (!hadAbility) {
    // Arav 允许通过 SetUnitFlyHeight 修改飞行高度
    UnitAddAbility(u, STORM_CROW_ABILITY);
  }

  const dispose = () => {
    // 重要：即使单位“已死”，也按需求尝试恢复其默认高度与临时能力清理。
    // `SetUnitFlyHeight` 在死单位上是否完全有可见效果取决于引擎，但调用本身是必要的“状态恢复”行为。
    SetUnitFlyHeight(u, baseFlyHeight, 0);
    if (!hadAbility) UnitRemoveAbility(u, STORM_CROW_ABILITY);
  };

  // 若单位已死，直接 dispose 并提前返回
  if (!isUnitAlive(u)) {
    dispose();
    return;
  }

  fn(baseFlyHeight, dispose);
}

/**
 * 小封装：设置飞行高度（相当于 SetUnitFlyHeight）
 */
export function setFlyHeight(u: unit, height: number, rate: number): void {
  SetUnitFlyHeight(u, height, rate);
}


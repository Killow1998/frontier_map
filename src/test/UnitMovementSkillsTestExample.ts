import { Players, Timer, Unit } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import {
  casterJumpToAndKnockEnemies,
  unitChargeToPoint,
  unitChargeToUnit,
  unitJumpTo,
  unitKnockUp,
} from "src/unit/skills";

function safeCreate(owner: number, unitTypeId: number, x: number, y: number): Unit | undefined {
  const p = Players[owner];
  if (!p) return undefined;
  return Unit.create(p, unitTypeId, x, y);
}

export function testUnitJumpToSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  if (!caster) return;

  Timer.create().start(1, false, () => {
    unitJumpTo(caster.handle, 250, 100, {
      jumpMaxHeight: 260,
      duration: 0.45,
    });
  });
}

export function testUnitChargeToPointSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  if (!caster) return;

  Timer.create().start(1, false, () => {
    unitChargeToPoint(caster.handle, 500, 0, {
      speed: 1000,
    });
  });
}

export function testUnitChargeToUnitSkill(): void {
  const charger = safeCreate(0, FourCC("Hpal"), 0, 0);
  const target = safeCreate(1, FourCC("Hpal"), 450, 0);
  if (!charger || !target) return;

  Timer.create().start(1, false, () => {
    unitChargeToUnit(charger.handle, target.handle, {
      speed: 900,
      stopDist: 90,
    });
  });
}

export function testUnitKnockUpSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  const target = safeCreate(1, FourCC("Hpal"), 350, 0);
  if (!caster || !target) return;

  Timer.create().start(1, false, () => {
    // from=caster：击飞的水平推开方向尽量从 caster 指向相反侧
    unitKnockUp(target.handle, {
      from: caster.handle,
      maxHeight: 200,
      pushDist: 180,
      duration: 0.5,
    });
  });
}

export function testCasterJumpAndKnockEnemiesSkill(): void {
  const caster = safeCreate(0, FourCC("Hpal"), 0, 0);
  const enemy1 = safeCreate(1, FourCC("Hpal"), 380, 0);
  const enemy2 = safeCreate(1, FourCC("Hpal"), 320, 220);
  const enemyBuilding = safeCreate(1, FourCC("hbar"), 420, 180); // 作为“建筑过滤”用
  if (!caster || !enemy1 || !enemy2 || !enemyBuilding) return;

  Timer.create().start(1, false, () => {
    casterJumpToAndKnockEnemies(caster.handle, 300, 80, {
      jumpMaxHeight: 240,
      jumpDuration: 0.5,
      knockRadius: 360,
      knockMaxHeight: 220,
      knockPushDist: 200,
    });
  });
}


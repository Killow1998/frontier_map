import { Players, Timer } from "@eiriksgata/wc3ts/*";
import { Actor } from "src/system/actor";
import { SpellCardBulletSystem, SpellCardId } from "src/system/bullethell";
import { FourCC } from "src/utils/helper";

/**
 * 弹幕压测入口：
 * 1. 创建巫妖单位
 * 2. 依次释放 3 张符卡（每张 8 秒）
 * 3. 每 2 秒打印一次统计，便于观察 200~300 并发下的稳定性
 */
export function runSpellCardBulletHellTest(): void {
  const caster = Actor.create(Players[0], FourCC("Ulic"), 0, 0, 0);
  if (!caster) {
    print("[BulletHellTest] 创建巫妖失败");
    return;
  }

  const system = SpellCardBulletSystem.getInstance();
  system.initialize({
    maxBullets: 320,
    collisionChecksPerTick: 84,
    collisionTickStride: 2,
  });

  system.startCardFromCaster(caster.handle, SpellCardId.RING_BURST, {
    duration: 8,
    emissionInterval: 0.08,
    baseSpeed: 600,
    bulletLife: 3.3,
    bulletRadius: 90,
    bulletDamage: 12,
  });

  Timer.create().start(8.2, false, () => {
    system.startCardFromCaster(caster.handle, SpellCardId.DUAL_SPIRAL, {
      duration: 8,
      emissionInterval: 0.05,
      baseSpeed: 640,
      bulletLife: 3.5,
      bulletRadius: 85,
      bulletDamage: 10,
    });
  });

  Timer.create().start(16.4, false, () => {
    system.startCardFromCaster(caster.handle, SpellCardId.FAN_PULSE, {
      duration: 8,
      emissionInterval: 0.09,
      baseSpeed: 700,
      bulletLife: 2.8,
      bulletRadius: 95,
      bulletDamage: 14,
    });
  });

  const statTimer = Timer.create();
  statTimer.start(2, true, () => {
    const s = system.getStats();
    print(
      `[BulletHellTest] active=${s.activeBullets}, emitters=${s.activeEmitters}, spawned=${s.totalSpawned}, dropped=${s.totalDropped}, recycled=${s.totalRecycled}, hit=${s.totalHit}`
    );

    if (s.activeEmitters <= 0 && s.activeBullets <= 0) {
      statTimer.destroy();
      print("[BulletHellTest] 全部符卡结束");
    }
  });
}

/**
 * 直接对任意单位释放符卡（你需求里的主入口）。
 */
export function castSpellCardFromUnit(caster: unit, cardId: SpellCardId): number | undefined {
  const system = SpellCardBulletSystem.getInstance();
  system.initialize();

  return system.startCardFromCaster(caster, cardId, {
    duration: 8,
    emissionInterval: cardId === SpellCardId.DUAL_SPIRAL ? 0.05 : 0.08,
    baseSpeed: 620,
    bulletLife: 3.2,
    bulletRadius: 90,
    bulletDamage: 12,
  });
}

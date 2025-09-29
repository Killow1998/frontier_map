
import { Effect, Unit } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { DamageCalculator, DamageType, Stats } from 'tstl-damage-calculator';
;

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {

  print("hello ts");
  DisplayTextToPlayer(Player(0), 0, 0, "hello ts");

  const aa = Effect.create("Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl", 0, 0);
  
  // 创建攻击者和防御者属性
  const attacker: Stats = {
    attack: 100,
    magicPower: 80,
    armor: 50,
    magicResist: 30,
    criticalChance: 0.25,
    criticalDamage: 1.5
  };

  const defender: Stats = {
    attack: 60,
    magicPower: 40,
    armor: 80,
    magicResist: 60,
    criticalChance: 0.1,
    criticalDamage: 1.3
  };

  // 计算伤害
  const result = DamageCalculator.calculateDamage(
    attacker,
    defender,
    DamageType.Physical
  );

  print(`最终伤害: ${result.finalDamage}`);
  print(`是否暴击: ${result.isCritical}`);
}



// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
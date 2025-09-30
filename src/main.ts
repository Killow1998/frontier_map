
import { Effect, Players, Unit } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { DamageCalculator, DamageType, Stats } from 'tstl-damage-calculator';
import { FourCC } from "./utils/helper";
;

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {

  print("hello ts");
  DisplayTextToPlayer(Player(0), 0, 0, "hello ts");

  const unit = Unit.create(Players[0], FourCC('hfoo'), 0, 0, 0)!;
  print(`Created unit: ${unit.name}`);
  
}



// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
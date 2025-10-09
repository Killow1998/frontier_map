
import { Effect, Unit, Players } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
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

  //移动镜头到单位坐标
  SetCameraTargetController(unit.handle, 0, 0, true);
  SetCameraQuickPosition(GetUnitX(unit.handle), GetUnitY(unit.handle));

  //创建一个特效
  const effect = Effect.create("Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl", GetUnitX(unit.handle), GetUnitY(unit.handle))!;
  effect.setHeight(100);
  effect.setYaw(0);
  effect.setPitch(0);
  effect.setRoll(0);
  
}



// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
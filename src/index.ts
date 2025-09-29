
import { ydlua } from "./ydlua";
import { FourCC } from "./utils/helper";
import { Unit } from "@eiriksgata/wc3ts";
import { Players } from "@eiriksgata/wc3ts/dist/globals";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {

  print("hello ts");
  DisplayTextToPlayer(Player(0), 0, 0, "hello ts");

  Unit.create(Players[0], FourCC("hfoo"), 0, 0, 0);
  

}



// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
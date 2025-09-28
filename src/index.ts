import { ydlua } from "./ydlua";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {

  print("hello ts");
  DisplayTextToPlayer(Player(0), 0, 0, "hello ts");

}

// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
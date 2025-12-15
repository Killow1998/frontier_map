
import { Frame, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { UnitBlood } from "./system/ui/component/UnitBlood";
import { HotReload } from "./system/HotReload";
import { ModuleManager } from "./system/ModuleManager";
import { PlayersConfig } from "./config/Players";
import { MapGeneral } from "./config/Map";
import { Console } from "./system/console";
import { ReloadTemplateExample } from "./examples/ReloadTemplateExample";
import { mouseEvents } from "./system/event";

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 * 测试自动重新编译功能
 */
async function main(): Promise<void> {


  // 确保所有UI模块被加载（这样它们的注册代码会被执行）
  // 只是引用一下类，确保模块被加载

  //移动镜头到0,0位置
  PanCameraToTimed(0, 0, 0);
  Timer.create().start(2, false, () => {
    print("Loading UI modules:", typeof ReloadTemplateExample);
  });




}

/**
 * 初始化函数 - 供模块化加载使用
 */
export function initialize(): void {
  // register ydlua
  ydlua.getInstance().initialize();

  //载入TOC fdf样式模板Frame
  try {
    Frame.loadTOC("resource\\fdf\\path.toc");
    Console.log("FDF TOC loaded successfully");
  } catch (e) {
    print(`Error loading FDF TOC: ${e}`);
  }

  // 初始化模块管理器中的所有模块
  print(">>> Main: Initializing all modules...");
  ModuleManager.getInstance().initializeAllModules();
  print(`>>> Main: All registered modules: ${ModuleManager.getInstance().getRegisteredModules().join(", ")}`);

  // 延迟启动热更新系统，确保所有模块都已注册
  Timer.create().start(2, false, () => {
    print(`>>> Main: Starting hot reload system...`);
    print(`>>> Main: Registered modules at start: ${ModuleManager.getInstance().getRegisteredModules().join(", ")}`);
    HotReload.getInstance().start();
  });

  PlayersConfig.CameraControl();
  UnitBlood.registerLocalDrawEvent();

  MapGeneral.sceneVisionInit();

  DzEnableWideScreen(true)

  mouseEvents.initialize();

  print(">>> Main: Main module initialized");

  // 启动应用程序
  main();

  //隐藏魔兽UI
  //DzFrameHideInterface();

  //调整魔兽渲染黑边
  //DzFrameEditBlackBorders(0, 0);

}

/**
 * 热重载处理函数
 * 当模块被热重载时调用
 */
export function onHotReload(): void {
  print("Main module hot reloaded!");
  // 这里可以添加主模块热重载后的特殊处理逻辑
}



import { Frame, FRAMEPOINT_BOTTOMRIGHT, FRAMEPOINT_TOPLEFT, Players, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { UnitBlood } from "./system/ui/component/UnitBlood";
import { HotReload } from "./system/HotReload";
import { ModuleManager } from "./system/ModuleManager";
import { PlayersConfig } from "./config/Players";
import { MapGeneral } from "./config/Map";
import { Console } from "./system/console";
import { UILayout } from "./system/ui/UILayout";
import { Button, ButtonTextures } from "./system/ui/component/Buttom";
import { TemplateUI } from "./examples/TemplateUi";
import { ExportUI } from "./test/ExportUI";
import { Actor } from "./system/actor";
import { FourCC } from "./utils/helper";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 * 测试自动重新编译功能
 */
async function main(): Promise<void> {


  // //移动镜头到目标
  // PanCameraToTimed(MAP_UNITS_INIT_CREATE.玩家1圣骑士.x, MAP_UNITS_INIT_CREATE.玩家1圣骑士.y, 0);
  // SetCameraQuickPosition(MAP_UNITS_INIT_CREATE.玩家1圣骑士.x, MAP_UNITS_INIT_CREATE.玩家1圣骑士.y);
  // SetCameraTargetController(MAP_UNITS_INIT_CREATE.玩家1圣骑士.handle, 0, 0, true);

  // MAP_UNITS_INIT_CREATE.玩家1圣骑士.createBloodBar();


  const actor = Actor.create(Players[0], FourCC('Hpal'), 0, 0);
  if (actor) {
    actor.createBloodBar();
    actor.setLabel("英雄单位\n大侠\n我是神");
  }


  // 确保所有UI模块被加载（这样它们的注册代码会被执行）
  // 只是引用一下类，确保模块被加载

  Timer.create().start(2, false, () => {
    //print("Loading UI modules:", typeof TemplateUI);

    //new ExportUI();

    // Button.createAtPresetPosition(
    //   "TestButton",
    //   ScreenCoordinates.ORIGIN_CENTER,
    //   "LARGE"
    // )
    //   .setOnClick(() => {
    //     Console.log("图标按钮被点击了!");
    //   })
    //   .create();

    //testButton();

    // new Frame("QuestButtonBaseTemplate", Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0)!, 0, 0)
    //   .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.353660, 0.388860)
    //   .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.453660, 0.288860)
  });



  // 测试Button组件


}

/**
 * 初始化函数 - 供模块化加载使用
 */
export function initialize(): void {
  // register ydlua
  ydlua.getInstance().initialize();

  //载入TOC fdf样式模板Frame
  try {
    Frame.loadTOC("UI\\fdf\\path.toc");
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

  print(">>> Main: Main module initialized");

  // 启动应用程序
  main();
}

/**
 * 热重载处理函数
 * 当模块被热重载时调用
 */
export function onHotReload(): void {
  print("Main module hot reloaded!");
  // 这里可以添加主模块热重载后的特殊处理逻辑
}


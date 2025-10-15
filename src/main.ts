
import { bj_MAX_PLAYER_SLOTS, MapPlayer, Players, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { UnitBlood } from "./system/ui/UnitBlood";
import { HotReload } from "./system/HotReload";
import { ModuleManager } from "./system/ModuleManager";
import { PlayersConfig } from "./config/Players";
import { MAP_UNITS_INIT_CREATE } from "./config/MapUnit";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 * 测试自动重新编译功能
 */
async function main(): Promise<void> {

  Timer.create().start(0.01, false, () => {

    PlayersConfig.CameraControl();

    UnitBlood.registerLocalDrawEvent();


    //移动镜头到目标
    PanCameraToTimed(MAP_UNITS_INIT_CREATE.玩家1圣骑士.x, MAP_UNITS_INIT_CREATE.玩家1圣骑士.y, 0);
    SetCameraQuickPosition(MAP_UNITS_INIT_CREATE.玩家1圣骑士.x, MAP_UNITS_INIT_CREATE.玩家1圣骑士.y);
    SetCameraTargetController(MAP_UNITS_INIT_CREATE.玩家1圣骑士.handle, 0, 0, true);

    MAP_UNITS_INIT_CREATE.玩家1圣骑士.createBloodBar();

    // 确保模块被引用，强制执行模块注册代码
    // print(`TemplateUI imported: ${typeof TemplateUI}`);

    // 初始化模块管理器中的所有模块
    ModuleManager.getInstance().initializeAllModules();
  });

  // 延迟启动热更新系统，确保所有模块都已注册
  Timer.create().start(2, false, () => {
    print(`Starting hot reload system. Registered modules: ${ModuleManager.getInstance().getRegisteredModules().join(", ")}`);
    HotReload.getInstance().start();
    print("Hot reload system initialized");
  });

}

/**
 * 初始化函数 - 供模块化加载使用
 */
export function initialize(): void {
  // register ydlua
  ydlua.getInstance().initialize();

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


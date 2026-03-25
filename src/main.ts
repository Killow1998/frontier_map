import { EVENT_PLAYER_UNIT_SPELL_EFFECT, EVENT_UNIT_SPELL_EFFECT, EVENT_UNIT_SPELL_ENDCAST, Frame, PLAYER_NEUTRAL_AGGRESSIVE, Players, Timer, Trigger, Unit } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { PlayersConfig } from "./config/Players";
import { MapGeneral } from "./config/Map";
import { mouseEvents } from "./system/event";
import { FourCC } from "./utils/helper";
import { castRushBarrageSkill } from "./examples/HeroUnitSkill";
import { castRushBarrageSkillTest, testAddShield } from "./test/HeroUnitSkillTestExample";
import { rgeisterUnitSpellEffectEvent } from "./examples/UnitEventExample";
import DamageSystem from "./system/damage";
import { BuffSystem } from "./system/buff";
import ShieldSystem from "./system/ShieldSystem";
import SummoningSystem from "./system/SummoningSystem";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 * 测试自动重新编译功能
 */
async function main(): Promise<void> {
  // 镜头对准两单位中间，便于观察「施法者 → 敌方脚下」的暴风雪
  PanCameraToTimed(200, 0, 0);
  Timer.create().start(0.01, false, () => {
    testAddShield();


  });
}

/**
 * 初始化函数 - 供模块化加载使用
 */
export function initialize(): void {
  // register ydlua
  ydlua.getInstance().initialize();

  //安装泄露检测（Timer / Trigger 句柄跟踪）
  // LeakDetector.install();

  // Timer.create().start(3, true, () => {
  //   LeakDetector.dump(3);
  // })
  //log 初始化
  //Console.init();

  //载入TOC fdf样式模板Frame
  try {
    Frame.loadTOC("resource\\fdf\\path.toc");
    print("FDF TOC loaded successfully");
  } catch (e) {
    print(`Error loading FDF TOC: ${e}`);
  }

  // 热重载模块极其容易发生闪退，不推荐使用

  // 初始化模块管理器中的所有模块 
  // print(">>> Main: Initializing all modules...");
  // ModuleManager.getInstance().initializeAllModules();
  // print(`>>> Main: All registered modules: ${ModuleManager.getInstance().getRegisteredModules().join(", ")}`);

  // 延迟启动热更新系统，确保所有模块都已注册
  // Timer.create().start(0.1, false, () => {
  //   print(`>>> Main: Starting hot reload system...`);
  //   print(`>>> Main: Registered modules at start: ${ModuleManager.getInstance().getRegisteredModules().join(", ")}`);
  //   HotReload.getInstance().start();
  // });

  PlayersConfig.CameraControl();
  //UnitBlood.registerLocalDrawEvent();

  MapGeneral.sceneVisionInit();

  DzEnableWideScreen(true)

  mouseEvents.initialize();

  // print(">>> Main: Main module initialized");


  // DzFrameUnlockMouseRectLimit(true);
  // //隐藏魔兽UI
  // //DzFrameHideInterface();

  // //调整魔兽渲染黑边
  // //DzFrameEditBlackBorders(0, 0);


  // //启动召唤系统
  SummoningSystem.getInstance().init();

  // // 启动伤害系统
  DamageSystem.getInstance().initialize();

  // // Buff 系统（驱动力：持续时间 tick、护盾等 buff 的过期与移除）
  BuffSystem.getInstance().init();

  // // 护盾系统（护盾为 Buff 一种，高优先级处理伤害吸收后 setEventDamage 写回）
  ShieldSystem.getInstance().init();


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


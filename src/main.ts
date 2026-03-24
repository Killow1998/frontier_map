import { EVENT_PLAYER_UNIT_SPELL_EFFECT, EVENT_UNIT_SPELL_EFFECT, EVENT_UNIT_SPELL_ENDCAST, Frame, PLAYER_NEUTRAL_AGGRESSIVE, Players, Timer, Trigger } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { UnitBlood } from "./system/ui/component/UnitBlood";
import { HotReload } from "./system/HotReload";
import { ModuleManager } from "./system/ModuleManager";
import { PlayersConfig } from "./config/Players";
import { MapGeneral } from "./config/Map";
import { EventBus, gameEvents, mouseEvents, SpellEventData, UnitDeathEventData } from "./system/event";
import { ReloadTemplateExample } from "./examples/ReloadTemplateExample";
import { LeakDetector } from "./system/LeakDetector";
import SummoningSystem from "./system/SummoningSystem";
import DamageSystem from "./system/damage";
import ShieldSystem from "./system/ShieldSystem";
import { BuffSystem } from "./system/buff";
import { FourCC } from "./utils/helper";
import { Actor } from "./system/actor";
import { GachaPanel } from "./system/ui/component/GachaPanel";

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 * 测试自动重新编译功能
 */
async function main(): Promise<void> {
  //移动镜头到0,0位置
  PanCameraToTimed(0, 0, 0);

  //DzDisableUnitPreselectUi();

  Timer.create().start(1, false, () => {

    gameEvents.onSpellEffect((data: SpellEventData) => {
      print("单位释放了技能: " + data.abilityId);
    })
    gameEvents.onUnitDeath((data: UnitDeathEventData) => {
      const time = Timer.create().start(1, false, () => {
        //复活
        data.Actor?.revive(0, 0, true);
        data.Actor!.mana = 3000;
        time.destroy();
      })
    })

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 10; i++) {
        const unit = Actor.create(Players[j], FourCC('Hpal'), 0, 0);
        if (unit == null) return;
        print("创建单位: " + unit?.id);
        unit.createBloodBar();
        unit.setLabel("测试单位");

        //攻击速度
        //unit.setUnitAttackCooldownJAPI(0.5);

        //添加霜冻新星技能
        unit.addAbility(FourCC('AUfn'));

        //添加水元素技能
        unit.addAbility(FourCC('AHwe'));

        unit.maxMana = 3000;
        unit.mana = 3000;

        //添加护盾
        //unit.addShield(1000);



      }
    }


    // const gacha = GachaPanel.createCentered("抽卡天赋", 1100, 500)
    //   .setCardSize(300, 350)
    //   .setDraggable(true);  // 可选：面板可拖拽

    // gacha.addCard({
    //   icon: "ReplaceableTextures\\CommandButtons\\BTNHeroPaladin.blp",
    //   title: "圣光信仰",
    //   description: "提高你的治疗效果 20%，\n并在释放技能时有几率恢复生命。",
    //   onClick: () => {
    //     print("选择了天赋：圣光信仰");
    //   },
    // });

    // gacha.addCard({
    //   icon: "ReplaceableTextures\\CommandButtons\\BTNStormBolt.blp",
    //   title: "雷霆一击",
    //   description: "获得一个可以对敌方单位造成伤害并眩晕的主动技能。",
    //   onClick: () => {
    //     print("选择了天赋：雷霆一击");
    //   },
    // });

    // gacha.addCard({
    //   icon: "ReplaceableTextures\\CommandButtons\\BTNStormBolt.blp",
    //   title: "雷霆一击",
    //   description: "获得一个可以对敌方单位造成伤害并眩晕的主动技能。",
    //   onClick: () => {
    //     print("选择了天赋：雷霆一击");
    //   },
    // });

    // // 显示抽卡 UI
    // gacha.show();
    // gameEvents.onSpellEffect((data: SpellEventData) => {
    //   //print(`${data.Actor?.name} 释放了 ${data.abilityId} 效果`);
    //   DisplayTextToPlayer(Player(0), 0, 0, `${data.Actor?.name} 释放了 ${data.abilityId} 效果`);
    // })

  })





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

  //DzEnableWideScreen(true)

  mouseEvents.initialize();

  // print(">>> Main: Main module initialized");




  // DzFrameUnlockMouseRectLimit(true);
  // //隐藏魔兽UI
  // //DzFrameHideInterface();

  // //调整魔兽渲染黑边
  // //DzFrameEditBlackBorders(0, 0);


  // //启动召唤系统
  // SummoningSystem.getInstance().init();

  // // 启动伤害系统
  // DamageSystem.getInstance().initialize();

  // // Buff 系统（驱动力：持续时间 tick、护盾等 buff 的过期与移除）
  // BuffSystem.getInstance().init();

  // // 护盾系统（护盾为 Buff 一种，高优先级处理伤害吸收后 setEventDamage 写回）
  // ShieldSystem.getInstance().init();


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


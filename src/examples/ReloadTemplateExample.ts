import { ModuleManager } from "../system/ModuleManager";
import { HotReloadHelper } from "src/system/ui/UIComponent";
import { EVENT_PLAYER_UNIT_DEATH, EVENT_PLAYER_UNIT_TRAIN_CANCEL, EVENT_UNIT_DEATH, Frame, FRAMEPOINT_CENTER, Players, Timer, Trigger, Unit } from "@eiriksgata/wc3ts/*";
import { UILayout } from "src/system/ui/UILayout";
import { Actor } from "src/system/actor";
import { FourCC } from "src/utils/helper";
import { EventBus, gameEvents, UnitDeathEventData } from "src/system/event";
import { Console } from "src/system/console";
import { GachaPanel } from "src/system/ui/component/GachaPanel";

/**
 * 热更新模板
 * 
 * 热重载设计要点：
 * 1. 使用 HotReloadHelper 自动管理UI组件
 * 2. 在 cleanup() 中调用 helper.cleanup() 即可销毁所有组件
 * 3. 使用 helper.register() 注册组件，无需手动管理数组
 */
class ReloadTemplateExample {

  // ========================================
  // 使用 HotReloadHelper 自动管理组件
  // ========================================
  private ui = new HotReloadHelper("ReloadTemplate");


  /**
   * 创建测试按钮
   */
  public TestButton() {

    gameEvents.onUnitDeath((data: UnitDeathEventData) => {
      const time = Timer.create().start(1, false, () => {
        //复活
        data.Actor?.revive(0, 0, true);
        time.destroy();
      })
    })

    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 10; i++) {
        const unit = Actor.create(Players[j], FourCC('Hpal'), 0, 0);
        if (unit == null) return;
        print("创建单位: " + unit?.id);
        unit.createBloodBar();
        unit.setLabel("测试单位");
        unit.setBaseDamageJAPI(200);
        //攻击速度
        unit.setUnitAttackCooldownJAPI(0.5);
      }
    }

    const gacha = GachaPanel.createCentered("抽卡天赋", 1100, 500)
      .setCardSize(300, 350)
      .setDraggable(true);  // 可选：面板可拖拽

    gacha.addCard({
      icon: "ReplaceableTextures\\CommandButtons\\BTNHeroPaladin.blp",
      title: "圣光信仰",
      description: "提高你的治疗效果 20%，\n并在释放技能时有几率恢复生命。",
      onClick: () => {
        print("选择了天赋：圣光信仰");
      },
    });

    gacha.addCard({
      icon: "ReplaceableTextures\\CommandButtons\\BTNStormBolt.blp",
      title: "雷霆一击",
      description: "获得一个可以对敌方单位造成伤害并眩晕的主动技能。",
      onClick: () => {
        print("选择了天赋：雷霆一击");
      },
    });

    gacha.addCard({
      icon: "ReplaceableTextures\\CommandButtons\\BTNStormBolt.blp",
      title: "雷霆一击",
      description: "获得一个可以对敌方单位造成伤害并眩晕的主动技能。",
      onClick: () => {
        print("选择了天赋：雷霆一击");
      },
    });

    // 显示抽卡 UI
    gacha.show();
  }

  /**
   * 清理函数 - 热重载时调用
   * 只需要一行代码即可清理所有UI组件
   */
  public cleanup(): void {
    print("ReloadTemplate: Cleanup called...");

    // 一行代码销毁所有已注册的组件！
    this.ui.cleanup();

    print("ReloadTemplate: All resources cleaned up");
  }

  /**
   * 初始化函数
   */
  public initialize(): void {
    print("ReloadTemplate: Initializing...");
    this.TestButton();
    print("ReloadTemplate initialized");
  }

  /**
   * 热重载处理函数
   */
  public static onHotReload(): void {
    print("ReloadTemplate hot reloaded!");
  }
}

// ========================================
// 模块注册 - 关键：保持实例在热重载之间存活
// ========================================

// 全局实例 - 在模块级别保存，热重载时会被重用
let reloadInstance: ReloadTemplateExample | null = null;

print(">>> ReloadTemplate: Module file loaded, about to register...");
const manager = ModuleManager.getInstance();
print(`>>> ReloadTemplate: Got ModuleManager instance`);

// 只需传递类，ModuleManager 会自动从 ClassName.name 获取模块名
manager.registerModule(ReloadTemplateExample, {
  // 不再需要 modulePath！dev.ts 会自动从 Lua 文件中提取模块名
  initialize: () => {
    print(">>> ReloadTemplate: Initialize callback called");
    if (!reloadInstance) {
      reloadInstance = new ReloadTemplateExample();
    }
    reloadInstance.initialize();
  },
  cleanup: () => {
    print(">>> ReloadTemplate: Cleanup callback called");
    if (reloadInstance) {
      reloadInstance.cleanup();
    }
  },
  onHotReload: () => {
    print(">>> ReloadTemplate: onHotReload callback called");
    ReloadTemplateExample.onHotReload();
  }
});
print(">>> ReloadTemplate: Module registration completed");

export { ReloadTemplateExample };
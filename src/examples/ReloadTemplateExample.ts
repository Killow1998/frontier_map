import { Text, TextColors } from "src/system/ui/component/Text";
import { ModuleManager } from "../system/ModuleManager";
import { HotReloadHelper } from "src/system/ui/UIComponent";
import { Dialog } from "src/system/ui/component/Dialog";
import { DamageTextExample } from "./DamageTextExample";
import { Actor } from "src/system/actor";
import { EVENT_PLAYER_UNIT_TRAIN_CANCEL, Players, Timer, Trigger, Unit } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import { GameEventManager, PlayerUnitEventId } from "src/system/event/GameEvent";
import { DamageTextManager } from "src/system/ui/DamageTexttag";
import { MessageList } from "src/system/ui/component/MessageList";
import { Button } from "src/system/ui/component/Button";
import { Console } from "src/system/console";

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
    // // 方式1: 使用 helper.create() 创建并自动注册
    // this.ui.create(() => {
    //   const button = Button.createCentered("ReloadTemplate Button");
    //   button.setDraggable(true);
    //   button.setOnClick(() => {
    //     print("ReloadTemplate Button clicked!");
    //   });
    //   return button;
    // });

    // // 方式2: 先创建再注册
    // const text = Text.createAtPresetPosition("ReloadTemplate Example v2", 'TOP_LEFT');
    // text.setSize(500, 100);
    // text.setBackground("UI\\Widgets\\BattleNet\\bnet-userlist-back.blp");
    // text.setPaddingTop(30);
    // text.setPaddingLeft(30);
    // text.enableDrag();

    // this.ui.register(text);  // 注册到热重载管理
    //text.setBackdropPadding(100);


    //创建面板
    //const panel = Panel.createCentered("SMALL");
    //panel.setDraggable(true);
    //panel.setPosition(600, 300);
    //panel.setBackground("UI\\Widgets\\ChatFrame\\ChatFrame-Background.blp");
    //this.ui.register(panel); // 注册面板


    // // 直接显示一个简单的对话框进行测试
    // const testDialog = new Dialog("测试对话框", 500, 600);
    // testDialog.create();
    // testDialog.setDraggable(true);

    // testDialog.addButton({
    //   text: "选项 12",
    //   onClick: () => {
    //     print("点击了选项 1");
    //   },
    //   color: TextColors.GREEN
    // });

    // testDialog.addButton({
    //   text: "选项 2",
    //   onClick: () => {
    //     print("点击了选项 2");
    //   },
    //   color: TextColors.YELLOW
    // });

    // testDialog.addButton({
    //   text: "关闭",
    //   onClick: () => {
    //     print("关闭对话框");
    //     testDialog.hide();
    //   },
    //   color: TextColors.RED
    // });

    // // 显示对话框
    // testDialog.show();

    // // 注册对话框到热重载管理器
    // this.ui.register(testDialog);

    //创建圣骑士单位
    // const actor = Actor.create(Players[0], FourCC('Hpal'), 0, 0, 270);


    // // 单位受到伤害
    // GameEventManager.getInstance().onUnitAttacked((data) => {
    //   if (data.Actor == undefined) return;
    //   const damage = GetRandomInt(1, 100000000);
    //   DamageTextManager.showDamage(damage, data.Actor.x, data.Actor.y, data.Actor.hpBarUIHeight);
    // });

    // actor?.createBloodBar();
    // typeof DamageTextExample;




    const button = Button.createAtPresetPosition("测试按钮", "CENTER");
    button.setOnClick(() => {
      Console.log("测试按钮被点击!111", 5, Players[0]);
    });
    button.create();
    this.ui.register(button);


    Timer.create().start(1, true, () => {
      Console.log("测试按钮被点击!");
    });
    print(`Registered ${this.ui.getComponentCount()} components`);

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
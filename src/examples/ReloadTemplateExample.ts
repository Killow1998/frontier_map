import { Text } from "src/system/ui/component/Text";
import { ModuleManager } from "../system/ModuleManager";
import { Console } from "../system/console";
import { Button } from 'src/system/ui/component/Button';
import { HotReloadHelper } from "src/system/ui/UIComponent";
import { PositionPreset } from '../system/ui/component/Text';

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
    // 方式1: 使用 helper.create() 创建并自动注册
    this.ui.create(() => {
      const button = Button.createCentered("ReloadTemplate Button");
      button.setDraggable(true);
      button.setOnClick(() => {
        Console.log("ReloadTemplate Button clicked!");
      });
      return button;
    });

    // 方式2: 先创建再注册
    const text = Text.createAtPresetPosition("ReloadTemplate Example v2", 'TOP_LEFT');
    text.setSize(500, 100);
    text.setBackground("UI\\Widgets\\BattleNet\\bnet-userlist-back.blp");
    text.setPaddingTop(30);
    text.setPaddingLeft(30);
    text.enableDrag();
    //text.center();

    this.ui.register(text);  // 注册到热重载管理
    //text.setBackdropPadding(100);


    Console.log(`Registered ${this.ui.getComponentCount()} components`);
  }

  /**
   * 清理函数 - 热重载时调用
   * 只需要一行代码即可清理所有UI组件
   */
  public cleanup(): void {
    Console.log("ReloadTemplate: Cleanup called...");

    // 一行代码销毁所有已注册的组件！
    this.ui.cleanup();

    Console.log("ReloadTemplate: All resources cleaned up");
  }

  /**
   * 初始化函数
   */
  public initialize(): void {
    Console.log("ReloadTemplate: Initializing...");
    this.TestButton();
    print("ReloadTemplate initialized");
  }

  /**
   * 热重载处理函数
   */
  public static onHotReload(): void {
    Console.log("ReloadTemplate hot reloaded!");
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
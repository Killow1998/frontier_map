import { ModuleManager } from "../system/ModuleManager";
import { Console } from "../system/console";
import { Button } from 'src/system/ui/component/Buttom';

/**
 * 热更新模板
 * 
 * 热重载设计要点：
 * 1. 需要在热重载时销毁的资源（如UI组件）应保存为类的成员变量
 * 2. 在 cleanup() 中销毁所有需要清理的资源
 * 3. 在 initialize() 中重新创建资源
 */
class ReloadTemplateExample {

  // ========================================
  // 需要在热重载时保留/销毁的成员变量
  // ========================================
  private buttons: Button[] = [];  // 如果有多个按钮，可以用数组管理


  /**
   * 创建测试按钮
   */
  public TestButton() {
    // 创建一个按钮 - 测试热重载 v1
    const btn = Button.createCentered("ReloadTemplate Button");
    btn.setOnClick(() => {
      Console.log("ReloadTemplate Button clicked!136");
    });
    this.buttons.push(btn);
  }
  
  /**
   * 清理函数 - 热重载时调用
   * 在这里销毁所有需要清理的资源
   */
  public cleanup(): void {
    Console.log("ReloadTemplate: Cleanup called, destroying resources...");

    // 销毁按钮数组中的所有按钮
    for (const btn of this.buttons) {
      btn.destroy();
    }
    this.buttons = [];

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
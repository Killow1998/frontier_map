import { MapPlayer, Players, Unit } from "@eiriksgata/wc3ts/*";
import { ModuleManager } from "../system/ModuleManager";
import { Console } from "../system/console";
import { Button, ButtonTextures } from 'src/system/ui/component/Buttom';
import { FourCC } from "src/utils/helper";

/**
 * 热更新模板
 * 
 * 热重载设计要点：
 * 1. 需要在热重载时销毁的资源（如UI组件）应保存为类的成员变量
 * 2. 在 cleanup() 中销毁所有需要清理的资源
 * 3. 在 initialize() 中重新创建资源
 */
class TemplateUI {

  // ========================================
  // 需要在热重载时保留/销毁的成员变量
  // ========================================
  private testButton: Button | null = null;
  private buttons: Button[] = [];  // 如果有多个按钮，可以用数组管理


  /**
   * 创建测试按钮
   */
  public TestButton() {
    // 创建10个圣骑士单位
    const paladins: Unit[] = [];
    for (let i = 0; i < 10; i++) {
      const x = -2000 + i * 200; // 水平排列，间隔200
      const y = 0;
      const paladin = Unit.create(
        Players[0],
        FourCC('Hpal'), // 圣骑士单位ID
        x,
        y,
        270 // 面向角度
      );

      if (paladin) {
        paladins.push(paladin);
        Console.log(`Created Paladin ${i + 1} at (${x}, ${y})`);
      }
    }


  }

  /**
   * 清理函数 - 热重载时调用
   * 在这里销毁所有需要清理的资源
   */
  public cleanup(): void {
    Console.log("TemplateUI: Cleanup called, destroying resources...");

    // 销毁单个按钮
    if (this.testButton) {
      this.testButton.destroy();
      this.testButton = null;
      Console.log("TemplateUI: testButton destroyed");
    }

    // 销毁按钮数组中的所有按钮
    for (const btn of this.buttons) {
      btn.destroy();
    }
    this.buttons = [];

    Console.log("TemplateUI: All resources cleaned up");
  }

  /**
   * 初始化函数
   */
  public initialize(): void {
    Console.log("TemplateUI: Initializing...");
    this.TestButton();
    print("TemplateUI initialized");
  }

  /**
   * 热重载处理函数
   */
  public static onHotReload(): void {
    Console.log("TemplateUI hot reloaded!");
  }
}

// ========================================
// 模块注册 - 关键：保持实例在热重载之间存活
// ========================================

// 全局实例 - 在模块级别保存，热重载时会被重用
let templateUIInstance: TemplateUI | null = null;

print(">>> TemplateUI: Module file loaded, about to register...");
const manager = ModuleManager.getInstance();
print(`>>> TemplateUI: Got ModuleManager instance`);

// 只需传递类，ModuleManager 会自动从 ClassName.name 获取模块名
manager.registerModule(TemplateUI, {
  initialize: () => {
    print(">>> TemplateUI: Initialize callback called");
    if (!templateUIInstance) {
      templateUIInstance = new TemplateUI();
    }
    templateUIInstance.initialize();
  },
  cleanup: () => {
    print(">>> TemplateUI: Cleanup callback called");
    if (templateUIInstance) {
      templateUIInstance.cleanup();
    }
  },
  onHotReload: () => {
    print(">>> TemplateUI: onHotReload callback called");
    TemplateUI.onHotReload();
  }
});
print(">>> TemplateUI: Module registration completed");

export { TemplateUI };
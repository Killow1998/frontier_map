import { ModuleManager } from "../system/ModuleManager";
import { Console } from "../system/console";
import { Button, ButtonTextures } from 'src/system/ui/component/Buttom';

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
    // 创建按钮并保存引用
    // this.testButton = Button.createCentered("Centered Button", "LARGE");
    // this.testButton.setTexture(ButtonTextures.BLACK_TRANSPARENT);
    // this.testButton.setOnClick(() => {
    //   Console.log("按钮点击了！！！123");
    // });
    
    // Console.log("TemplateUI: Button created and saved to instance");

    // print("TemplateUI: TestButton created");
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

manager.registerModule("TemplateUI", TemplateUI, {
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
      // 先清理资源
      templateUIInstance.cleanup();
      // 注意：这里不要设置为 null，保持实例以便下次热重载时复用
      // 如果想完全重建实例，则设置为 null
      // templateUIInstance = null;
    }
  },
  onHotReload: () => {
    print(">>> TemplateUI: onHotReload callback called");
    TemplateUI.onHotReload();
  },
  dependencies: []
});
print(">>> TemplateUI: Module registration completed");

export { TemplateUI };
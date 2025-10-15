import { Frame, FRAME_ALIGN_CENTER, Players, Unit } from "@eiriksgata/wc3ts/*";
import { ModuleManager } from "../ModuleManager";
import { FourCC } from "src/utils/helper";
import { Actor } from "../actor";
import { Console } from "../console";

let button: Frame | null = null;
let unit: Unit | null = null;
class TemplateUI {


  public TestButton() {
    const btn = Frame.createType("TestButton", Frame.fromHandle(DzGetGameUI())!, 0, "BUTTON", "");
    if (btn) {
      btn.setTexture("hpbar\\02.tga", 0, false);
      btn.setSize(0.06, 0.03);
      btn.setPoint(FRAME_ALIGN_CENTER, Frame.fromHandle(DzGetGameUI())!, FRAME_ALIGN_CENTER, 0.5, 0.5);
      btn.setText("测试按钮 v2.0");
      button = btn;
    }
    unit = Actor.create(Players[0], FourCC('Hpal'), 0, 0, 0)!;
    Console.log(`Created unit in TemplateUI: ${unit.name}`);

    return btn;
  }

  /**
   * 清理函数 - 热重载时调用
   */
  public cleanup(): void {
    if (button) {
      button.destroy();
      button = null;
      unit?.destroy();
      print("TemplateUI cleaned up");
    }
  }

  /**
   * 初始化函数
   */
  public initialize(): void {
    this.TestButton();
    print("TemplateUI initialized");
  }

  /**
   * 热重载处理函数
   */
  public static onHotReload(): void {
    print("TemplateUI hot reloaded!");
    // 可以在这里添加特殊的热重载逻辑
  }
}

// 创建全局实例
let templateUIInstance: TemplateUI | null = null;

// 注册模块到 ModuleManager
print(">>> TemplateUI: About to register module...");
ModuleManager.getInstance().registerModule("TemplateUI", TemplateUI, {
  initialize: () => {
    if (!templateUIInstance) {
      templateUIInstance = new TemplateUI();
    }
    templateUIInstance.initialize();
  },
  cleanup: () => {
    if (templateUIInstance) {
      templateUIInstance.cleanup();
      templateUIInstance = null;
    }
  },
  onHotReload: () => TemplateUI.onHotReload(),
  dependencies: [] // 这个模块没有依赖
});
print(">>> TemplateUI: Module registration completed");

export { TemplateUI };
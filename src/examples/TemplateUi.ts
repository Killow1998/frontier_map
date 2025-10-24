import { Frame, FRAME_ALIGN_CENTER, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from '@eiriksgata/wc3ts/*';
import { ModuleManager } from "../system/ModuleManager";
import { Console } from "../system/console";
import { FrameEventUtils } from "../constants/frame";

/**
 * 热更新模板
 */
class TemplateUI {


  public TestButton() {
    // // Console.log("TemplateUI: Button created!");
    // const backdropFrame = Frame.createType("BackdropButton01", Frame.fromHandle(DzGetGameUI())!, 0, 'BACKDROP', "")!
    //   .setAbsPoint(FRAME_ALIGN_LEFT_TOP, 0.250000, 0.350000)
    //   .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, 0.350000, 0.250000)
    //   .setTexture("UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp", 0, true);

    // const textFrame = Frame.createType("TEXT", backdropFrame, 0, "TEXT", "")!
    //   .setAllPoints(backdropFrame)
    //   .setText("新常量结构测试")
    //   .setTextAlignment(50, 0);

    // const frame = Frame.createType("btn", backdropFrame, 3, "BUTTON", "template")!
    //   .setAllPoints(backdropFrame);

    // // 使用Frame事件工具类绑定事件
    // FrameEventUtils.bindEvents(frame, {
    //   onClick: () => {
    //     Console.log("TemplateUI: 按钮被点击了!");
    //   },
    //   onMouseEnter: () => {
    //     Console.log("TemplateUI: 鼠标进入按钮区域");
    //     // 可以在这里改变按钮的视觉效果
    //   },
    //   onMouseLeave: () => {
    //     Console.log("TemplateUI: 鼠标离开按钮区域");
    //     // 可以在这里恢复按钮的视觉效果
    //   }
    // });

    Frame.createType("name", Frame.fromHandle(DzGetGameUI())!, 0, "BACKDROP", "Demo_SizeBack")!
      .setAbsPoint(FRAME_ALIGN_CENTER, 0.5, 0.5)
    //.setPoint(FRAME_ALIGN_CENTER, Frame.fromHandle(DzGetGameUI())!, FRAME_ALIGN_CENTER, 0, 0);





  }

  /**
   * 清理函数 - 热重载时调用
   */
  public cleanup(): void {
    Console.log("TemplateUI: Cleanup called, destroying button if exists.");

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
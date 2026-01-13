import { Text, TextColors } from "src/system/ui/component/Text";
import { ModuleManager } from "../system/ModuleManager";
import { HotReloadHelper } from "src/system/ui/UIComponent";
import { Dialog } from "src/system/ui/component/Dialog";
import { DamageTextExample } from "./DamageTextExample";
import { Actor } from "src/system/actor";
import { EVENT_PLAYER_UNIT_TRAIN_CANCEL, Frame, FRAMEPOINT_CENTER, Players, Timer, Trigger, Unit } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import { GameEventManager, PlayerUnitEventId } from "src/system/event/GameEvent";
import { DamageTextManager } from "src/system/ui/DamageTexttag";
import { MessageList } from "src/system/ui/component/MessageList";
import { Button } from "src/system/ui/component/Button";
import { Console } from "src/system/console";
import { Tips, TipsAnimation, TipsPosition } from "src/system/ui/component/Tips";
import { runTipsExamples } from "./TipsExample";
import { ScreenCoordinates } from "src/system/ui/ScreenCoordinates";
import { UILayout } from "src/system/ui/UILayout";

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
    const gameUI = Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0)!;

    const gameUIConsole = Frame.createType("gameUIConsole", gameUI, 0, "BACKDROP", "")!;

    gameUIConsole.setTexture("map\\resource\\Console\\console.blp", 0, true);

    // ========================================
    // 使用 UILayout 预设方法 - 简单快捷！
    // ========================================
    const imageWidth = 910;   // 图片像素宽度
    const imageHeight = 245;  // 图片像素高度

    // 方式1：一行代码居中并设置尺寸
    UILayout.setFrame(gameUIConsole, 'BOTTOM_CENTER', imageWidth, imageHeight);

    // 方式2：分别设置（如果需要）
    // UILayout.setFramePosition(gameUIConsole, 'CENTER');
    // UILayout.setFrameSize(gameUIConsole, imageWidth, imageHeight);

    // 方式3：设置完整矩形区域
    // UILayout.setFrameRect(gameUIConsole, { x: 100, y: 100, width: imageWidth, height: imageHeight });

    print(`图片尺寸: ${imageWidth}x${imageHeight} 像素，已居中显示`);

    this.ui.register(gameUIConsole);
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
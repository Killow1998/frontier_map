import { Button, ButtonTextures } from "src/system/ui/component/Button";


/**
 * Button使用示例
 * 演示三层结构按钮的创建和使用
 */
export class ButtonExample {
  private testButton: Button | null = null;
  private centerButton: Button | null = null;

  public initialize(): void {
    print("ButtonExample: 初始化按钮示例");

    // 方法1: 使用像素坐标创建按钮
    this.testButton = new Button("测试按钮", 400, 300, 100, 36);
    
    // 配置按钮
    this.testButton
      .setTextColor("FFCC00") // 金色文字
      .setTexturePreset("HUMAN_BACKGROUND") // 使用预设背景
      .setOnClick(() => {
        print("测试按钮被点击了!");
      })
      .setOnHover(() => {
        print("鼠标进入测试按钮");
      })
      .setOnLeave(() => {
        print("鼠标离开测试按钮");
      })
      .addHoverEffect(); // 添加悬停透明度效果

    // 创建按钮(显示在界面上)
    this.testButton.create();

    // 方法2: 使用预设位置在屏幕中心创建按钮（推荐）
    this.centerButton = Button.createCentered("屏幕中心按钮", "LARGE");
    this.centerButton
      .setTextColor("00FF00") // 绿色文字
      .setBackground(ButtonTextures.DIALOG_BACKGROUND) // 设置对话框背景
      .setOnClick(() => {
        print("中心按钮被点击!");
      });
    this.centerButton.create();

    print("ButtonExample: 按钮已创建");
  }

  public cleanup(): void {
    if (this.testButton) {
      this.testButton.destroy();
      this.testButton = null;
    }
    if (this.centerButton) {
      this.centerButton.destroy();
      this.centerButton = null;
    }
    print("ButtonExample: 清理完成");
  }
}

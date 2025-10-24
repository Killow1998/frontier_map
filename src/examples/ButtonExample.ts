import { Button } from "src/system/ui/component/Buttom";
import { Console } from "src/system/console";

/**
 * Button使用示例
 * 演示三层结构按钮的创建和使用
 */
export class ButtonExample {
  private testButton: Button | null = null;

  public initialize(): void {
    Console.log("ButtonExample: 初始化按钮示例");

    // 创建一个简单的按钮
    this.testButton = new Button("测试按钮", 400, 300, 100, 36);
    
    // 配置按钮
    this.testButton
      .setTextColor("FFCC00") // 金色文字
      .setOnClick(() => {
        Console.log("按钮被点击了!");
      })
      .setOnHover(() => {
        Console.log("鼠标进入按钮");
      })
      .setOnLeave(() => {
        Console.log("鼠标离开按钮");
      })
      .addHoverEffect(); // 添加悬停透明度效果

    // 创建按钮(显示在界面上)
    this.testButton.create();

    Console.log("ButtonExample: 按钮已创建");
  }

  public cleanup(): void {
    if (this.testButton) {
      this.testButton.destroy();
      this.testButton = null;
    }
    Console.log("ButtonExample: 清理完成");
  }
}

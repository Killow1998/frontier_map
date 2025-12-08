/** @noSelfInFile */

import { Button, ButtonTextures } from "../system/ui/component/Button";
import { Console } from "../system/console";
import { FontSizes, TextColors } from "../system/ui/component/Text";

/**
 * 测试重构后的 Button 组件（使用 Text 组件）
 */
export function testButtonWithTextComponent(): void {
  Console.log("=== Button with Text Component Test ===");

  // 测试 1: 基本按钮创建（Text 组件自动创建）
  const btn1 = Button.createCentered("重构测试", "MEDIUM");
  btn1.setOnClick(() => {
    Console.log("按钮被点击！");
  });
  Console.log("✓ 创建了使用 Text 组件的按钮");

  // 测试 2: 使用 Text 组件的字体功能
  const btn2 = Button.createWithPreset("大字体按钮", 100, 200, "LARGE");
  btn2
    .setFontSizePixels(18)  // 使用像素设置字体大小
    .setTextColor(TextColors.GOLD)
    .centerText()  // 文本居中
    .configure({
      texture: ButtonTextures.HUMAN_BORDER,
      onClick: () => Console.log("大字体按钮点击")
    });
  Console.log("✓ 设置了字体大小和颜色");

  // 测试 3: 使用 Text 组件的内边距功能
  const btn3 = Button.createAtPresetPosition(
    "有内边距的按钮",
    "TOP_CENTER",
    "MEDIUM"
  );
  btn3
    .setTextPadding(10)  // 设置 10 像素内边距
    .setTextColor(TextColors.CYAN)
    .setOnClick(() => Console.log("内边距按钮点击"));
  Console.log("✓ 设置了文本内边距");

  // 测试 4: 使用 Text 组件的对齐功能
  const btn4 = new Button("左对齐文本", 100, 400, 200, 50);
  btn4.create();
  btn4
    .alignTextLeft()  // 文本左对齐
    .setTextPaddingTRBL(5, 15, 5, 15)  // 上下5px，左右15px
    .setTextColor(TextColors.ORANGE);
  Console.log("✓ 设置了文本对齐方式");

  // 测试 5: 动态更新文本样式
  const btn5 = Button.createCentered("动态样式", "MEDIUM");
  btn5.configure({
    textColor: TextColors.GREEN,
    fontSize: FontSizes.LARGE,
    padding: 8,
    onClick: () => {
      // 点击时改变颜色
      btn5.setTextColor(TextColors.RED);
      Console.log("文本颜色已改变");
    }
  });
  Console.log("✓ 配置了动态样式");

  // 测试 6: 获取 Text 组件进行高级操作
  const btn6 = Button.createAtPresetPosition("高级操作", "BOTTOM_CENTER", "LARGE");
  const textComponent = btn6.getTextComponent();
  if (textComponent) {
    // 直接操作 Text 组件
    textComponent
      .setColor(TextColors.PURPLE)
      .setPaddingVH(10, 20)  // 垂直10px，水平20px
      .setFontSizePixels(16);
    Console.log("✓ 直接访问和操作 Text 组件");
  }

  // 测试 7: 悬停效果与文本组合
  const btn7 = Button.createCentered("悬停效果", "MEDIUM");
  btn7
    .addHoverEffect(180, 255)  // 背景透明度变化
    .setTextColor(TextColors.WHITE)
    .centerText()
    .setOnHover(() => {
      // 悬停时文本变黄
      btn7.setTextColor(TextColors.YELLOW);
    })
    .setOnLeave(() => {
      // 离开时恢复白色
      btn7.setTextColor(TextColors.WHITE);
    });
  Console.log("✓ 设置了悬停效果");

  // 测试 8: 拖拽功能与 Text 组件
  const btn8 = new Button("可拖拽按钮", 400, 300, 150, 50);
  btn8.create();
  btn8
    .enableDrag({
      onDragStart: () => {
        btn8.setTextColor(TextColors.RED);
        Console.log("开始拖拽");
      },
      onDragEnd: (x, y) => {
        btn8.setTextColor(TextColors.GREEN);
        Console.log(`拖拽结束: (${x}, ${y})`);
      }
    })
    .centerText();
  Console.log("✓ 启用了拖拽功能");

  // 测试 9: 完整配置示例
  const btn9 = Button.createCentered("完整配置", "LARGE");
  btn9.configure({
    text: "完整配置按钮",
    textColor: TextColors.GOLD,
    texture: ButtonTextures.QUEST_BACKGROUND,
    fontSize: FontSizes.XLARGE,
    padding: 12,
    enabled: true,
    visible: true,
    onClick: () => Console.log("完整配置按钮被点击"),
    onHover: () => btn9.setTextColor(TextColors.SILVER),
    onLeave: () => btn9.setTextColor(TextColors.GOLD)
  });
  Console.log("✓ 完成完整配置");

  Console.log("=== Button with Text Component Test Complete ===");
  Console.log("重构成功！Button 现在使用 Text 组件来管理文本显示");
}

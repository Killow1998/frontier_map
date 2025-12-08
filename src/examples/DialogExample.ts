/** @noSelfInFile */

import { Dialog } from "../system/ui/component/Dialog";
import { Console } from "../system/console";
import { TextColors } from "../system/ui/component/Text";

/**
 * Dialog 组件使用示例
 */
export function runDialogExamples(): void {
  Console.log("=== Dialog Component Examples ===");


  // ==================== 示例 1: 基本对话框 ====================
  // example1_BasicDialog();

  // ==================== 示例 2: 确认对话框 ====================
  // example2_ConfirmDialog();

  // ==================== 示例 3: 选择对话框 ====================
  // example3_ChoiceDialog();

  // ==================== 示例 4: 自定义样式对话框 ====================
  // example4_CustomDialog();

  // ==================== 示例 5: 动态添加按钮 ====================
  // example5_DynamicButtons();

  Console.log("=== Dialog Examples Complete ===");
}

/**
 * 示例 1: 基本对话框
 */
/* function example1_BasicDialog(): void {
  Console.log("\n--- Example 1: Basic Dialog ---");

  const dialog = new Dialog("选择难度", 500, 300);
  dialog.create();

  // 添加按钮
  dialog.addButton({
    text: "简单",
    onClick: () => {
      Console.log("选择了简单难度");
      dialog.hide();
    },
    color: TextColors.GREEN
  });

  dialog.addButton({
    text: "普通",
    onClick: () => {
      Console.log("选择了普通难度");
      dialog.hide();
    },
    color: TextColors.YELLOW
  });

  dialog.addButton({
    text: "困难",
    onClick: () => {
      Console.log("选择了困难难度");
      dialog.hide();
    },
    color: TextColors.RED
  });

  // 默认隐藏，等待显示
  dialog.hide();

  Console.log("✓ 创建了基本对话框");
  Console.log("  提示: 调用 dialog.show() 显示对话框");
} */

/**
 * 示例 2: 确认对话框
 */
/* function example2_ConfirmDialog(): void {
  Console.log("\n--- Example 2: Confirm Dialog ---");

  const confirmDialog = Dialog.createConfirm(
    "确认操作",
    "你确定要继续吗？",
    () => {
      Console.log('用户点击了"是"');
      // 执行确认操作
    },
    () => {
      Console.log('用户点击了"否"');
      // 取消操作
    }
  );

  confirmDialog.hide(); // 默认隐藏

  Console.log("✓ 创建了确认对话框");
} */

/**
 * 示例 3: 选择对话框
 */
/* function example3_ChoiceDialog(): void {
  Console.log("\n--- Example 3: Choice Dialog ---");

  const options = ["战士", "法师", "刺客", "牧师", "猎人"];

  const choiceDialog = Dialog.createChoice(
    "选择职业",
    options,
    (index) => {
      Console.log("选择了: " + options[index] + " (索引 " + index + ")");
      // 根据选择执行相应逻辑
    }
  );

  choiceDialog.hide();

  Console.log("✓ 创建了选择对话框，包含 " + options.length + " 个选项");
} */

/**
 * 示例 4: 自定义样式对话框
 */
/* function example4_CustomDialog(): void {
  Console.log("\n--- Example 4: Custom Styled Dialog ---");

  const customDialog = new Dialog("设置", 450, 400);
  customDialog.create();

  // 自定义样式
  customDialog.configure({
    titleColor: TextColors.CYAN,
    background: "UI\\Widgets\\Glues\\GlueScreen-DialogBackground.blp",
    alpha: 250,
    buttonStartY: 60,
    buttonSpacing: 70,
    buttonHeight: 55,
    buttonWidthRatio: 0.7
  });

  // 添加设置项按钮
  customDialog.addButton({
    text: "音效设置",
    onClick: () => {
      Console.log("打开音效设置");
    },
    color: TextColors.WHITE
  });

  customDialog.addButton({
    text: "画面设置",
    onClick: () => {
      Console.log("打开画面设置");
    },
    color: TextColors.WHITE
  });

  customDialog.addButton({
    text: "控制设置",
    onClick: () => {
      Console.log("打开控制设置");
    },
    color: TextColors.WHITE
  });

  customDialog.addButton({
    text: "返回",
    onClick: () => {
      Console.log("关闭设置");
      customDialog.hide();
    },
    color: TextColors.ORANGE
  });

  customDialog.hide();

  Console.log("✓ 创建了自定义样式对话框");
} */

/**
 * 示例 5: 动态添加/移除按钮
 */
/* function example5_DynamicButtons(): void {
  Console.log("\n--- Example 5: Dynamic Buttons ---");

  const dynamicDialog = new Dialog("动态按钮", 500, 400);
  dynamicDialog.create();

  let buttonCount = 0;

  // 添加"添加按钮"按钮
  dynamicDialog.addButton({
    text: "添加按钮",
    onClick: () => {
      buttonCount++;
      dynamicDialog.addButton({
        text: "按钮 " + buttonCount,
        onClick: () => {
          Console.log("点击了按钮 " + buttonCount);
        },
        color: TextColors.CYAN
      });
      Console.log("添加了按钮 " + buttonCount);
    },
    color: TextColors.GREEN
  });

  // 添加"移除最后按钮"按钮
  dynamicDialog.addButton({
    text: "移除最后按钮",
    onClick: () => {
      const buttons = dynamicDialog.getButtons();
      if (buttons.length > 2) { // 保留前两个控制按钮
        dynamicDialog.removeButton(buttons.length - 1);
        Console.log("移除了最后一个按钮");
      } else {
        Console.log("没有可移除的按钮");
      }
    },
    color: TextColors.RED
  });

  dynamicDialog.hide();

  Console.log("✓ 创建了动态按钮对话框");
  Console.log("  提示: 可以动态添加和移除按钮");
} */

/**
 * 完整示例：游戏菜单
 */
export function createGameMenuDialog(): Dialog {
  Console.log("\n=== Creating Game Menu Dialog ===");

  const menuDialog = Dialog.createCentered("游戏菜单", 450, 450);

  menuDialog.configure({
    titleColor: TextColors.GOLD,
    alpha: 240,
    buttonSpacing: 65
  });

  // 继续游戏
  menuDialog.addButton({
    text: "继续游戏",
    onClick: () => {
      Console.log("继续游戏");
      menuDialog.hide();
    },
    color: TextColors.GREEN
  });

  // 保存游戏
  menuDialog.addButton({
    text: "保存游戏",
    onClick: () => {
      Console.log("保存游戏");
      // 显示保存对话框
    },
    color: TextColors.CYAN
  });

  // 读取存档
  menuDialog.addButton({
    text: "读取存档",
    onClick: () => {
      Console.log("读取存档");
      // 显示读取对话框
    },
    color: TextColors.CYAN
  });

  // 设置
  menuDialog.addButton({
    text: "设置",
    onClick: () => {
      Console.log("打开设置");
      // 显示设置对话框
    },
    color: TextColors.WHITE
  });

  // 退出游戏
  menuDialog.addButton({
    text: "退出游戏",
    onClick: () => {
      Console.log("退出游戏");
      // 显示退出确认对话框
      const exitConfirm = Dialog.createConfirm(
        "退出确认",
        "确定要退出游戏吗？",
        () => {
          Console.log("退出游戏确认");
          // 执行退出逻辑
        }
      );
      exitConfirm.show();
    },
    color: TextColors.RED
  });

  menuDialog.hide();

  Console.log("✓ 游戏菜单对话框创建完成");

  return menuDialog;
}

/**
 * 快速开始 - 最简单的用法
 */
export function quickStartDialog(): void {
  Console.log("\n=== Quick Start: Dialog ===");

  // 方式 1: 基本对话框
  const dialog1 = new Dialog("标题", 500, 300);
  dialog1.create();
  dialog1.addButton({
    text: "确定",
    onClick: () => dialog1.hide()
  });

  // 方式 2: 确认对话框
  Dialog.createConfirm(
    "确认",
    "确定要执行此操作吗？",
    () => Console.log("确认")
  );

  // 方式 3: 选择对话框
  Dialog.createChoice(
    "选择",
    ["选项1", "选项2", "选项3"],
    (index) => Console.log("选择了选项" + (index + 1))
  );

  Console.log("✓ 快速开始示例完成");
}

import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { Console } from "src/system/console";

/**
 * 文本对齐方式
 */
export const TextAlign = {
  /** 左对齐 */
  LEFT: 0,
  /** 居中对齐 */
  CENTER: 50,
  /** 右对齐 */
  RIGHT: 100,
} as const;

/**
 * 垂直对齐方式
 */
export const VerticalAlign = {
  /** 顶部对齐 */
  TOP: 0,
  /** 垂直居中 */
  MIDDLE: 50,
  /** 底部对齐 */
  BOTTOM: 100,
} as const;

/**
 * 常用背景纹理预设
 */
export const TextBackgrounds = {
  /** 无背景（透明） */
  NONE: "",
  /** 黑色半透明 */
  BLACK_TRANSPARENT: "UI\\Widgets\\EscMenu\\Human\\editbox-background.blp",
  /** 工具提示背景 */
  TOOLTIP: "UI\\Widgets\\ToolTips\\Human\\human-tooltip-background.blp",
  /** 对话框背景 */
  DIALOG: "UI\\Widgets\\Glues\\GlueScreen-DialogBackground.blp",
  /** 人族边框 */
  HUMAN_BORDER: "UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp",
  /** 任务背景 */
  QUEST: "UI\\Widgets\\Quests\\QuestMainBackdrop.blp",
} as const;

/**
 * 预设颜色
 */
export const TextColors = {
  /** 白色 */
  WHITE: "FFFFFF",
  /** 黑色 */
  BLACK: "000000",
  /** 红色 */
  RED: "FF0000",
  /** 绿色 */
  GREEN: "00FF00",
  /** 蓝色 */
  BLUE: "0000FF",
  /** 黄色 */
  YELLOW: "FFFF00",
  /** 橙色 */
  ORANGE: "FFA500",
  /** 紫色 */
  PURPLE: "800080",
  /** 青色 */
  CYAN: "00FFFF",
  /** 粉色 */
  PINK: "FFC0CB",
  /** 金色 */
  GOLD: "FFD700",
  /** 银色 */
  SILVER: "C0C0C0",
  /** 灰色 */
  GRAY: "808080",
} as const;

/**
 * 尺寸预设
 */
export const TextSizes = {
  /** 小文本 */
  SMALL: { width: 100, height: 20 },
  /** 中等文本 */
  MEDIUM: { width: 200, height: 30 },
  /** 大文本 */
  LARGE: { width: 300, height: 40 },
  /** 标题 */
  TITLE: { width: 400, height: 50 },
  /** 自适应（需要手动设置） */
  AUTO: { width: 0, height: 0 },
} as const;

/**
 * 字体预设
 */
export const TextFonts = {
  /** 默认字体（不设置） */
  DEFAULT: "",
  /** 自定义字体示例 */
  CUSTOM: "UI\\hpbar\\ZiTi.ttf",
  /** 主字体 */
  MASTER: "Fonts\\FZXH1JW.TTF",
} as const;

/**
 * 字体大小预设（WC3坐标系）
 */
export const FontSizes = {
  /** 微小 (8px) */
  TINY: 0.008,
  /** 小 (10px) */
  SMALL: 0.010,
  /** 中等 (12px) */
  MEDIUM: 0.012,
  /** 大 (14px) */
  LARGE: 0.014,
  /** 超大 (16px) */
  XLARGE: 0.016,
  /** 标题 (20px) */
  TITLE: 0.020,
  /** 巨大 (24px) */
  HUGE: 0.024,
} as const;

/**
 * Text类 - 文本显示组件
 * 包含: 背景框架(Backdrop，可选) + 文本框架(Text)
 */
export class Text {
  private content: string;
  private pixelX: number;
  private pixelY: number;
  private pixelWidth: number;
  private pixelHeight: number;
  
  private backdropFrame: Frame | null = null;
  private textFrame: Frame | null = null;
  
  private isVisible: boolean = true;
  
  private background: string = TextBackgrounds.NONE;
  private showBackground: boolean = false;
  private backdropPadding: number = 5; // 背景内边距（像素）
  
  private textColor: string = TextColors.WHITE;
  private horizontalAlign: number = TextAlign.LEFT;
  private verticalAlign: number = VerticalAlign.TOP;
  
  // 字体相关
  private fontPath: string = "";  // 空字符串表示使用默认字体
  private fontSize: number = FontSizes.MEDIUM;  // WC3坐标系字体大小
  private fontFlags: number = 0;  // 字体标志
  
  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;
  
  // 自适应相关
  private autoWidth: boolean = false;
  private autoHeight: boolean = false;
  private minWidth: number = 50;
  private minHeight: number = 20;
  private maxWidth: number = 800;
  private maxHeight: number = 600;
  
  // 字符宽度估算（像素）
  private static readonly CHAR_WIDTH = 10;
  private static readonly LINE_HEIGHT = 18;

  constructor(
    content: string,
    x: number,
    y: number,
    width: number = 200,
    height: number = 30,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ) {
    this.content = content;
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = origin;
  }

  // ==================== 静态工厂方法 ====================

  /**
   * 使用尺寸预设创建文本（自动调用create）
   */
  public static createWithPreset(
    content: string,
    x: number,
    y: number,
    sizePreset: keyof typeof TextSizes = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Text {
    const size = TextSizes[sizePreset];
    const text = new Text(content, x, y, size.width, size.height, origin);
    if (sizePreset === 'AUTO') {
      text.setAutoSize(true, true);
    }
    text.create(parent);
    return text;
  }

  /**
   * 在预设位置创建文本（自动调用create）
   */
  public static createAtPresetPosition(
    content: string,
    positionPreset: string,
    sizePreset: keyof typeof TextSizes = 'MEDIUM',
    centered: boolean = true,
    parent?: Frame
  ): Text {
    const position = ScreenCoordinates.getPresetPosition(positionPreset);
    const size = TextSizes[sizePreset];
    
    let x = position.x;
    let y = position.y;
    
    if (centered && sizePreset !== 'AUTO') {
      x = position.x - size.width / 2;
      y = position.y - size.height / 2;
    }
    
    const text = new Text(content, x, y, size.width, size.height);
    if (sizePreset === 'AUTO') {
      text.setAutoSize(true, true);
    }
    text.create(parent);
    return text;
  }

  /**
   * 在屏幕中心创建文本（便捷方法）
   */
  public static createCentered(
    content: string,
    sizePreset: keyof typeof TextSizes = 'MEDIUM',
    parent?: Frame
  ): Text {
    return Text.createAtPresetPosition(content, 'CENTER', sizePreset, true, parent);
  }

  /**
   * 创建带背景的文本
   */
  public static createWithBackground(
    content: string,
    x: number,
    y: number,
    width: number = 200,
    height: number = 30,
    background: string = TextBackgrounds.BLACK_TRANSPARENT,
    parent?: Frame
  ): Text {
    const text = new Text(content, x, y, width, height);
    text.setBackground(background);
    text.create(parent);
    return text;
  }

  // ==================== 核心方法 ====================

  public create(parent?: Frame): void {
    if (this.textFrame) {
      Console.log("Text already created");
      return;
    }

    const parentFrame = parent || Frame.fromHandle(DzGetGameUI())!;

    // 如果启用自适应，先计算尺寸
    if (this.autoWidth || this.autoHeight) {
      this.calculateAutoSize();
    }

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    // 如果需要背景，先创建背景框架
    if (this.showBackground && this.background !== "") {
      const paddingWC3 = (this.backdropPadding / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      
      this.backdropFrame = Frame.createType("BACKDROP", parentFrame, 0, 'BACKDROP', "")!;
      if (this.backdropFrame) {
        this.backdropFrame
          .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x - paddingWC3, wc3Pos.y + paddingWC3)
          .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX + paddingWC3, bottomY - paddingWC3)
          .setTexture(this.background, 0, true);
      }
    }

    // 创建文本框架
    const textParent = this.backdropFrame || parentFrame;
    this.textFrame = Frame.createType("TEXT", textParent, 0, "TEXT", "")!;
    
    if (!this.textFrame) {
      Console.log("Error: Failed to create text frame");
      return;
    }

    this.textFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
      .setText(this.getFormattedText())
      .setTextAlignment(this.horizontalAlign, this.verticalAlign);

    // 应用字体设置
    if (this.fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }

    this.setVisible(this.isVisible);

    Console.log("Text created: \"" + this.content.substring(0, 20) + (this.content.length > 20 ? "..." : "") + "\"");
  }

  // ==================== 文本内容 ====================

  /**
   * 设置文本内容
   */
  public setText(content: string): Text {
    this.content = content;
    if (this.textFrame) {
      // 如果启用自适应，重新计算尺寸
      if (this.autoWidth || this.autoHeight) {
        this.calculateAutoSize();
        this.updateFramePositions();
      }
      this.textFrame.setText(this.getFormattedText());
    }
    return this;
  }

  /**
   * 获取文本内容
   */
  public getText(): string {
    return this.content;
  }

  /**
   * 追加文本
   */
  public appendText(text: string): Text {
    return this.setText(this.content + text);
  }

  /**
   * 清空文本
   */
  public clearText(): Text {
    return this.setText("");
  }

  // ==================== 颜色设置 ====================

  /**
   * 设置文本颜色（十六进制）
   * @param hexColor 十六进制颜色，如 "FF0000"
   */
  public setColor(hexColor: string): Text {
    this.textColor = hexColor;
    if (this.textFrame) {
      this.textFrame.setText(this.getFormattedText());
    }
    return this;
  }

  /**
   * 使用预设颜色
   */
  public setColorPreset(preset: keyof typeof TextColors): Text {
    return this.setColor(TextColors[preset]);
  }

  /**
   * 设置RGB颜色
   */
  public setColorRGB(r: number, g: number, b: number): Text {
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return this.setColor(toHex(r) + toHex(g) + toHex(b));
  }

  /**
   * 获取当前颜色
   */
  public getColor(): string {
    return this.textColor;
  }

  // ==================== 字体设置 ====================

  /**
   * 设置字体
   * @param fontPath 字体文件路径（如 "Fonts\\FZXH1JW.TTF" 或 "UI\\hpbar\\ZiTi.ttf"）
   * @param fontSize 字体大小（WC3坐标系，如 0.012）
   * @param flags 字体标志（默认0）
   */
  public setFont(fontPath: string, fontSize?: number, flags?: number): Text {
    this.fontPath = fontPath;
    if (fontSize !== undefined) {
      this.fontSize = fontSize;
    }
    if (flags !== undefined) {
      this.fontFlags = flags;
    }
    
    if (this.textFrame && fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }
    return this;
  }

  /**
   * 使用预设字体
   * @param preset 字体预设
   * @param size 字体大小预设（可选）
   */
  public setFontPreset(preset: keyof typeof TextFonts, size?: keyof typeof FontSizes): Text {
    this.fontPath = TextFonts[preset];
    if (size !== undefined) {
      this.fontSize = FontSizes[size];
    }
    
    if (this.textFrame && this.fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }
    return this;
  }

  /**
   * 设置字体大小
   * @param size WC3坐标系字体大小（如 0.012）
   */
  public setFontSize(size: number): Text {
    this.fontSize = size;
    if (this.textFrame && this.fontPath !== "") {
      this.textFrame.setFont(this.fontPath, this.fontSize, this.fontFlags);
    }
    return this;
  }

  /**
   * 使用预设字体大小
   * @param preset 字体大小预设
   */
  public setFontSizePreset(preset: keyof typeof FontSizes): Text {
    return this.setFontSize(FontSizes[preset]);
  }

  /**
   * 设置字体大小（像素值，自动转换为WC3坐标系）
   * @param pixelSize 像素大小（如 12, 14, 16）
   */
  public setFontSizePixels(pixelSize: number): Text {
    // 将像素大小转换为WC3坐标系大小
    // 基于标准 1080 高度，WC3 高度 0.6
    const wc3Size = (pixelSize / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    return this.setFontSize(wc3Size);
  }

  /**
   * 获取当前字体路径
   */
  public getFontPath(): string {
    return this.fontPath;
  }

  /**
   * 获取当前字体大小
   */
  public getFontSize(): number {
    return this.fontSize;
  }

  // ==================== 对齐设置 ====================

  /**
   * 设置水平对齐方式
   * @param align 0=左对齐, 50=居中, 100=右对齐
   */
  public setHorizontalAlign(align: number): Text {
    this.horizontalAlign = align;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(this.horizontalAlign, this.verticalAlign);
    }
    return this;
  }

  /**
   * 设置垂直对齐方式
   * @param align 0=顶部, 50=居中, 100=底部
   */
  public setVerticalAlign(align: number): Text {
    this.verticalAlign = align;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(this.horizontalAlign, this.verticalAlign);
    }
    return this;
  }

  /**
   * 同时设置水平和垂直对齐
   */
  public setAlignment(horizontal: number, vertical: number): Text {
    this.horizontalAlign = horizontal;
    this.verticalAlign = vertical;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(this.horizontalAlign, this.verticalAlign);
    }
    return this;
  }

  /**
   * 使用预设对齐方式
   */
  public setAlignPreset(
    horizontal: keyof typeof TextAlign, 
    vertical: keyof typeof VerticalAlign = 'TOP'
  ): Text {
    return this.setAlignment(TextAlign[horizontal], VerticalAlign[vertical]);
  }

  /**
   * 居中对齐（水平+垂直）
   */
  public center(): Text {
    return this.setAlignment(TextAlign.CENTER, VerticalAlign.MIDDLE);
  }

  /**
   * 左对齐
   */
  public alignLeft(): Text {
    return this.setHorizontalAlign(TextAlign.LEFT);
  }

  /**
   * 右对齐
   */
  public alignRight(): Text {
    return this.setHorizontalAlign(TextAlign.RIGHT);
  }

  // ==================== 背景设置 ====================

  /**
   * 设置背景纹理
   */
  public setBackground(texturePath: string): Text {
    this.background = texturePath;
    this.showBackground = texturePath !== "";
    
    if (this.textFrame && this.showBackground && !this.backdropFrame) {
      // 需要重新创建以添加背景
      this.recreate();
    } else if (this.backdropFrame) {
      if (texturePath === "") {
        this.backdropFrame.setVisible(false);
      } else {
        this.backdropFrame.setTexture(texturePath, 0, true);
        this.backdropFrame.setVisible(true);
      }
    }
    return this;
  }

  /**
   * 使用预设背景
   */
  public setBackgroundPreset(preset: keyof typeof TextBackgrounds): Text {
    return this.setBackground(TextBackgrounds[preset]);
  }

  /**
   * 显示/隐藏背景
   */
  public setShowBackground(show: boolean): Text {
    this.showBackground = show;
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(show);
    }
    return this;
  }

  /**
   * 设置背景内边距
   * @param padding 内边距（像素）
   */
  public setBackdropPadding(padding: number): Text {
    this.backdropPadding = padding;
    if (this.backdropFrame) {
      this.updateFramePositions();
    }
    return this;
  }

  /**
   * 设置背景透明度
   * @param alpha 透明度 (0-255)
   */
  public setBackdropAlpha(alpha: number): Text {
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    return this;
  }

  // ==================== 自适应尺寸 ====================

  /**
   * 启用/禁用自适应尺寸
   * @param autoWidth 自适应宽度
   * @param autoHeight 自适应高度
   */
  public setAutoSize(autoWidth: boolean, autoHeight: boolean = false): Text {
    this.autoWidth = autoWidth;
    this.autoHeight = autoHeight;
    
    if ((autoWidth || autoHeight) && this.textFrame) {
      this.calculateAutoSize();
      this.updateFramePositions();
    }
    return this;
  }

  /**
   * 设置自适应尺寸的限制
   */
  public setAutoSizeLimits(
    minWidth: number, maxWidth: number,
    minHeight: number, maxHeight: number
  ): Text {
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    return this;
  }

  /**
   * 计算自适应尺寸
   */
  private calculateAutoSize(): void {
    // 移除颜色代码来计算实际文本长度
    const plainText = this.content.replace(/\|c[0-9a-fA-F]{8}/g, '').replace(/\|r/g, '');
    const lines = plainText.split('\n');
    
    if (this.autoWidth) {
      // 找出最长的行
      let maxLineLength = 0;
      for (const line of lines) {
        if (line.length > maxLineLength) {
          maxLineLength = line.length;
        }
      }
      const calculatedWidth = maxLineLength * Text.CHAR_WIDTH + this.backdropPadding * 2;
      this.pixelWidth = Math.max(this.minWidth, Math.min(this.maxWidth, calculatedWidth));
    }
    
    if (this.autoHeight) {
      const calculatedHeight = lines.length * Text.LINE_HEIGHT + this.backdropPadding * 2;
      this.pixelHeight = Math.max(this.minHeight, Math.min(this.maxHeight, calculatedHeight));
    }
  }

  // ==================== 位置和尺寸 ====================

  /**
   * 设置位置
   */
  public setPosition(x: number, y: number): Text {
    this.pixelX = x;
    this.pixelY = y;
    this.updateFramePositions();
    return this;
  }

  /**
   * 设置尺寸
   */
  public setSize(width: number, height: number): Text {
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.autoWidth = false;
    this.autoHeight = false;
    this.updateFramePositions();
    return this;
  }

  /**
   * 获取位置
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.pixelX, y: this.pixelY };
  }

  /**
   * 获取尺寸
   */
  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  /**
   * 更新框架位置
   */
  private updateFramePositions(): void {
    if (!this.textFrame) return;

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
    
    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;

    // 更新背景
    if (this.backdropFrame) {
      const paddingWC3 = (this.backdropPadding / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      this.backdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x - paddingWC3, wc3Pos.y + paddingWC3)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX + paddingWC3, bottomY - paddingWC3);
    }

    // 更新文本
    this.textFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
  }

  // ==================== 可见性 ====================

  /**
   * 设置可见性
   */
  public setVisible(visible: boolean): Text {
    this.isVisible = visible;
    if (this.textFrame) {
      this.textFrame.setVisible(visible);
    }
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(visible && this.showBackground);
    }
    return this;
  }

  /**
   * 获取可见性
   */
  public getVisible(): boolean {
    return this.isVisible;
  }

  /**
   * 显示
   */
  public show(): Text {
    return this.setVisible(true);
  }

  /**
   * 隐藏
   */
  public hide(): Text {
    return this.setVisible(false);
  }

  /**
   * 切换可见性
   */
  public toggle(): Text {
    return this.setVisible(!this.isVisible);
  }

  // ==================== 透明度 ====================

  /**
   * 设置文本透明度
   * @param alpha 透明度 (0-255)
   */
  public setAlpha(alpha: number): Text {
    if (this.textFrame) {
      this.textFrame.setAlpha(alpha);
    }
    return this;
  }

  // ==================== 获取框架 ====================

  /**
   * 获取文本框架
   */
  public getTextFrame(): Frame | null {
    return this.textFrame;
  }

  /**
   * 获取背景框架
   */
  public getBackdropFrame(): Frame | null {
    return this.backdropFrame;
  }

  // ==================== 辅助方法 ====================

  /**
   * 获取带颜色格式的文本
   */
  private getFormattedText(): string {
    return "|cff" + this.textColor + this.content + "|r";
  }

  /**
   * 重新创建组件
   */
  private recreate(): void {
    const parent = this.textFrame ? undefined : undefined; // 保持原有父级
    this.destroy();
    this.create(parent);
  }

  /**
   * 配置多个属性
   */
  public configure(config: {
    text?: string;
    color?: string;
    horizontalAlign?: number;
    verticalAlign?: number;
    background?: string;
    visible?: boolean;
    alpha?: number;
    fontPath?: string;
    fontSize?: number;
  }): Text {
    if (config.text !== undefined) this.setText(config.text);
    if (config.color !== undefined) this.setColor(config.color);
    if (config.horizontalAlign !== undefined) this.setHorizontalAlign(config.horizontalAlign);
    if (config.verticalAlign !== undefined) this.setVerticalAlign(config.verticalAlign);
    if (config.background !== undefined) this.setBackground(config.background);
    if (config.visible !== undefined) this.setVisible(config.visible);
    if (config.alpha !== undefined) this.setAlpha(config.alpha);
    if (config.fontPath !== undefined) this.setFont(config.fontPath, config.fontSize);
    else if (config.fontSize !== undefined) this.setFontSize(config.fontSize);
    
    return this;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    if (this.textFrame) {
      this.textFrame.destroy();
      this.textFrame = null;
    }

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }
  }
}

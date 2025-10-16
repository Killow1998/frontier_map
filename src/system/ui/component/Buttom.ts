
import { Frame, Trigger, FRAME_ALIGN_LEFT, FRAME_ALIGN_TOP } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { UILayout, WC3Rect } from "../UILayout";
import { Console } from "src/system/console";

export class Button {
  private label: string;
  private pixelX: number;  // 像素坐标
  private pixelY: number;  // 像素坐标
  private pixelWidth: number;   // 像素尺寸
  private pixelHeight: number;  // 像素尺寸
  private frame: Frame | null = null;
  private onClick: (() => void) | null = null;
  private onHover: (() => void) | null = null;
  private onLeave: (() => void) | null = null;
  private clickTrigger: Trigger | null = null;
  private isEnabled: boolean = true;
  private isVisible: boolean = true;
  private texture: string = "UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp";
  private tooltip: string = "";
  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;

  private backdropFrame: Frame | null = null;


  constructor(
    label: string,
    x: number,
    y: number,
    width: number = 120,   // 默认像素宽度
    height: number = 40,   // 默认像素高度
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ) {
    this.label = label;
    this.pixelX = x;
    this.pixelY = y;
    this.pixelWidth = width;
    this.pixelHeight = height;
    this.origin = origin;
  }

  /**
   * 使用布局预设创建按钮
   * @param label 按钮文本
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param sizePreset 尺寸预设
   * @param origin 坐标原点
   * @returns Button实例
   */
  public static createWithPreset(
    label: string,
    x: number,
    y: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ): Button {
    const size = UILayout.BUTTON_SIZES[sizePreset];
    return new Button(label, x, y, size.width, size.height, origin);
  }

  /**
   * 使用预设位置创建按钮
   * @param label 按钮文本
   * @param positionPreset 位置预设
   * @param sizePreset 尺寸预设
   * @returns Button实例
   */
  public static createAtPresetPosition(
    label: string,
    positionPreset: string,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM'
  ): Button {
    const position = ScreenCoordinates.getPresetPosition(positionPreset);
    const size = UILayout.BUTTON_SIZES[sizePreset];
    return new Button(label, position.x, position.y, size.width, size.height);
  }

  /**
   * 创建按钮并显示在界面上
   */
  public create(parent?: Frame): void {
    if (this.frame) {
      return; // 已经创建了
    }

    // 创建按钮框架
    const parentFrame = parent || Frame.fromHandle(DzGetGameUI())!;
    const buttonFrame = Frame.createType(`Button`, parentFrame, 0, "ScriptDialogButton", "");

    if (!buttonFrame) {
      print("Error: Failed to create button frame");
      return;
    }

    this.frame = buttonFrame;

    // 转换为WC3坐标
    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    Console.log(`Creating button "${this.label}" at pixel(${this.pixelX}, ${this.pixelY}) with size (${this.pixelWidth}x${this.pixelHeight})`);
    Console.log(`Converted to WC3 coords: (${wc3Pos.x.toFixed(3)}, ${wc3Pos.y.toFixed(3)}) size (${wc3Width.toFixed(3)}x${wc3Height.toFixed(3)})`);

    // 设置基础属性
    this.frame.setSize(wc3Width, wc3Height);
    this.frame.setPoint(FRAME_ALIGN_LEFT, parentFrame, FRAME_ALIGN_LEFT, wc3Pos.x, wc3Pos.y);
    this.frame.setText(this.label);
    this.frame.setVisible(this.isVisible);
    this.frame.setEnabled(this.isEnabled);

    // 设置纹理（如果指定）
    if (this.texture) {
      this.backdropFrame = Frame.createType("Backdrop", this.frame, 0, 'BACKDROP', "")!;
      this.backdropFrame.setAllPoints(this.frame);
      this.backdropFrame.setTexture(this.texture, 0, false);
    }

    // 设置事件监听器
    this.setupEventListeners();

    print(`Button "${this.label}" created at pixel(${this.pixelX}, ${this.pixelY}) -> wc3(${wc3Pos.x.toFixed(3)}, ${wc3Pos.y.toFixed(3)})`);
  }

  /**
   * 设置点击事件回调
   */
  public setOnClick(callback: () => void): void {
    this.onClick = callback;
    // 如果按钮已创建，重新设置事件
    if (this.frame) {
      this.refreshEventListeners();
    }
  }

  /**
   * 设置鼠标悬停事件回调
   */
  public setOnHover(callback: () => void): void {
    this.onHover = callback;
  }

  /**
   * 设置鼠标离开事件回调
   */
  public setOnLeave(callback: () => void): void {
    this.onLeave = callback;
  }

  /**
   * 设置按钮文本
   */
  public setText(text: string): void {
    this.label = text;
    if (this.frame) {
      this.frame.setText(text);
    }
  }

  /**
   * 获取按钮文本
   */
  public getText(): string {
    return this.label;
  }

  /**
   * 设置按钮位置
   */
  public setPosition(x: number, y: number): void {
    this.pixelX = x;
    this.pixelY = y;
    if (this.frame) {
      const parent = Frame.fromHandle(DzGetGameUI())!;
      const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
      this.frame.setPoint(FRAME_ALIGN_LEFT, parent, FRAME_ALIGN_LEFT, wc3Pos.x, wc3Pos.y);
    }
  }

  /**
   * 设置按钮大小
   */
  public setSize(width: number, height: number): void {
    this.pixelWidth = width;
    this.pixelHeight = height;
    if (this.frame) {
      const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
      this.frame.setSize(wc3Width, wc3Height);
    }
  }

  /**
   * 设置按钮纹理
   */
  public setTexture(texturePath: string): void {
    this.texture = texturePath;
    if (this.frame) {
      this.frame.setTexture(texturePath, 0, false);
    }
  }

  /**
   * 设置工具提示（通过文本显示）
   */
  public setTooltip(tooltip: string): void {
    this.tooltip = tooltip;
    // 在 WC3 中，我们可以通过其他方式实现工具提示
    // 这里先保存，之后可以在鼠标悬停时显示
  }

  /**
   * 启用/禁用按钮
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (this.frame) {
      this.frame.setEnabled(enabled);
      // 视觉上表示禁用状态
      if (enabled) {
        this.frame.setAlpha(255);
      } else {
        this.frame.setAlpha(128); // 半透明表示禁用
      }
    }
  }

  /**
   * 显示/隐藏按钮
   */
  public setVisible(visible: boolean): void {
    this.isVisible = visible;
    if (this.frame) {
      this.frame.setVisible(visible);
    }
  }

  /**
   * 检查按钮是否启用
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * 检查按钮是否可见
   */
  public getVisible(): boolean {
    return this.isVisible;
  }

  /**
   * 获取按钮框架
   */
  public getFrame(): Frame | null {
    return this.frame;
  }

  /**
   * 获取按钮位置
   */
  public getPosition(): { x: number; y: number } {
    return { x: this.pixelX, y: this.pixelY };
  }

  /**
   * 获取按钮大小
   */
  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  /**
   * 销毁按钮
   */
  public destroy(): void {
    // 清理事件监听器
    if (this.clickTrigger) {
      this.clickTrigger.destroy();
      this.clickTrigger = null;
    }

    // 销毁框架
    if (this.frame) {
      this.frame.destroy();
      this.frame = null;
    }

    // 清理回调
    this.onClick = null;
    this.onHover = null;
    this.onLeave = null;
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    if (!this.frame || !this.onClick) return;

    // 在 WC3 中，我们需要使用不同的方式来处理按钮点击
    // 由于 Frame 事件在 wc3ts 中的实现可能有限，我们使用简化的方法
    this.clickTrigger = Trigger.create();

    // 注册按钮点击事件（需要根据实际的 wc3ts API 调整）
    try {
      // 使用原生 JASS 函数注册框架事件
      const frameHandle = this.frame.handle;
      if (frameHandle) {
        // 这里需要使用原生的框架事件注册
        // 由于 API 限制，我们先使用简化实现
        print(`Button "${this.label}" created successfully`);
      }
    } catch (error) {
      print(`Error setting up button events: ${error}`);
    }
  }

  /**
   * 重新设置事件监听器
   */
  private refreshEventListeners(): void {
    if (this.clickTrigger) {
      this.clickTrigger.destroy();
      this.clickTrigger = null;
    }
    this.setupEventListeners();
  }

  /**
   * 模拟按钮点击
   */
  public click(): void {
    if (this.isEnabled && this.onClick) {
      this.onClick();
      print(`Button "${this.label}" clicked`);
    }
  }

  /**
   * 设置按钮样式
   */
  public setStyle(style: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    fontSize?: number;
  }): void {
    if (!this.frame) return;

    // 在 WC3 中，样式设置比较有限
    // 这里提供一个接口，可以根据需要扩展
    if (style.textColor) {
      // 可以通过设置文本颜色代码实现
      const coloredText = `|cff${style.textColor}${this.label}|r`;
      this.frame.setText(coloredText);
    }
  }

  /**
   * 添加悬停效果
   */
  public addHoverEffect(): void {
    // 简单的悬停效果实现
    this.setOnHover(() => {
      if (this.frame && this.isEnabled) {
        this.frame.setAlpha(200); // 悬停时稍微变暗
      }
    });

    this.setOnLeave(() => {
      if (this.frame && this.isEnabled) {
        this.frame.setAlpha(255); // 恢复正常透明度
      }
    });
  }
}
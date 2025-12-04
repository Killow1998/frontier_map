import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { UILayout } from "../UILayout";
import { Console } from "src/system/console";
import { FrameEventUtils } from "src/constants/frame/utils";

/**
 * 常用背景纹理预设
 */
export const ButtonTextures = {
  /** 人族命令按钮边框 */
  HUMAN_BORDER: "UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp",
  /** 人族命令按钮背景 */
  HUMAN_BACKGROUND: "UI\\Widgets\\Console\\Human\\human-transport-slot.blp",
  /** 兽族按钮背景 */
  ORC_BACKGROUND: "UI\\Widgets\\Console\\Orc\\orc-transport-slot.blp",
  /** 暗夜精灵按钮背景 */
  NIGHTELF_BACKGROUND: "UI\\Widgets\\Console\\NightElf\\nightelf-transport-slot.blp",
  /** 不死族按钮背景 */
  UNDEAD_BACKGROUND: "UI\\Widgets\\Console\\Undead\\undead-transport-slot.blp",
  /** 黑色半透明 */
  BLACK_TRANSPARENT: "UI\\Widgets\\EscMenu\\Human\\editbox-background.blp",
  /** 工具提示背景 */
  TOOLTIP_BACKGROUND: "UI\\Widgets\\ToolTips\\Human\\human-tooltip-background.blp",
  /** 对话框背景 */
  DIALOG_BACKGROUND: "UI\\Widgets\\Glues\\GlueScreen-DialogBackground.blp",
  /** 任务背景 */
  QUEST_BACKGROUND: "UI\\Widgets\\Quests\\QuestMainBackdrop.blp",
  /** 透明（无背景） */
  TRANSPARENT: "",
} as const;

/**
 * Button类 - 三层结构按钮组件
 * 包含: 背景框架(Backdrop) + 文本框架(Text) + 按钮框架(Button)
 */
export class Button {
  private label: string;
  private pixelX: number;
  private pixelY: number;
  private pixelWidth: number;
  private pixelHeight: number;
  
  private backdropFrame: Frame | null = null;
  private textFrame: Frame | null = null;
  private buttonFrame: Frame | null = null;
  
  private onClick: (() => void) | null = null;
  private onHover: (() => void) | null = null;
  private onLeave: (() => void) | null = null;
  
  private isEnabled: boolean = true;
  private isVisible: boolean = true;
  
  private texture: string = ButtonTextures.HUMAN_BORDER;
  private textAlignment: number = 50;
  private textColor: string = "FFFFFF";
  private tooltip: string = "";
  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;

  // 拖拽相关属性
  private isDraggable: boolean = false;
  private isDragging: boolean = false;
  private dragTimer: timer | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private dragTrigger: trigger | null = null;
  private onDragStart: (() => void) | null = null;
  private onDragEnd: ((x: number, y: number) => void) | null = null;
  private onDragging: ((x: number, y: number) => void) | null = null;

  constructor(
    label: string,
    x: number,
    y: number,
    width: number = 120,
    height: number = 40,
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
   * 使用尺寸预设创建按钮（自动调用create）
   * @param label 按钮文本
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param sizePreset 尺寸预设
   * @param origin 坐标原点
   * @param parent 父级Frame（可选）
   */
  public static createWithPreset(
    label: string,
    x: number,
    y: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT,
    parent?: Frame
  ): Button {
    const size = UILayout.BUTTON_SIZES[sizePreset];
    const button = new Button(label, x, y, size.width, size.height, origin);
    button.create(parent);
    return button;
  }

  /**
   * 在预设位置创建按钮（自动调用create）
   * @param label 按钮文本
   * @param positionPreset 位置预设 ('CENTER', 'TOP_LEFT', etc.)
   * @param sizePreset 尺寸预设
   * @param centered 是否将按钮中心对齐到预设位置（默认true）
   * @param parent 父级Frame（可选）
   */
  public static createAtPresetPosition(
    label: string,
    positionPreset: string,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    centered: boolean = true,
    parent?: Frame
  ): Button {
    const position = ScreenCoordinates.getPresetPosition(positionPreset);
    const size = UILayout.BUTTON_SIZES[sizePreset];
    
    let x = position.x;
    let y = position.y;
    
    // 如果居中对齐，需要减去按钮尺寸的一半
    if (centered) {
      x = position.x - size.width / 2;
      y = position.y - size.height / 2;
    }
    
    const button = new Button(label, x, y, size.width, size.height);
    button.create(parent);
    return button;
  }
  
  /**
   * 在屏幕中心创建按钮（便捷方法，自动调用create）
   * @param label 按钮文本
   * @param sizePreset 尺寸预设
   * @param parent 父级Frame（可选）
   */
  public static createCentered(
    label: string,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    parent?: Frame
  ): Button {
    return Button.createAtPresetPosition(label, 'CENTER', sizePreset, true, parent);
  }

  public create(parent?: Frame): void {
    if (this.backdropFrame) {
      Console.log("Button already created");
      return;
    }

    const parentFrame = parent || Frame.fromHandle(DzGetGameUI())!;

    const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
    const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    //Console.log("Creating button \"" + this.label + "\" at pixel(" + this.pixelX + ", " + this.pixelY + ") with size (" + this.pixelWidth + "x" + this.pixelHeight + ")");

    this.backdropFrame = Frame.createType("BACKDROP", parentFrame, 0, 'BACKDROP', "")!;
    if (!this.backdropFrame) {
      Console.log("Error: Failed to create backdrop frame");
      return;
    }

    const rightX = wc3Pos.x + wc3Width;
    const bottomY = wc3Pos.y - wc3Height;
    
    this.backdropFrame
      .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
      .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY)
      .setTexture(this.texture, 0, true);

    this.textFrame = Frame.createType("TEXT", this.backdropFrame, 0, "TEXT", "")!;
    if (!this.textFrame) {
      Console.log("Error: Failed to create text frame");
      return;
    }

    this.textFrame
      .setAllPoints(this.backdropFrame)
      .setText("|cff" + this.textColor + this.label + "|r")
      .setTextAlignment(this.textAlignment, 0);

    this.buttonFrame = Frame.createType("BUTTON", this.backdropFrame, 0, "BUTTON", "")!;
    if (!this.buttonFrame) {
      Console.log("Error: Failed to create button frame");
      return;
    }

    this.buttonFrame.setAllPoints(this.backdropFrame);

    this.setVisible(this.isVisible);
    this.setEnabled(this.isEnabled);
    this.setupEventListeners();

    Console.log("Button \"" + this.label + "\" created successfully with 3-layer structure");
  }

  public setOnClick(callback: () => void): Button {
    this.onClick = callback;
    if (this.buttonFrame) {
      this.setupEventListeners();
    }
    return this;
  }

  public setOnHover(callback: () => void): Button {
    this.onHover = callback;
    if (this.buttonFrame) {
      this.setupEventListeners();
    }
    return this;
  }

  public setOnLeave(callback: () => void): Button {
    this.onLeave = callback;
    if (this.buttonFrame) {
      this.setupEventListeners();
    }
    return this;
  }

  public setText(text: string): Button {
    this.label = text;
    if (this.textFrame) {
      this.textFrame.setText("|cff" + this.textColor + text + "|r");
    }
    return this;
  }

  public getText(): string {
    return this.label;
  }

  public setTextColor(hexColor: string): Button {
    this.textColor = hexColor;
    if (this.textFrame) {
      this.textFrame.setText("|cff" + this.textColor + this.label + "|r");
    }
    return this;
  }

  public setTextAlignment(alignment: number): Button {
    this.textAlignment = alignment;
    if (this.textFrame) {
      this.textFrame.setTextAlignment(alignment, 0);
    }
    return this;
  }

  public setPosition(x: number, y: number): Button {
    this.pixelX = x;
    this.pixelY = y;
    if (this.backdropFrame) {
      const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
      const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
      
      const rightX = wc3Pos.x + wc3Width;
      const bottomY = wc3Pos.y - wc3Height;
      
      this.backdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
    }
    return this;
  }

  public setSize(width: number, height: number): Button {
    this.pixelWidth = width;
    this.pixelHeight = height;
    if (this.backdropFrame) {
      const wc3Pos = ScreenCoordinates.pixelToWC3(this.pixelX, this.pixelY, this.origin);
      const wc3Width = (this.pixelWidth / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3Height = (this.pixelHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;
      
      const rightX = wc3Pos.x + wc3Width;
      const bottomY = wc3Pos.y - wc3Height;
      
      this.backdropFrame
        .setAbsPoint(FRAME_ALIGN_LEFT_TOP, wc3Pos.x, wc3Pos.y)
        .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, rightX, bottomY);
    }
    return this;
  }

  public setTexture(texturePath: string): Button {
    this.texture = texturePath;
    if (this.backdropFrame) {
      this.backdropFrame.setTexture(texturePath, 0, true);
    }
    return this;
  }

  /**
   * 使用预设纹理
   * @param preset 纹理预设键名
   */
  public setTexturePreset(preset: keyof typeof ButtonTextures): Button {
    return this.setTexture(ButtonTextures[preset]);
  }

  /**
   * 设置背景透明度
   * @param alpha 透明度 (0-255)
   */
  public setBackdropAlpha(alpha: number): Button {
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    return this;
  }

  /**
   * 隐藏背景（使用空纹理）
   */
  public hideBackdrop(): Button {
    return this.setTexture("");
  }

  /**
   * 设置自定义背景图片路径
   * @param path 图片路径（相对于MPQ/地图）
   */
  public setBackground(path: string): Button {
    return this.setTexture(path);
  }

  public setTooltip(tooltip: string): Button {
    this.tooltip = tooltip;
    return this;
  }

  public setEnabled(enabled: boolean): Button {
    this.isEnabled = enabled;
    if (this.buttonFrame) {
      if (enabled) {
        this.backdropFrame?.setAlpha(255);
        this.textFrame?.setAlpha(255);
      } else {
        this.backdropFrame?.setAlpha(128);
        this.textFrame?.setAlpha(128);
      }
    }
    return this;
  }

  public setVisible(visible: boolean): Button {
    this.isVisible = visible;
    if (this.backdropFrame) {
      this.backdropFrame.setVisible(visible);
    }
    if (this.textFrame) {
      this.textFrame.setVisible(visible);
    }
    if (this.buttonFrame) {
      this.buttonFrame.setVisible(visible);
    }
    return this;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public getVisible(): boolean {
    return this.isVisible;
  }

  public getBackdropFrame(): Frame | null {
    return this.backdropFrame;
  }

  public getTextFrame(): Frame | null {
    return this.textFrame;
  }

  public getButtonFrame(): Frame | null {
    return this.buttonFrame;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.pixelX, y: this.pixelY };
  }

  public getSize(): { width: number; height: number } {
    return { width: this.pixelWidth, height: this.pixelHeight };
  }

  public destroy(): void {
    // 如果正在拖拽，先结束拖拽
    if (this.isDragging) {
      this.endDrag();
    }
    
    if (this.buttonFrame) {
      this.buttonFrame.destroy();
      this.buttonFrame = null;
    }

    if (this.textFrame) {
      this.textFrame.destroy();
      this.textFrame = null;
    }

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }

    this.onClick = null;
    this.onHover = null;
    this.onLeave = null;
    this.onDragStart = null;
    this.onDragEnd = null;
    this.onDragging = null;
  }

  private setupEventListeners(): void {
    if (!this.buttonFrame) return;

    FrameEventUtils.bindEvents(this.buttonFrame, {
      onClick: () => {
        // 如果启用了拖拽，点击时开始拖拽
        if (this.isDraggable && !this.isDragging) {
          this.startDrag();
        } else if (this.isEnabled && this.onClick) {
          this.onClick();
        }
      },
      onMouseEnter: this.onHover ? () => {
        if (this.isEnabled && this.onHover) {
          this.onHover();
        }
      } : undefined,
      onMouseLeave: () => {
        // 如果正在拖拽且鼠标离开了按钮区域，继续拖拽（不结束）
        if (this.isEnabled && this.onLeave && !this.isDragging) {
          this.onLeave();
        }
      }
    });
  }

  public click(): void {
    if (this.isEnabled && this.onClick) {
      this.onClick();
      Console.log("Button \"" + this.label + "\" clicked");
    }
  }

  public addHoverEffect(hoverAlpha: number = 200, normalAlpha: number = 255): Button {
    this.setOnHover(() => {
      if (this.backdropFrame && this.isEnabled) {
        this.backdropFrame.setAlpha(hoverAlpha);
      }
    });

    this.setOnLeave(() => {
      if (this.backdropFrame && this.isEnabled) {
        this.backdropFrame.setAlpha(normalAlpha);
      }
    });
    
    return this;
  }

  public configure(config: {
    text?: string;
    textColor?: string;
    texture?: string;
    onClick?: () => void;
    onHover?: () => void;
    onLeave?: () => void;
    enabled?: boolean;
    visible?: boolean;
  }): Button {
    if (config.text !== undefined) this.setText(config.text);
    if (config.textColor !== undefined) this.setTextColor(config.textColor);
    if (config.texture !== undefined) this.setTexture(config.texture);
    if (config.onClick !== undefined) this.setOnClick(config.onClick);
    if (config.onHover !== undefined) this.setOnHover(config.onHover);
    if (config.onLeave !== undefined) this.setOnLeave(config.onLeave);
    if (config.enabled !== undefined) this.setEnabled(config.enabled);
    if (config.visible !== undefined) this.setVisible(config.visible);
    
    return this;
  }

  // ==================== 拖拽功能 ====================

  /**
   * 启用/禁用拖拽功能
   * @param draggable 是否可拖拽
   */
  public setDraggable(draggable: boolean): Button {
    this.isDraggable = draggable;
    if (this.buttonFrame) {
      this.setupDragEventListeners();
    }
    return this;
  }

  /**
   * 获取是否启用了拖拽
   */
  public getDraggable(): boolean {
    return this.isDraggable;
  }

  /**
   * 获取是否正在拖拽
   */
  public getIsDragging(): boolean {
    return this.isDragging;
  }

  /**
   * 设置拖拽开始回调
   * @param callback 拖拽开始时调用
   */
  public setOnDragStart(callback: () => void): Button {
    this.onDragStart = callback;
    return this;
  }

  /**
   * 设置拖拽结束回调
   * @param callback 拖拽结束时调用，参数为最终的像素坐标
   */
  public setOnDragEnd(callback: (x: number, y: number) => void): Button {
    this.onDragEnd = callback;
    return this;
  }

  /**
   * 设置拖拽过程中回调
   * @param callback 拖拽过程中调用，参数为当前像素坐标
   */
  public setOnDragging(callback: (x: number, y: number) => void): Button {
    this.onDragging = callback;
    return this;
  }

  /**
   * 开始拖拽
   */
  private startDrag(): void {
    if (!this.isDraggable || this.isDragging) return;
    
    this.isDragging = true;
    
    // 使用 KKWE 的鼠标位置API（获取屏幕像素坐标）
    const currentMouseX = DzGetMouseX();
    const currentMouseY = DzGetMouseY();
    
    // 计算鼠标相对于按钮左上角的偏移量（像素坐标）
    this.dragOffsetX = currentMouseX - this.pixelX;
    this.dragOffsetY = currentMouseY - this.pixelY;
    
    Console.log("Drag started at mouse(" + currentMouseX + ", " + currentMouseY + "), offset(" + this.dragOffsetX + ", " + this.dragOffsetY + ")");
    
    // 触发拖拽开始回调
    if (this.onDragStart) {
      this.onDragStart();
    }
    
    // 创建定时器持续更新位置
    this.dragTimer = CreateTimer();
    TimerStart(this.dragTimer, 0.01, true, () => {
      this.updateDragPosition();
    });
    
    // 注册全局鼠标松开事件
    this.dragTrigger = CreateTrigger();
    DzTriggerRegisterMouseEventByCode(this.dragTrigger, 1, 2, true, () => {
      // 1 = 鼠标左键, 2 = 松开事件
      this.endDrag();
    });
  }

  /**
   * 更新拖拽过程中的位置
   */
  private updateDragPosition(): void {
    if (!this.isDragging) return;
    
    // 获取当前鼠标位置（像素坐标）
    const currentMouseX = DzGetMouseX();
    const currentMouseY = DzGetMouseY();
    
    // 计算新的按钮位置
    const newX = currentMouseX - this.dragOffsetX;
    const newY = currentMouseY - this.dragOffsetY;
    
    // 更新按钮位置
    this.setPosition(newX, newY);
    
    // 触发拖拽过程回调
    if (this.onDragging) {
      this.onDragging(newX, newY);
    }
  }

  /**
   * 结束拖拽
   */
  private endDrag(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    // 停止定时器
    if (this.dragTimer) {
      PauseTimer(this.dragTimer);
      DestroyTimer(this.dragTimer);
      this.dragTimer = null;
    }
    
    // 销毁鼠标事件触发器
    if (this.dragTrigger) {
      DestroyTrigger(this.dragTrigger);
      this.dragTrigger = null;
    }
    
    Console.log("Drag ended at position(" + this.pixelX + ", " + this.pixelY + ")");
    
    // 触发拖拽结束回调
    if (this.onDragEnd) {
      this.onDragEnd(this.pixelX, this.pixelY);
    }
  }

  /**
   * 设置拖拽事件监听器
   */
  private setupDragEventListeners(): void {
    // 拖拽通过 setupEventListeners 中的点击事件触发
    // 松开通过 startDrag 中注册的全局鼠标事件检测
    // 这里不需要额外的设置
  }

  /**
   * 启用拖拽并配置（便捷方法）
   * @param config 拖拽配置
   */
  public enableDrag(config?: {
    onDragStart?: () => void;
    onDragEnd?: (x: number, y: number) => void;
    onDragging?: (x: number, y: number) => void;
  }): Button {
    this.setDraggable(true);
    
    if (config) {
      if (config.onDragStart) this.setOnDragStart(config.onDragStart);
      if (config.onDragEnd) this.setOnDragEnd(config.onDragEnd);
      if (config.onDragging) this.setOnDragging(config.onDragging);
    }
    
    return this;
  }

  /**
   * 禁用拖拽
   */
  public disableDrag(): Button {
    this.setDraggable(false);
    if (this.isDragging) {
      this.endDrag();
    }
    return this;
  }
}

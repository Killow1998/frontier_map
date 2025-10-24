import { Frame, FRAME_ALIGN_LEFT, FRAME_ALIGN_TOP, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { ScreenCoordinates } from "../ScreenCoordinates";
import { UILayout } from "../UILayout";
import { Console } from "src/system/console";
import { FrameEventUtils } from "src/constants/frame/utils";

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
  
  private texture: string = "UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp";
  private textAlignment: number = 50;
  private textColor: string = "FFFFFF";
  private tooltip: string = "";
  private origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT;

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

  public static createAtPresetPosition(
    label: string,
    positionPreset: string,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM'
  ): Button {
    const position = ScreenCoordinates.getPresetPosition(positionPreset);
    const size = UILayout.BUTTON_SIZES[sizePreset];
    return new Button(label, position.x, position.y, size.width, size.height);
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

    Console.log("Creating button \"" + this.label + "\" at pixel(" + this.pixelX + ", " + this.pixelY + ") with size (" + this.pixelWidth + "x" + this.pixelHeight + ")");

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
  }

  private setupEventListeners(): void {
    if (!this.buttonFrame) return;

    FrameEventUtils.bindEvents(this.buttonFrame, {
      onClick: this.onClick ? () => {
        if (this.isEnabled && this.onClick) {
          this.onClick();
        }
      } : undefined,
      onMouseEnter: this.onHover ? () => {
        if (this.isEnabled && this.onHover) {
          this.onHover();
        }
      } : undefined,
      onMouseLeave: this.onLeave ? () => {
        if (this.isEnabled && this.onLeave) {
          this.onLeave();
        }
      } : undefined
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
}

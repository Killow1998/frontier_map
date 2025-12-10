import { Frame, FRAMEPOINT_TOPLEFT, FRAMEPOINT_BOTTOMRIGHT } from "@eiriksgata/wc3ts/*";
import { Console } from "src/system/console";
import { ScreenCoordinates } from "../ScreenCoordinates";

/**
 * Tips 动画类型
 */
export enum TipsAnimation {
  /** 无动画 */
  NONE = "none",
  /** 淡入淡出 */
  FADE = "fade",
  /** 从右侧滑入 */
  SLIDE_RIGHT = "slideRight",
  /** 从左侧滑入 */
  SLIDE_LEFT = "slideLeft",
  /** 从上方滑入 */
  SLIDE_TOP = "slideTop",
  /** 从下方滑入 */
  SLIDE_BOTTOM = "slideBottom",
}

/**
 * Tips 显示位置
 */
export enum TipsPosition {
  /** 自动检测（根据屏幕边界） */
  AUTO = "auto",
  /** 右侧 */
  RIGHT = "right",
  /** 左侧 */
  LEFT = "left",
  /** 上方 */
  TOP = "top",
  /** 下方 */
  BOTTOM = "bottom",
}

/**
 * Tips 配置
 */
export interface TipsConfig {
  /** 提示文本 */
  text: string;
  /** 文本颜色（十六进制，不含#） */
  textColor?: string;
  /** 背景纹理路径 */
  background?: string;
  /** 图标路径（可选） */
  icon?: string;
  /** 宽度（像素） */
  width?: number;
  /** 最大高度（像素） */
  maxHeight?: number;
  /** 显示位置偏好 */
  position?: TipsPosition;
  /** 动画类型 */
  animation?: TipsAnimation;
  /** 延迟显示时间（秒） */
  delayShow?: number;
  /** 延迟隐藏时间（秒） */
  delayHide?: number;
  /** 距离目标的偏移距离（像素） */
  offset?: number;
}

/**
 * Tips 组件 - 单例模式
 * 用于显示鼠标悬停提示、技能说明、物品介绍等
 * 
 * @example
 * ```typescript
 * // 获取 Tips 单例
 * const tips = Tips.getInstance();
 * 
 * // 显示提示（使用组件的 getComponentInfo 方法）
 * const button = new Button("技能", 200, 200, 100, 100);
 * const info = button.getComponentInfo();
 * tips.show({
 *   text: "这是一个强力技能\n冷却时间: 10秒\n魔法消耗: 100",
 *   textColor: "FFD700",
 *   icon: "ReplaceableTextures\\CommandButtons\\BTNFireBolt.blp",
 *   position: TipsPosition.AUTO,
 *   animation: TipsAnimation.FADE
 * }, info.x, info.y, info.width, info.height);
 * 
 * // 隐藏提示
 * tips.hide();
 * ```
 */
export class Tips {
  private static instance: Tips | null = null;

  // Frame 组件
  private backdropFrame: Frame | null = null;
  private iconFrame: Frame | null = null;
  private textFrame: Frame | null = null;

  // 状态
  private isVisible: boolean = false;
  private isCreated: boolean = false;
  private currentConfig: TipsConfig | null = null;
  private componentWidth: number = 100;  // 目标组件宽度（像素）
  private componentHeight: number = 40;  // 目标组件高度（像素）

  // 定时器
  private showTimer: timer | null = null;
  private hideTimer: timer | null = null;
  private animationTimer: timer | null = null;

  // 动画状态
  private currentAlpha: number = 0;
  private targetAlpha: number = 255;
  private animationProgress: number = 0;

  // 最终位置（用于滑动动画）
  private finalPositionX: number = 0;
  private finalPositionY: number = 0;

  // 默认配置
  private static readonly DEFAULT_WIDTH = 300;
  private static readonly DEFAULT_MAX_HEIGHT = 400;
  private static readonly DEFAULT_BACKGROUND = "UI\\Widgets\\EscMenu\\Human\\editbox-background.blp";
  private static readonly DEFAULT_TEXT_COLOR = "FFFFFF";
  private static readonly DEFAULT_DELAY_SHOW = 0.3; // 秒
  private static readonly DEFAULT_DELAY_HIDE = 0.1; // 秒
  private static readonly DEFAULT_OFFSET = 10; // 像素
  private static readonly ANIMATION_DURATION = 0.15; // 动画持续时间（秒）
  private static readonly ANIMATION_FPS = 30; // 动画帧率

  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  /**
   * 获取 Tips 单例
   */
  public static getInstance(): Tips {
    if (!Tips.instance) {
      Tips.instance = new Tips();
    }
    // 确保已创建
    if (!Tips.instance.isCreated) {
      Tips.instance.create();
    }
    return Tips.instance;
  }

  /**
   * 创建 Tips UI
   */
  private create(): void {
    if (this.isCreated) return;

    Console.log("[Tips] Starting Tips creation...");

    const gameUI = Frame.fromHandle(DzGetGameUI());
    if (!gameUI) {
      Console.log("[Tips] Error: Cannot get game UI frame");
      return;
    }
    Console.log("[Tips] ✓ Got game UI frame");

    // 使用时间戳确保 Frame 名称唯一
    const timestamp = math.floor(os.clock() * 1000);
    Console.log(`[Tips] Using timestamp: ${timestamp}`);

    // 创建背景框架
    Console.log("[Tips] Creating backdrop frame...");
    this.backdropFrame = Frame.createType(`TipsBackdrop_${timestamp}`, gameUI, 0, "BACKDROP", "") || null;
    if (!this.backdropFrame) {
      Console.log("[Tips] Error: Failed to create backdrop frame");
      return;
    }
    Console.log("[Tips] ✓ Backdrop frame created");

    this.backdropFrame
      .setSize(0.2, 0.15)
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.4, 0.5)
      .setTexture(Tips.DEFAULT_BACKGROUND, 0, true)
      .setAlpha(0); // 初始透明

    // 创建图标框架（可选，初始隐藏）
    this.iconFrame = Frame.createType(`TipsIcon_${timestamp}`, this.backdropFrame, 0, "BACKDROP", "") || null;
    if (this.iconFrame) {
      this.iconFrame
        .setSize(0.03, 0.03)
        .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, 0.005, -0.005)
        .setAlpha(0);
    }

    // 创建文本框架
    this.textFrame = Frame.createType(`TipsText_${timestamp}`, this.backdropFrame, 0, "TEXT", "") || null;
    if (!this.textFrame) {
      Console.log("[Tips] Error: Failed to create text frame");
      return;
    }

    this.textFrame
      .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, 0.005, -0.005)
      .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.backdropFrame, FRAMEPOINT_BOTTOMRIGHT, -0.005, 0.005)
      .setText("")
      .setTextAlignment(0, 50) // 左对齐，垂直居中
      .setAlpha(0);

    this.isCreated = true;
    this.isVisible = false;

    Console.log("[Tips] Tips component created successfully");
  }

  /**
   * 从组件信息显示 Tips（推荐使用 Button.getComponentInfo()）
   * @param config Tips 配置
   * @param componentInfo 组件信息对象 { frame, x, y, width, height }
   */
  public showFromComponentInfo(
    config: TipsConfig,
    componentInfo: { frame?: Frame | null; x: number; y: number; width: number; height: number }
  ): void {
    this.show(config, componentInfo.x, componentInfo.y, componentInfo.width, componentInfo.height);
  }

  /**
   * 显示 Tips
   * @param config Tips 配置
   * @param targetPixelX 目标像素 X 坐标
   * @param targetPixelY 目标像素 Y 坐标
   * @param componentWidth 目标组件宽度（像素）
   * @param componentHeight 目标组件高度（像素）
   */
  public show(
    config: TipsConfig,
    targetPixelX?: number,
    targetPixelY?: number,
    componentWidth: number = 100,
    componentHeight: number = 40
  ): void {
    // 确保已创建
    if (!this.isCreated) {
      Console.log("[Tips] Tips not created, attempting to create...");
      this.create();
      if (!this.isCreated) {
        Console.log("[Tips] Error: Failed to create Tips");
        return;
      }
    }

    // 取消之前的定时器和动画（立即停止任何进行中的动画）
    this.cancelTimers();

    // 保存配置和目标
    this.currentConfig = config;
    this.componentWidth = componentWidth;
    this.componentHeight = componentHeight;

    // 如果已经可见，直接更新内容，不重新播放动画（避免抖动）
    if (this.isVisible) {
      this.doShow(config, targetPixelX, targetPixelY);
      return;
    }

    // 设置延迟显示
    const delayShow = config.delayShow ?? Tips.DEFAULT_DELAY_SHOW;

    if (delayShow > 0) {
      const timer = CreateTimer();
      this.showTimer = timer;
      TimerStart(timer, delayShow, false, () => {
        this.doShow(config, targetPixelX, targetPixelY);
      });
    } else {
      this.doShow(config, targetPixelX, targetPixelY);
    }
  }

  /**
   * 执行显示逻辑
   */
  private doShow(
    config: TipsConfig,
    targetPixelX?: number,
    targetPixelY?: number
  ): void {
    if (!this.backdropFrame || !this.textFrame) return;

    // 更新内容
    this.updateContent(config);

    // 计算位置
    const position = this.calculatePosition(config, targetPixelX, targetPixelY);

    // 设置位置
    this.backdropFrame.setAbsPoint(FRAMEPOINT_TOPLEFT, position.x, position.y);

    // 如果已经可见，只更新内容和位置，不重新播放动画
    if (this.isVisible && this.currentAlpha >= 200) {
      // 确保完全可见
      this.setAlpha(255);
      return;
    }

    // 执行动画
    const animation = config.animation ?? TipsAnimation.FADE;
    this.playAnimation(animation, true);

    this.isVisible = true;
  }

  /**
   * 隐藏 Tips
   */
  public hide(): void {
    if (!this.isCreated) return;

    // 取消所有定时器（包括延迟显示）
    this.cancelTimers();

    // 如果当前不可见或已经在隐藏中，直接返回
    if (!this.isVisible) return;

    const delayHide = this.currentConfig?.delayHide ?? Tips.DEFAULT_DELAY_HIDE;

    if (delayHide > 0) {
      const timer = CreateTimer();
      this.hideTimer = timer;
      TimerStart(timer, delayHide, false, () => {
        this.doHide();
      });
    } else {
      this.doHide();
    }
  }

  /**
   * 执行隐藏逻辑
   */
  private doHide(): void {
    if (!this.isVisible) return;

    const animation = this.currentConfig?.animation ?? TipsAnimation.FADE;
    this.playAnimation(animation, false);

    this.isVisible = false;
    this.currentConfig = null;
  }

  /**
   * 更新 Tips 内容
   */
  private updateContent(config: TipsConfig): void {
    if (!this.backdropFrame || !this.textFrame) return;

    // 计算尺寸
    const width = config.width ?? Tips.DEFAULT_WIDTH;
    const maxHeight = config.maxHeight ?? Tips.DEFAULT_MAX_HEIGHT;
    const wc3Width = (width / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3MaxHeight = (maxHeight / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    // 设置背景
    this.backdropFrame
      .setSize(wc3Width, wc3MaxHeight)
      .setTexture(config.background ?? Tips.DEFAULT_BACKGROUND, 0, true);

    // 设置图标（如果有）
    if (config.icon) {
      const iconSize = 32; // 像素
      const iconPadding = 8; // 图标与文字之间的间距（像素）
      const leftPadding = 8; // 左侧内边距（像素）
      const topPadding = 8; // 顶部内边距（像素）

      const wc3IconSize = (iconSize / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3IconPadding = (iconPadding / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3LeftPadding = (leftPadding / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3TopPadding = (topPadding / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

      if (this.iconFrame) {
        this.iconFrame.setVisible(true);
        // 图标定位：左上角，带内边距
        this.iconFrame!
          .setSize(wc3IconSize, wc3IconSize)
          .setTexture(config.icon, 0, true)
          .clearPoints()
          .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, wc3LeftPadding, -wc3TopPadding)
          .setAlpha(0); // 初始透明，动画中会设置

      }

      // 文本需要为图标留出空间：图标宽度 + 左边距 + 图标间距
      const textLeftOffset = wc3LeftPadding + wc3IconSize + wc3IconPadding;
      const wc3RightPadding = (8 / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;

      this.textFrame
        .clearPoints()
        .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, textLeftOffset, -wc3TopPadding)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.backdropFrame, FRAMEPOINT_BOTTOMRIGHT, -wc3RightPadding, wc3TopPadding);
    } else {
      // 没有图标，文本占满整个区域（带内边距）
      if (this.iconFrame) {
        this.iconFrame.setVisible(false);
        //this.iconFrame.setAlpha(0);
      }

      const padding = 8; // 像素
      const wc3Padding = (padding / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
      const wc3PaddingY = (padding / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

      this.textFrame
        .clearPoints()
        .setPoint(FRAMEPOINT_TOPLEFT, this.backdropFrame, FRAMEPOINT_TOPLEFT, wc3Padding, -wc3PaddingY)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, this.backdropFrame, FRAMEPOINT_BOTTOMRIGHT, -wc3Padding, wc3PaddingY);
    }

    // 设置文本
    const textColor = config.textColor ?? Tips.DEFAULT_TEXT_COLOR;
    this.textFrame.setText(`|cff${textColor}${config.text}|r`);
  }

  /**
   * 计算 Tips 显示位置
   */
  private calculatePosition(
    config: TipsConfig,
    targetPixelX?: number,
    targetPixelY?: number
  ): { x: number; y: number } {
    // 获取目标位置（像素）
    let pixelX: number;
    let pixelY: number;

    if (targetPixelX !== undefined && targetPixelY !== undefined) {
      pixelX = targetPixelX;
      pixelY = targetPixelY;
    } else {
      // 默认位置：屏幕中心
      pixelX = ScreenCoordinates.STANDARD_WIDTH / 2;
      pixelY = ScreenCoordinates.STANDARD_HEIGHT / 2;
    }

    // Tips 尺寸
    const tipsWidth = config.width ?? Tips.DEFAULT_WIDTH;
    const tipsHeight = config.maxHeight ?? Tips.DEFAULT_MAX_HEIGHT;
    const offset = config.offset ?? Tips.DEFAULT_OFFSET;

    // 确定显示位置
    let position = config.position ?? TipsPosition.AUTO;

    if (position === TipsPosition.AUTO) {
      // 自动检测最佳位置
      position = this.detectBestPosition(pixelX, pixelY, tipsWidth, tipsHeight, offset);
    }

    // 根据位置计算坐标（考虑目标组件的尺寸）
    let finalPixelX: number;
    let finalPixelY: number;

    switch (position) {
      case TipsPosition.RIGHT:
        // 显示在组件右侧
        finalPixelX = pixelX + this.componentWidth + offset;
        finalPixelY = pixelY;
        break;
      case TipsPosition.LEFT:
        // 显示在组件左侧
        finalPixelX = pixelX - tipsWidth - offset;
        finalPixelY = pixelY;
        break;
      case TipsPosition.TOP:
        // 显示在组件上方
        finalPixelX = pixelX;
        finalPixelY = pixelY - tipsHeight - offset;
        break;
      case TipsPosition.BOTTOM:
        // 显示在组件下方
        finalPixelX = pixelX;
        finalPixelY = pixelY + this.componentHeight + offset;
        break;
      default:
        finalPixelX = pixelX + this.componentWidth + offset;
        finalPixelY = pixelY;
    }

    // 边界检查，确保不超出屏幕
    finalPixelX = Math.max(10, Math.min(finalPixelX, ScreenCoordinates.STANDARD_WIDTH - tipsWidth - 10));
    finalPixelY = Math.max(10, Math.min(finalPixelY, ScreenCoordinates.STANDARD_HEIGHT - tipsHeight - 10));

    // 转换为 WC3 坐标
    const wc3X = (finalPixelX / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH;
    const wc3Y = ScreenCoordinates.WC3_SCREEN_HEIGHT - (finalPixelY / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT;

    // 保存最终位置（用于滑动动画）
    this.finalPositionX = wc3X;
    this.finalPositionY = wc3Y;

    return { x: wc3X, y: wc3Y };
  }

  /**
   * 检测最佳显示位置（根据目标组件在屏幕中的位置智能选择）
   * @param pixelX 组件左上角 X 坐标（像素）
   * @param pixelY 组件左上角 Y 坐标（像素）
   * @param tipsWidth Tips 宽度（像素）
   * @param tipsHeight Tips 高度（像素）
   * @param offset 偏移量（像素）
   */
  private detectBestPosition(
    pixelX: number,
    pixelY: number,
    tipsWidth: number,
    tipsHeight: number,
    offset: number
  ): TipsPosition {
    const screenWidth = ScreenCoordinates.STANDARD_WIDTH;
    const screenHeight = ScreenCoordinates.STANDARD_HEIGHT;

    // 组件中心点坐标
    const componentCenterX = pixelX + this.componentWidth / 2;
    const componentCenterY = pixelY + this.componentHeight / 2;

    // 计算各个方向的可用空间（从组件边缘开始计算）
    const spaceRight = screenWidth - (pixelX + this.componentWidth) - offset;
    const spaceLeft = pixelX - offset;
    const spaceTop = pixelY - offset;
    const spaceBottom = screenHeight - (pixelY + this.componentHeight) - offset;

    // 判断组件在屏幕中的位置（分为 9 个区域）
    const isLeft = componentCenterX < screenWidth / 3;
    const isRight = componentCenterX > (screenWidth * 2) / 3;
    const isTop = componentCenterY < screenHeight / 3;
    const isBottom = componentCenterY > (screenHeight * 2) / 3;

    // 根据位置选择最佳方向
    // 优先级：远离边缘的方向

    // 右上角 -> 优先左侧或下方
    if (isRight && isTop) {
      if (spaceLeft >= tipsWidth) {
        return TipsPosition.LEFT;
      } else if (spaceBottom >= tipsHeight) {
        return TipsPosition.BOTTOM;
      }
    }

    // 右下角 -> 优先左侧或上方
    if (isRight && isBottom) {
      if (spaceLeft >= tipsWidth) {
        return TipsPosition.LEFT;
      } else if (spaceTop >= tipsHeight) {
        return TipsPosition.TOP;
      }
    }

    // 左上角 -> 优先右侧或下方
    if (isLeft && isTop) {
      if (spaceRight >= tipsWidth) {
        return TipsPosition.RIGHT;
      } else if (spaceBottom >= tipsHeight) {
        return TipsPosition.BOTTOM;
      }
    }

    // 左下角 -> 优先右侧或上方
    if (isLeft && isBottom) {
      if (spaceRight >= tipsWidth) {
        return TipsPosition.RIGHT;
      } else if (spaceTop >= tipsHeight) {
        return TipsPosition.TOP;
      }
    }

    // 右侧（不在角落）-> 优先左侧
    if (isRight && spaceLeft >= tipsWidth) {
      return TipsPosition.LEFT;
    }

    // 左侧（不在角落）-> 优先右侧
    if (isLeft && spaceRight >= tipsWidth) {
      return TipsPosition.RIGHT;
    }

    // 顶部（不在角落）-> 优先下方
    if (isTop && spaceBottom >= tipsHeight) {
      return TipsPosition.BOTTOM;
    }

    // 底部（不在角落）-> 优先上方
    if (isBottom && spaceTop >= tipsHeight) {
      return TipsPosition.TOP;
    }

    // 中心区域：默认优先右侧，其次左侧，然后下方，最后上方
    if (spaceRight >= tipsWidth) {
      return TipsPosition.RIGHT;
    } else if (spaceLeft >= tipsWidth) {
      return TipsPosition.LEFT;
    } else if (spaceBottom >= tipsHeight) {
      return TipsPosition.BOTTOM;
    } else if (spaceTop >= tipsHeight) {
      return TipsPosition.TOP;
    }

    // 如果都不够，选择空间最大的方向
    const maxSpace = Math.max(spaceRight, spaceLeft, spaceTop, spaceBottom);
    if (maxSpace === spaceRight) return TipsPosition.RIGHT;
    if (maxSpace === spaceLeft) return TipsPosition.LEFT;
    if (maxSpace === spaceBottom) return TipsPosition.BOTTOM;
    return TipsPosition.TOP;
  }

  /**
   * 播放动画
   */
  private playAnimation(animation: TipsAnimation, isShowing: boolean): void {
    // 取消之前的动画
    if (this.animationTimer) {
      DestroyTimer(this.animationTimer as any);
      this.animationTimer = null;
    }

    this.animationProgress = 0;
    this.currentAlpha = isShowing ? 0 : 255;
    this.targetAlpha = isShowing ? 255 : 0;

    if (animation === TipsAnimation.NONE) {
      // 无动画，直接设置
      this.setAlpha(this.targetAlpha);
      return;
    }

    // 计算滑动动画的起始偏移量（转换为 WC3 坐标）
    const slideDistance = 20; // 像素
    const slideOffsetWC3 = ScreenCoordinates.pixelToWC3(slideDistance, 0).x;
    let startOffsetX = 0;
    let startOffsetY = 0;

    // 根据动画类型设置初始偏移
    if (isShowing) {
      switch (animation) {
        case TipsAnimation.SLIDE_RIGHT:
          startOffsetX = -slideOffsetWC3; // 从左侧滑入
          break;
        case TipsAnimation.SLIDE_LEFT:
          startOffsetX = slideOffsetWC3; // 从右侧滑入
          break;
        case TipsAnimation.SLIDE_TOP:
          startOffsetY = -slideOffsetWC3; // 从下方滑入
          break;
        case TipsAnimation.SLIDE_BOTTOM:
          startOffsetY = slideOffsetWC3; // 从上方滑入
          break;
      }
    }

    // 保存目标位置
    const targetX = this.finalPositionX;
    const targetY = this.finalPositionY;

    // 启动动画定时器
    const interval = 1.0 / Tips.ANIMATION_FPS;
    const totalSteps = Tips.ANIMATION_DURATION * Tips.ANIMATION_FPS;

    const timer = CreateTimer();
    this.animationTimer = timer;
    TimerStart(timer, interval, true, () => {
      this.animationProgress += 1 / totalSteps;

      if (this.animationProgress >= 1.0) {
        // 动画完成
        this.animationProgress = 1.0;
        this.setAlpha(this.targetAlpha);

        // 确保位置回到目标位置
        if (this.backdropFrame && animation !== TipsAnimation.FADE) {
          this.backdropFrame.clearPoints();
          this.backdropFrame.setAbsPoint(FRAMEPOINT_TOPLEFT, targetX, targetY);
        }

        if (this.animationTimer) {
          DestroyTimer(this.animationTimer as any);
          this.animationTimer = null;
        }
        return;
      }

      // 计算缓动进度（easeOutCubic）
      const eased = 1 - Math.pow(1 - this.animationProgress, 3);

      // 更新透明度
      const alpha = this.currentAlpha + (this.targetAlpha - this.currentAlpha) * eased;
      this.setAlpha(Math.floor(alpha));

      // 更新滑动位置
      if (animation !== TipsAnimation.FADE && this.backdropFrame) {
        const currentOffsetX = startOffsetX * (1 - eased);
        const currentOffsetY = startOffsetY * (1 - eased);

        this.backdropFrame.clearPoints();
        this.backdropFrame.setAbsPoint(
          FRAMEPOINT_TOPLEFT,
          targetX + currentOffsetX,
          targetY + currentOffsetY
        );
      }
    });
  }

  /**
   * 设置透明度
   */
  private setAlpha(alpha: number): void {
    if (this.backdropFrame) {
      this.backdropFrame.setAlpha(alpha);
    }
    if (this.textFrame) {
      this.textFrame.setAlpha(alpha);
    }
    // 只在有图标配置时才设置图标透明度
    if (this.iconFrame && this.currentConfig?.icon) {
      this.iconFrame.setAlpha(alpha);
    }
  }

  /**
   * 取消所有定时器
   */
  private cancelTimers(): void {
    if (this.showTimer) {
      DestroyTimer(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      DestroyTimer(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.animationTimer) {
      DestroyTimer(this.animationTimer);
      this.animationTimer = null;
    }
  }

  /**
   * 销毁 Tips（通常不需要调用，单例会一直存在）
   */
  public destroy(): void {
    this.cancelTimers();

    if (this.backdropFrame) {
      this.backdropFrame.destroy();
      this.backdropFrame = null;
    }
    if (this.iconFrame) {
      this.iconFrame.destroy();
      this.iconFrame = null;
    }
    if (this.textFrame) {
      this.textFrame.destroy();
      this.textFrame = null;
    }

    this.isCreated = false;
    this.isVisible = false;
    Tips.instance = null;

    Console.log("[Tips] Tips component destroyed");
  }

  /**
   * 检查是否可见
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }
}

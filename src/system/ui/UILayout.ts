/**
 * UI布局管理器
 * 提供常用的UI布局和尺寸预设
 */

import { ScreenCoordinates } from "./ScreenCoordinates";

export interface UIRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WC3Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class UILayout {
  // 常用按钮尺寸（像素）
  public static readonly BUTTON_SIZES = {
    SMALL: { width: 80, height: 32 },
    MEDIUM: { width: 120, height: 40 },
    LARGE: { width: 160, height: 48 },
    EXTRA_LARGE: { width: 200, height: 56 }
  };

  // 常用面板尺寸（像素）
  public static readonly PANEL_SIZES = {
    SMALL: { width: 300, height: 200 },
    MEDIUM: { width: 500, height: 350 },
    LARGE: { width: 700, height: 500 },
    FULLSCREEN: { width: 1820, height: 980 }
  };

  // 间距预设（像素）
  public static readonly SPACING = {
    TINY: 4,
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
    EXTRA_LARGE: 32
  };

  /**
   * 创建按钮位置和尺寸
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param sizePreset 尺寸预设
   * @param origin 坐标原点
   * @returns WC3坐标格式的矩形
   */
  public static createButton(
    x: number,
    y: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ): WC3Rect {
    const size = UILayout.BUTTON_SIZES[sizePreset];
    const wc3Pos = ScreenCoordinates.pixelToWC3(x, y, origin);
    const wc3Size = {
      width: (size.width / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH,
      height: (size.height / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT
    };

    return {
      x: wc3Pos.x,
      y: wc3Pos.y,
      width: wc3Size.width,
      height: wc3Size.height
    };
  }

  /**
   * 创建面板位置和尺寸
   * @param x 像素X坐标
   * @param y 像素Y坐标
   * @param sizePreset 尺寸预设
   * @param origin 坐标原点
   * @returns WC3坐标格式的矩形
   */
  public static createPanel(
    x: number,
    y: number,
    sizePreset: keyof typeof UILayout.PANEL_SIZES = 'MEDIUM',
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ): WC3Rect {
    const size = UILayout.PANEL_SIZES[sizePreset];
    const wc3Pos = ScreenCoordinates.pixelToWC3(x, y, origin);
    const wc3Size = {
      width: (size.width / ScreenCoordinates.STANDARD_WIDTH) * ScreenCoordinates.WC3_SCREEN_WIDTH,
      height: (size.height / ScreenCoordinates.STANDARD_HEIGHT) * ScreenCoordinates.WC3_SCREEN_HEIGHT
    };

    return {
      x: wc3Pos.x,
      y: wc3Pos.y,
      width: wc3Size.width,
      height: wc3Size.height
    };
  }

  /**
   * 创建水平布局的按钮组
   * @param startX 起始X坐标（像素）
   * @param y Y坐标（像素）
   * @param buttonCount 按钮数量
   * @param sizePreset 按钮尺寸预设
   * @param spacing 间距（像素）
   * @param origin 坐标原点
   * @returns 按钮位置数组
   */
  public static createHorizontalButtonGroup(
    startX: number,
    y: number,
    buttonCount: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    spacing: number = UILayout.SPACING.MEDIUM,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ): WC3Rect[] {
    const buttons: WC3Rect[] = [];
    const buttonSize = UILayout.BUTTON_SIZES[sizePreset];

    for (let i = 0; i < buttonCount; i++) {
      const x = startX + i * (buttonSize.width + spacing);
      buttons.push(UILayout.createButton(x, y, sizePreset, origin));
    }

    return buttons;
  }

  /**
   * 创建垂直布局的按钮组
   * @param x X坐标（像素）
   * @param startY 起始Y坐标（像素）
   * @param buttonCount 按钮数量
   * @param sizePreset 按钮尺寸预设
   * @param spacing 间距（像素）
   * @param origin 坐标原点
   * @returns 按钮位置数组
   */
  public static createVerticalButtonGroup(
    x: number,
    startY: number,
    buttonCount: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    spacing: number = UILayout.SPACING.MEDIUM,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ): WC3Rect[] {
    const buttons: WC3Rect[] = [];
    const buttonSize = UILayout.BUTTON_SIZES[sizePreset];

    for (let i = 0; i < buttonCount; i++) {
      const y = startY + i * (buttonSize.height + spacing);
      buttons.push(UILayout.createButton(x, y, sizePreset, origin));
    }

    return buttons;
  }

  /**
   * 创建网格布局
   * @param startX 起始X坐标（像素）
   * @param startY 起始Y坐标（像素）
   * @param rows 行数
   * @param cols 列数
   * @param sizePreset 按钮尺寸预设
   * @param spacing 间距（像素）
   * @param origin 坐标原点
   * @returns 按钮位置数组（按行列顺序）
   */
  public static createGridLayout(
    startX: number,
    startY: number,
    rows: number,
    cols: number,
    sizePreset: keyof typeof UILayout.BUTTON_SIZES = 'MEDIUM',
    spacing: number = UILayout.SPACING.MEDIUM,
    origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
  ): WC3Rect[][] {
    const grid: WC3Rect[][] = [];
    const buttonSize = UILayout.BUTTON_SIZES[sizePreset];

    for (let row = 0; row < rows; row++) {
      const rowButtons: WC3Rect[] = [];
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (buttonSize.width + spacing);
        const y = startY + row * (buttonSize.height + spacing);
        rowButtons.push(UILayout.createButton(x, y, sizePreset, origin));
      }
      grid.push(rowButtons);
    }

    return grid;
  }

  /**
   * 居中对齐元素
   * @param elementWidth 元素宽度（像素）
   * @param elementHeight 元素高度（像素）
   * @param containerWidth 容器宽度（像素），默认为屏幕宽度
   * @param containerHeight 容器高度（像素），默认为屏幕高度
   * @returns 居中位置（像素坐标）
   */
  public static centerAlign(
    elementWidth: number,
    elementHeight: number,
    containerWidth: number = ScreenCoordinates.STANDARD_WIDTH,
    containerHeight: number = ScreenCoordinates.STANDARD_HEIGHT
  ): { x: number; y: number } {
    return {
      x: (containerWidth - elementWidth) / 2,
      y: (containerHeight - elementHeight) / 2
    };
  }

  /**
   * 获取安全区域（避免UI被遮挡）
   * @param margin 边距（像素）
   * @returns 安全区域矩形
   */
  public static getSafeArea(margin: number = 50): UIRect {
    return {
      x: margin,
      y: margin,
      width: ScreenCoordinates.STANDARD_WIDTH - 2 * margin,
      height: ScreenCoordinates.STANDARD_HEIGHT - 2 * margin
    };
  }

  /**
   * 在指定区域内排列元素
   * @param area 区域
   * @param elementCount 元素数量
   * @param elementSize 元素尺寸
   * @param spacing 间距
   * @param direction 排列方向
   * @returns 元素位置数组
   */
  public static arrangeInArea(
    area: UIRect,
    elementCount: number,
    elementSize: { width: number; height: number },
    spacing: number = UILayout.SPACING.MEDIUM,
    direction: 'horizontal' | 'vertical' | 'grid' = 'horizontal'
  ): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];

    switch (direction) {
      case 'horizontal':
        const totalWidth = elementCount * elementSize.width + (elementCount - 1) * spacing;
        const startX = area.x + (area.width - totalWidth) / 2;
        const centerY = area.y + (area.height - elementSize.height) / 2;

        for (let i = 0; i < elementCount; i++) {
          positions.push({
            x: startX + i * (elementSize.width + spacing),
            y: centerY
          });
        }
        break;

      case 'vertical':
        const totalHeight = elementCount * elementSize.height + (elementCount - 1) * spacing;
        const centerX = area.x + (area.width - elementSize.width) / 2;
        const startY = area.y + (area.height - totalHeight) / 2;

        for (let i = 0; i < elementCount; i++) {
          positions.push({
            x: centerX,
            y: startY + i * (elementSize.height + spacing)
          });
        }
        break;

      case 'grid':
        const cols = Math.floor((area.width + spacing) / (elementSize.width + spacing));
        const rows = Math.ceil(elementCount / cols);
        
        const gridWidth = cols * elementSize.width + (cols - 1) * spacing;
        const gridHeight = rows * elementSize.height + (rows - 1) * spacing;
        const gridStartX = area.x + (area.width - gridWidth) / 2;
        const gridStartY = area.y + (area.height - gridHeight) / 2;

        for (let i = 0; i < elementCount; i++) {
          const row = Math.floor(i / cols);
          const col = i % cols;
          positions.push({
            x: gridStartX + col * (elementSize.width + spacing),
            y: gridStartY + row * (elementSize.height + spacing)
          });
        }
        break;
    }

    return positions;
  }
}
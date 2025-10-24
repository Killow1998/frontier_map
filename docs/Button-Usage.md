# Button 组件使用文档

## 概述

`Button` 类是一个三层结构的按钮组件，完全参考魔兽争霸3的Frame UI系统设计。

## 三层结构

```
Button (三层结构)
├── backdropFrame (背景框架) - 显示纹理、边框
├── textFrame (文本框架) - 显示按钮文字
└── buttonFrame (按钮框架) - 接收交互事件
```

### 结构特点

1. **背景框架 (Backdrop)**
   - 负责显示按钮的背景纹理
   - 使用 `setAbsPoint` 设置绝对坐标
   - 支持自定义纹理路径

2. **文本框架 (Text)**
   - 显示按钮的文字内容
   - 支持WC3颜色代码 (`|cffRRGGBB文本|r`)
   - 可设置文本对齐方式

3. **按钮框架 (Button)**
   - 接收鼠标点击、悬停、离开事件
   - 通过 `FrameEventUtils` 绑定事件
   - 覆盖整个按钮区域

## 基本用法

### 1. 创建简单按钮

```typescript
import { Button } from "src/system/ui/component/Buttom";

// 创建按钮实例 (label, x, y, width, height)
const button = new Button("点击我", 400, 300, 120, 40);

// 显示按钮
button.create();
```

### 2. 设置事件回调

```typescript
const button = new Button("测试按钮", 400, 300);

button
  .setOnClick(() => {
    print("按钮被点击!");
  })
  .setOnHover(() => {
    print("鼠标进入");
  })
  .setOnLeave(() => {
    print("鼠标离开");
  });

button.create();
```

### 3. 自定义样式

```typescript
const button = new Button("自定义按钮", 400, 300, 150, 48);

button
  .setTextColor("FF0000") // 红色文字
  .setTexture("UI\\Widgets\\Console\\Human\\CommandButton\\human-activestop-down.blp")
  .setTextAlignment(50); // 居中对齐

button.create();
```

### 4. 链式配置

```typescript
const button = new Button("配置按钮", 400, 300);

button.configure({
  text: "新文本",
  textColor: "00FF00", // 绿色
  texture: "path/to/texture.blp",
  onClick: () => print("点击!"),
  onHover: () => print("悬停!"),
  enabled: true,
  visible: true
});

button.create();
```

### 5. 添加悬停效果

```typescript
const button = new Button("悬停效果", 400, 300);

// 悬停时透明度变为200，正常时255
button.addHoverEffect(200, 255);

button.create();
```

## 完整示例

参考你提供的代码风格:

```typescript
import { Frame, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM } from "@eiriksgata/wc3ts/*";
import { FrameEventUtils } from "src/constants/frame/utils";
import { Console } from "src//system/console";

// 方式1: 使用原生Frame API (你的代码风格)
const backdropFrame = Frame.createType("BackdropButton01", Frame.fromHandle(DzGetGameUI())!, 0, 'BACKDROP', "")!
  .setAbsPoint(FRAME_ALIGN_LEFT_TOP, 0.250000, 0.350000)
  .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, 0.350000, 0.250000)
  .setTexture("UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp", 0, true);

const textFrame = Frame.createType("TEXT", backdropFrame, 0, "TEXT", "")!
  .setAllPoints(backdropFrame)
  .setText("新常量结构测试")
  .setTextAlignment(50, 0);

const frame = Frame.createType("btn", backdropFrame, 3, "BUTTON", "template")!
  .setAllPoints(backdropFrame);

FrameEventUtils.bindEvents(frame, {
  onClick: () => {
    Console.log("TemplateUI: 按钮被点击了!");
  },
  onMouseEnter: () => {
    Console.log("TemplateUI: 鼠标进入按钮区域");
  },
  onMouseLeave: () => {
    Console.log("TemplateUI: 鼠标离开按钮区域");
  }
});

// 方式2: 使用封装的Button类 (等效实现)
const button = new Button("新常量结构测试", 400, 300, 100, 100);

button
  .setTexture("UI\\Widgets\\Console\\Human\\CommandButton\\human-multipleselection-border.blp")
  .setTextAlignment(50)
  .setOnClick(() => {
    Console.log("TemplateUI: 按钮被点击了!");
  })
  .setOnHover(() => {
    Console.log("TemplateUI: 鼠标进入按钮区域");
  })
  .setOnLeave(() => {
    Console.log("TemplateUI: 鼠标离开按钮区域");
  });

button.create();
```

## API 参考

### 构造函数

```typescript
constructor(
  label: string,           // 按钮文本
  x: number,              // X坐标(像素)
  y: number,              // Y坐标(像素)
  width: number = 120,    // 宽度(像素)
  height: number = 40,    // 高度(像素)
  origin: string = ScreenCoordinates.ORIGIN_TOP_LEFT
)
```

### 静态方法

- `createWithPreset(label, x, y, sizePreset, origin)` - 使用预设尺寸创建
- `createAtPresetPosition(label, positionPreset, sizePreset)` - 使用预设位置创建

### 主要方法

#### 创建和销毁
- `create(parent?: Frame)` - 创建并显示按钮
- `destroy()` - 销毁按钮及所有子框架

#### 事件设置
- `setOnClick(callback)` - 设置点击事件
- `setOnHover(callback)` - 设置鼠标进入事件
- `setOnLeave(callback)` - 设置鼠标离开事件
- `click()` - 手动触发点击

#### 外观设置
- `setText(text)` - 设置文本
- `setTextColor(hexColor)` - 设置文本颜色 (如 "FF0000")
- `setTextAlignment(alignment)` - 设置文本对齐
- `setTexture(texturePath)` - 设置背景纹理
- `setTooltip(tooltip)` - 设置工具提示

#### 位置和大小
- `setPosition(x, y)` - 设置位置
- `setSize(width, height)` - 设置大小
- `getPosition()` - 获取位置
- `getSize()` - 获取大小

#### 状态控制
- `setEnabled(enabled)` - 启用/禁用
- `setVisible(visible)` - 显示/隐藏
- `getEnabled()` - 获取启用状态
- `getVisible()` - 获取可见状态

#### 特效
- `addHoverEffect(hoverAlpha, normalAlpha)` - 添加悬停透明度效果

#### 高级配置
- `configure(config)` - 批量配置按钮属性

#### 获取框架
- `getBackdropFrame()` - 获取背景框架
- `getTextFrame()` - 获取文本框架
- `getButtonFrame()` - 获取按钮框架

## 与你的代码对比

### 你的代码 (原生API)
```typescript
const backdropFrame = Frame.createType("BACKDROP", parent, 0, 'BACKDROP', "")!
  .setAbsPoint(FRAME_ALIGN_LEFT_TOP, 0.250, 0.350)
  .setAbsPoint(FRAME_ALIGN_RIGHT_BOTTOM, 0.350, 0.250)
  .setTexture("path.blp", 0, true);

const textFrame = Frame.createType("TEXT", backdropFrame, 0, "TEXT", "")!
  .setAllPoints(backdropFrame)
  .setText("文本")
  .setTextAlignment(50, 0);

const btnFrame = Frame.createType("btn", backdropFrame, 0, "BUTTON", "")!
  .setAllPoints(backdropFrame);

FrameEventUtils.bindEvents(btnFrame, {
  onClick: () => { /* ... */ },
  onMouseEnter: () => { /* ... */ },
  onMouseLeave: () => { /* ... */ }
});
```

### 使用Button类 (封装后)
```typescript
const button = new Button("文本", 400, 300, 100, 100);

button
  .setTexture("path.blp")
  .setTextAlignment(50)
  .setOnClick(() => { /* ... */ })
  .setOnHover(() => { /* ... */ })
  .setOnLeave(() => { /* ... */ })
  .create();
```

## 优势

1. **自动管理三层结构** - 不需要手动创建和关联三个Frame
2. **像素坐标系统** - 自动转换为WC3坐标
3. **链式API** - 支持流畅的方法链调用
4. **事件封装** - 简化事件绑定逻辑
5. **状态管理** - 内置启用/禁用、显示/隐藏状态
6. **完整生命周期** - 自动清理所有子框架

## 注意事项

1. 必须调用 `create()` 方法才能显示按钮
2. 销毁时会自动清理所有三层框架
3. 坐标使用像素值，内部自动转换为WC3坐标
4. 文本颜色使用十六进制格式 (如 "FF0000" 表示红色)
5. 纹理路径使用WC3资源路径格式

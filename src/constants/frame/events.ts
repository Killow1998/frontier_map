/**
 * Frame事件常量定义
 * 用于Frame UI事件处理
 */

/**
 * 当控件（如按钮）被点击时触发
 */
export const FRAMEEVENT_CONTROL_CLICK = 1;

/**
 * 当鼠标光标移入框架区域时触发
 */
export const FRAMEEVENT_MOUSE_ENTER = 2;

/**
 * 当鼠标光标移出框架区域时触发
 */
export const FRAMEEVENT_MOUSE_LEAVE = 3;

/**
 * 当鼠标按钮在框架上松开时触发
 */
export const FRAMEEVENT_MOUSE_UP = 4;

/**
 * 当在框架上滚动鼠标滚轮时触发
 */
export const FRAMEEVENT_MOUSE_WHEEL = 5;

/**
 * 当复选框被勾选时触发（适用于复选框控件）
 */
export const FRAMEEVENT_CHECKBOX_CHECKED = 6;

/**
 * 当编辑框内的文本发生变化时触发
 */
export const FRAMEEVENT_EDITBOX_TEXT_CHANGED = 7;

/**
 * Frame事件类型枚举
 */
export enum FrameEventType {
    CONTROL_CLICK = FRAMEEVENT_CONTROL_CLICK,
    MOUSE_ENTER = FRAMEEVENT_MOUSE_ENTER,
    MOUSE_LEAVE = FRAMEEVENT_MOUSE_LEAVE,
    MOUSE_UP = FRAMEEVENT_MOUSE_UP,
    MOUSE_WHEEL = FRAMEEVENT_MOUSE_WHEEL,
    CHECKBOX_CHECKED = FRAMEEVENT_CHECKBOX_CHECKED,
    EDITBOX_TEXT_CHANGED = FRAMEEVENT_EDITBOX_TEXT_CHANGED
}
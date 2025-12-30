import { MapPlayer, Players } from "@eiriksgata/wc3ts/*";
import { MessageList } from "./ui/component/MessageList";

/**
 * 控制台类
 * 使用MessageList单例来显示日志消息
 */
export class print {
  /**
   * 获取MessageList单例
   */
  public static getMessageList(): MessageList {
    return MessageList.getInstance();
  }

  /**
   * 初始化Console（创建MessageList并调用create）
   * 应该在游戏初始化时调用一次
   * 
   * @param x X坐标（像素，默认300）
   * @param y Y坐标（像素，默认200）
   * @param width 宽度（像素，默认400）
   * @param height 高度（像素，默认300）
   * @param config 可选配置
   */
  public static init(
    x: number = 300,
    y: number = 200,
    width: number = 400,
    height: number = 300,
    config?: Partial<import("./ui/component/MessageList").MessageListConfig>
  ): void {
    const messageList = MessageList.createInstance(x, y, width, height, config);
    // 初始化完成后可以添加一条欢迎消息
    messageList.addMessage("print initialized", 3, "00FF00");
  }

  /**
   * 记录日志消息
   */
  public static log(message: string, duration: number = 5, player?: MapPlayer): void {
    // 只对本地玩家显示
    if (player && player.handle !== GetLocalPlayer()) {
      return;
    }
    
    const messageList = MessageList.getInstance();
    if (!messageList) {
      return;
    }
    
    messageList.addMessage(message, duration, "00FF00");
  }

  /**
   * 记录错误消息
   */
  public static error(message: string, duration: number = 5, player?: MapPlayer): void {
    // 只对本地玩家显示
    if (player && player.handle !== GetLocalPlayer()) {
      return;
    }
    
    const messageList = MessageList.getInstance();
    if (!messageList) {
      return;
    }
    
    messageList.addMessage(message, duration, "FF0000");
  }

  /**
   * 记录警告消息
   */
  public static warn(message: string, duration: number = 5, player?: MapPlayer): void {
    // 只对本地玩家显示
    if (player && player.handle !== GetLocalPlayer()) {
      return;
    }
    
    const messageList = MessageList.getInstance();
    if (!messageList) {
      return;
    }
    
    messageList.addMessage(message, duration, "FFFF00");
  }
}
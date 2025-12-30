import { MapPlayer, Players } from "@eiriksgata/wc3ts/*";
import { MessageList } from "./ui/component/MessageList";
import { Queue } from "../utils/queue";

/**
 * 消息项接口
 */
interface ConsoleMessage {
  text: string;
  duration: number;
  color: string;
}

/**
 * 控制台类
 * 使用队列存储消息，通过定时器每0.1秒处理一条消息
 */
export class Console {
  private static messageQueue: Queue<ConsoleMessage> = new Queue<ConsoleMessage>();
  private static messageList: MessageList | null = null;
  private static processTimer: timer | null = null;
  private static isInitialized: boolean = false;

  /**
   * 获取MessageList单例
   */
  public static getMessageList(): MessageList | null {
    return Console.messageList;
  }

  /**
   * 初始化Console（创建MessageList并调用create，启动消息处理定时器）
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
    if (Console.isInitialized) {
      return;
    }

    // 创建MessageList
    Console.messageList = MessageList.createInstance(x, y, width, height, config);

    // 启动消息处理定时器（每0.1秒处理一条消息）
    Console.processTimer = CreateTimer();
    TimerStart(Console.processTimer, 0.1, true, () => {
      Console.processNextMessage();
    });

    Console.isInitialized = true;

    // 添加欢迎消息到队列
    Console.messageQueue.enqueue({
      text: "Console initialized",
      duration: 3,
      color: "00FF00"
    });
  }

  /**
   * 处理下一条消息（从队列中取出并显示）
   */
  private static processNextMessage(): void {
    if (!Console.messageList || Console.messageQueue.isEmpty()) {
      return;
    }

    const message = Console.messageQueue.dequeue();
    if (message) {
      Console.messageList.addMessage(message.text, message.duration, message.color);
    }
  }

  /**
   * 记录日志消息（只存入队列，不立即显示）
   */
  public static log(message: string, duration: number = 5, player?: MapPlayer): void {
    // 只对本地玩家显示
    if (player && player.handle !== GetLocalPlayer()) {
      return;
    }

    Console.messageQueue.enqueue({
      text: message,
      duration: duration,
      color: "00FF00"
    });
  }

  /**
   * 记录错误消息（只存入队列，不立即显示）
   */
  public static error(message: string, duration: number = 5, player?: MapPlayer): void {
    // 只对本地玩家显示
    if (player && player.handle !== GetLocalPlayer()) {
      return;
    }

    Console.messageQueue.enqueue({
      text: message,
      duration: duration,
      color: "FF0000"
    });
  }

  /**
   * 记录警告消息（只存入队列，不立即显示）
   */
  public static warn(message: string, duration: number = 5, player?: MapPlayer): void {
    // 只对本地玩家显示
    if (player && player.handle !== GetLocalPlayer()) {
      return;
    }

    Console.messageQueue.enqueue({
      text: message,
      duration: duration,
      color: "FFFF00"
    });
  }

  /**
   * 获取队列中待处理的消息数量
   */
  public static getQueueLength(): number {
    return Console.messageQueue.length();
  }

  /**
   * 清空消息队列
   */
  public static clearQueue(): void {
    Console.messageQueue.clear();
  }

  /**
   * 销毁Console（停止定时器并清理资源）
   */
  public static destroy(): void {
    if (Console.processTimer) {
      PauseTimer(Console.processTimer);
      DestroyTimer(Console.processTimer);
      Console.processTimer = null;
    }

    Console.messageQueue.clear();
    Console.messageList = null;
    Console.isInitialized = false;
  }
}
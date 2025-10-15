import { Timer } from "@eiriksgata/wc3ts/*";
import { Console } from "./console";
import { ModuleManager } from "./ModuleManager";

//程序运行目录路径
declare const PROJECT_PATH: string;

/**
 * 热更新管理器
 * 负责检测外部热更新通知并重新加载指定模块
 */
export class HotReload {
  private static instance: HotReload;
  private timer: Timer | null = null;
  private checkInterval: number = 1; // 检查间隔（秒）
  private lastProcessedTimestamp: number = 0;
  private enabled: boolean = true;

  private constructor() {
    // 私有构造函数，确保单例
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): HotReload {
    if (!HotReload.instance) {
      HotReload.instance = new HotReload();
    }
    return HotReload.instance;
  }

  /**
   * 启动热更新监听
   */
  public start(): void {
    if (!this.enabled) {
      print("Hot reload is disabled");
      return;
    }

    if (this.timer) {
      print("Hot reload is already running");
      return;
    }

    print("Starting hot reload system...");

    this.timer = Timer.create();
    this.timer.start(this.checkInterval, true, () => {
      this.checkForUpdates();
    });

    print("Hot reload system started");
  }

  /**
   * 停止热更新监听
   */
  public stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
      print("Hot reload system stopped");
    }
  }

  /**
   * 启用/禁用热更新
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
    print(`Hot reload ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 检查热更新通知
   */
  private checkForUpdates(): void {
    try {
      // 尝试读取热更新通知文件
      const notificationContent = this.readHotReloadFile();
      if (!notificationContent) {
        return;
      }

      const notification = this.parseNotification(notificationContent);
      if (!notification) {
        return;
      }

      // 检查是否是新的通知（仅检查时间戳，忽略文件中的 processed 字段）
      if (notification.timestamp <= this.lastProcessedTimestamp) {
        return;
      }

      // 处理热更新
      this.processHotReload(notification);

      // 标记为已处理（仅在内存中）
      this.markAsProcessed(notification);

    } catch (error) {
      // 静默处理错误，避免在游戏中产生过多日志
      //Console.error(`Hot reload check failed: ${error}`);
    }
  }

  /**
   * 读取热更新通知文件
   */
  private readHotReloadFile(): string | null {
    try {
      // 使用原生 Lua 代码读取文件
      const file = io.open(`${PROJECT_PATH}/hot-reload.json`, "r");
      if (!file) {
        return null;
      }

      // 使用 *l 逐行读取整个文件
      let content = "";
      let line: string | null;
      while (true) {
        line = file[0]?.read("l") || null;
        if (!line) {
          break;
        }
        content += line + "\n";
      }
      file[0]?.close();
      return content;
    } catch (error) {
      print(`Error reading hot reload file: ${error}`);
      return null;
    }
  }

  /**
   * 解析通知内容
   */
  private parseNotification(content: string): HotReloadNotification | null {
    try {
      // 简单的手动 JSON 解析
      return this.parseJsonManually(content);
    } catch (error) {
      return null;
    }
  }

  /**
   * 手动解析简单的 JSON
   */
  private parseJsonManually(jsonStr: string): HotReloadNotification | null {
    try {
      // 简单的字符串解析
      const str = this.removeWhitespace(jsonStr);

      // 提取时间戳
      const timestamp = this.extractNumber(str, '"timestamp":');

      // 提取 action
      const action = this.extractString(str, '"action":"');

      // 提取 modules 数组
      const modules = this.extractModules(str);

      // 提取 processed
      const processed = this.extractBoolean(str, '"processed":');

      return {
        timestamp: timestamp || 0,
        action: action || "",
        modules: modules || [],
        processed: processed || false
      };
    } catch (error) {
      return null;
    }
  }

  private removeWhitespace(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      if (char !== ' ' && char !== '\n' && char !== '\r' && char !== '\t') {
        result += char;
      }
    }
    return result;
  }

  private extractNumber(str: string, key: string): number | null {
    const startIndex = str.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;
    let valueEnd = valueStart;

    while (valueEnd < str.length) {
      const char = str.charAt(valueEnd);
      if (char >= '0' && char <= '9') {
        valueEnd++;
      } else {
        break;
      }
    }

    const numberStr = str.substring(valueStart, valueEnd);
    return numberStr ? parseInt(numberStr) : null;
  }

  private extractString(str: string, key: string): string | null {
    const startIndex = str.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;
    const valueEnd = str.indexOf('"', valueStart);

    if (valueEnd === -1) return null;

    return str.substring(valueStart, valueEnd);
  }

  private extractModules(str: string): string[] {
    const modules: string[] = [];
    const startKey = '"modules":[';
    const startIndex = str.indexOf(startKey);

    if (startIndex === -1) return modules;

    const arrayStart = startIndex + startKey.length;
    const arrayEnd = str.indexOf(']', arrayStart);

    if (arrayEnd === -1) return modules;

    const arrayContent = str.substring(arrayStart, arrayEnd);

    // 简单解析数组中的字符串
    let inString = false;
    let currentString = "";

    for (let i = 0; i < arrayContent.length; i++) {
      const char = arrayContent.charAt(i);

      if (char === '"') {
        if (inString) {
          // 字符串结束
          if (currentString) {
            modules.push(currentString);
            currentString = "";
          }
          inString = false;
        } else {
          // 字符串开始
          inString = true;
        }
      } else if (inString) {
        currentString += char;
      }
    }

    return modules;
  }

  private extractBoolean(str: string, key: string): boolean | null {
    const startIndex = str.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;

    if (str.substring(valueStart, valueStart + 4) === 'true') {
      return true;
    } else if (str.substring(valueStart, valueStart + 5) === 'false') {
      return false;
    }

    return null;
  }

  /**
   * 处理热更新
   */
  private processHotReload(notification: HotReloadNotification): void {
    print(`Processing hot reload for ${notification.modules.length} modules...`);
    print(`Raw modules: ${notification.modules.join(", ")}`);

    // 提取模块名称（从路径中获取实际的模块名）
    const moduleNames = notification.modules.map(fullPath => {
      // 从 "src.system.ui.TemplateUi" 中提取模块名
      const parts = fullPath.split('.');
      let moduleName = parts[parts.length - 1];
      
      // 处理文件名的大小写问题，映射到注册时使用的名称
      const nameMapping: { [key: string]: string } = {
        'TemplateUi': 'TemplateUI',  // 文件名 -> 注册名
        'UnitBlood': 'UnitBlood',
        'CameraControl': 'CameraControl',
        'Actor': 'Actor',
        'ModuleManager': 'ModuleManager',
        'HotReload': 'HotReload'
      };
      
      return nameMapping[moduleName] || moduleName;
    });

    print(`Extracted module names: ${moduleNames.join(", ")}`);

    // 过滤出已注册的模块
    const moduleManager = ModuleManager.getInstance();
    print(`All registered modules: ${moduleManager.getRegisteredModules().join(", ")}`);
    
    const registeredModules = moduleNames.filter(name => 
      moduleManager.isModuleRegistered(name)
    );

    print(`Matched registered modules: ${registeredModules.join(", ")}`);

    if (registeredModules.length === 0) {
      print("  No registered modules to hot reload");
      return;
    }

    // 使用 ModuleManager 进行热重载
    moduleManager.hotReloadModules(registeredModules);

    // 对于未注册的模块，使用传统方式重载
    const unregisteredModules = notification.modules.filter(fullPath => {
      const moduleName = fullPath.split('.').pop() || '';
      return !moduleManager.isModuleRegistered(moduleName);
    });

    if (unregisteredModules.length > 0) {
      print(`Processing ${unregisteredModules.length} unregistered modules with traditional reload...`);
      for (const modulePath of unregisteredModules) {
        try {
          this.reloadModule(modulePath);
          print(`  ✓ Reloaded (traditional): ${modulePath}`);
        } catch (error) {
          print(`  ✗ Failed to reload: ${modulePath} - ${error}`);
        }
      }
    }
  }

  /**
   * 重新加载单个模块
   */
  private reloadModule(moduleName: string): void {
    // 清除模块缓存（使用 any 绕过类型检查）
    (globalThis as any).package.loaded[moduleName] = undefined;

    // 重新加载模块
    const newModule = require(moduleName);

    // 如果模块有初始化函数，调用它
    if (newModule && typeof newModule.initialize === 'function') {
      newModule.initialize();
    }

    // 如果模块有热重载处理函数，调用它
    if (newModule && typeof newModule.onHotReload === 'function') {
      newModule.onHotReload();
    }
  }

  /**
   * 标记通知为已处理（仅在内存中标记）
   */
  private markAsProcessed(notification: HotReloadNotification): void {
    // 由于 Lua 引擎不支持文件写入模式，我们只在内存中标记已处理的时间戳
    // 通过更新 lastProcessedTimestamp 来避免重复处理相同的通知
    this.lastProcessedTimestamp = notification.timestamp;
    print(`Marked notification with timestamp ${notification.timestamp} as processed in memory`);
  }
}

/**
 * 热更新通知接口
 */
interface HotReloadNotification {
  timestamp: number;
  action: string;
  modules: string[];
  processed: boolean;
}
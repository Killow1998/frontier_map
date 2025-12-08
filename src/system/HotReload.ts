import { Timer } from "@eiriksgata/wc3ts/*";
import { ModuleManager } from "./ModuleManager";

// 程序运行目录路径（仅在 dev 模式下由 bootstrap.lua 注入）
declare const PROJECT_PATH: string | undefined;

/**
 * 检查是否为开发模式
 */
function isDevMode(): boolean {
  return typeof PROJECT_PATH !== 'undefined' && PROJECT_PATH !== null;
}

/**
 * 热更新管理器
 * 负责检测外部热更新通知并重新加载指定模块
 * 注意：仅在开发模式下有效，生产环境会自动禁用
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
    // 检查是否为开发模式
    if (!isDevMode()) {
      print(">>> HotReload: Production mode detected, hot reload disabled");
      this.enabled = false;
      return;
    }

    if (!this.enabled) {
      print(">>> HotReload: Hot reload is disabled");
      return;
    }

    if (this.timer) {
      print(">>> HotReload: Hot reload is already running");
      return;
    }

    print(">>> HotReload: Starting hot reload system...");
    print(`>>> HotReload: Check interval: ${this.checkInterval} seconds`);
    print(`>>> HotReload: PROJECT_PATH: ${PROJECT_PATH}`);

    this.timer = Timer.create();
    this.timer.start(this.checkInterval, true, () => {
      this.checkForUpdates();
    });

    print(">>> HotReload: Hot reload system started successfully");
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
        print(">>> HotReload: Failed to parse notification");
        return;
      }

      // 检查是否是新的通知（仅检查时间戳，忽略文件中的 processed 字段）
      if (notification.timestamp <= this.lastProcessedTimestamp) {
        return;
      }

      print(`>>> HotReload: New notification detected!`);
      print(`>>> HotReload: Timestamp: ${notification.timestamp}, Last: ${this.lastProcessedTimestamp}`);
      print(`>>> HotReload: Action: ${notification.action}`);
      print(`>>> HotReload: Modules: ${notification.modules.join(", ")}`);

      // 处理热更新
      this.processHotReload(notification);

      // 标记为已处理（仅在内存中）
      this.markAsProcessed(notification);

    } catch (error) {
      print(`>>> HotReload: Error in checkForUpdates: ${error}`);
    }
  }

  /**
   * 读取热更新通知文件
   */
  private readHotReloadFile(): string | null {
    try {
      const filePath = `${PROJECT_PATH}/hot-reload.json`;
      
      // 使用原生 Lua 代码读取文件
      const file = io.open(filePath, "r");
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
      print(`>>> HotReload: Error reading hot reload file: ${error}`);
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

  private extractModules(str: string): ModuleInfo[] {
    const modules: ModuleInfo[] = [];
    const startKey = '"modules":[';
    const startIndex = str.indexOf(startKey);

    if (startIndex === -1) return modules;

    const arrayStart = startIndex + startKey.length;
    // 找到数组结束位置（需要处理嵌套的对象）
    let depth = 1;
    let arrayEnd = arrayStart;
    for (let i = arrayStart; i < str.length && depth > 0; i++) {
      const char = str.charAt(i);
      if (char === '[' || char === '{') depth++;
      else if (char === ']' || char === '}') depth--;
      if (depth === 0) arrayEnd = i;
    }

    if (arrayEnd === arrayStart) return modules;

    const arrayContent = str.substring(arrayStart, arrayEnd);

    // 解析数组中的对象 {"name":"...","path":"..."}
    let i = 0;
    while (i < arrayContent.length) {
      // 找到对象开始
      const objStart = arrayContent.indexOf('{', i);
      if (objStart === -1) break;
      
      // 找到对象结束
      const objEnd = arrayContent.indexOf('}', objStart);
      if (objEnd === -1) break;
      
      const objContent = arrayContent.substring(objStart, objEnd + 1);
      
      // 提取 name 和 path
      const name = this.extractStringFromObject(objContent, '"name":"');
      const path = this.extractStringFromObject(objContent, '"path":"');
      
      if (name && path) {
        modules.push({ name, path });
      }
      
      i = objEnd + 1;
    }

    return modules;
  }

  /**
   * 从对象字符串中提取字段值
   */
  private extractStringFromObject(objStr: string, key: string): string | null {
    const startIndex = objStr.indexOf(key);
    if (startIndex === -1) return null;

    const valueStart = startIndex + key.length;
    const valueEnd = objStr.indexOf('"', valueStart);

    if (valueEnd === -1) return null;

    return objStr.substring(valueStart, valueEnd);
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
   * notification.modules 包含 {name, path} 对象
   */
  private processHotReload(notification: HotReloadNotification): void {
    print(`>>> HotReload: Processing hot reload for ${notification.modules.length} modules...`);

    const moduleManager = ModuleManager.getInstance();
    const registeredModules = moduleManager.getRegisteredModules();
    print(`>>> HotReload: All registered modules: ${registeredModules.join(", ")}`);

    // 匹配已注册的模块，并传递路径信息
    const matchedModules: ModuleInfo[] = [];

    for (const moduleInfo of notification.modules) {
      print(`>>> HotReload: Checking module: ${moduleInfo.name} (${moduleInfo.path})`);

      if (moduleManager.isModuleRegistered(moduleInfo.name)) {
        print(`>>> HotReload: ✓ Matched: ${moduleInfo.name}`);
        matchedModules.push(moduleInfo);
      } else {
        print(`>>> HotReload: ✗ Not registered: ${moduleInfo.name}`);
      }
    }

    const matchedNames = matchedModules.map(m => m.name).join(", ");
    print(`>>> HotReload: Matched registered modules: ${matchedNames}`);

    if (matchedModules.length === 0) {
      print(">>> HotReload: No registered modules to hot reload");
      return;
    }

    // 使用 ModuleManager 进行热重载，传递完整的模块信息
    print(`>>> HotReload: Calling ModuleManager.hotReloadModules...`);
    moduleManager.hotReloadModulesWithPath(matchedModules);
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
 * 模块信息接口
 */
interface ModuleInfo {
  name: string;  // 注册的模块名，如 "ReloadTemplate"
  path: string;  // require 路径，如 "src.examples.ReloadTemplateExample"
}

/**
 * 热更新通知接口
 */
interface HotReloadNotification {
  timestamp: number;
  action: string;
  modules: ModuleInfo[];  // 改为 ModuleInfo 数组
  processed: boolean;
}
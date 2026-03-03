import { Timer } from "@eiriksgata/wc3ts/*";
import { ModuleManager } from "./ModuleManager";
import { gameEvents, PlayerChatEventData } from "./event";

// 程序运行目录路径（仅在 dev 模式下由 bootstrap.lua 注入）
declare const PROJECT_PATH: string | undefined;
// Lua 标准库，部分运行环境可能被禁用
declare const os: { time: () => number } | undefined;
declare const io:
  | { open: (path: string, mode: string) => LuaFile | null }
  | undefined;

interface LuaFile {
  read: (this: LuaFile, format: string) => string | null;
  close: (this: LuaFile) => void;
}

/**
 * 检查是否为开发模式
 */
function isDevMode(): boolean {
  return typeof PROJECT_PATH !== "undefined" && PROJECT_PATH !== null;
}

/**
 * 热更新管理器（读文件 + 聊天命令双驱动）
 *
 * - 游戏内仅读取 hot-reload.json，不写任何文件（文件由构建脚本/IDE 写入）
 * - 定时轮询 PROJECT_PATH/hot-reload.json，根据时间戳去重，只处理新通知
 * - 同时支持聊天命令 -hr list / all / ModuleA 作为手动触发
 */
export class HotReload {
  private static instance: HotReload;

  private enabled = true;
  private initialized = false;

  /** 定时轮询读文件用的定时器 */
  private timer: Timer | null = null;
  private checkInterval = 1;
  /** 上次已处理的通知时间戳（秒），仅内存，不写文件 */
  private lastProcessedTimestamp = 0;
  /** 游戏启动时间戳（秒），用于忽略启动前的旧通知 */
  private gameStartTimestamp = 0;

  private constructor() {}

  public static getInstance(): HotReload {
    if (!HotReload.instance) {
      HotReload.instance = new HotReload();
    }
    return HotReload.instance;
  }

  /**
   * 启动热重载系统
   * 若环境支持：开启定时器轮询读 hot-reload.json（只读不写）
   * 并注册 -hr 聊天命令
   */
  public start(): void {
    if (!isDevMode()) {
      print(">>> HotReload: Production mode detected, hot reload disabled");
      this.enabled = false;
      return;
    }

    if (!this.enabled) {
      print(">>> HotReload: Hot reload is disabled");
      return;
    }

    if (this.initialized) {
      print(">>> HotReload: Already initialized");
      return;
    }

    // 仅内存记录启动时间，用于过滤旧通知（若 os 不可用则用 0）
    if (typeof os !== "undefined" && os !== null && typeof os.time === "function") {
      this.gameStartTimestamp = os.time();
    } else {
      this.gameStartTimestamp = 0;
    }

    this.registerChatCommands();

    // 若 io 可用则启动定时读文件（只读）
    if (typeof io !== "undefined" && io !== null && typeof io.open === "function") {
      this.timer = Timer.create();
      this.timer.start(this.checkInterval, true, () => {
        this.checkForUpdates();
      });
      print(">>> HotReload: File polling started (read-only, no write)");
    } else {
      print(">>> HotReload: io.open not available, file polling disabled; use -hr commands");
    }

    this.initialized = true;
    print(">>> HotReload: Commands: -hr list | -hr all | -hr ModuleA ...");
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stop();
    print(`Hot reload ${enabled ? "enabled" : "disabled"}`);
  }

  /**
   * 停止定时器（不写文件）
   */
  public stop(): void {
    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
      print(">>> HotReload: File polling stopped");
    }
  }

  /**
   * 轮询读取 hot-reload.json，仅读不写；用 lastProcessedTimestamp 去重（仅内存）
   */
  private checkForUpdates(): void {
    try {
      const content = this.readHotReloadFile();
      if (!content) return;

      const notification = this.parseNotification(content);
      if (!notification) return;

      let ts = notification.timestamp;
      if (ts > 10000000000) ts = Math.floor(ts / 1000);

      if (ts < this.gameStartTimestamp) return;
      if (ts <= this.lastProcessedTimestamp) return;

      print(`>>> HotReload: New notification (ts=${ts}), reloading ${notification.modules.length} module(s)`);
      this.processHotReload(notification);
      this.lastProcessedTimestamp = ts;
    } catch (e) {
      print(`>>> HotReload: checkForUpdates error: ${e}`);
    }
  }

  /**
   * 仅读取文件内容，不写任何东西
   */
  private readHotReloadFile(): string | null {
    try {
      if (typeof PROJECT_PATH !== "string" || !PROJECT_PATH) return null;
      if (typeof io === "undefined" || !io || typeof io.open !== "function") return null;

      const path = `${PROJECT_PATH}/hot-reload.json`;
      const file = io.open(path, "r");
      if (!file) return null;

      const read = file.read;
      let content = "";
      if (read && typeof read === "function") {
        let line: string | null;
        while (true) {
          line = read.call(file, "*l");
          if (line == null) break;
          content += line + "\n";
        }
      }
      file.close();
      return content;
    } catch (e) {
      return null;
    }
  }

  private parseNotification(content: string): HotReloadNotification | null {
    try {
      return this.parseJsonManually(content);
    } catch {
      return null;
    }
  }

  private parseJsonManually(jsonStr: string): HotReloadNotification | null {
    try {
      const str = jsonStr.replace(/\s/g, "");

      const timestamp = this.extractNumber(str, '"timestamp":');
      const action = this.extractString(str, '"action":"');
      const modules = this.extractModules(str);
      const processed = this.extractBoolean(str, '"processed":');

      return {
        timestamp: timestamp ?? 0,
        action: action ?? "",
        modules: modules ?? [],
        processed: processed ?? false,
      };
    } catch {
      return null;
    }
  }

  private extractNumber(str: string, key: string): number | null {
    const i = str.indexOf(key);
    if (i === -1) return null;
    let end = i + key.length;
    while (end < str.length && str.charAt(end) >= "0" && str.charAt(end) <= "9") end++;
    const num = str.substring(i + key.length, end);
    return num ? parseInt(num, 10) : null;
  }

  private extractString(str: string, key: string): string | null {
    const i = str.indexOf(key);
    if (i === -1) return null;
    const start = i + key.length;
    const end = str.indexOf('"', start);
    return end === -1 ? null : str.substring(start, end);
  }

  private extractModules(str: string): ModuleInfo[] {
    const out: ModuleInfo[] = [];
    const key = '"modules":[';
    const i = str.indexOf(key);
    if (i === -1) return out;
    let start = i + key.length;
    let depth = 1;
    let end = start;
    for (let j = start; j < str.length && depth > 0; j++) {
      const c = str.charAt(j);
      if (c === "[" || c === "{") depth++;
      else if (c === "]" || c === "}") depth--;
      if (depth === 0) end = j;
    }
    const arr = str.substring(start, end);
    let k = 0;
    while (k < arr.length) {
      const ob = arr.indexOf("{", k);
      if (ob === -1) break;
      const cb = arr.indexOf("}", ob);
      if (cb === -1) break;
      const name = this.extractStringFromObject(arr.substring(ob, cb + 1), '"name":"');
      const path = this.extractStringFromObject(arr.substring(ob, cb + 1), '"path":"');
      if (name && path) out.push({ name, path });
      k = cb + 1;
    }
    return out;
  }

  private extractStringFromObject(obj: string, key: string): string | null {
    const i = obj.indexOf(key);
    if (i === -1) return null;
    const start = i + key.length;
    const end = obj.indexOf('"', start);
    return end === -1 ? null : obj.substring(start, end);
  }

  private extractBoolean(str: string, key: string): boolean | null {
    const i = str.indexOf(key);
    if (i === -1) return null;
    const v = str.substring(i + key.length, i + key.length + 5);
    if (v.startsWith("true")) return true;
    if (v.startsWith("false")) return false;
    return null;
  }

  private processHotReload(notification: HotReloadNotification): void {
    const mm = ModuleManager.getInstance();
    const matched: ModuleInfo[] = [];
    for (const m of notification.modules) {
      if (mm.isModuleRegistered(m.name)) matched.push(m);
    }
    if (matched.length === 0) {
      print(">>> HotReload: No registered modules to reload");
      return;
    }
    mm.hotReloadModulesWithPath(matched);
  }

  // ----- 聊天命令（保留为手动触发） -----

  private registerChatCommands(): void {
    gameEvents.onPlayerChat((data: PlayerChatEventData) => {
      const msg = (data.message || "").trim();
      if (!msg.startsWith("-hr") || !this.enabled || !isDevMode()) return;
      this.handleCommand(msg);
    });
  }

  private handleCommand(msg: string): void {
    const parts = msg.split(/\s+/);
    if (parts.length === 1 || parts[1] === "help" || parts[1] === "?") {
      this.printHelp();
      return;
    }
    const sub = parts[1];
    if (sub === "list") {
      this.printRegisteredModules();
      return;
    }
    if (sub === "all") {
      this.reloadAllModules();
      return;
    }
    this.reloadSelectedModules(parts.slice(1));
  }

  private printHelp(): void {
    print(">>> HotReload: -hr list | -hr all | -hr NameA NameB ...");
  }

  private printRegisteredModules(): void {
    const list = ModuleManager.getInstance().getRegisteredModules();
    print(`>>> HotReload: Registered (${list.length}): ${list.join(", ")}`);
  }

  private reloadAllModules(): void {
    const list = ModuleManager.getInstance().getRegisteredModules();
    if (list.length === 0) {
      print(">>> HotReload: No modules to reload");
      return;
    }
    ModuleManager.getInstance().hotReloadModules(list);
  }

  private reloadSelectedModules(names: string[]): void {
    const mm = ModuleManager.getInstance();
    const valid: string[] = [];
    for (const n of names) {
      if (mm.isModuleRegistered(n)) valid.push(n);
      else print(`>>> HotReload: Not registered: ${n}`);
    }
    if (valid.length === 0) return;
    mm.hotReloadModules(valid);
  }
}

interface ModuleInfo {
  name: string;
  path: string;
}

interface HotReloadNotification {
  timestamp: number;
  action: string;
  modules: ModuleInfo[];
  processed: boolean;
}

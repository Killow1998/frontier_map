import { ConfigManager } from "../config";

export const ydcommon = require("jass.common")
export const ydai = require("jass.ai")
export const ydglobals = require("jass.globals")
export const ydjapi = require("jass.japi")
export const ydhook = require("jass.hook")
export const ydruntime: Ijassruntime = require("jass.runtime")
export const ydslk = require("jass.slk")
export const ydconsole: Ijassconsole = require("jass.console")
export const yddebug: Ijassdebug = require("jass.debug")
export const ydlog = require("jass.log")
export const ydmessage = require("jass.message")
export const ydbignum = require("jass.bignum")


export interface Ijassconsole {
  enable: boolean;
  read: (f: (...msg: any[]) => void) => void;
  write: (...msg: any[]) => void;
}

export class ydlua {

  private configManager: ConfigManager;
  private static instance: ydlua;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
  }

  /**
 * 获取实例
 */
  public static getInstance(): ydlua {
    if (!ydlua.instance) {
      ydlua.instance = new ydlua();
    }
    return ydlua.instance;
  }

  /**
 * 初始化运行时
 */
  private initializeRuntime(): void {
    const config = this.configManager.getConfig();
    const runtimeConfig = config.runtime;

    ydruntime.console = config.console;
    ydruntime.sleep = runtimeConfig.sleep;
    ydruntime.debugger = runtimeConfig.debuggerPort;
    ydruntime.catch_crash = runtimeConfig.catchCrash;

    // 设置错误处理器
    ydruntime.error_hanlde = function (msg: any) {
      print("========lua-err========");
      print(tostring(msg));
      print("=========================");
    };

    print(`>>> Runtime configured: debugger=${runtimeConfig.debuggerPort}, crash_catch=${runtimeConfig.catchCrash}`);
  }

  /**
   * 初始化 YD Lua 相关内容
   * 自动化注册 JASS 全局函数到 _G
   * 方便在 TypeScript 中调用
   */
  /**
   * 初始化运行时环境
   */
  public initialize(): void {
    this.initializeConsole();
    this.initializeRuntime();
    this.registerGlobals();
  }

  /**
 * 初始化控制台
 */
  private initializeConsole(): void {
    const isConsoleEnabled = this.configManager.isConsoleEnabled();
    ydconsole.enable = isConsoleEnabled;

    if (isConsoleEnabled) {
      // 设置全局 print 函数
      _G["print"] = (message: string) => ydconsole.write(message);
      print('>>> Console enabled');
    }
  }


  /**
   * 注册全局变量
   */
  private registerGlobals(): void {
    // 注册 jass.common 到全局
    Object.keys(ydcommon).forEach(key => {
      // @ts-ignore
      _G[key] = ydcommon[key];
    });

    // 注册 jass.japi 到全局
    Object.keys(ydjapi).forEach(key => {
      // @ts-ignore
      _G[key] = ydjapi[key];
    });

    print('>>> Global APIs registered');
  }

};
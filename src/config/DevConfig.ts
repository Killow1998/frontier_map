/** @noSelfInFile */

/**
 * 开发环境配置
 * 管理热更新和开发工具的设置
 */

export interface DevConfig {
  /** 是否启用热更新 */
  hotReload: {
    enabled: boolean;
    autoStart: boolean;
    checkInterval: number;
    preserveState: boolean;
  };
  
  /** 调试设置 */
  debug: {
    enabled: boolean;
    logLevel: 'info' | 'warn' | 'error';
    showTimestamps: boolean;
  };
  
  /** 开发命令 */
  commands: {
    enabled: boolean;
    adminOnly: boolean;
  };
}

/**
 * 默认开发配置
 */
export const DEFAULT_DEV_CONFIG: DevConfig = {
  hotReload: {
    enabled: true,        // 启用热更新
    autoStart: true,      // 自动启动
    checkInterval: 2,     // 2秒检查间隔
    preserveState: true   // 保持状态
  },
  
  debug: {
    enabled: true,        // 启用调试
    logLevel: 'info',     // 信息级别日志
    showTimestamps: true  // 显示时间戳
  },
  
  commands: {
    enabled: true,        // 启用开发命令
    adminOnly: true       // 仅管理员可用
  }
};

/**
 * 开发环境管理器
 */
export class DevEnvironment {
  private static instance: DevEnvironment;
  private config: DevConfig;
  private startTime: number;

  private constructor(config: DevConfig) {
    this.config = config;
    this.startTime = os.time();
  }

  public static getInstance(config?: DevConfig): DevEnvironment {
    if (!DevEnvironment.instance) {
      DevEnvironment.instance = new DevEnvironment(config || DEFAULT_DEV_CONFIG);
    }
    return DevEnvironment.instance;
  }

  /**
   * 初始化开发环境
   */
  public initialize(): void {
    this.log('info', '=== 开发环境初始化开始 ===');
    
    // 显示配置信息
    this.printConfig();
    
    // 设置调试环境
    if (this.config.debug.enabled) {
      this.setupDebugEnvironment();
    }
    
    // 设置开发命令
    if (this.config.commands.enabled) {
      this.setupDevelopmentCommands();
    }
    
    this.log('info', '=== 开发环境初始化完成 ===');
  }

  /**
   * 打印配置信息
   */
  private printConfig(): void {
    this.log('info', '开发环境配置:');
    this.log('info', `  热更新: ${this.config.hotReload.enabled ? '启用' : '禁用'}`);
    this.log('info', `  调试模式: ${this.config.debug.enabled ? '启用' : '禁用'}`);
    this.log('info', `  开发命令: ${this.config.commands.enabled ? '启用' : '禁用'}`);
  }

  /**
   * 设置调试环境
   */
  private setupDebugEnvironment(): void {
    // 重定向 print 函数以添加时间戳
    if (this.config.debug.showTimestamps) {
      const originalPrint = print;
      
      // @ts-ignore
      _G.print = (message: string) => {
        const timestamp = this.getFormattedTime();
        originalPrint(`[${timestamp}] ${message}`);
      };
    }
    
    this.log('info', '调试环境已设置');
  }

  /**
   * 设置开发命令
   */
  private setupDevelopmentCommands(): void {
    const trigger = CreateTrigger();
    
    // 注册聊天事件
    for (let i = 0; i < 8; i++) {
      TriggerRegisterPlayerChatEvent(trigger, Player(i), "-dev", false);
    }
    
    TriggerAddAction(trigger, () => {
      const chatString = GetEventPlayerChatString();
      const player = GetTriggerPlayer();
      
      // 权限检查
      if (this.config.commands.adminOnly && GetPlayerId(player) !== 0) {
        return;
      }
      
      this.handleDevCommand(chatString);
    });
    
    this.log('info', '开发命令已注册');
    this.log('info', '可用命令: -dev help');
  }

  /**
   * 处理开发命令
   */
  private handleDevCommand(command: string): void {
    const parts = command.split(' ');
    const cmd = parts[1] || 'help';
    
    switch (cmd) {
      case 'help':
        this.showHelpMenu();
        break;
        
      case 'status':
        this.showStatus();
        break;
        
      case 'config':
        this.showCurrentConfig();
        break;
        
      case 'performance':
        this.showPerformanceInfo();
        break;
        
      case 'memory':
        this.showMemoryInfo();
        break;
        
      case 'time':
        this.showTimeInfo();
        break;
        
      default:
        this.log('warn', `未知命令: ${cmd}。输入 -dev help 查看帮助`);
        break;
    }
  }

  /**
   * 显示帮助菜单
   */
  private showHelpMenu(): void {
    this.log('info', '=== 开发命令帮助 ===');
    this.log('info', '-dev help        - 显示此帮助');
    this.log('info', '-dev status      - 显示系统状态');
    this.log('info', '-dev config      - 显示当前配置');
    this.log('info', '-dev performance - 显示性能信息');
    this.log('info', '-dev memory      - 显示内存信息');
    this.log('info', '-dev time        - 显示时间信息');
  }

  /**
   * 显示系统状态
   */
  private showStatus(): void {
    const uptime = os.time() - this.startTime;
    this.log('info', '=== 系统状态 ===');
    this.log('info', `运行时间: ${uptime} 秒`);
    this.log('info', `热更新: ${this.config.hotReload.enabled ? '活跃' : '未启用'}`);
    this.log('info', `调试模式: ${this.config.debug.enabled ? '开启' : '关闭'}`);
  }

  /**
   * 显示当前配置
   */
  private showCurrentConfig(): void {
    this.log('info', '=== 当前配置 ===');
    this.log('info', JSON.stringify(this.config, null, 2));
  }

  /**
   * 显示性能信息
   */
  private showPerformanceInfo(): void {
    this.log('info', '=== 性能信息 ===');
    
    // Lua 的垃圾回收信息
    const memoryKB = collectgarbage('count');
    this.log('info', `Lua 内存使用: ${memoryKB.toFixed(2)} KB`);
    
    // 其他性能指标
    this.log('info', `FPS: ${GetLocalizedString("GAMEERR_FRAME_RATE")} (模拟)`);
  }

  /**
   * 显示内存信息
   */
  private showMemoryInfo(): void {
    this.log('info', '=== 内存信息 ===');
    
    const beforeGC = collectgarbage('count');
    collectgarbage('collect');
    const afterGC = collectgarbage('count');
    
    this.log('info', `GC 前: ${beforeGC.toFixed(2)} KB`);
    this.log('info', `GC 后: ${afterGC.toFixed(2)} KB`);
    this.log('info', `释放: ${(beforeGC - afterGC).toFixed(2)} KB`);
  }

  /**
   * 显示时间信息
   */
  private showTimeInfo(): void {
    const current = os.time();
    const uptime = current - this.startTime;
    
    this.log('info', '=== 时间信息 ===');
    this.log('info', `当前时间戳: ${current}`);
    this.log('info', `启动时间戳: ${this.startTime}`);
    this.log('info', `运行时长: ${uptime} 秒`);
    this.log('info', `格式化时间: ${this.getFormattedTime()}`);
  }

  /**
   * 获取格式化时间
   */
  private getFormattedTime(): string {
    const time = os.time();
    const minutes = Math.floor(time / 60) % 60;
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * 日志函数
   */
  private log(level: 'info' | 'warn' | 'error', message: string): void {
    if (this.shouldLog(level)) {
      const prefix = this.getLogPrefix(level);
      print(`${prefix}${message}`);
    }
  }

  /**
   * 检查是否应该记录日志
   */
  private shouldLog(level: 'info' | 'warn' | 'error'): boolean {
    const levels = ['info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.debug.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * 获取日志前缀
   */
  private getLogPrefix(level: 'info' | 'warn' | 'error'): string {
    const prefixes = {
      info: '[INFO] ',
      warn: '[WARN] ',
      error: '[ERROR] '
    };
    
    return prefixes[level];
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<DevConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.log('info', '开发配置已更新');
  }

  /**
   * 获取配置
   */
  public getConfig(): DevConfig {
    return { ...this.config };
  }
}
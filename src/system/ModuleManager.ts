/**
 * 模块管理器
 * 负责管理各个模块的热更新和生命周期
 */

interface ModuleInfo {
  name: string;
  module: any;
  initializeFunction?: () => void;
  cleanupFunction?: () => void;
  hotReloadFunction?: () => void;
  dependencies?: string[];
  initialized: boolean;
}

export class ModuleManager {
  private static instance: ModuleManager;
  private modules: Map<string, ModuleInfo> = new Map();
  private initializationOrder: string[] = [];

  private constructor() {
    // 私有构造函数，确保单例
    print(">>> ModuleManager: Instance created");
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      print(">>> ModuleManager: Creating new instance");
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  /**
   * 注册模块
   */
  public registerModule(
    name: string, 
    module: any, 
    options: {
      initialize?: () => void;
      cleanup?: () => void;
      onHotReload?: () => void;
      dependencies?: string[];
    } = {}
  ): void {
    const moduleInfo: ModuleInfo = {
      name,
      module,
      initializeFunction: options.initialize,
      cleanupFunction: options.cleanup,
      hotReloadFunction: options.onHotReload,
      dependencies: options.dependencies || [],
      initialized: false
    };

    this.modules.set(name, moduleInfo);
    print(`>>> ModuleManager: Module registered: ${name}`);
    print(`>>> ModuleManager: Total registered modules: ${this.modules.size}`);
    print(`>>> ModuleManager: Current modules: ${Array.from(this.modules.keys()).join(", ")}`);
  }

  /**
   * 初始化所有模块（按依赖顺序）
   */
  public initializeAllModules(): void {
    // 计算初始化顺序
    this.calculateInitializationOrder();
    
    // 按顺序初始化
    for (const moduleName of this.initializationOrder) {
      this.initializeModule(moduleName);
    }
  }

  /**
   * 初始化单个模块
   */
  private initializeModule(name: string): void {
    const moduleInfo = this.modules.get(name);
    if (!moduleInfo) {
      print(`Warning: Module ${name} not found`);
      return;
    }

    if (moduleInfo.initialized) {
      return; // 已经初始化过了
    }

    // 先初始化依赖
    for (const depName of moduleInfo.dependencies || []) {
      this.initializeModule(depName);
    }

    // 初始化当前模块
    try {
      if (moduleInfo.initializeFunction) {
        moduleInfo.initializeFunction();
      }
      moduleInfo.initialized = true;
      print(`Module initialized: ${name}`);
    } catch (error) {
      print(`Error initializing module ${name}: ${error}`);
    }
  }

  /**
   * 热重载指定模块
   */
  public hotReloadModule(name: string): void {
    const moduleInfo = this.modules.get(name);
    if (!moduleInfo) {
      print(`Warning: Module ${name} not registered for hot reload`);
      return;
    }

    try {
      // 1. 清理旧模块（如果有清理函数）
      if (moduleInfo.cleanupFunction) {
        moduleInfo.cleanupFunction();
        print(`Cleaned up module: ${name}`);
      }

      // 2. 重新加载模块
      const modulePath = this.getModulePathFromName(name);
      if (modulePath) {
        // 清除模块缓存
        (globalThis as any).package.loaded[modulePath] = undefined;
        
        // 重新加载
        const newModule = require(modulePath);
        moduleInfo.module = newModule;
        
        print(`Reloaded module: ${name} from ${modulePath}`);
      }

      // 3. 调用热重载处理函数
      if (moduleInfo.hotReloadFunction) {
        moduleInfo.hotReloadFunction();
        print(`Hot reload handled for module: ${name}`);
      }

      // 4. 重新初始化（如果需要）
      if (moduleInfo.initializeFunction) {
        moduleInfo.initialized = false;
        this.initializeModule(name);
      }

    } catch (error) {
      print(`Error during hot reload of module ${name}: ${error}`);
    }
  }

  /**
   * 批量热重载多个模块
   */
  public hotReloadModules(moduleNames: string[]): void {
    print(`Hot reloading ${moduleNames.length} modules...`);
    
    let successCount = 0;
    let failCount = 0;

    for (const moduleName of moduleNames) {
      try {
        this.hotReloadModule(moduleName);
        successCount++;
      } catch (error) {
        failCount++;
        print(`Failed to hot reload module ${moduleName}: ${error}`);
      }
    }

    print(`Hot reload completed: ${successCount} succeeded, ${failCount} failed`);
  }

  /**
   * 将模块路径名转换为实际的 require 路径
   */
  private getModulePathFromName(name: string): string | null {
    // 根据模块名称查找对应的路径
    // 这里需要处理文件名大小写的映射
    
    const pathMappings: { [key: string]: string } = {
      'TemplateUI': 'src.examples.TemplateUi',  // 正确路径：src/examples/TemplateUi.ts
      'UnitBlood': 'src.system.ui.UnitBlood',
      'CameraControl': 'src.utils.CameraControl',
      'Actor': 'src.system.actor',
      'ModuleManager': 'src.system.ModuleManager',
      'HotReload': 'src.system.HotReload',
      // 添加更多映射...
    };

    if (pathMappings[name]) {
      return pathMappings[name];
    }

    // 如果没有找到映射，尝试一些通用的路径模式
    const possiblePaths = [
      `src.system.ui.${name}`,
      `src.system.${name}`,
      `src.utils.${name}`,
      `src.${name}`,
    ];

    return possiblePaths[0];
  }

  /**
   * 计算模块初始化顺序（拓扑排序）
   */
  private calculateInitializationOrder(): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (name: string): void => {
      if (visiting.has(name)) {
        throw new Error(`Circular dependency detected involving ${name}`);
      }
      if (visited.has(name)) {
        return;
      }

      visiting.add(name);
      
      const moduleInfo = this.modules.get(name);
      if (moduleInfo) {
        for (const depName of moduleInfo.dependencies || []) {
          visit(depName);
        }
      }
      
      visiting.delete(name);
      visited.add(name);
      order.push(name);
    };

    for (const moduleName of this.modules.keys()) {
      if (!visited.has(moduleName)) {
        visit(moduleName);
      }
    }

    this.initializationOrder = order;
  }

  /**
   * 获取已注册的模块列表
   */
  public getRegisteredModules(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * 检查模块是否已注册
   */
  public isModuleRegistered(name: string): boolean {
    return this.modules.has(name);
  }
}
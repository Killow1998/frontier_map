/** @noSelfInFile */

// 句柄类型标识，不限制枚举，方便扩展
type LeakKind = string;

interface LeakRecord {
  kind: LeakKind;
  createdAt: number;
  stack?: string;
}

declare const os: { clock?: () => number } | undefined;
declare const debug:
  | {
      traceback?: (msg?: string, level?: number) => string;
    }
  | undefined;

// Lua 全局表，动态访问各种 CreateX / DestroyX / RemoveX 原生
declare const _G: Record<string, unknown>;

declare function tostring(value: unknown): string;

export class LeakDetector {
  private static installed = false;
  private static enabled = true;
  private static records = new Map<unknown, LeakRecord>();

  /**
   * 安装钩子，只需在游戏初始化时调用一次
   */
  public static install(): void {
    if (this.installed) {
      return;
    }
    this.installed = true;

    this.hookTimer();
    this.hookTrigger();

    print("|cffffff00[LeakDetector]|r 已安装句柄跟踪钩子");
  }

  public static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 打印当前疑似泄露的对象
   * @param minLifetimeSec 只显示存活时间大于等于该值的对象（秒）
   */
  public static dump(minLifetimeSec = 0): void {
    const now = this.now();
    let count = 0;

    print("|cff00ff00========== LeakDetector Report ==========" + "|r");

    for (const [obj, info] of this.records.entries()) {
      const life = now - info.createdAt;
      if (life < minLifetimeSec) {
        continue;
      }

      count++;
      print(
        string.format(
          "#%d [%s] 存活时间: %.2fs 对象: %s",
          count,
          info.kind,
          life,
          tostring(obj as never),
        ),
      );

      if (info.stack) {
        print(info.stack);
      }
    }

    if (count === 0) {
      print(
        string.format(
          "LeakDetector: 未发现疑似泄露对象（阈值 %.2fs）",
          minLifetimeSec,
        ),
      );
    } else {
      print(
        string.format(
          "LeakDetector: 共发现 %d 个疑似泄露对象（阈值 %.2fs）",
          count,
          minLifetimeSec,
        ),
      );
    }

    print("|cff00ff00=========================================" + "|r");
  }

  /**
   * 清空当前所有记录（例如在读图/重新开始时）
   */
  public static reset(): void {
    this.records.clear();
  }

  // ======================== 内部实现 ========================

  /**
   * 针对一对 CreateX / DestroyX 或 RemoveX 做通用 Hook
   */
  private static hookHandlePair(
    createName: string,
    destroyName: string,
    kind: LeakKind,
  ): void {
    const createFn = _G[createName] as ((...args: unknown[]) => unknown) | undefined;
    const destroyFn = _G[destroyName] as
      | ((handle: unknown, ...rest: unknown[]) => void)
      | undefined;

    if (typeof createFn !== "function" || typeof destroyFn !== "function") {
      // 对于当前环境不存在的原生，静默跳过
      return;
    }

    const self = this;

    // Hook 创建
    _G[createName] = ((...args: unknown[]): unknown => {
      const handle = createFn(...args);
      if (handle != null) {
        self.registerHandle(handle, kind);
      }
      return handle;
    }) as unknown;

    // Hook 销毁
    _G[destroyName] = ((handle: unknown, ...rest: unknown[]): void => {
      self.unregisterHandle(handle);
      return destroyFn(handle, ...rest);
    }) as unknown;
  }

  /**
   * 安装核心的一批句柄 Hook
   * （常见泄露源：timer / trigger / group / location / region / force 等）
   */
  private static hookTimer(): void {
    this.hookHandlePair("CreateTimer", "DestroyTimer", "timer");
  }

  private static hookTrigger(): void {
    this.hookHandlePair("CreateTrigger", "DestroyTrigger", "trigger");
    this.hookHandlePair("CreateGroup", "DestroyGroup", "group");
    this.hookHandlePair("CreateForce", "DestroyForce", "force");
    this.hookHandlePair("Location", "RemoveLocation", "location");
    this.hookHandlePair("CreateRegion", "RemoveRegion", "region");
    this.hookHandlePair("CreateFogModifierRect", "DestroyFogModifier", "fogRect");
    this.hookHandlePair("CreateFogModifierRadius", "DestroyFogModifier", "fogRadius");
    this.hookHandlePair("CreateTriggerDialog", "DestroyTriggerDialog", "triggerDialog");
    this.hookHandlePair("CreateTimerDialog", "DestroyTimerDialog", "timerDialog");
    this.hookHandlePair("CreateTextTag", "DestroyTextTag", "texttag");
    this.hookHandlePair("AddSpecialEffect", "DestroyEffect", "effect");
    this.hookHandlePair("AddSpecialEffectTarget", "DestroyEffect", "effectTarget");
  }

  private static registerHandle(
    handle: unknown,
    kind: LeakKind,
  ): void {
    if (!this.enabled) {
      return;
    }

    const createdAt = this.now();
    const stack = this.captureStack();

    this.records.set(handle, { kind, createdAt, stack });
  }

  private static unregisterHandle(handle: unknown): void {
    if (!this.enabled) {
      return;
    }
    this.records.delete(handle);
  }

  private static now(): number {
    try {
      if (os && typeof os.clock === "function") {
        return os.clock();
      }
    } catch {
      // ignore
    }
    return 0;
  }

  private static captureStack(): string | undefined {
    try {
      if (debug && typeof debug.traceback === "function") {
        // 第二个参数 3：跳过 LeakDetector 自身的几层调用
        return debug.traceback("", 3);
      }
    } catch {
      // ignore
    }
    return undefined;
  }
}


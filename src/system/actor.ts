import { Unit, MapPlayer } from "@eiriksgata/wc3ts/*";
import { UnitBlood } from "./ui/UnitBlood";

export class Actor extends Unit {
  public static allActors: Record<number, Actor> = {};

  // 私有字段存储实际值，并设置默认值
  private _hpBarUIHeight: number = 150; // 默认血条UI高度
  private _size: number = 1.0; // 默认大小倍数

  /**
   * @deprecated 请使用 Actor.create 或 Actor.fromUnit 或 Actor.fromHandle 静态方法
   * @param owner 单位所有者
   * @param unitId 单位ID
   * @param x X坐标
   * @param y Y坐标 
   * @param face 朝向角度
   */
  constructor(owner: MapPlayer, unitId: number, x: number, y: number, face?: number) {
    super(owner, unitId, x, y, face);
    // 将当前实例添加到全局管理器中
    Actor.allActors[this.id] = this;
  }

  /**
   * 创建新的Actor单位
   * @param owner 单位所有者
   * @param unitId 单位ID (FourCC)
   * @param x X坐标
   * @param y Y坐标
   * @param facing 朝向角度（可选）
   * @returns Actor实例，如果创建失败返回undefined
   */
  public static create(
    owner: MapPlayer,
    unitId: number,
    x: number,
    y: number,
    facing: number = 0
  ): Actor | undefined {
    // 检查是否已经存在该位置的单位
    const handle = CreateUnit(owner.handle, unitId, x, y, facing);
    if (handle === undefined) {
      return undefined;
    }

    // 检查是否已经是Actor
    const unitId_handle = GetHandleId(handle);
    const existingActor = Actor.allActors[unitId_handle];
    if (existingActor !== undefined) {
      return existingActor;
    }

    // 创建Actor实例 - 使用wc3ts的getObject方法
    const actor = Actor.getObject(handle) as Actor;
    if (actor !== undefined) {
      const values: Record<string, unknown> = {};
      values.handle = handle;
      Object.assign(actor, values);

      // 添加到管理器
      Actor.allActors[actor.id] = actor;
      return actor;
    }

    return undefined;
  }

  /**
   * 从现有Unit创建Actor
   * @param unit 现有的Unit实例
   * @returns Actor实例
   */
  public static fromUnit(unit: Unit): Actor {
    // 检查是否已经是Actor
    const existingActor = Actor.allActors[unit.id];
    if (existingActor !== undefined) {
      return existingActor;
    }

    // 从Unit的handle创建Actor
    return Actor.fromHandle(unit.handle)!;
  }

  /**
   * 从handle创建Actor
   * @param handle 单位handle
   * @returns Actor实例，如果handle无效返回undefined
   */
  public static fromHandle(handle: unit): Actor | undefined {
    if (handle === undefined) {
      return undefined;
    }

    // 检查是否已经存在
    const unitId = GetHandleId(handle);
    const existingActor = Actor.allActors[unitId];
    if (existingActor !== undefined) {
      return existingActor;
    }

    // 使用wc3ts的getObject方法创建实例
    const actor = Actor.getObject(handle) as Actor;
    if (actor !== undefined) {
      const values: Record<string, unknown> = {};
      values.handle = handle;
      Object.assign(actor, values);

      // 添加到管理器
      Actor.allActors[actor.id] = actor;
      return actor;
    }

    return undefined;
  }

  /**
   * 获取指定ID的Actor
   * @param unitId 单位ID
   * @returns Actor实例或undefined
   */
  public static getById(unitId: number): Actor | undefined {
    return Actor.allActors[unitId];
  }

  /**
   * 移除Actor（当单位死亡或被移除时调用）
   */
  public destroy(): void {
    // 从全局管理器中移除
    delete Actor.allActors[this.id];

    // 移除相关的UI
    UnitBlood.remove(this);

    // 调用父类的销毁方法
    super.destroy();
  }

  public set hpBarUIHeight(value: number) {
    this._hpBarUIHeight = value;
  }

  public get hpBarUIHeight(): number {
    return this._hpBarUIHeight;
  }

  public set size(value: number) {
    this._size = value;
  }

  public get size(): number {
    return this._size;
  }

  /**
   * 为当前Actor创建血条UI
   */
  public createBloodBar(): void {
    UnitBlood.create(this);
  }

}
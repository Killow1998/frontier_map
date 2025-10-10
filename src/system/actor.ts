import { Unit } from "@eiriksgata/wc3ts/*";

export class Actor extends Unit {
  // 私有字段存储实际值，并设置默认值
  private _hpBarUIHeight: number = 300; // 默认血条UI高度
  private _size: number = 1.0; // 默认大小倍数

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

}
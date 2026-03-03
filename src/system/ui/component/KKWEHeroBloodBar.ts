/**
 * 英雄血条/蓝条（YD 风格）
 * 参考 JASS 逻辑：DzFrameBindWidget 绑定单位 + 定时器更新血条/蓝条宽度
 * 使用方式：给英雄创建血条只需传入单位，例如 HeroBloodBarYD.create(unit)
 */

import { bj_MAX_PLAYER_SLOTS } from "@eiriksgata/wc3ts/src/globals/define";
import {
  UNIT_TYPE_HERO,
  UNIT_TYPE_DEAD,
  UNIT_STATE_LIFE,
  UNIT_STATE_MAX_LIFE,
  UNIT_STATE_MANA,
  UNIT_STATE_MAX_MANA,
} from "src/constants/game/units";

/** 血条宽度（比例） */
const BAR_WIDTH = 0.04;
/** 血条高度 */
const LIFE_HEIGHT = 0.005;
/** 蓝条高度 */
const MANA_HEIGHT = 0.003;

/** 定时器间隔（与 JASS 0.03 一致） */
const TIMER_INTERVAL = 0.03;

/**
 * 获取英雄单位头像贴图路径（可改为从配置/物编读取）
 */
function getHeroArtPath(unitTypeId: number): string {
  return "ReplaceableTextures\\CommandButtons\\BTNHeroPaladin.blp";
}

export class KKWEHeroBloodBar {
  private unit: unit;
  private unitId: number;
  private backdrop: number;
  private lifeBar: number;
  private manaBar: number;
  private heroIcon: number;
  private heroName: number;
  private timer: timer;
  private barWidth: number;
  private lifeHeight: number;
  private manaHeight: number;

  private heroIconTextFrame: number;

  /** 血条底层父 Frame 句柄 */
  private static lifeBaseFrame: number = 0;
  /** unitId -> 血条实例 */
  private static instanceMap: Record<number, KKWEHeroBloodBar> = {};

  private constructor(u: unit) {
    this.unit = u;
    this.unitId = GetHandleId(u);
    this.barWidth = BAR_WIDTH;
    this.lifeHeight = LIFE_HEIGHT;
    this.manaHeight = MANA_HEIGHT;

    const base = KKWEHeroBloodBar.getLifeBaseFrame();
    const idStr = String(this.unitId);
    const nameBackdrop = "血条" + idStr;
    const nameLife = "血条图片" + idStr;
    const nameMana = "蓝条图片" + idStr;
    const nameIcon = "血条英雄图标" + idStr;
    const nameText = "血条英雄名字" + idStr;

    const nameIconText = "血条英雄图标文字" + idStr;

    const backdrop = DzCreateFrameByTagName("BACKDROP", nameBackdrop, base as any, "", 0);
    DzFrameBindWidget(backdrop as any, u, 0, 0, 0, 0, 0, false, true, false);
    DzFrameSetTexture(backdrop, "Textures\\Black32.blp", 0);
    DzFrameSetSize(backdrop, this.barWidth, this.lifeHeight + this.manaHeight);

    const lifeBar = DzCreateFrameByTagName("BACKDROP", nameLife, backdrop, "", 0);
    DzFrameSetPoint(lifeBar, 0, backdrop, 0, 0, 0);
    if (IsUnitEnemy(u, GetLocalPlayer())) {
      DzFrameSetTexture(lifeBar, "ReplaceableTextures\\TeamColor\\TeamColor00.blp", 0);
    } else {
      DzFrameSetTexture(lifeBar, "ReplaceableTextures\\TeamColor\\TeamColor06.blp", 0);
    }
    DzFrameSetSize(lifeBar, this.barWidth, this.lifeHeight);

    const manaBar = DzCreateFrameByTagName("BACKDROP", nameMana, backdrop, "", 0);
    DzFrameSetPoint(manaBar, 6, backdrop, 6, 0, 0);
    DzFrameSetTexture(manaBar, "ReplaceableTextures\\TeamColor\\TeamColor01.blp", 0);
    DzFrameSetSize(manaBar, this.barWidth, this.manaHeight);

    const heroIcon = DzCreateFrameByTagName("BACKDROP", nameIcon, backdrop, "", 0);
    DzFrameSetPoint(heroIcon, 5, backdrop, 3, 0, 0);
    //DzFrameSetTexture(heroIcon, getHeroArtPath(GetUnitTypeId(u)), 0);
    DzFrameSetTexture(heroIcon, "Textures\\Black32.blp", 0);
    DzFrameSetSize(heroIcon, 0.01, 0.01);

    const heroIconText = DzCreateFrameByTagName("TEXT", nameIconText, heroIcon, "", 0);
    DzFrameSetPoint(heroIconText, 0, heroIcon, 0, 0, 0);
    DzFrameSetSize(heroIconText, 0.01, 0.01);
    DzFrameSetText(heroIconText, "1");
    DzFrameSetTextAlignment(heroIconText, 4);
    DzFrameSetIgnoreTrackEvents(heroIconText as any, true);

    const heroName = DzCreateFrameByTagName("TEXT", nameText, backdrop, "", 0);
    DzFrameSetPoint(heroName, 7, backdrop, 1, 0, 0.002);
    DzFrameSetSize(heroName, 0.0, 0.01);
    DzFrameSetText(heroName, GetUnitName(u));
    DzFrameSetTextAlignment(heroName, 4);
    DzFrameSetIgnoreTrackEvents(heroName as any, true);

    this.backdrop = backdrop as any;
    this.lifeBar = lifeBar as any;
    this.manaBar = manaBar as any;
    this.heroIcon = heroIcon as any;
    this.heroName = heroName as any;
    this.heroIconTextFrame = heroIconText as any;

    this.timer = CreateTimer();
    KKWEHeroBloodBar.instanceMap[this.unitId] = this;
    TimerStart(this.timer, TIMER_INTERVAL, true, () => this.onTimerTick());
  }

  /** 定时器回调：更新血条/蓝条宽度，单位无效时自动销毁 */
  private onTimerTick(): void {
    if (this.unit == null || IsUnitType(this.unit, UNIT_TYPE_DEAD) || this.backdrop === 0) {
      this.destroy();
      return;
    }
    const maxLife = GetUnitState(this.unit, UNIT_STATE_MAX_LIFE);
    const lifePercent = maxLife <= 0 ? 0 : (GetUnitState(this.unit, UNIT_STATE_LIFE) / maxLife) * 100;
    const maxMana = GetUnitState(this.unit, UNIT_STATE_MAX_MANA);
    const manaPercent = maxMana <= 0 ? 0 : (GetUnitState(this.unit, UNIT_STATE_MANA) / maxMana) * 100;
    const heroLevel = GetUnitLevel(this.unit);

    DzFrameSetText(this.heroIconTextFrame as any, heroLevel + '');

    DzFrameSetSize(this.lifeBar as any, (this.barWidth * lifePercent) / 100, this.lifeHeight);
    DzFrameSetSize(this.manaBar as any, (this.barWidth * manaPercent) / 100, this.manaHeight);
  }

  /**
   * 销毁血条并释放定时器
   */
  public destroy(): void {
    if (this.backdrop !== 0) {
      DzFrameUnBind(this.backdrop);
      DzDestroyFrame(this.backdrop as any);
    }
    if (this.lifeBar !== 0) DzDestroyFrame(this.lifeBar as any);
    if (this.manaBar !== 0) DzDestroyFrame(this.manaBar as any);
    if (this.heroIcon !== 0) DzDestroyFrame(this.heroIcon as any);
    if (this.heroName !== 0) DzDestroyFrame(this.heroName as any);
    if (this.timer != null) DestroyTimer(this.timer);

    this.unit = null as any;
    this.backdrop = 0;
    this.lifeBar = 0;
    this.manaBar = 0;
    this.heroIcon = 0;
    this.heroName = 0;
    delete KKWEHeroBloodBar.instanceMap[this.unitId];
  }

  /** 获取绑定的单位 */
  public getUnit(): unit {
    return this.unit;
  }

  /** 获取单位 handle id */
  public getUnitId(): number {
    return this.unitId;
  }

  // ---------- 静态方法 ----------

  private static getLifeBaseFrame(): number {
    if (KKWEHeroBloodBar.lifeBaseFrame !== 0) {
      return KKWEHeroBloodBar.lifeBaseFrame;
    }
    const lower = DzFrameGetLowerLevelFrame();
    KKWEHeroBloodBar.lifeBaseFrame = DzCreateFrameByTagName("FRAME", "血条底层", lower as any, "", 0) as unknown as number;
    return KKWEHeroBloodBar.lifeBaseFrame;
  }

  /**
   * 给单位创建英雄血条，传入单位即可。
   * 仅对英雄单位有效；若该单位已有血条则返回已有实例。
   * @param u 单位（通常为英雄）
   * @returns 血条实例，非英雄或创建失败时返回 null
   */
  public static create(u: unit): KKWEHeroBloodBar | null {
    if (u == null) return null;
    if (IsUnitType(u, UNIT_TYPE_HERO) !== true) return null;

    //隐藏单位的血条
    DzSetUnitPreselectUIVisible(u, false);
    const unitId = GetHandleId(u);
    const existing = KKWEHeroBloodBar.instanceMap[unitId];
    if (existing != null) return existing;

    return new KKWEHeroBloodBar(u);
  }

  /**
   * 根据单位获取已创建的血条实例
   */
  public static get(u: unit): KKWEHeroBloodBar | null {
    if (u == null) return null;
    return KKWEHeroBloodBar.instanceMap[GetHandleId(u)] ?? null;
  }

  /**
   * 移除指定单位的血条（若存在）
   */
  public static removeByUnit(u: unit): void {
    const bar = KKWEHeroBloodBar.get(u);
    if (bar != null) bar.destroy();
  }

  /**
   * 设置血条底层父框架（若在 main 中已创建可传入句柄）
   */
  public static setLifeBaseFrame(frameHandle: number): void {
    KKWEHeroBloodBar.lifeBaseFrame = frameHandle;
  }


}

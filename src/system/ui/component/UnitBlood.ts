import { Frame, FRAME_ALIGN_BOTTOM, FRAME_ALIGN_CENTER, FRAME_ALIGN_LEFT_TOP, FRAME_ALIGN_RIGHT_BOTTOM, FRAME_ALIGN_TOP, MapPlayer, Timer, Unit, UNIT_TYPE_DEAD } from "@eiriksgata/wc3ts/*";
import { CameraControl } from "src/utils/CameraControl";
import { worldToScreen } from "src/utils/helper";
import { Actor } from "../../actor";


export class UnitBlood {

  public static allUnitBlood: Record<number, UnitBlood> = {};

  // 标记是否已经注册过绘制事件
  private static isDrawEventRegistered: boolean = false;

  actor: Actor;
  frame: Frame;
  lifeFrame: Frame;
  manaFrame: Frame;
  levelFrame: Frame;
  nameBoxFrame: Frame;
  nameFrame: Frame;

  /**
   * 私有构造函数，防止直接实例化
   */
  private constructor(actor: Actor) {
    this.actor = actor;
    actor.setPreselectUIVisible(false);

    //血条UI基底框架
    this.frame = Frame.createType("UnitBloodFrame", Frame.fromHandle(DzGetGameUI())!, 0, "BACKDROP", "")!;
    this.frame.setSize(130 / 2400, 28 / 1800);
    this.frame.setTexture("UI\\hpbar\\01.tga", 0, false);
    this.frame.setVisible(true);

    //血条生命值框架
    this.lifeFrame = Frame.createType("LifeFrame", this.frame, 0, "BACKDROP", "")!;
    this.lifeFrame.setSize(100 / 2400, 12 / 1800);
    this.lifeFrame.setTexture("UI\\hpbar\\02.tga", 0, false);
    this.lifeFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.frame, FRAME_ALIGN_LEFT_TOP, 26 / 2400, -4 / 1800);

    //血条魔法值框架
    this.manaFrame = Frame.createType("ManaFrame", this.frame, 0, "BACKDROP", "")!;
    this.manaFrame.setSize(100 / 2400, 8 / 1800);
    this.manaFrame.setTexture("UI\\hpbar\\03.tga", 0, false);
    this.manaFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.frame, FRAME_ALIGN_LEFT_TOP, 26 / 2400, -16 / 1800);

    //血条等级框架
    this.levelFrame = Frame.createType("LevelFrame", this.frame, 0, "TEXT", "")!;
    this.levelFrame.setTextAlignment(50, 0);
    this.levelFrame.setText(`${actor.level}`);
    this.levelFrame.setFont("resource\\hpbar\\ZiTi.ttf", 0.01, 0);

    this.levelFrame.setPoint(FRAME_ALIGN_CENTER, this.frame, FRAME_ALIGN_LEFT_TOP, 14 / 2400, -14 / 1800);

    //血条名称框架
    this.nameBoxFrame = Frame.createType("NameBoxFrame", this.frame, 0, "BACKDROP", "")!;
    this.nameBoxFrame.setTexture("UI\\hpbar\\07.tga", 0, false);
    this.nameBoxFrame.alpha = 75;

    //血条名称文本框架
    this.nameFrame = Frame.createType("NameFrame", this.nameBoxFrame, 0, "TEXT", "")!;
    this.nameFrame.setText(actor.name);
    this.nameFrame.setTextAlignment(18, 0);
    this.nameFrame.setFont("UI\\resource\\hpbar\\ZiTi.ttf", 0.01, 0);
    // this.nameFrame.setSize(0, 0.006)
    
    this.nameFrame.alpha = 255;
    this.nameFrame.setPoint(FRAME_ALIGN_BOTTOM, this.frame, FRAME_ALIGN_TOP, 0.003, 10 / 1800);

    this.nameBoxFrame.setPoint(FRAME_ALIGN_LEFT_TOP, this.nameFrame, FRAME_ALIGN_LEFT_TOP, -0.003, 0.004);
    this.nameBoxFrame.setPoint(FRAME_ALIGN_RIGHT_BOTTOM, this.nameFrame, FRAME_ALIGN_RIGHT_BOTTOM, 0.004, -0.004);

    if (actor.owner == MapPlayer.fromLocal()) {
      this.lifeFrame.setTexture("hpbar\\02.tga", 0, false);
    } else {
      if (actor.isAlly(MapPlayer.fromLocal())) {
        this.lifeFrame.setTexture("hpbar\\06.tga", 0, false);
      } else {
        this.lifeFrame.setTexture("hpbar\\05.tga", 0, false);
      }
    }

    UnitBlood.allUnitBlood[actor.id] = this;
  }

  /**
   * 创建或获取 UnitBlood 实例
   * 如果已存在则返回现有实例，否则创建新实例
   */
  public static create(actor: Actor): UnitBlood {
    // 如果已经存在，直接返回现有实例
    if (UnitBlood.allUnitBlood[actor.id] !== undefined) {
      return UnitBlood.allUnitBlood[actor.id];
    }

    // 不存在则创建新实例
    return new UnitBlood(actor);
  }

  /**
   * 获取指定单位的血条UI
   */
  public static get(unit: Unit): UnitBlood | undefined {
    return UnitBlood.allUnitBlood[unit.id];
  }

  /**
   * 移除指定单位的血条UI
   */
  public static remove(unit: Unit): void {
    const unitBlood = UnitBlood.allUnitBlood[unit.id];
    if (unitBlood !== undefined) {
      unitBlood.destroy();
      delete UnitBlood.allUnitBlood[unit.id];
    }
  }

  /**
   * 销毁血条UI
   */
  public destroy(): void {
    this.frame.destroy();
    this.actor.setPreselectUIVisible(true);
    delete UnitBlood.allUnitBlood[this.actor.id];
    // console.log(`UnitBlood for unit ${this.unit.id} destroyed.`);
    // 其他清理工作...
  }


  /**
   * 注册本地绘制事件
   * 此方法只能调用一次，重复调用会被忽略
   */
  public static registerLocalDrawEvent(): boolean {
    // 如果已经注册过，直接返回 false 表示未执行
    if (UnitBlood.isDrawEventRegistered) {
      print("UnitBlood: 绘制事件已经注册过，重复调用被忽略");
      return false;
    }

    // 标记为已注册
    UnitBlood.isDrawEventRegistered = true;

    // 执行注册逻辑
    DzFrameSetUpdateCallbackByCode(() => {
      CameraControl.update();
      // 这里可以添加其他需要每帧更新的血条逻辑
      UnitBlood.updateAllUnitBloods();
    });

    print("UnitBlood: 绘制事件注册成功");
    return true;
  }

  /**
   * 检查绘制事件是否已注册
   */
  public static isRegistered(): boolean {
    return UnitBlood.isDrawEventRegistered;
  }

  /**
   * 更新所有血条UI（每帧调用）
   */
  private static updateAllUnitBloods(): void {
    for (const unitId in UnitBlood.allUnitBlood) {
      const unitBlood = UnitBlood.allUnitBlood[unitId];
      if (unitBlood !== undefined) {
        unitBlood.updateUI();
      }
    }
  }

  /**
   * 更新单个血条UI
   */
  private updateUI(): void {
    // 检查单位是否还存在
    if (this.actor.life <= 0 || !this.actor.handle || this.actor.id == 0) {
      this.destroy();
      return;
    }

    // 更新血条位置、生命值等
    // 这里可以添加具体的更新逻辑
    this.updateLifeBar();
    this.updateManaBar();

    this.updatePosition();

    this.levelFrame.setText(`${this.actor.level}`);
  }

  /**
   * 更新生命值条
   */
  private updateLifeBar(): void {
    const lifePercent = this.actor.life / this.actor.maxLife;
    this.lifeFrame.setSize((100 / 2400) * lifePercent, 12 / 1800);
  }

  /**
   * 更新魔法值条
   */
  private updateManaBar(): void {
    const manaPercent = this.actor.mana / this.actor.maxMana;
    this.manaFrame.setSize((100 / 2400) * manaPercent, 8 / 1800);
  }

  /**
   * 更新血条位置（世界坐标转屏幕坐标）
   */
  private updatePosition(): void {
    // 获取单位的世界坐标
    const unitX = this.actor.x;
    const unitY = this.actor.y;

    // 转换为屏幕坐标
    const screenPos = worldToScreen(unitX, 0, unitY);

    // 获取单位的高度和体积倍数
    const unitHeight = this.actor.hpBarUIHeight; // 单位高度数据
    const sizeMultiplier = this.actor.size; // 体积倍数数据

    const baseOffset = 2200.00 + 800.00; // 基础偏移量
    const unitHeightOffset = unitHeight * sizeMultiplier; // 单位高度偏移
    const totalHeight = baseOffset + unitHeightOffset; // 总高度
    const cameraEyeZ = GetCameraEyePositionZ(); // 摄像机视点Z坐标
    const heightDifference = totalHeight - cameraEyeZ; // 高度差
    const yAdjustment = heightDifference * 0.00006; // Y坐标调整量

    // 计算最终的屏幕Y坐标
    const finalScreenY = screenPos.screenY + yAdjustment;
    
    //判断是否在控制台的位置
    if (finalScreenY >= 1000 / 1800 ||
      finalScreenY <= 300 / 1800 ||
      this.actor.life < 0.05 ||
      this.actor.isUnitType(UNIT_TYPE_DEAD()) ||
      screenPos.screenX >= 1850 / 2400 ||
      screenPos.screenX <= 70 / 2400
    ) {
      this.frame.setVisible(false);
      return;
    }

    if (this.actor == undefined || this.actor.id == 0) {
      this.destroy();
      return;
    }
    if (DzFrameIsVisible(this.frame.handle) == false) {
      this.frame.setVisible(true);
    }

    this.frame.setAbsPoint(FRAME_ALIGN_BOTTOM, screenPos.screenX, finalScreenY);

  }


}
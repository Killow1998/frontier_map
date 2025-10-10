import { Frame, FRAME_ALIGN_BOTTOM, FRAME_ALIGN_CENTER, Timer, Unit, UNIT_TYPE_DEAD } from "@eiriksgata/wc3ts/*";
import { Console } from "../console";


export class UnitBlood {

  unit: Unit;

  frame: Frame;

  timer: Timer;

  constructor(unit: Unit) {
    this.unit = unit;
    unit.setPreselectUIVisible(false);

    this.frame = Frame.createType("UnitBloodFrame", Frame.fromHandle(DzGetGameUI())!, 0, "BACKDROP", "")!;
    //this.frame.setPoint(FRAME_ALIGN_CENTER, Frame.fromHandle(DzGetGameUI())!, FRAME_ALIGN_CENTER, 0, 0);

    this.frame.setSize(0.04, 0.01);
    this.frame.setTexture("UI\\Widgets\\StatusBar\\HealthBar\\HealthBar.blp", 0, false);
    this.frame.setVisible(true);

    //获取单位血条的屏幕坐标
    const hpBarFrame = DzFrameGetUnitHpBar(unit.handle);
    Console.log(`hpBarFrame: ${hpBarFrame}`);

    this.frame.setPoint(FRAME_ALIGN_BOTTOM, Frame.fromHandle(hpBarFrame as any)!, FRAME_ALIGN_BOTTOM, 0, 0);
    

    this.timer = Timer.create().start(0.1, true, () => {
      if (this.unit == null) {
        this.frame.destroy();
      }
      if (this.unit.isUnitType(UNIT_TYPE_DEAD())) {
        this.frame.setVisible(false);
        return;
      }
    });

  }






}
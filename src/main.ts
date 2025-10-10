
import { Effect, Unit, Players, Frame, FRAME_ALIGN_BOTTOM, FRAME_ALIGN_CENTER, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { FourCC } from "./utils/helper";
import { Console } from "./system/console";
import { UnitBlood } from "./system/ui/UnitBlood";
import { CameraControl } from "./utils/CameraControl";
;

/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {

  print("hello ts");
  DisplayTextToPlayer(Player(0), 0, 0, "hello ts");


  const unit = Unit.create(Players[0], FourCC('hfoo'), 0, 0, 0)!;
  print(`Created unit: ${unit.name}`);

  //改变攻击力
  unit.setBaseDamageJAPI(100);

  let x = 330.00 / 2400.00
  let y = 430.00 / 1800.00

  //创建一个UI 使用原生
  // const frame = DzCreateFrameByTagName("BACKDROP", "fraUserLike", DzGetGameUI() as any, "template", 0)
  // DzEnableWideScreen(true)
  // DzFrameSetSize(frame, 410.00 / 2400.00, 100.00 / 1800.00)
  // DzFrameSetPoint(frame, 4, DzGetGameUI() as any, 4, x, y)
  // DzFrameSetTexture(frame, "UI\\Widgets\\BattleNet\\bnet-userlist-back.blp", 0)

  //Console.log(`frame created: ${frame}`)

  //创建一个UI 使用封装的
  const frame = Frame.createType("TestFrame", Frame.fromHandle(DzGetGameUI())!, 0, "BACKDROP", "")!;
  frame.setSize(410.00 / 2400.00, 100.00 / 1800.00);
  frame.setPoint(FRAME_ALIGN_CENTER, Frame.fromHandle(DzGetGameUI())!, FRAME_ALIGN_CENTER, x, y);
  frame.setTexture("UI\\Widgets\\BattleNet\\bnet-userlist-back.blp", 0, false);


  //载入自定义血条UI 
  new UnitBlood(unit);

  Timer.create().start(1, false, () => {
    CameraControl.initMouseControl();
  });



  //移动镜头到单位坐标
  // SetCameraTargetController(unit.handle, 0, 0, true);
  // SetCameraQuickPosition(GetUnitX(unit.handle), GetUnitY(unit.handle));

  //创建一个特效
  const effect = Effect.create("Abilities\\Spells\\Human\\FlameStrike\\FlameStrikeTarget.mdl", GetUnitX(unit.handle), GetUnitY(unit.handle))!;
  effect.setHeight(100);
  effect.setYaw(0);
  effect.setPitch(0);
  effect.setRoll(0);

}



// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
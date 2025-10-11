
import { Players, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { FourCC } from "./utils/helper";
import { UnitBlood } from "./system/ui/UnitBlood";
import { CameraControl } from "./utils/CameraControl";
import { Actor } from "./system/actor";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 */
async function main(): Promise<void> {



  Timer.create().start(1, false, () => {
    //禁用黑色阴影和迷雾
    FogMaskEnable(false)
    FogEnable(false)
    // 必须开启宽屏模式
    DzEnableWideScreen(true)

    CameraControl.initMouseControl();

    UnitBlood.registerLocalDrawEvent();

    const unit = Actor.create(Players[0], FourCC('Hpal'), 0, 0, 0)!;
    print(`Created unit: ${unit.name}`);
    SetCameraQuickPosition(unit.x, unit.y);

    //改变攻击力
    unit.setBaseDamageJAPI(100);

    unit.createBloodBar();

    const testUnit = Actor.create(Players[1], FourCC('Hpal'), 300, 300, 0)!;
    testUnit.createBloodBar();

  });



  // 移动镜头到单位坐标
  // SetCameraTargetController(unit.handle, 0, 0, true);


}



// register ydlua
ydlua.getInstance().initialize();

// 启动应用程序
main();
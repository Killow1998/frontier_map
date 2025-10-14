
import { Players, Timer } from "@eiriksgata/wc3ts/*";
import { ydlua } from "./ydlua";
import { FourCC } from "./utils/helper";
import { UnitBlood } from "./system/ui/UnitBlood";
import { CameraControl } from "./utils/CameraControl";
import { Actor } from "./system/actor";


/**
 * 应用程序主入口
 * 负责引导整个应用程序的启动
 * 测试自动重新编译功能
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

    //移动镜头到目标
    PanCameraToTimed(unit.x, unit.y, 0);
    SetCameraQuickPosition(unit.x, unit.y);


    //改变攻击力
    unit.setBaseDamageJAPI(100);

    unit.createBloodBar();

    const testUnit = Actor.create(Players[1], FourCC('Hpal'), 300, 300, 0)!;
    testUnit.createBloodBar();

    print("hello ! test")
  });



  // 移动镜头到单位坐标
  // SetCameraTargetController(unit.handle, 0, 0, true);


}

/**
 * 初始化函数 - 供模块化加载使用
 */
export function initialize(): void {
  // register ydlua
  ydlua.getInstance().initialize();

  // 启动应用程序
  main();
}
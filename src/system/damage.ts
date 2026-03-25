import { EVENT_UNIT_DAMAGED, EVENT_UNIT_DEATH, Group, Rectangle, Region, Timer, Trigger, Unit } from "@eiriksgata/wc3ts/*";
import { gameEvents, GameEventType, UnitDeathEventData, UnitDamageEventData } from "./event";
import { FourCC } from "src/utils/helper";
import { Actor } from "./actor";
import { eventBus } from "./event/EventBus";

export default class DamageSystem {

  public static unitGroup: Group;
  private static instance: DamageSystem;
  private static dmgTrigger: Trigger;

  private static triggerEventCount = 0;

  // 使用 Actor 创建事件动态补注册，避免 Timer 循环遍历。
  private constructor() {
  }
  public static getInstance(): DamageSystem {
    if (!DamageSystem.instance) {
      DamageSystem.instance = new DamageSystem();
    }
    return DamageSystem.instance;
  }

  //
  public initialize() {
    //选取地图所有的单位注册受到伤害事件
    DamageSystem.dmgTrigger = Trigger.create();
    DamageSystem.unitGroup = Group.create()!;
    DamageSystem.unitGroup.enumUnitsInRange(0, 0, 10000, () => {
      const u = GetFilterUnit();
      DamageSystem.dmgTrigger.registerUnitEvent(Unit.fromHandle(u)!, EVENT_UNIT_DAMAGED());
      DamageSystem.triggerEventCount++;
      return true
    });
    
    //注册地图区域进入事件
    const region = Region.create();
    const worldBounds = Rectangle.getWorldBounds();
    region.addRect(worldBounds!);
    DamageSystem.dmgTrigger.registerEnterRegion(region, () => {
      //单位不能在单位组中
      const u = GetEnteringUnit();
      if (u == null) return true;
      if(GetUnitAbilityLevel(GetFilterUnit(), FourCC('Aloc')) <= 0) return true;
      if (DamageSystem.unitGroup.hasUnit(Unit.fromHandle(u)!)) return true;
      DamageSystem.dmgTrigger.registerUnitEvent(Unit.fromHandle(u)!, EVENT_UNIT_DAMAGED());
      DamageSystem.unitGroup.addUnit(Unit.fromHandle(u)!);
      DamageSystem.triggerEventCount++;
      return true;
    });

    //任意单位死亡时移除单位组中的单位、
    gameEvents.onUnitDeath((data: UnitDeathEventData) => {
      const unit = data.Actor;
      if (unit == null) return;
      DamageSystem.unitGroup.removeUnit(unit);
    });

    //
    // 将原生受到伤害事件转发到 GameEvent 系统
    DamageSystem.dmgTrigger.addAction(() => {
      const damagedUnit = GetTriggerUnit();
      const damageSource = GetEventDamageSource();
      const rawDamage = GetEventDamage();

      const data = new UnitDamageEventData(
        Actor.fromHandle(damagedUnit),
        GetUnitTypeId(damagedUnit),
        GetOwningPlayer(damagedUnit),
        Actor.fromHandle(damageSource),
        rawDamage
      );

      gameEvents.emit(GameEventType.UNIT_DAMAGED, data);
    });

    //每10分钟，检测触发器事件大于 30000时，则重新注册触发 用于释放资源
    Timer.create().start(10 * 60, false, () => {
      if (DamageSystem.triggerEventCount > 30000) {
        this.releaseUnitEvent();
        DamageSystem.triggerEventCount = 0;
      }
    });

    // 动态补注册：Actor 创建/升级时通知 DamageSystem。
    // 这样新创建单位也能触发 UNIT_DAMAGED，从而护盾系统生效。
    eventBus.on("game:Actor:created", ({ actor }: { actor: Actor }) => {
      if (!DamageSystem.unitGroup || !DamageSystem.dmgTrigger) return;
      if (DamageSystem.unitGroup.hasUnit(actor)) return;

      DamageSystem.dmgTrigger.registerUnitEvent(actor, EVENT_UNIT_DAMAGED());
      DamageSystem.unitGroup.addUnit(actor);
      DamageSystem.triggerEventCount++;
    });

  }


  //释放事件中绑定的单位句柄，并重新注册触发
  public releaseUnitEvent() {
    //销毁原触发器和事件
    DamageSystem.dmgTrigger.destroy();
    DamageSystem.dmgTrigger = Trigger.create();
  }
}


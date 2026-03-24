import { Timer, Players } from "@eiriksgata/wc3ts/*";
import { Actor } from "src/system/actor";
import { gameEvents, SpellEventData, UnitDeathEventData } from "src/system/event";
import { FourCC } from "src/utils/helper";

export function rgeisterUnitSpellEffectEvent():void{

  gameEvents.onSpellEffect((data: SpellEventData) => {
    print("单位释放了技能: " + data.abilityId);
  })
  gameEvents.onUnitDeath((data: UnitDeathEventData) => {
    const time = Timer.create().start(1, false, () => {
      //复活
      data.Actor?.revive(0, 0, true);
      data.Actor!.mana = 3000;
      time.destroy();
    })
  })

  for (let j = 0; j < 5; j++) {
    for (let i = 0; i < 10; i++) {
      const unit = Actor.create(Players[j], FourCC('Hpal'), 0, 0);
      if (unit == null) return;
      print("创建单位: " + unit?.id);
      unit.createBloodBar();
      unit.setLabel("测试单位");

      //攻击速度
      //unit.setUnitAttackCooldownJAPI(0.5);

      //添加霜冻新星技能
      unit.addAbility(FourCC('AUfn'));

      //添加水元素技能
      unit.addAbility(FourCC('AHwe'));

      unit.maxMana = 3000;
      unit.mana = 3000;

      //添加护盾
      //unit.addShield(1000);



    }
  }


}
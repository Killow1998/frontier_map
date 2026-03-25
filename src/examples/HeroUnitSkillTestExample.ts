import { Unit, Players, Timer } from "@eiriksgata/wc3ts/*";
import { FourCC } from "src/utils/helper";
import { castBlizzardSkill } from "./HeroUnitSkill";

export function castBlizzardSkillTest(): void {

  const caster = Unit.create(Players[0], FourCC("Hpal"), 0, 0);
    const target = Unit.create(Players[1], FourCC("Hpal"), 400, 0);
    if (!caster || !target) {
      return;
    }

    Timer.create().start(1, false, () => {
      // 以敌方单位当前坐标为技能中心（非固定 0,0）
      castBlizzardSkill(caster.handle, target.x, target.y, {
        damage: 120,
        radius: 400,
        duration: 3,
        interval: 0.3,
        stormCount: 8,
      });
    });
}
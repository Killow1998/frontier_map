
import { Players } from "@eiriksgata/wc3ts/*";
import { Actor } from "src/system/actor";
import { FourCC } from "src/utils/helper";

export const MAP_UNITS_INIT_CREATE = {
  "玩家1圣骑士": Actor.create(Players[0], FourCC('Hpal'), 0, 0, 0)!,
  "玩家2圣骑士": Actor.create(Players[1], FourCC('Hpal'), 300, 300, 0)!
}
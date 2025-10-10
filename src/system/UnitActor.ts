import { Actor } from "./actor";

export class UnitActor extends Actor {

  life: number = 1;
  mana: number = 1;

  set lifePercent(percent: number) {
    this.life = percent / 100;
  }

  set manaPercent(percent: number) {
    this.mana = percent / 100;
  }

  get lifePercent() {
    return this.life * 100;
  }

  get manaPercent() {
    return this.mana * 100;
  }

  
}
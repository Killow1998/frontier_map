import { MapPlayer, Players } from "@eiriksgata/wc3ts/*";

export class Console {

  public static log(message: string, player: MapPlayer = Players[0]) {
    DisplayTextToPlayer(player.handle, 0, 0, message);
  }

}
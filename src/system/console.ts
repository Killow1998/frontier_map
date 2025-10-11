import { MapPlayer, Players } from "@eiriksgata/wc3ts/*";

export class Console {

  public static log(message: string, player: MapPlayer = Players[0]) {
    DisplayTextToPlayer(player.handle, 0, 0, `|cff00ff00${message}|r`);
  }

  public static err(message: string, player: MapPlayer = Players[0]) {
    DisplayTextToPlayer(player.handle, 0, 0, `|cffff0000${message}|r`);
  }

  public static warn(message: string, player: MapPlayer = Players[0]) {
    DisplayTextToPlayer(player.handle, 0, 0, `|cffffff00${message}|r`);
  }

}
import { Socket } from "socket.io";

interface IPlayer {
  id: string;
  color: number;
  x: number;
  y: number;
}

declare module "socket.io" {
  interface CustomSocket extends Socket {
    player: IPlayer;
  }
}

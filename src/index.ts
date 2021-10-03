import express from "express";
import http from "http";
import { CustomSocket, Server } from "socket.io";
import { IPlayer } from "./server";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const players: {
  [socketId: string]: IPlayer;
} = {};

io.on("connection", (socket: CustomSocket) => {
  socket.on("addNewPlayer", (color: number) => {
    socket.player = {
      id: socket.id,
      color,
      x: 0,
      y: 0,
    };

    players[socket.id] = socket.player;
    socket.emit("sendId", socket.id);
    socket.broadcast.emit("newPlayer", socket.player);

    socket.on("getCurrentPlayers", () => {
      Object.values(players).map((player) => socket.emit("newPlayer", player));
    });

    socket.on("getAllPlayers", () => {
      socket.emit("allPlayers", players);
    });

    socket.on("updatePlayer", (player: IPlayer) => {
      if (player.id && players[player.id]) {
        players[player.id] = player;
      }
    });

    socket.on("disconnect", () => {
      delete players[socket.player.id];
      socket.broadcast.emit("removePlayer", socket.player.id);
    });
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(4040, () => {
  console.log("listening on *:4040");
});

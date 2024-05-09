/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { config } from "dotenv";
import http from "http";
import { Server } from "socket.io";
import ChatsController from "./chats";

config();

export function socketServer() {
  const httpServer = http.createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  ChatsController.initIO(io);

  const socketPort = process.env.SOCKET_PORT || 3001;
  httpServer.listen(socketPort, () => {
    console.log(`Socket.IO server is running on port ${socketPort}`);
  });

  return io;
}

export default socketServer;

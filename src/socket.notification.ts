import { Server as SocketIOServer, Namespace } from "socket.io";
import ChatsController from "./chats";

let io: SocketIOServer;
let Notification: Namespace;
let chats: any;

export const socketserverstart = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*"
    }
  });
  Notification = io.of("/notification");
  chats = io.of("/chats");
  ChatsController.initIO(chats);
  Notification.on("connection", (socket) => {
    console.log("connected socket io");
    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
    });
  });
};

export const SocketTrigger = (
  userid: string,
  email: string,
  messages: string,
  subject: string
) => {
  console.log(userid, "user loged in");
  Notification.to(userid).emit("productUnavailable", {
    email,
    messages,
    subject
  });
};
// SOCKET CONNECTION
// Start listening on port 3000

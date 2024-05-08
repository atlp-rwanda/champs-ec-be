import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Create an HTTP server
let httpServer;

// eslint-disable-next-line import/no-mutable-exports
let io: SocketIOServer;

export const socketserverstart = () => {
  httpServer = createServer();

  // Create a socket.io instance and attach it to the HTTP server
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*"
    }
  });
  io.on("connection", (socket) => {
    console.log("connected socket io");
    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
    });
  });
  const port = 3000;
  httpServer.listen(port, () => {
    console.log(`Socket.IO server is running on port ${port}`);
  });
};

export const SocketTrigger = (
  userid: string,
  email: string,
  messages: string,
  subject: string
) => {
  console.log(userid, "user loged in");
  io.to(userid).emit("productUnavailable", {
    email,
    messages,
    subject
  });
};
// SOCKET CONNECTION

// Start listening on port 3000

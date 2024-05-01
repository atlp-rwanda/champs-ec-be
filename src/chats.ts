/* eslint-disable lines-between-class-members */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
import { Server, Socket } from "socket.io";
import Message from "./models/messages";
import User from "./models/user";
import { tokenDecode } from "./utils/token.generator";

class ChatsController {
  static io: Server;
  static typingUsers: { [key: string]: boolean } = {};
  static chatsController: any;

  static initIO(io: Server) {
    ChatsController.io = io;
    io.on("connection", async (socket: Socket) => {
      console.log("A user connected");
      const token = socket.handshake.auth.token;
      console.log(`token: ${token}`);
      const decoded: any = tokenDecode(token);
      const userId = decoded.id;
      const email = decoded.email;
      console.log("User ID:", userId, "Email:", email);

      const messages = await ChatsController.getAllMessages();
      // console.log("Sending all messages to the client:", messages);
      socket.emit("all messages", messages);

      socket.on("chat message", async (msg, callback) => {
        console.log("Received chat message:", msg);
        const { senderId, message } = msg;
        try {
          const newMessage = await Message.create({ senderId, message });
          console.log("New message created in the database:", newMessage);

          if (newMessage.dataValues.id) {
            const messageWithSender = await Message.findOne({
              where: { id: newMessage.dataValues.id },
              include: [
                {
                  model: User,
                  as: "sender",
                  attributes: ["id", "firstName", "email"]
                }
              ]
            });
            console.log("New message created:", messageWithSender);
            io.emit("chat message", messageWithSender);
            callback({ status: "ok", newMessage: messageWithSender });
          } else {
            console.error("Error creating message: id property not set");
            callback({
              status: "error",
              error: "Error creating message: id property not set"
            });
          }
        } catch (error: any) {
          console.error("Error creating message:", error.message);
          callback({ status: "error", error: error.message });
        }
      });
      socket.on("typing", () => {
        ChatsController.typingUsers[userId] = true;
        socket.emit("typing", Object.keys(ChatsController.typingUsers));
      });

      socket.on("stop typing", () => {
        delete ChatsController.typingUsers[userId];
        socket.emit("stop typing", Object.keys(ChatsController.typingUsers));
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
        delete ChatsController.typingUsers[userId];
        socket.broadcast.emit(
          "stop typing",
          Object.keys(ChatsController.typingUsers)
        );
      });
    });
  }

  static async getAllMessages() {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "email"]
        }
      ]
    });
    return messages;
  }
}

export default ChatsController;

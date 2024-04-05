import { Router } from "express";
import {
  MessageSent,
  Notification,
  chatApplication,
  privateChatApplication
} from "../controllers/chats.controllers";

const chatRoutes = Router({ mergeParams: true });

chatRoutes.get("/", chatApplication);
chatRoutes.get("/private", privateChatApplication);
chatRoutes.get("/Notification", Notification);
chatRoutes.get("/messages", MessageSent);
chatRoutes.get("/messages", MessageSent);

export default chatRoutes;

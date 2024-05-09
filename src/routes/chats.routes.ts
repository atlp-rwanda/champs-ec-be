import { Router } from "express";
import {
  MessageSent,
  Notification,
  chatApplication
} from "../controllers/chats.controllers";

const chatRouters = Router();

chatRouters.get("/chats", chatApplication);
chatRouters.get("/Notification", Notification);
chatRouters.get("/messages", MessageSent);

export default chatRouters;

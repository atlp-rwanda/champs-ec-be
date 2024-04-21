import { Router } from "express";
import { MessageSent, chatApplication } from "../controllers/chats.controllers";

const chatRouters = Router();

chatRouters.get("/chats", chatApplication);
chatRouters.get("/messages", MessageSent);

export default chatRouters;

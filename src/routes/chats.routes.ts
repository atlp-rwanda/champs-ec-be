// routes.ts
import express from "express";
import ChatsController from "../controllers/chats.controller";

const chatsRouter = express.Router();

chatsRouter.get("/messages", ChatsController.getAllMessages);

export default chatsRouter;

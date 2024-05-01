import { Request, Response } from "express";
import { join } from "path";
import Message from "../models/messages";
import User from "../models/user";

export const chatApplication = (req: Request, res: Response) => {
  const filePath = join(__dirname, "../../public/index.html");
  res.sendFile(filePath);
};

export const MessageSent = async (req: Request, res: Response) => {
  try {
    const messages = await Message.findAll({
      include: {
        model: User,
        as: "sender",
        attributes: ["id", "firstName", "email"]
      }
    });
    return res.status(200).json({
      status: "success",
      message: "Messages retrieved successfully",
      messages
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

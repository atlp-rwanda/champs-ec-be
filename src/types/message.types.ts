import { Optional } from "sequelize";

export interface MessageAttributes {
  id?: string;
  senderId?: string;
  receiver?: string;
  message?: string;
  chatroomId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  UserId?: string;
  ChatroomId?: string;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "createdAt" | "updatedAt"> {}

import { Optional } from "sequelize";

export interface MessageAttributes {
  id?: string;
  senderId?: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageCreationAttributes
  extends Optional<MessageAttributes, "id" | "createdAt" | "updatedAt"> {}

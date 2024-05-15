import { Optional } from "sequelize";

export interface ChatroomAttributes {
  id?: string;
  initiator: string;
  participants?: string[];
  isPrivate?: boolean;
  messages?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatroomCreationAttributes
  extends Optional<ChatroomAttributes, "id" | "createdAt" | "updatedAt"> {}

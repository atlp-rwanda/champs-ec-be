import { Optional } from "sequelize";

export interface notificationAttributes {
  id?: string;
  reciepent_id?: string;
  message?: string;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface notificationCreateAttributes
  extends Optional<notificationAttributes, "id"> {}

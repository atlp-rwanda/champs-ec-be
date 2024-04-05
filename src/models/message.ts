import { DataTypes, Model, ModelStatic, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  MessageAttributes,
  MessageCreationAttributes
} from "../types/message.types";
import User from "./user";
import Chatroom from "./Chatroom";

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: string;

  public senderId!: string;

  public receiver!: string;

  public message!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public chatroomId?: string;

  static id: any;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    receiver: {
      type: DataTypes.UUID,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    modelName: "Message",
    tableName: "messages"
  }
);

// define association here
export default Message;

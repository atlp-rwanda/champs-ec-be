import { DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  MessageAttributes,
  MessageCreationAttributes
} from "../types/message.types";
import User from "./user";

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: string;

  public senderId!: string;

  public message!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

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
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id"
      }
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
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
export default Message;

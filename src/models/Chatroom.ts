import { DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

import {
  ChatroomAttributes,
  ChatroomCreationAttributes
} from "../types/chatroom.types";
import Message from "./message";
import User from "./user";

class Chatroom
  extends Model<ChatroomAttributes, ChatroomCreationAttributes>
  implements ChatroomAttributes
{
  public id!: string;

  public initiator!: string;

  public participants!: string[];

  public isPrivate!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Chatroom.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    initiator: {
      type: DataTypes.UUID,
      allowNull: false
    },
    participants: {
      type: DataTypes.ARRAY(DataTypes.JSON()),
      allowNull: true
    },
    isPrivate: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    modelName: "Chatroom",
    tableName: "chatrooms"
  }
);
Chatroom.hasMany(Message, {
  as: "messages",
  onDelete: "CASCADE"
});
Message.belongsTo(Chatroom, {
  as: "chatroom",
  onDelete: "CASCADE"
});

Chatroom.belongsToMany(User, {
  through: "user_chatroom",
  foreignKey: "chatroomId",
  as: "users"
});
User.belongsToMany(Chatroom, {
  through: "user_chatroom",
  as: "chatrooms",
  foreignKey: "userId"
});
export default Chatroom;

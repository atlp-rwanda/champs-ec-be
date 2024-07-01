import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

interface UserChatroomAttributes {
  id: string;
  userId: string;
  chatroomId: string;
}

interface UserChatroomCreationAttributes
  extends Optional<UserChatroomAttributes, "id"> {}

class UserChatroom
  extends Model<UserChatroomAttributes, UserChatroomCreationAttributes>
  implements UserChatroomAttributes
{
  public id!: string;

  public userId!: string;

  public chatroomId!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

UserChatroom.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    chatroomId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Chatroom",
        key: "id"
      }
    }
  },
  {
    sequelize: sequelizeConnection,
    modelName: "UserChatroom",
    tableName: "user_chatroom"
  }
);

// Export the UserChatroom model
export default UserChatroom;

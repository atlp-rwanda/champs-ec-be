import { UUIDV4, Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  notificationAttributes,
  notificationCreateAttributes
} from "../types/notification.types";

class Notification
  extends Model<notificationAttributes, notificationCreateAttributes>
  implements notificationAttributes
{
  public id!: string;

  public reciepent_id!: string | undefined;

  public message?: string | undefined;

  public read!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    reciepent_id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: UUIDV4,
      validate: {
        notEmpty: true
      }
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "notifications"
  }
);
export default Notification;

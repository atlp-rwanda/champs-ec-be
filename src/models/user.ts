import { DataTypes, UUIDV4, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { UserAttributes, UserCreationAttributes } from "../types/user.types";

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;

  public firstName!: string;

  public lastName!: string;

  public email!: string;

  public password!: string;

  public profile!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
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
    tableName: "users"
  }
);

export default User;

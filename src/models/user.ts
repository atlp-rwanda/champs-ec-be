import { DataTypes, Model } from "sequelize";
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

  public verified!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      field: "first_name"
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      field: "last_name"
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
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "users"
  }
);

export default User;

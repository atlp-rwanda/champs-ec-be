import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { UserAttributes, UserCreationAttributes } from "../types/user.types";

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;

  declare firstName: string;

  declare lastName: string;

  declare email: string;

  declare password: string;

  declare profile: string;

  declare verified: boolean;

  declare photoURL: string;

  declare googleId: string;

  declare createdAt: Date;

  declare updatedAt: Date;
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
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "google_id"
    },
    photoURL: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "photo_url"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      defaultValue: ""
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "users"
  }
);

export default User;

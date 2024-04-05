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

  declare googleId: string;

  declare photoUrl: string;

  declare email: string;

  declare password: string;

  declare profile: string;

  declare verified: boolean;

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
    googleID: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "google_id"
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "photo_url"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true
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

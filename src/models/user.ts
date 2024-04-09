import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { UserAttributes, UserCreationAttributes } from "../types/user.types";
import Role from "./Role";

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;

  public firstName!: string;

  public lastName!: string;

  public email!: string;

  public password!: string;

  public phone!: string;

  public birthDate!: Date;

  public preferredLanguage!: string;

  public whereYouLive!: string;

  public preferredCurrency!: string;

  public profileImage!: string;

  public billingAddress!: string;

  public verified!: boolean;

  public roleId!: string;
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
      field: "firstName"
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      field: "lastName"
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
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferredCurrency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    whereYouLive: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Role,
        key: "id"
      }
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
User.belongsTo(Role, {
  foreignKey: "roleId",
  onDelete: "CASCADE"
});

export default User;

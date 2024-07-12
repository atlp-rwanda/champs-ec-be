import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { UserAttributes, UserCreationAttributes } from "../types/user.types";
import Role from "./Role";
import Message from "./message";
import extendPasswordValidity from "../utils/extendPasswordValidity";
import Reviews from "./review";

let myDate = new Date(Date.now());
const addedTime = Number(process.env.PASSWORD_LIFE_SPAN);
myDate = new Date(myDate.setMonth(myDate.getMonth() + addedTime));

const userPasswordValidityPeriod = extendPasswordValidity();

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;

  declare firstName: string;

  declare lastName: string;

  declare email: string;

  declare password: string;

  declare phone: string;

  declare birthDate: Date;

  declare preferredLanguage: string;

  declare whereYouLive: string;

  declare preferredCurrency: string;

  declare profileImage: string;

  declare billingAddress: string;

  declare verified: boolean;

  declare roleId: string;

  declare photoURL: string;

  declare googleId: string;

  declare isActive: boolean;

  declare reasonForDeactivation: string;

  declare createdAt: Date;

  declare updatedAt: Date;

  declare passwordExpiresAt: Date;

  declare isPasswordExpired: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE"
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
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
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
      allowNull: true,
      references: {
        model: Role,
        key: "id"
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    reasonForDeactivation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    passwordExpiresAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: myDate
    },
    isPasswordExpired: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    modelName: "User",
    tableName: "users"
  }
);
User.belongsTo(Role, {
  foreignKey: "roleId",
  onDelete: "CASCADE"
});
User.hasMany(Message);
Message.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId"
  // onDelete: "CASCADE"
});
export default User;

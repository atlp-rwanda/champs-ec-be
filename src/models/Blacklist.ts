import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  Blacklist,
  BlacklistedTokenAttributes
} from "../types/blacklist.types";

class BlacklistedToken
  extends Model<BlacklistedTokenAttributes>
  implements Blacklist
{
  public id!: string;

  public token!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

BlacklistedToken.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
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
    modelName: "BlacklistedToken",
    tableName: "blacklisted_tokens"
  }
);

export default BlacklistedToken;

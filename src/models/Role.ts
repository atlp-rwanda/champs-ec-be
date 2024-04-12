import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { RoleAttributes, RoleCreationAttributes } from "../types/role.types";

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: string;

  public name!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: "roles"
  }
);

export default Role;

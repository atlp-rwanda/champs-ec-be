import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { WishAttributes, WishCreationAttributes } from "../types/wish.types";
import User from "./user";
import Product from "./Product";

class Wish
  extends Model<WishAttributes, WishCreationAttributes>
  implements WishAttributes
{
  public id!: string;

  public userId!: string;

  public productId!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Wish.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id"
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Product,
        key: "id"
      }
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "wishes"
  }
);

export default Wish;

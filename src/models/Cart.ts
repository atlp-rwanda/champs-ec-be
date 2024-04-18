import { DataTypes, UUIDV4, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { CartsAttributes, CartsCreationAttributes } from "../types/carts.types";

class Cart
  extends Model<CartsAttributes, CartsCreationAttributes>
  implements CartsAttributes
{
  public id!: string;

  public userId!: string | undefined;

  public product!: any[] | undefined;

  public totalPrice?: number | undefined;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      validate: {
        notEmpty: true
      }
    },
    product: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
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
    tableName: "carts"
  }
);

export default Cart;

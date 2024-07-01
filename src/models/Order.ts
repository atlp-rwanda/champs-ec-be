import { DataTypes, UUIDV4, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  OrdersAttributes,
  OrdersCreationAttributes
} from "../types/order.types";

import Product from "./Product";
import User from "./user";

class Order
  extends Model<OrdersAttributes, OrdersCreationAttributes>
  implements OrdersAttributes
{
  public id!: string;

  public buyerId!: string | undefined;

  public productId!: string | undefined;

  public totalAmount!: number | undefined;

  public quantity!: number | undefined;

  public paymentDate!: Date;

  public deliveryDate!: Date;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id"
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paymentDate: {
      allowNull: false,
      type: DataTypes.DATE
    },

    deliveryDate: {
      allowNull: false,
      type: DataTypes.DATE
    },

    deliveryStatus: {
      type: DataTypes.ENUM("Pending", "Shipped", "Delivered"),
      allowNull: false,
      defaultValue: "Pending"
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
    tableName: "orders"
  }
);
Order.belongsTo(Product, {
  foreignKey: "productId"
});
Order.belongsTo(User, {
  foreignKey: "buyerId",
  onDelete: "CASCADE",
  as: "buyer"
});
export default Order;

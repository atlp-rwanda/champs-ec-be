import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { ReviewsAttributes, ReviewCreationAttributes } from "../types/reviews";
import Product from "./Product";
import User from "./user";

class Reviews
  extends Model<ReviewsAttributes, ReviewCreationAttributes>
  implements ReviewsAttributes {}

Reviews.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      },
      references: {
        model: Product,
        key: "id"
      },
      onDelete: "CASCADE"
    },
    buyerId: {
      onDelete: "CASCADE",
      references: {
        model: User,
        key: "id"
      },
      allowNull: false,
      type: DataTypes.UUID
    },
    rating: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    feedback: {
      allowNull: false,
      type: DataTypes.STRING
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
    tableName: "reviews"
  }
);
export default Reviews;

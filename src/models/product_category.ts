import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  ProductCategoryAttributes,
  ProductCategoryCreationAttributes
} from "../types/product_category.types";
import Product from "./Product";

class ProductCategory
  extends Model<ProductCategoryAttributes, ProductCategoryCreationAttributes>
  implements ProductCategoryAttributes {}

ProductCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    categoryName: {
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
    tableName: "product_categories"
  }
);
Product.belongsTo(ProductCategory, {
  foreignKey: "productCategory",
  as: "relatedproducts" // You can use this alias when querying
});

export default ProductCategory;

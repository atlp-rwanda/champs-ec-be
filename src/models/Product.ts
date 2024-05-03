import { DataTypes, UUIDV4, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  ProductAttributes,
  ProductCreationAttributes
} from "../types/product.types";
import Reviews from "./reviews";
// eslint-disable-next-line require-jsdoc
class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;

  public sellerId!: string;

  public productCategory!: string;

  public productName!: string;

  public stockLevel!: number | undefined;

  public productPrice!: number;

  public productCurrency!: string;

  public productDiscount!: string;

  public productDescription!: Text;

  public productPictures!: any;

  public productThumbnail!: string;

  public productStatus!: boolean;

  public expireDate!: Date;

  public createdAt!: Date;

  public updatedAt!: Date;

  public isExpired!: boolean;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4,
      validate: {
        notEmpty: true
      }
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    stockLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    productCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    productDiscount: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0"
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },

    productThumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    productPictures: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true
    },
    expireDate: {
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
    isExpired: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "products"
  }
);
Product.hasMany(Reviews, { foreignKey: "productId", as: "reviews" });
export default Product;

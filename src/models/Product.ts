import { DataTypes, UUIDV4, Model } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import {
  ProductAttributes,
  ProductCreationAttributes
} from "../types/product.types";
// eslint-disable-next-line require-jsdoc
class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;

  public sellerId!: string;

  public productCategory!: string;

  public productName!: string;

  public stockLevel!: string;

  public productPrice!: string;

  public productCurrency!: string;

  public productDiscount!: string;

  public productDescription!: Text;

  public productPictures!: any;

  public productThumbnail!: string;

  public expireDate!: Date;

  public createdAt!: Date;

  public updatedAt!: Date;
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
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    productPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
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
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    tableName: "products"
  }
);

export default Product;
import { Optional } from "sequelize";

export interface ProductAttributes {
  id?: string;
  sellerId?: string;
  productCategory?: string;
  productName?: string;
  stockLevel?: number;
  productPrice?: number;
  productCurrency?: string;
  productDiscount: number;
  isAvailable?: boolean;
  productDescription?: Text;
  productThumbnail?: string;
  productPictures?: any;
  expireDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isExpired?: boolean;
  isFeatured?: boolean;
  featureEndDate?: Date;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}

export interface ProductOutPuts extends Required<ProductAttributes> {}

export interface ProductPictureAtributes {
  url: string;
  imgId: string;
}

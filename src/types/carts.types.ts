import { Optional } from "sequelize";

export interface CartsAttributes {
  id?: string;
  userId?: string;
  product?: Array<any>;
  totalPrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CartsCreationAttributes
  extends Optional<CartsAttributes, "id"> {}

export interface CartsSingleProduct {
  productId: string;
  quantity: number;
  totalPrice: number;
}

import { Optional } from "sequelize";

export interface WishAttributes {
  id?: string;
  productId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WishCreationAttributes
  extends Optional<WishAttributes, "id" | "createdAt" | "updatedAt"> {}

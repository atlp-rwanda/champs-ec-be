import { Optional } from "sequelize";

export interface ReviewsAttributes {
  [key: string]: any;
  id?: string;
  productId?: string;
  buyerId?: string;
  rating?: number;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewCreationAttributes
  extends Optional<ReviewsAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface ReviewOutputs extends Required<ReviewsAttributes> {
  [key: string]: any;
}

export interface reviewData {
  dataValues: {
    id: string;
    productId: string;
    buyerId: string;
  };
}

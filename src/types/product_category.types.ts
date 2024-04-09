import { Optional } from "sequelize";

export interface ProductCategoryAttributes {
  [x: string]: any;
  id?: string;
  categoryName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCategoryCreationAttributes
  extends Optional<
    ProductCategoryAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

export interface ProductCategoryOutputs
  extends Required<ProductCategoryAttributes> {
  [x: string]: any;
}

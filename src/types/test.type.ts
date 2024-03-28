import { Optional } from "sequelize";

export interface TestAttributes {
  id?: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestCreationAttributes
  extends Optional<TestAttributes, "id"> {}

export interface TestOutPuts extends Required<TestAttributes> {}

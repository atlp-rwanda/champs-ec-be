import { Optional } from "sequelize";

export interface RoleAttributes {
  id?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreationAttributes
  extends Optional<RoleAttributes, "id" | "createdAt" | "updatedAt"> {}

export interface RoleOutputs extends Required<RoleAttributes> {}

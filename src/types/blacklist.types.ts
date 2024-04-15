import { Optional } from "sequelize";

export interface BlacklistedTokenAttributes {
  id?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BlacklistedTokenCreationAttributes
  extends Optional<BlacklistedTokenAttributes, "id"> {}

export interface Blacklist extends Required<BlacklistedTokenAttributes> {}

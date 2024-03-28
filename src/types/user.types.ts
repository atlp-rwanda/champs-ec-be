import { Optional } from "sequelize";

export interface UserAttributes {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PayloadAttributes {
  id: string;
  email: string;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

export interface UserOutPuts extends Required<UserAttributes> {}

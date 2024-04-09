import { Optional } from "sequelize";

export interface UserAttributes {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  phone?: string;
  birthDate?: Date;
  preferredLanguage?: string;
  preferredcurrency?: string;
  whereYouLive?: string;
  billingAddress?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PayloadAttributes {
  id: string;
  email: string;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "phone"
    | "birthDate"
    | "preferredLanguage"
    | "preferredcurrency"
    | "whereYouLive"
    | "billingAddress"
  > {}

export interface UserOutputs extends Required<UserAttributes> {}

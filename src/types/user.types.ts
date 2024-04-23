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
  preferredCurrency?: string;
  whereYouLive?: string;
  billingAddress?: string;
  verified?: boolean;
  roleId?: string;
  isActive?: boolean;
  reasonForDeactivation?: string;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
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
    | "preferredCurrency"
    | "whereYouLive"
    | "billingAddress"
  > {}

export interface UserOutputs extends Required<UserAttributes> {}

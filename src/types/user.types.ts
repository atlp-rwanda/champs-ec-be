export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profile?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  photoURL?: string;
}

export interface PayloadAttributes {
  id: string;
  email: string;
}

export interface UserCreationAttributes
  extends Partial<Omit<UserAttributes, "id" | "createdAt" | "updatedAt">> {}

export interface UserOutputs extends Required<UserAttributes> {}

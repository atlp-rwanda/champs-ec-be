import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PayloadAttributes } from "../../types/user.types";

dotenv.config();

export const userToken = async (userId: string, userEmail: string) => {
  const payload: PayloadAttributes = {
    id: userId,
    email: userEmail
  };
  console.log(payload);
  const token: string = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE
  });
  return token;
};

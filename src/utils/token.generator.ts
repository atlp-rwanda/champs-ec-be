import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PayloadAttributes } from "../types/user.types";

dotenv.config();

export const userToken = async (userId: string, userEmail: string) => {
  const payload: PayloadAttributes = {
    id: userId,
    email: userEmail
  };

  const token: string = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE
  });
  return token;
};
// export const tokenAssign = (body: object, timePeriod: string) => {
//   return jwt.sign(body, process.env.JWT_SECRET as string, {
//     expiresIn: `${timePeriod}`
//   });
// };

export const tokenVerify = (token: string, resultFunction?: any) => {
  return jwt.verify(token, process.env.JWT_SECRET as string, resultFunction);
};

export const tokenDecode = (token: string) => {
  return jwt.decode(token);
};

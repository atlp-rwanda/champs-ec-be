import { Request } from "express";
import User from "../models/user";

export const findUserByEmail = async (req: Request) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  return user;
};

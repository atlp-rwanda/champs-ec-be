import express, { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { UserAttributes } from "../types/user.types";

export const findUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  return user;
};

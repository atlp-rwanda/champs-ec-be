import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { userSchema } from "../validations/user.validations";

const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (user) {
    return res.status(409).json({
      error: "User exist, please login to continue"
    });
  }
  next();
};

const isValidUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // type UserType=z.infer<typeof userSchema>
    const result = userSchema.parse(req.body);
    if (result) {
      next();
    }
  } catch (error: any) {
    return res.status(403).json({ error: error.errors[0].message });
  }
};

export { isUserExist, isValidUser };

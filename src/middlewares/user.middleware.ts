import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { updateSchema, userSchema } from "../validations/user.validations";
import { userLoginValidation } from "../utils/validations/user.validations";

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
    return res.status(400).json({ error: error.errors[0].message });
  }
};
const isValidUserLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = userLoginValidation.parse(req.body);

    if (validation) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};
const isValidUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = updateSchema.parse(req.body);

    if (validation) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export { isUserExist, isValidUser, isValidUserLogin, isValidUserUpdate };

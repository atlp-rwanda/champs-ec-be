import { Request, Response, NextFunction } from "express";
import passport from "../config/passport.config";
import User from "../models/user";
import { userToken } from "../utils/token.generator";
import { sendOtp, UserData } from "../controllers/otpauth.controllers";
import Role from "../models/Role";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (error: any, user: any) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized User. Please login to continue" });
    }
    const loggedUser: User = user;
    req.user = loggedUser;
    return next();
  })(req, res, next);
};

const isCheckSeller = async (
  id: string,
  email: string,
  req: Request,
  res: Response
) => {
  const user = (await User.findOne({
    where: {
      email
    }
  })) as UserData;

  const userRoleId = await user.dataValues.roleId;
  const userRole = await Role.findOne({ where: { id: userRoleId } });

  if (userRole?.dataValues.name === "seller") {
    sendOtp(req, res, email);
  } else {
    const token = await userToken(id, email);

    res.status(200).send({
      message: "Login successful",
      success: true,
      token: `Bearer ${token}`
    });
  }
};

export { authenticate, isCheckSeller };

import { Request, Response, NextFunction } from "express";
import passport from "../config/passport.config";
import User from "../models/user";
import Role from "../models/Role";
import { sendOtp, UserData } from "../controllers/otpauth.controllers";
import { userToken } from "../utils/token.generator";
import BlacklistedToken from "../models/Blacklist";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error: any, user: any) => {
      const tokenHeader = req.headers.authorization?.split(" ")[1];
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      let blacklistedToken;
      blacklistedToken = await BlacklistedToken.findOne({
        where: { token: tokenHeader }
      });
      if (!user || blacklistedToken) {
        return res
          .status(401)
          .json({ error: "Unauthorized User. Please login to continue" });
      }
      const loggedUser: User = user;
      req.user = loggedUser;
      return next();
    }
  )(req, res, next);
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

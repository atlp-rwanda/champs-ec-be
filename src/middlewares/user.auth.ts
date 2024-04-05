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
      if (!tokenHeader) {
        return res.status(401).json({ error: "you are not loggged in" });
      }
      if (error) {
        if (
          error.message.includes(
            'WHERE parameter "email" has invalid "undefined" value'
          )
        ) {
          return res.status(401).json({
            error:
              "This token is used for 2fa verification only, please verify 2fa to gain access"
          });
        }
        return res.status(500).json({ error: error.message });
      }
      if (user.isActive === false) {
        return res
          .status(401)
          .json({ message: `${user.dataValues.reasonForDeactivation}` });
      }
      const blacklistedToken = await BlacklistedToken.findOne({
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

const isCheckSeller = async (user: UserData, req: Request, res: Response) => {
  const userRoleId = await user.dataValues.roleId;
  const userRole = await Role.findOne({ where: { id: userRoleId } });

  if (userRole?.dataValues.name === "seller") {
    sendOtp(req, res, user.dataValues.email);
  } else {
    const token = await userToken(user.dataValues.id, user.dataValues.email);
    res.status(200).send({
      message: "Login successful",
      success: true,
      firstName: user.dataValues.firstName,
      lastName: user.dataValues.lastName,
      token: `Bearer ${token}`
    });
  }
};

const isAnonymous = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error: any, user: any) => {
      const tokenHeader = req.headers.authorization?.split(" ")[1];
      if (!tokenHeader) {
        (req as any).isLoggedin = false;
        return next();
      }
      const blacklistedToken = await BlacklistedToken.findOne({
        where: { token: tokenHeader }
      });
      if (!user || blacklistedToken) {
        (req as any).isLoggedin = false;
        return next();
      }
      (req as any).isLoggedin = true;
      const loggedUser: User = user;
      req.user = loggedUser;

      return next();
    }
  )(req, res, next);
};
export { authenticate, isCheckSeller, isAnonymous };

/* eslint-disable import/no-duplicates */
import { Request, Response, NextFunction } from "express";
import passport from "../config/google.config";
import { userToken } from "../utils/token.generator";
// eslint-disable-next-line import/no-duplicates
import { UserModel } from "../config/google.config";

const initiateGoogleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const handleGoogleCallback = async (req: Request, res: Response) => {
  passport.authenticate("google", async (err: any, user: UserModel | null) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to authenticate with Google" });
    }
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    try {
      const token = await userToken(user.id, user.email);
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          token
        }
      });
    } catch (error) {
      return res.status(500).json({
        status: "not success",
        error: "Login Failed, token generation failed"
      });
    }
  })(req, res);
};

export { initiateGoogleLogin, handleGoogleCallback };

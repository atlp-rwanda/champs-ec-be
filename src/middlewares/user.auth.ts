import { Request, Response, NextFunction } from "express";
import passport from "../config/passport.config";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (error:any, user:any) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized User. Please login to continue" });
    }

    req.user = user;
    return next();
  })(req, res, next);
};

export default authenticate;

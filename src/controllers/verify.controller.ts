import { config } from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

config();

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const reqToken = req.params.token;
    const decodedToken = jwt.verify(
      reqToken,
      process.env.JWT_SECRET as string
    ) as {
      id: string;
      email: string;
    };
    const user = await User.findOne({
      where: { email: decodedToken.email, verified: false }
    });

    if (user) {
      const updatedUser = await user.update({ verified: true });
      if (updatedUser) {
        res.status(201).json({
          message: "Account verified please login to continue"
        });
      }
    } else {
      res.status(400).json({ error: "Verification failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

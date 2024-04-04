import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import { use } from "chai";
import User from "../models/User";
import { UserAttributes } from "../types/user.types";
import { passwordEncrypt } from "../utils/encrypt";
import { userLoginValidation } from "../utils/validations/user.validations";
import { sendVerificationMail } from "../utils/mailer";
import { userToken } from "../utils/token.generator";

config();

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userPassword = await passwordEncrypt(password);

    const newUser: any = await User.create({
      firstName,
      lastName,
      email,
      password: userPassword
    });

    const createdUser: UserAttributes = newUser.dataValues;

    if (createdUser) {
      const token = await userToken(createdUser.id, createdUser.email);
      const link: string = `api/users/${token}/verify-email`;

      sendVerificationMail(email, link, firstName);
      res.status(201).json({
        message: "user is registered, please verify through email"
      });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: any = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Incorrect user name " });
    }

    const verifyPassword = await bcrypt.compare(
      req.body.password,
      user?.dataValues?.password
    );
    if (!verifyPassword) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    const payload = {
      email: req.body.email,
      id: user.id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).send({
      message: "Login successful ",
      success: true,
      token: `Bearer ${token}`
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "There is an error in login please try again" });
  }
};

import { Request, Response } from "express";

import User from "../models/user";
import { UserAttributes } from "../types/user.types";
import { passwordEncrypt } from "../utils/encrypt";
import { userToken } from "../utils/functions/token.generator";

const userSignup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userPassword = await passwordEncrypt(password);
    console.log("user:", userPassword);

    const newUser: any = await User.create({
      firstName,
      lastName,
      email,
      password: userPassword
    });

    const createdUser: UserAttributes = newUser.dataValues;
    if (createdUser) {
      const token = await userToken(
        createdUser.id as string,
        createdUser.email as string
      );
      return res
        .status(201)
        .json({ message: "user is successfuly signed up", token });
    }
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export { userSignup };

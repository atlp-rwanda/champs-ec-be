import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserAttributes } from "../types/user.types";
import { passwordEncrypt } from "../utils/encrypt";
import User from "../models/user";
import Role from "../models/Role";
import { sendVerificationMail } from "../utils/mailer";
import { userToken } from "../utils/token.generator";
import uploadImage from "../utils/cloudinary";
import { isUserExist } from "../middlewares/user.middleware";

config();
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;
    const userPassword = await passwordEncrypt(password);
    await isUserExist(req, res, async () => {
      const newUser: any = await User.create({
        firstName,
        lastName,
        email,
        password: userPassword,
        roleId
      });

      const createdUser: UserAttributes = newUser.dataValues;

      if (createdUser) {
        const token = await userToken(
          createdUser.id as string,
          createdUser.email as string
        );
        const link: string = `api/users/${token}/verify-email`;

        sendVerificationMail(email, link, firstName);
        res.status(201).json({
          message: "user is registered, please verify through email"
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
    res.status(400).json({ error: "Invalid token" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
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

    const token = await userToken(user.dataValues.id, req.body.email);

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

export const userProfile = (req: Request, res: Response) => {
  res.status(200).json({ User: req.user });
};

export const editUser = async (req: any, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      profileImage,
      phone,
      birthDate,
      preferredLanguage,
      whereYouLive,
      preferredCurrency,
      billingAddress
    } = req.body;
    if (!firstName && !lastName && !profileImage) {
      res.status(400).send({
        error: "At least one property is required to update the user"
      });
      return;
    }

    if (req.body.email || req.body.password) {
      return res
        .status(400)
        .send({ error: "it is not possible to update email or password Here" });
    }

    const user: User | null = await User.findOne({
      where: {
        id: req.user.dataValues.id
      }
    });

    let uploadedImage;
    if (req.file) {
      uploadedImage = await uploadImage(req.file.buffer);
    }

    const updatedUser: UserAttributes = {
      firstName: firstName || user?.firstName,
      lastName: lastName || user?.lastName,
      profileImage: uploadedImage || user?.profileImage,
      phone: phone || user?.phone,
      birthDate: birthDate || user?.birthDate,
      preferredLanguage: preferredLanguage || user?.preferredLanguage,
      whereYouLive: whereYouLive || user?.whereYouLive,
      billingAddress: billingAddress || user?.billingAddress,
      preferredCurrency: preferredCurrency || user?.preferredCurrency
    };

    await user?.update(updatedUser);
    res.status(201).json({ message: "user are updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: "there is an error user are not updated" });
  }
};
export const assignRoleToUser = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.body;
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    await user?.update({ roleId });

    res.status(200).json({ message: "Role assigned to user successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

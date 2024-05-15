import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserAttributes } from "../types/user.types";
import { passwordCompare, passwordEncrypt } from "../utils/encrypt";
import User from "../models/user";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { userToken, tokenVerify, tokenAssign } from "../utils/token.generator";
import uploadImage from "../utils/cloudinary";
import { isUserExist } from "../middlewares/user.middleware";
import { isCheckSeller } from "../middlewares/user.auth";
import {
  sendNotificationInactiveAccount,
  sendResetMail,
  sendVerificationMail
} from "../utils/mailer";
import { passwordStrength } from "../utils/validations/user.validations";
import { findUserByEmail } from "../utils/finders";
import { matchPasswords } from "../utils/matchPasswords";
import BlacklistedToken from "../models/Blacklist";
import { ResponseOutPut, userStatusData } from "../helper/handleUserStatusData";
import { isValidUUID } from "../utils/uuid";
import { insertNewUserIntoPublicChatroom } from "../services/chats.services";

config();
interface JToken extends jwt.Jwt {
  user?: string;
  exp?: string;
}
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
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });
    res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: "Invalid user Id" });
    }
    const user: User | null = await User.findOne({
      where: {
        id: userId
      },
      attributes: { exclude: ["password"] }
    });
    if (!user) {
      return res.status(404).json({
        error: "User with this ID not exists"
      });
    }
    return res.status(200).json({ message: "user information", user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
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
      await insertNewUserIntoPublicChatroom(user);
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
    const { email } = req.body;
    const user: any = await User.findOne({
      where: {
        email,
        // verified: true,
        isActive: true
      }
    });

    if (user.dataValues.verified !== true) {
      return res
        .status(401)
        .json({ message: "Verify you email to gain access" });
    }

    const verifyPassword = await bcrypt.compare(
      req.body.password,
      user?.dataValues?.password
    );
    if (!verifyPassword) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    await isCheckSeller(user, req, res);
  } catch (err) {
    res
      .status(500)
      .json({ error: "There is an error in login please try again" });
  }
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    const newuser: any = await req.user;

    res.status(200).json({ User: newuser });
  } catch (error) {
    return res.status(400).json("user profile is not exist");
  }
};
export const sendResetInstructions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await findUserByEmail(req);
    if (!foundUser) return res.status(404).json({ msg: "User not found" });
    const { firstName, id, email } = foundUser.dataValues;

    const token = tokenAssign(
      { user: id },
      Date.now() + Number(process.env.PASSWORD_RESET_EXPIRES as string)
    );
    const passwordUpdateLink = `${process.env.BASE_URL as string}/api/users/reset-password/${token}`;
    sendResetMail(email as string, passwordUpdateLink, firstName as string);

    return res.status(200).json({
      msg: "Password reset Instructions sent successfully",
      token
    });
  } catch (err) {
    return next({ err });
  }
};

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;

    const isValid: JToken = tokenVerify(
      token,
      function (err: Error, decoded: any) {
        if (err) {
          if (err.message.includes("expired")) {
            return res.status(401).json({ message: "Token has expired" });
          }
          return res.status(404).json({ message: "Invalid token" });
        }
        return decoded;
      }
    );

    const foundUser = await User.findByPk(isValid.user);
    if (!foundUser) return res.status(404).json({ msg: "User Not found" });

    const { newPassword, confirmPassword } = req.body;
    const checkPasswordStrength = passwordStrength.test(newPassword);
    if (!checkPasswordStrength) {
      return res
        .status(400)
        .json({ msg: "Password must have atleast 8 to 15 characters" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords don't match" });
    }

    const pass: string = await passwordEncrypt(newPassword);
    await foundUser.update({ password: pass });

    return res.status(200).json({ msg: "Password updated succesfully" });
  } catch (err) {
    return next({ err });
  }
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
      return res.status(400).send({
        error: "At least one property is required to update the user"
      });
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
    let uploadedImage: any;
    if (!req.file) {
      return res.status(400).json({ Error: "profile image is required" });
    }

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
    const userWithoutPassword = { ...user?.dataValues };
    delete userWithoutPassword.password;
    res.status(201).json({
      message: "user are updated successfully",
      user: userWithoutPassword
    });
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
    res.status(500).json({ error: "Internal server error" });
  }
};
interface Data {
  dataValues: {
    id: string;
    password: string;
  };
}
export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const logedInUser = req.user as Data;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({
      where: {
        id: logedInUser.dataValues.id
      }
    });

    const passwordMatch = await passwordCompare(
      user?.dataValues.password as string,
      oldPassword
    );

    if (!passwordMatch) {
      return res.status(400).send({ error: "Incorrect old password" });
    }
    const matchIncommingPasswords = await matchPasswords(
      newPassword,
      confirmPassword
    );
    if (!matchIncommingPasswords) {
      return res.status(400).send({ error: "Passwords doesn't match" });
    }

    const hashedPassword = await passwordEncrypt(newPassword);
    const updatePassword = await user?.update({ password: hashedPassword });
    if (!updatePassword) {
      return res.status(400).send({ message: "failed to update password!" });
    }
    return res.status(200).send({ message: "Password Updated Successfully!" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};
export const blacklistToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers.authorization?.split(" ")[1];
  if (!tokenHeader) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const token = tokenHeader; // Parse token from header
    await BlacklistedToken.create({ token });
    return res
      .status(200)
      .json({ success: true, message: "logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const changeAccountStatus = async (req: any, res: Response) => {
  const data: ResponseOutPut = await userStatusData(req.body);
  await User.update(
    {
      isActive: data.isActive,
      reasonForDeactivation: data.message
    },
    { where: { id: req.params.userId }, returning: true }
  )
    .then((result) => {
      const user: Array<User> = result[1];

      sendNotificationInactiveAccount(
        user[0].dataValues.email as string,
        user[0].dataValues.firstName as string,
        data.emailNotification
      );
      return res.status(200).json({ message: data.success });
    })
    .catch((err) => {
      if (err) return res.status(200).json({ error: "user ID not exist" });
    });
};

export const passwordExpirationChecker = async (
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
    const expiryDate = new Date(user.dataValues.passwordExpiresAt as Date);
    if (expiryDate.getTime() <= new Date().getTime()) {
      return res
        .status(200)
        .json({ msg: "Your password has expired please update your password" });
    }
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: "failed to run checking passwords expiration!" });
  }
};

export default blacklistToken;

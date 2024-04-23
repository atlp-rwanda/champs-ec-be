import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import Role from "../models/Role";
import {
  updateSchema,
  userLoginValidation,
  userSchema,
  userUpdatePassValidation
} from "../validations/user.validations";
import { UserAttributes } from "../types/user.types";
import { isValidUUID } from "../utils/uuid";

const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.email) {
      // Check if user exists by email
      const userByEmail = await User.findOne({
        where: { email: req.body.email }
      });

      if (userByEmail) {
        return res.status(409).json({
          error: "User with this email already exists"
        });
      }
    }

    if (req.params.userId) {
      const isValidId: boolean = isValidUUID(req.params.userId);
      if (!isValidId) {
        return res.status(404).json({
          error: "User with this ID not valid please check and try again"
        });
      }

      const user_id = req.params.userId;

      // Check if user exists by userId
      const userById = await User.findOne({ where: { id: user_id } });
      if (!userById) {
        return res.status(404).json({
          error: "User with this ID not exists"
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const checkIfUserBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Incorrect username" });
    }

    if (!user?.dataValues.isActive) {
      return res.status(401).json({
        error: "your account is blocked ",
        reason: user?.dataValues.reasonForDeactivation
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
const isValidUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = userSchema.parse(req.body);

    if (result) {
      // Assuming your user model has a 'roleId' field
      const userRole = await Role.findOne({ where: { name: "buyer" } });

      if (!userRole) {
        return res
          .status(500)
          .json({ error: "Default role 'buyer' not found" });
      }

      // Assigning the roleId to the user
      req.body.roleId = userRole.dataValues.id;
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

const isValidUserLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = userLoginValidation.parse(req.body);

    if (validation) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};
const isValidUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = updateSchema.parse(req.body);

    if (validation) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};
const isValidPasswordUpdated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = userUpdatePassValidation.parse(req.body);
    if (validation) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const role = await Role.findByPk(user.dataValues.roleId);
    const role = (req.user as any).Role.dataValues.name;
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized, user is not an admin" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const isSeller = async (req: Request, res: Response, next: NextFunction) => {
  const { user }: any = req;

  try {
    const role = await Role.findByPk(user.dataValues.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (role.dataValues.name === "seller") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized, user is not an seller" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const isAdminOrSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user }: any = req;

  try {
    const role = await Role.findByPk(user.dataValues.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (role.dataValues.name === "seller" || role.dataValues.name === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized, only seller and admin has access" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const isUserEmailValid = (req: Request, res: Response, next: NextFunction) => {
  // type UserType=z.infer<typeof userSchema>
  const result: UserAttributes | any = req.user as UserAttributes;
  if (!result.dataValues.verified) {
    return res.status(400).json({ error: "Email is not verified" });
  }
  next();
};

export {
  isUserExist,
  isValidUser,
  isValidUserLogin,
  isValidUserUpdate,
  isAdmin,
  isAdminOrSeller,
  isSeller,
  isValidPasswordUpdated,
  isUserEmailValid,
  checkIfUserBlocked
};

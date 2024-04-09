import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { Console } from "console";
import User from "../models/user";
import { updateSchema, userSchema } from "../validations/user.validations";
import { userLoginValidation } from "../utils/validations/user.validations";
import Role from "../models/Role";
import { isValidUUID } from "../utils/uuid";

const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const { email, userId } = req.body;

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
    const user_id = req.params.userId;

    // Check if user exists by userId
    const userById = await User.findOne({ where: { id: user_id } });
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkk", user_id);
    if (!userById) {
      return res.status(404).json({
        error: "User with this ID not exists"
      });
    }
  }

  next();
};
const isValidUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = userSchema.parse(req.body);

    if (result) {
      // Assuming your user model has a 'roleId' field
      const userRole = await Role.findOne({ where: { name: "user" } });

      if (!userRole) {
        return res.status(500).json({ error: "Default role 'user' not found" });
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

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { user }: any = req;

  try {
    const role = await Role.findByPk(user.dataValues.roleId);
    console.log(
      "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
      role
    );
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    if (role.dataValues.name === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized, user is not an admin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  isUserExist,
  isValidUser,
  isValidUserLogin,
  isValidUserUpdate,
  isAdmin
};

import { NextFunction, Request, Response } from "express";
import Role from "../models/Role";
import { roleSchema } from "../validations/role.validation";

export const validateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const check = roleSchema.parse(req.body);
    if (check) {
      next();
    }
    // console.log("this is check:",check)
    // return res.status(403).json("bad request")
    // next()
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export const isRoleIdExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await Role.findByPk(req.body.roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "internal server" });
  }
};
export const isRoleIdExistFromPram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    next();
  } catch (error) {
    res.status(404).json(error);
  }
};

export const isRoleNameExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingRole = await Role.findOne({ where: { name: req.body.name } });
    if (existingRole) {
      return res.status(409).json("user role exist try another role");
    }
    next();
  } catch (error) {
    res.status(404).json(error);
  }
};
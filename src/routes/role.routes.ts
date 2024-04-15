import express from "express";
import { isAdmin } from "../middlewares/user.middleware";
import { authenticate } from "../middlewares/user.auth";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/role.controllers";
import {
  isRoleIdExistFromPram,
  isRoleNameExist,
  validateRole
} from "../middlewares/role.middleware";

const roleRoutes = express.Router();

roleRoutes.post(
  "/",
  authenticate,
  isAdmin,
  validateRole,
  isRoleNameExist,
  createRole
);

roleRoutes.get("/", authenticate, isAdmin, getAllRoles);

roleRoutes.get(
  "/:id",
  authenticate,
  isAdmin,
  isRoleIdExistFromPram,
  getRoleById
);

roleRoutes.put(
  "/:id",
  authenticate,
  isAdmin,
  validateRole,
  isRoleNameExist,
  updateRole
);

roleRoutes.delete(
  "/:id",
  authenticate,
  isAdmin,
  isRoleIdExistFromPram,
  deleteRole
);

export default roleRoutes;

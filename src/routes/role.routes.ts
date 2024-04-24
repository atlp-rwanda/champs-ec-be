import express from "express";
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

roleRoutes
  .route("/")
  .post(validateRole, isRoleNameExist, createRole)
  .get(getAllRoles);

roleRoutes
  .route("/:id")
  .get(isRoleIdExistFromPram, getRoleById)
  .put(validateRole, isRoleNameExist, updateRole)
  .delete(isRoleIdExistFromPram, deleteRole);

export default roleRoutes;

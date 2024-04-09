import express from "express";
import multerupload from "../utils/multer";

import {
  userSignup,
  userLogin,
  userProfile,
  editUser,
  verifyAccount,
  assignRoleToUser,
  getAllUsers
} from "../controllers/user.controllers";
import authenticate from "../middlewares/user.auth";

import {
  isUserExist,
  isValidUser,
  isValidUserLogin,
  isValidUserUpdate,
  isAdmin
} from "../middlewares/user.middleware";
import { sendOtp, verifyOtp } from "../controllers/otpauth.controllers";
import { isRoleIdExist } from "../middlewares/role.middleware";

const userRoutes = express.Router();

userRoutes.post("/signup", isValidUser, isUserExist, userSignup);
userRoutes.post("/login", isValidUserLogin, userLogin);
userRoutes.get("/profile", authenticate, userProfile);
userRoutes.get("/", authenticate, isAdmin, getAllUsers);
userRoutes.put(
  "/profiles",
  authenticate,
  multerupload.single("profileImage"),
  isValidUserUpdate,
  editUser
);

userRoutes.route("/:token/verify-email").get(verifyAccount);
userRoutes.post("/otp", authenticate, sendOtp);
userRoutes.post("/otp/:token", authenticate, verifyOtp);
userRoutes.patch(
  "/:userId/roles",
  authenticate,
  isAdmin,
  isUserExist,
  isRoleIdExist,
  assignRoleToUser
);
export default userRoutes;

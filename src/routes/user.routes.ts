import express from "express";
import multerupload from "../utils/multer";

import blacklistToken, {
  userSignup,
  userLogin,
  userProfile,
  editUser,
  verifyAccount,
  assignRoleToUser,
  getAllUsers,
  sendResetInstructions,
  resetUserPassword,
  updateUserPassword,
  changeAccountStatus,
  getSingleUser,
  passwordExpirationChecker
} from "../controllers/user.controllers";
import { authenticate } from "../middlewares/user.auth";

import {
  isUserExist,
  isValidUser,
  isValidUserUpdate,
  checkRole,
  isValidUserLogin,
  isValidPasswordUpdated,
  isUserEmailValid,
  checkIfUserBlocked,
  isAdmin
} from "../middlewares/user.middleware";
import { verifyOtp } from "../controllers/otpauth.controllers";
import { isRoleIdExist } from "../middlewares/role.middleware";
import { isDecodeOTP } from "../middlewares/otpauth.middleware";
import { accountStatusValidation } from "../validations/user.validations";

const userRoutes = express.Router({ mergeParams: true });

userRoutes.post("/reset-password", sendResetInstructions);
userRoutes.patch("/reset-password/:token", resetUserPassword);
userRoutes.post("/signup", isValidUser, isUserExist, userSignup);
userRoutes.post(
  "/login",
  isValidUserLogin,
  checkIfUserBlocked,
  passwordExpirationChecker,
  userLogin
);
userRoutes.post("/logout", authenticate, blacklistToken);
userRoutes.get("/profile", authenticate, userProfile);
userRoutes.get("/", authenticate, checkRole(["admin"]), getAllUsers);
userRoutes.put(
  "/profiles",
  authenticate,
  multerupload.single("profileImage"),
  isValidUserUpdate,
  editUser
);

userRoutes.route("/:token/verify-email").get(verifyAccount);
userRoutes.post("/otp/:token", isDecodeOTP, verifyOtp);
userRoutes.patch(
  "/:userId/roles",
  authenticate,
  checkRole(["admin"]),
  isUserExist,
  isRoleIdExist,
  assignRoleToUser
);
userRoutes.patch(
  "/passwordUpdate",
  authenticate,
  isUserEmailValid,
  isValidPasswordUpdated,
  updateUserPassword
);

userRoutes.get("/:userId", authenticate, checkRole(["admin"]), getSingleUser);

userRoutes.patch(
  "/:userId/status",
  authenticate,
  checkRole(["admin"]),
  accountStatusValidation,
  changeAccountStatus
);

userRoutes.post(
  "/check-passwords",
  authenticate,
  isAdmin,
  passwordExpirationChecker
);

export default userRoutes;

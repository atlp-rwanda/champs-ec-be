import express from "express";
import multerupload from "../utils/multer";

import {
  userSignup,
  userLogin,
  userProfile,
  editUser,
  verifyAccount
} from "../controllers/user.controllers";
import authenticate from "../middlewares/user.auth";
import {
  isUserExist,
  isValidUser,
  isValidUserLogin,
  isValidUserUpdate
} from "../middlewares/user.middleware";
import { sendOtp, verifyOtp } from "../controllers/otpauth.controllers";

const userRoutes = express.Router();

userRoutes.post("/signup", isValidUser, isUserExist, userSignup);
userRoutes.post("/login", isValidUserLogin, userLogin);
userRoutes.get("/profile", authenticate, userProfile);
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

export default userRoutes;

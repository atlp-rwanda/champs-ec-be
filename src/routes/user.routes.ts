import express from "express";
import multerupload from "../utils/multer";

import {
  userSignup,
  userLogin,
  userProfile,
  editUser,
  verifyAccount
} from "../controllers/user.controllers";
import {
  isUserExist,
  isValidUser,
  isValidUserLogin,
  isValidUserUpdate
} from "../middlewares/user.middleware";
import authenticate from "../middlewares/user.auth";

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

export default userRoutes;

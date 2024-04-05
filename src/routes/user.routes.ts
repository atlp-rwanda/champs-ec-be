import express from "express";
import {
  userSignup,
  userLogin,
  verifyAccount
} from "../controllers/user.controllers";
import {
  isUserExist,
  isValidUser,
  isValidUserLogin
} from "../middlewares/user.middleware";

const userRoutes = express.Router();
userRoutes.post("/signup", isValidUser, isUserExist, userSignup);
userRoutes.post("/login", isValidUserLogin, userLogin);

userRoutes.route("/:token/verify-email").get(verifyAccount);

export default userRoutes;

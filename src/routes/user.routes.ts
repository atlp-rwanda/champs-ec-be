import express from "express";
import { userSignup, userLogin } from "../controllers/user.controllers";
import {
  isUserExist,
  isValidUser,
  isValidUserLogin
} from "../middlewares/user.middleware";
import { verifyAccount } from "../controllers/verify.controller";

const userRoutes = express.Router();
userRoutes.post("/signup", isValidUser, isUserExist, userSignup);
userRoutes.post("/login", isValidUserLogin, userLogin);

userRoutes.route("/:token/verify-email").get(verifyAccount);

export default userRoutes;

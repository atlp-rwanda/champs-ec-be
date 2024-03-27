import express from "express";
import { userSignup } from "../controllers/user.controllers";
import { isUserExist, isValidUser } from "../middlewares/user.middleware";

const userRoutes = express.Router();
userRoutes.post("/signup", isValidUser, isUserExist, userSignup);

export default userRoutes;

import express from "express";
import {
  initiateGoogleLogin,
  handleGoogleCallback
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.get("/login/google", initiateGoogleLogin);

authRoutes.get("/google/callback", handleGoogleCallback);

export default authRoutes;

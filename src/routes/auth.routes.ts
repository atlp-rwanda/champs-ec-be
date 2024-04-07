import express from "express";
import {
  initiateGoogleLogin,
  handleGoogleCallback
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.get("/google", initiateGoogleLogin);

authRoutes.get("/google/callback", handleGoogleCallback);

export default authRoutes;

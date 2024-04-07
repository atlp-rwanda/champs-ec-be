import express from "express";
import {
  initiateGoogleLogin,
  handleGoogleCallback
} from "../controllers/auth.controller";

const authRoutes = express.Router();

// Initiate Google OAuth2 login process
authRoutes.get("/login/google", initiateGoogleLogin);

// Handle callback from Google OAuth2 after successful authentication
authRoutes.get("/google/callback", handleGoogleCallback);

export default authRoutes;

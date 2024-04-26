import express from "express";
import { authenticate } from "../middlewares/user.auth";
import {
  GetUserNotification,
  ReadAllNotification,
  ReadOneNotification
} from "../controllers/notification.controller";
// import {GetUserNotification} from '../'

const NotificationsRoutes = express.Router();
NotificationsRoutes.get("/", authenticate, GetUserNotification);
NotificationsRoutes.patch("/:id", authenticate, ReadOneNotification);
NotificationsRoutes.patch("/", authenticate, ReadAllNotification);
export default NotificationsRoutes;

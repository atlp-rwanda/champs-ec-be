import express from "express";
import {
  checkoutCancel,
  checkoutSuccess,
  createCustomer
} from "../controllers/payment.controllers";
import { authenticate } from "../middlewares/user.auth";
import { isUserWhoNothaveCart } from "../middlewares/checkusercart.middleware";

const paymentRoutes = express.Router();
paymentRoutes.post("/", authenticate, isUserWhoNothaveCart, createCustomer);
paymentRoutes.get("/success", checkoutSuccess);
paymentRoutes.post("/cancel", checkoutCancel);

export default paymentRoutes;

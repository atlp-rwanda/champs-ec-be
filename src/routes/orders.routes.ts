import express from "express";

import {
  getAllOrders,
  getSingleOrder,
  updateOrder
} from "../controllers/orderControllers";
import {
  isValidOrderId,
  orderStatusValidation
} from "../validations/order.validation";
import { checkRole } from "../middlewares/user.middleware";
import { authenticate } from "../middlewares/user.auth";

const orderRoutes = express.Router();
orderRoutes.get(
  "/",
  authenticate,
  checkRole(["buyer", "seller"]),
  getAllOrders
);
// orderRoutes.post("/", authenticate, createOrders);
orderRoutes.get("/:orderId", authenticate, isValidOrderId, getSingleOrder);
orderRoutes.patch(
  "/:orderId",
  authenticate,
  orderStatusValidation,
  isValidOrderId,
  updateOrder
);

export default orderRoutes;

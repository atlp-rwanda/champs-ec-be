import express from "express";

import {
  getAllOrders,
  getOrderStatus,
  getSingleOrder,
  updateOrder,
  updateOrderStatus
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
orderRoutes
  .route("/:orderId/status")
  .get(
    authenticate,
    checkRole(["buyer", "seller"]),
    isValidOrderId,
    getOrderStatus
  )
  .post(authenticate, checkRole(["seller"]), isValidOrderId, updateOrderStatus);

orderRoutes.get("/:orderId", authenticate, isValidOrderId, getSingleOrder);
orderRoutes.patch(
  "/:orderId",
  authenticate,
  orderStatusValidation,
  isValidOrderId,
  updateOrder
);

export default orderRoutes;

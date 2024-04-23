import express from "express";
import {
  createCart,
  getCart,
  updateCart
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/user.auth";
import {
  isUserWhoNothaveCart,
  isUserhaveCart
} from "../middlewares/checkusercart.middleware";
import { cartCheck } from "../validations/cart.validation";

const cartRouter = express.Router();

cartRouter.post("/", authenticate, cartCheck, isUserhaveCart, createCart);
cartRouter.get("/", authenticate, getCart);
cartRouter.put("/", authenticate, cartCheck, isUserWhoNothaveCart, updateCart);

export default cartRouter;

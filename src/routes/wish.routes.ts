import { Router } from "express";
import {
  createRemoveWish,
  flushUserWishes,
  getUserWishes
} from "../controllers/wish.controller";
import { checkRole } from "../middlewares/user.middleware";

const productWishRoutes = Router();
productWishRoutes
  .route("/")
  .post(checkRole(["buyer"]), createRemoveWish)
  .get(checkRole(["buyer", "seller"]), getUserWishes)
  .delete(checkRole(["buyer"]), flushUserWishes);
export default productWishRoutes;

import { Router } from "express";
import {
  createRemoveWish,
  flushUserWishes,
  getProductWishes,
  getUserWishes
} from "../controllers/wish.controller";

const productWishRoutes = Router();
productWishRoutes.route("/").get(getUserWishes).delete(flushUserWishes);
productWishRoutes
  .route("/:product_id")
  .post(createRemoveWish)
  .get(getProductWishes);
export default productWishRoutes;

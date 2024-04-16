import express from "express";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategory,
  singleProductCategory,
  updateProductCategory
} from "../controllers/productCategory.controllers";
import {
  isCategoryNameExist,
  isExistProductCategory
} from "../middlewares/productCategory.middlewares";
import { checkRole } from "../middlewares/user.middleware";
import {
  isValidCategoryInsert,
  isValidCategoryUpdate
} from "../validations/productCategories.validations";

const productCategoryRoutes = express.Router();

productCategoryRoutes.post(
  "/",
  isValidCategoryInsert,
  isCategoryNameExist,
  checkRole(["admin"]),
  createProductCategory
);
productCategoryRoutes.get(
  "/",
  checkRole(["admin", "seller"]),
  getProductCategory
);
productCategoryRoutes.get(
  "/:catId",
  checkRole(["admin", "seller"]),
  isExistProductCategory,
  singleProductCategory
);
productCategoryRoutes.patch(
  "/:catId",
  isValidCategoryUpdate,
  checkRole(["admin", "seller"]),
  isExistProductCategory,
  isCategoryNameExist,
  updateProductCategory
);
productCategoryRoutes.delete(
  "/:catId",
  checkRole(["admin", "seller"]),
  isExistProductCategory,
  deleteProductCategory
);

export default productCategoryRoutes;

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
import { isAdmin, isAdminOrSeller } from "../middlewares/user.middleware";
import {
  isValidCategoryInsert,
  isValidCategoryUpdate
} from "../validations/productCategories.validations";
import { authenticate } from "../middlewares/user.auth";

const productCategoryRoutes = express.Router();

productCategoryRoutes.post(
  "/",
  authenticate,
  isValidCategoryInsert,
  isCategoryNameExist,
  isAdmin,
  createProductCategory
);
productCategoryRoutes.get(
  "/",
  authenticate,
  isAdminOrSeller,
  getProductCategory
);
productCategoryRoutes.get(
  "/:catId",
  authenticate,
  isAdminOrSeller,
  isExistProductCategory,
  singleProductCategory
);
productCategoryRoutes.patch(
  "/:catId",
  authenticate,
  isValidCategoryUpdate,
  isAdmin,
  isExistProductCategory,
  isCategoryNameExist,
  updateProductCategory
);
productCategoryRoutes.delete(
  "/:catId",
  authenticate,
  isAdmin,
  isExistProductCategory,
  deleteProductCategory
);

export default productCategoryRoutes;

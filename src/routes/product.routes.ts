import express from "express";
import {
  createProducts,
  getAllSellerProducts,
  getSingleProduct,
  removeProductPictures,
  removeSellerProduct,
  setProductThumbnail,
  updateProductPictures,
  updateSellerProduct,
  productExpirationChecker
} from "../controllers/product.controllers";

import multerImage from "../utils/uploader";

import { isAdmin, checkRole } from "../middlewares/user.middleware";
import { isExistProductCategory } from "../middlewares/productCategory.middlewares";
import {
  isValidItem,
  isValidUpdate
} from "../validations/sellerProduct.validation";

import {
  imageNumbers,
  isExistProductCategoryOnUpdate,
  isExistSellerProduct,
  isProductNameExist,
  isSingleImageUpload,
  isValidImage
} from "../middlewares/sellerproduct.middlewares";
import { authenticate } from "../middlewares/user.auth";

const productRoutes = express.Router();
productRoutes.post(
  "/",
  authenticate,
  checkRole(["seller"]),
  multerImage.array("productImage", 8),
  isValidImage,
  isValidItem,
  imageNumbers,
  isExistProductCategory,
  isProductNameExist,
  createProducts
);
productRoutes.get(
  "/",
  authenticate,
  checkRole(["seller", "admin", "user"]),
  getAllSellerProducts
);
productRoutes.get(
  "/:productId",
  authenticate,
  checkRole(["seller"]),
  isExistSellerProduct,
  getSingleProduct
);
productRoutes.patch(
  "/:productId",
  authenticate,
  checkRole(["seller"]),
  multerImage.single("productImage"),
  isValidImage,
  isValidUpdate,
  isExistProductCategoryOnUpdate,
  isProductNameExist,
  isExistSellerProduct,
  updateSellerProduct
);

productRoutes.delete(
  "/:productId",
  authenticate,
  checkRole(["seller"]),
  isExistSellerProduct,
  removeSellerProduct
);

productRoutes.patch(
  "/:productId/profile/:imgId",
  authenticate,
  checkRole(["seller"]),
  isExistSellerProduct,
  setProductThumbnail
);

productRoutes.patch(
  "/:productId/pictures/:imgId",
  authenticate,
  multerImage.single("productImage"),
  isValidImage,
  checkRole(["seller"]),
  isSingleImageUpload,
  isExistSellerProduct,
  updateProductPictures
);

productRoutes.delete(
  "/:productId/pictures/:imgId",
  authenticate,
  checkRole(["seller"]),
  isExistSellerProduct,
  removeProductPictures
);
productRoutes.post(
  "/check-expiration",
  authenticate,
  isAdmin,
  productExpirationChecker
);

export default productRoutes;

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
  productExpirationChecker,
  updateProductStatus
} from "../controllers/product.controllers";

import multerImage from "../utils/uploader";

import { checkRole } from "../middlewares/user.middleware";
import { isExistProductCategory } from "../middlewares/productCategory.middlewares";
import {
  isValidItem,
  isValidStatus,
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
import { authenticate, isAnonymous } from "../middlewares/user.auth";
import { checkRoles } from "../middlewares/role.middleware";
import { isReviewProduct } from "../middlewares/reviews.middlewares";
import { productReview } from "../controllers/reviews.controller";

const productRoutes = express.Router({ mergeParams: true });

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
  isAnonymous,
  checkRoles(["seller", "admin", "buyer"]),
  getAllSellerProducts
);

productRoutes.get(
  "/:productId",
  isAnonymous,
  checkRoles(["admin", "seller", "buyer"]),
  isExistSellerProduct,
  getSingleProduct
);

productRoutes.get(
  "/",
  isAnonymous,
  checkRoles(["admin", "seller", "buyer"]),
  getAllSellerProducts
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
  checkRole(["admin"]),
  productExpirationChecker
);
productRoutes.patch(
  "/:productId/status",
  authenticate,
  checkRole(["seller"]),
  isValidStatus,
  updateProductStatus
);

// productRoutes.get("/items/:productId",isExistSellerProduct,getAvailableProductById)
// productRoutes.get('/',[admin,buyer,])
productRoutes.post(
  "/:productId/reviews",
  authenticate,
  checkRole(["buyer"]),
  isReviewProduct,
  productReview
);

export default productRoutes;

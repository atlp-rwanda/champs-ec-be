import express from "express";
import {
  createProducts,
  getAllSellerProducts,
  getSingleProduct,
  removeProductPictures,
  removeSellerProduct,
  setProductThumbnail,
  updateProductPictures,
  updateSellerProduct
} from "../controllers/product.controllers";

import multerImage from "../utils/uploader";

import { isSeller } from "../middlewares/user.middleware";
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
  isSeller,
  multerImage.array("productImage", 8),
  isValidImage,
  isValidItem,
  imageNumbers,
  isExistProductCategory,
  isProductNameExist,
  createProducts
);
productRoutes.get("/", authenticate, isSeller, getAllSellerProducts);
productRoutes.get(
  "/:productId",
  authenticate,
  isSeller,
  isExistSellerProduct,
  getSingleProduct
);
productRoutes.patch(
  "/:productId",
  authenticate,
  isSeller,
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
  isSeller,
  isExistSellerProduct,
  removeSellerProduct
);

productRoutes.patch(
  "/:productId/profile/:imgId",
  authenticate,
  isSeller,
  isExistSellerProduct,
  setProductThumbnail
);

productRoutes.patch(
  "/:productId/pictures/:imgId",
  authenticate,
  multerImage.single("productImage"),
  isValidImage,
  isSeller,
  isSingleImageUpload,
  isExistSellerProduct,
  updateProductPictures
);

productRoutes.delete(
  "/:productId/pictures/:imgId",
  authenticate,
  isSeller,
  isExistSellerProduct,
  removeProductPictures
);

export default productRoutes;

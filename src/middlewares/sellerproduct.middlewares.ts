import { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";
import Product from "../models/Product";
import User from "../models/user";
import ProductCategory from "../models/product_category";
import formatString from "../utils/string.manipulation";
import { isValidUUID } from "../utils/uuid";

export const isExistSellerProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValidId: boolean = isValidUUID(req.params.productId);
    if (!isValidId) {
      return res.status(403).json({
        error: "Invalid product ID  please check and try again"
      });
    }
    let product: any;
    const logedSeller: any = req.user;
    if (logedSeller.Role && logedSeller.Role.dataValues.name === "seller") {
      const userId: string = logedSeller.dataValues.id;
      product = await Product.findOne({
        where: {
          id: req.params.productId,
          sellerId: userId
        }
      });
    } else {
      product = await Product.findOne({
        where: {
          id: req.params.productId
        }
      });
    }
    if (!product) {
      return res
        .status(404)
        .json({ message: "The product is not found , please try again" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ errors: "Internal server error" });
  }
};

export const isProductNameExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.productName) {
      const logedUser: User = req.user as User;
      const userId: string = logedUser.dataValues.id as string;
      const productName = formatString(req.body.productName);
      const product = await Product.findOne({
        where: {
          sellerId: userId,
          productName
        }
      });
      if (product) {
        return res.status(409).json({
          message: "This item already exists",
          product
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const isExistProductCategoryOnUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.productCategory) {
      const product = await ProductCategory.findOne({
        where: {
          id: req.body.productCategory
        }
      });
      if (!product) {
        return res.status(404).json({
          error: "The product category is not found , please try again"
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const isValidImage = async (
  err: MulterError | Error,
  req: any,
  res: any,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(400).json({
      error: `Image uploading error ${err.message} `
    });
  } else if (err) {
    if (err.name === "ExtensionError") {
      return res
        .status(400)
        .json({ error: `Image upload error, ${err.message}` });
    }
    return res.status(400).json({
      error: `Image upload error, ${err.message}  and shpould not exceed 1MB`
    });
  } else {
    next();
  }
};
export const imageNumbers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageNumber = req.files?.length as number;
  if (imageNumber >= 4 && imageNumber <= 8) {
    next();
  } else {
    return res
      .status(403)
      .json({ error: "Product item should have 4 up to 8 images" });
  }
};

export const isSingleImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    next();
  } else {
    return res.status(403).json({ error: "please upoad image" });
  }
};

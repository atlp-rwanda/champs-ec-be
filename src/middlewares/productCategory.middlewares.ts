import { NextFunction, Request, Response } from "express";

import ProductCategory from "../models/product_category";
import formatString from "../utils/string.manipulation";

export const isExistProductCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let catId: string;
    if (req.params.catId) {
      catId = req.params.catId;
    } else {
      catId = req.body.productCategory;
    }

    const product = await ProductCategory.findOne({
      where: {
        id: catId
      }
    });
    if (!product) {
      return res.status(404).json({
        error: "The product category is not found , please try again"
      });
    }
    next();
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ err: "Internal server error, check your Id and try again" });
  }
};

export const isCategoryNameExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryName: string = formatString(req.body.categoryName);
    const category = await ProductCategory.findOne({
      where: {
        categoryName
      }
    });
    if (category) {
      return res.status(409).json({
        message: "This Category alread exists",
        category
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

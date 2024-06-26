import { NextFunction, Request, Response } from "express";

import ProductCategory from "../models/product_category";
import formatString from "../utils/string.manipulation";
import { isValidUUID } from "../utils/uuid";

export const isExistProductCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let catId: string;
    if (req.params.catId) {
      catId = req.params.catId;
      const isValidId: boolean = isValidUUID(req.params.catId);
      if (!isValidId) {
        return res.status(403).json({
          error: " invalid Id for category ID please check and try again"
        });
      }
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
        message: "This Category already exists",
        category
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryIdByName = async (
  categoryName: string
): Promise<string | null> => {
  try {
    const category = await ProductCategory.findOne({
      where: { categoryName }
    });

    if (category) {
      return category.dataValues.id as string;
    }
    return null; // Category not found
  } catch (error) {
    console.error("Error fetching category ID:");
    return null;
  }
};

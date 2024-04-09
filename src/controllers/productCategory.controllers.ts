import { Request, Response } from "express";
import ProductCategory from "../models/product_category";
import { ProductCategoryAttributes } from "../types/product_category.types";
import formatString from "../utils/string.manipulation";

export const createProductCategory = async (req: Request, res: Response) => {
  try {
    const categoryName = formatString(req.body.categoryName);

    const category = await ProductCategory.create({ categoryName });
    return res
      .status(201)
      .json({ message: "Product category is created", category });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getProductCategory = async (req: Request, res: Response) => {
  try {
    const categories = await ProductCategory.findAll();
    if (categories.length > 0) {
      return res.status(200).json({
        message: "success",
        categories
      });
    }
    return res
      .status(200)
      .json({ message: "no Product category found , please add new" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const singleProductCategory = async (req: Request, res: Response) => {
  try {
    const category = await ProductCategory.findOne({
      where: {
        id: req.params.catId
      }
    });
    return res.status(200).json({ message: "success", category });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const updateProductCategory = async (req: Request, res: Response) => {
  try {
    const category: ProductCategoryAttributes = (await ProductCategory.findOne({
      where: {
        id: req.params.catId
      }
    })) as ProductCategory;

    const categoryName = formatString(req.body.categoryName);
    category.categoryName = categoryName;
    await category.update(category);
    return res
      .status(200)
      .json({ message: "Product category updated successful", category });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteProductCategory = async (req: Request, res: Response) => {
  try {
    await ProductCategory.destroy({
      where: {
        id: req.params.catId
      }
    });
    return res.status(203).json({ message: " Product category is removed" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

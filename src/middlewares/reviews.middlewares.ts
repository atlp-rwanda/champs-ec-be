import { NextFunction, Request, Response } from "express";
import {
  productIdValidation,
  productReviewSchema
} from "../validations/review.validataion";
import { UserData } from "../controllers/otpauth.controllers";
import Order from "../models/Order";
import Product from "../models/Product";

export const isReviewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserData;
    await productReviewSchema.parse(req.body);
    const { productId } = req.params;
    await productIdValidation.parse({ productId });

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const productOrdered = await Order.findOne({
      where: {
        buyerId: user.dataValues.id,
        productId
      }
    });
    if (!productOrdered) {
      return res
        .status(401)
        .json({ message: "Review allowed only on purchased products" });
    }
    next();
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

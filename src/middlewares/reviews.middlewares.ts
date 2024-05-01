import { NextFunction, Request, Response } from "express";
import {
  productIdValidation,
  productReviewSchema
} from "../validations/review.validataion";

export const isReviewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await productReviewSchema.parse(req.body);
    const { productId } = req.params;
    await productIdValidation.parse({ productId });

    next();
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

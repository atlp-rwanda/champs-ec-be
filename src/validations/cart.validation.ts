import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const CartItemSchema = z.object({
  productId: z
    .string({ required_error: "productId is required" })
    .uuid({ message: "Product id must be a UUID" }),
  Quantity: z.number({ required_error: "Quantity is required" }).positive()
});

const CartItemsSchema = z.array(CartItemSchema);

export const cartCheck = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: any = CartItemsSchema.parse(req.body);
    if (!result.success || result.data.length === 0) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

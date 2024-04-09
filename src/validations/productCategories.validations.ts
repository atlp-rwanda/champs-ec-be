import { z } from "zod";
import { NextFunction, Request, Response } from "express";

const productCategorySchema = z
  .object({
    categoryName: z
      .string({ required_error: "the product category is required" })
      .min(3, "Use atleast 3 characters for category name")
      .max(50, "Don't exceed 50 characters category name ")
      .regex(/^[a-zA-Z ]+$/, "use onyl characters for category name")
  })
  .strict();

const productCategoryUpdateSchema = z
  .object({
    categoryName: z
      .string()
      .min(3, "Use atleast 3 characters for category name")
      .max(50, "Don't exceed 50 characters category name ")
      .regex(/^[a-zA-Z ]+$/, "use onyl characters for category name")
      .optional()
      .or(z.literal(""))
  })
  .strict();

export const isValidCategoryInsert = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // type UserType=z.infer<typeof userSchema>
    const result = productCategorySchema.parse(req.body);
    if (result) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export const isValidCategoryUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // type UserType=z.infer<typeof userSchema>
    const result = productCategoryUpdateSchema.parse(req.body);
    if (result) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import { z } from "zod";
import { NextFunction, Request, Response } from "express";

const productSchema = z
  .object({
    productName: z
      .string({ required_error: "the name product item is required" })
      .min(3, "Use atleast 3 characters for the name product item")
      .max(50, "Don't exceed 50 characters to the name of product item")
      .regex(
        /[A-Za-z-0-9\s]$/,
        "use characters and numbers for the product item name"
      ),
    stockLevel: z
      .string({ required_error: "the stock level is required" })
      .regex(/[0-9]$/, "use numbers for the product stock level"),
    productCategory: z
      .string({ required_error: "the item category is required" })
      .uuid("invalid product category id ")
      .min(3, "Use atleast 3 characters for the item category ")
      .max(50, "Don't exceed 50 characters to item category"),
    productPrice: z
      .string({ required_error: "the item price is required" })
      .regex(/[0-9]$/, "use numbers for the item price"),
    productDiscount: z
      .string()
      .regex(/[0-9]$/, "use numbers for the item discount")
      .optional(),
    productCurrency: z
      .string({
        required_error: "the item currency is required"
      })
      .max(3, "use 3 charaters for currency unit")
      .regex(
        /^RWF$/i,
        "use atleast 3 characters for curreny unit Ex:Rwf | USD "
      ),
    productDescription: z
      .string({ required_error: "The item description is required" })
      .min(20, "the item description should be atleast 20 characters")
      .max(500, "the item description should not excedd 500 characters"),
    expireDate: z.coerce.date().refine((data) => data > new Date(), {
      message: `The expire date must be future date`
    })
  })
  .strict();

const productUpdateSchema = z
  .object({
    productName: z
      .string({ required_error: "the name product item is required" })
      .min(3, "Use atleast 3 characters for the name product item")
      .max(50, "Don't exceed 50 characters to the name of product item")
      .regex(
        /[A-Za-z-0-9\s]$/,
        "use characters and numbers for the product item name"
      ),
    stockLevel: z
      .string({ required_error: "the stock level is required" })
      .regex(/[0-9]$/, "use numbers for the product stock level"),
    productCategory: z
      .string({ required_error: "the item category is required" })
      .uuid("invalid product category id ")
      .min(3, "Use atleast 3 characters for the item category ")
      .max(50, "Don't exceed 50 characters to item category"),
    productPrice: z
      .string({ required_error: "the item price is required" })
      .regex(/[0-9]$/, "use numbers for the item price"),
    productDiscount: z
      .string()
      .regex(/[0-9]$/, "use numbers for the item discount")
      .optional(),
    productCurrency: z
      .string({
        required_error: "the item currency is required"
      })
      .max(3, "use 3 charaters for currency unit")
      .regex(
        /^RWF$/i,
        "use atleast 3 characters for curreny unit Ex:Rwf | USD "
      ),
    productDescription: z
      .string({ required_error: "The item description is required" })
      .min(20, "the item description should be atleast 20 characters")
      .max(500, "the item description should not excedd 500 characters"),
    expireDate: z.coerce.date().refine((data) => data > new Date(), {
      message: `The expire date must be future date`
    })
  })
  .strict();

export const isAvailable = z.boolean({
  invalid_type_error: "isAvailable must be a boolean"
});

export const isValidItem = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // type UserType=z.infer<typeof userSchema>
    const result = productSchema.parse(req.body);
    if (result) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export const isValidUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // type UserType=z.infer<typeof userSchema>
    const result = productUpdateSchema.parse(req.body);
    if (result) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

export const isValidStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isAvailable } = req.body;
    if (typeof isAvailable === "boolean") {
      return next();
    }

    return res.status(400).json({ error: "isAvailable must be a boolean" });
  } catch (error: any) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

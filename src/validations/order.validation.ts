import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { isValidUUID } from "../utils/uuid";

const orderSChema = z
  .object({
    status: z.enum(["Pending", "Shipped", "Delivered"])
  })
  .strict();

export const orderStatusValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = orderSChema.parse(req.body);
    if (result) {
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ err: error.errors[0].message });
  }
};

export const isValidOrderId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidId: boolean = isValidUUID(req.params.orderId);
  if (!isValidId) {
    return res.status(403).json({
      error: "invalid order Id, please try again"
    });
  }
  next();
};

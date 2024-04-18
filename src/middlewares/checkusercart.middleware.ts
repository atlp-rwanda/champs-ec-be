import { Request, Response, NextFunction } from "express";
import Cart from "../models/Cart";

export const isUserhaveCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newuser: any = req.user;
  const new_cart = await Cart.findOne({ where: { userId: newuser.id } });
  if (new_cart) {
    return res.status(404).json({
      error: "The cart of this user is exist please modify the existe one "
    });
  }
  next();
};

export const isUserWhoNothaveCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newuser: any = req.user;
  const new_cart = await Cart.findOne({ where: { userId: newuser.id } });
  if (!new_cart) {
    return res.status(404).json({
      error: "Please create cart by post the product at the first time"
    });
  }
  next();
};

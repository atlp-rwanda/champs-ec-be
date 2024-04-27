import { Request, Response } from "express";

import Cart from "../models/Cart";
import {
  mergeDuplicatedProduct,
  getProductsWithQuantity
} from "../utils/cartMergeProduct";
import User from "../models/user";

interface CartItem {
  productId: string;
  Quantity: number;
}
export const createCart = async (req: Request, res: Response) => {
  try {
    const newuser: User = req.user as User;
    const cartItems: CartItem[] = req.body;

    const productsWithQuantity = await getProductsWithQuantity(cartItems);
    productsWithQuantity.reduce((sum, prod) => sum + prod.totalPrice, 0);

    const news = await mergeDuplicatedProduct(productsWithQuantity);
    if (!news.StockCheck) {
      return res.status(200).json({
        error: "You sent a quantity that exceeds what we have in stock."
      });
    }

    const cart = await Cart.create({
      userId: newuser.id,
      product: news.product,
      totalPrice: news.totalPrice
    });
    res.status(201).json(cart);
  } catch (error: unknown | any) {
    res.status(500).json({
      status: error.status,
      message: "the request fail",
      error: error.message
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const newuser: User = req.user as User;
    const cart = await Cart.findOne({
      where: {
        userId: newuser.id
      }
    });

    if (!cart) {
      return res.status(400).json({
        error: "You don't have cart please add product to have a cart"
      });
    }
    res.status(200).json({ status: "success", cart });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const newuser: User = req.user as User;
    const cartItems: CartItem[] = req.body;
    const productsWithQuantity = await getProductsWithQuantity(cartItems);
    // let sum: number;
    productsWithQuantity.reduce((sum, prod) => sum + prod.totalPrice, 0);

    const mergedProduct = await mergeDuplicatedProduct(productsWithQuantity);
    const new_cart: any = await Cart.findOne({
      where: { userId: newuser.id }
    });

    if (!mergedProduct.StockCheck) {
      return res.status(200).json({
        error:
          "you send the quantity which are more than what we have in the stock Please check."
      });
    }
    await new_cart.update({
      userId: newuser.id,
      product: mergedProduct.product,
      totalPrice: mergedProduct.totalPrice
    });
    res.status(201).json(new_cart);
  } catch (error: Error | any) {
    res.status(400).json({
      status: error.status,
      message: "the request fail",
      error: error.message
    });
  }
};

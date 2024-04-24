import { Request, Response } from "express";
import User from "../models/user";
import wishServices from "../services/wish.services";

export const createRemoveWish = async (req: Request, res: Response) => {
  const productId = req.params.product_id;
  const user: User = req.user as User;
  const userId: string = user.dataValues.id as string;

  if (productId != null) {
    const data = {
      productId,
      userId
    };

    const exWish = await wishServices.getSingleWish(data);
    if (exWish == null) {
      const wish = await wishServices.createWish(data);

      if (wish != null) {
        res.status(200).send({
          message: "product added to wishlist",
          data: { productId, userId }
        });
      } else {
        res.status(500).send({ error: "Could not create a wish" });
      }
    } else {
      await wishServices.deleteWish(data);
      res.status(200).send({ message: "Product removed into wishlist" });
    }
  } else {
    res.status(500).send({ error: "Could not get a product" });
  }
};

export const getProductWishes = async (req: Request, res: Response) => {
  const productId = req.params.product_id;
  if (productId != null) {
    const wishes = await wishServices.getProductWishes(productId);

    if (wishes != null) {
      res.status(200).send({ message: "Product wishes", data: wishes });
    } else {
      res
        .status(200)
        .send({ message: "Product wishes is empty", data: wishes });
    }
  } else {
    res.status(400).send({ message: "please provide valid product id" });
  }
};

export const getUserWishes = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const userId: string = user.dataValues.id as string;

  if (userId != null) {
    const wishes = await wishServices.getUserWishes(userId);
    if (wishes != null) {
      res.status(200).send({ message: "product wishlist", data: wishes });
    } else {
      res.status(200).send({ message: "product wish list is empty" });
    }
  } else {
    res.status(500).send({ error: "Could not get users wishes" });
  }
};

export const flushUserWishes = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const userId: string = user.dataValues.id as string;
  if (userId != null) {
    const wishes = await wishServices.flushWishes(userId);
    if (wishes != null) {
      res.status(200).send({ message: "Product wishes flushed" });
    } else {
      res.status(400).send({ error: "Could not flush wishlist" });
    }
  }
};

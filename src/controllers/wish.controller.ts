import { Request, Response } from "express";
import User from "../models/user";
import wishServices from "../services/wish.services";
import Product from "../models/Product";
import { isValidUUID } from "../utils/uuid";
import Role from "../models/Role";
import Wish from "../models/Wish";

export const createRemoveWish = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const isValid: boolean = isValidUUID(productId);
    const user: User = req.user as User;
    const userId: string = user.dataValues.id as string;
    if (isValid && productId != null) {
      const data = { productId, userId };
      const exWish = await wishServices.getSingleWish(data);
      if (exWish == null) {
        await wishServices.createWish(data);
        res.status(200).send({
          message: "product added to wishlist",
          data
        });
      } else {
        await wishServices.deleteWish(data);
        res.status(200).send({ message: "Product removed into wishlist" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Could add product wishes" });
  }
};

export const getUserWishes = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const userId: string = user.dataValues.id as string;
  const userRole: string = user.dataValues.roleId as string;
  const role = await Role.findByPk(userRole);
  let wishesData: any[] = [];

  if (role?.dataValues.name == "buyer") {
    const wishes: any = await wishServices.getUserWishes(userId);
    const productIds = wishes.map((wish: any) => wish.dataValues.productId);

    const products = await Product.findAll({
      where: {
        id: productIds
      },
      attributes: ["id", "productName", "productPrice", "productThumbnail"]
    });

    const productMap = products.reduce((map: any, product: any) => {
      map[product.dataValues.id] = product;
      return map;
    }, {});

    wishesData = wishes.map((wish: any) => {
      const { productId, userId, updatedAt, ...wishData } = wish.dataValues;
      const product = productMap[productId];
      return { ...wishData, product: product.dataValues };
    });
    res.status(200).send({
      message: "Your products wish list",
      data: wishesData
    });
  } else if (role?.dataValues.name == "seller") {
    const productsInWishes: any = [];

    const sellerProducts = await Product.findAll({
      where: { sellerId: userId },
      attributes: ["id", "productName", "productPrice", "productThumbnail"]
    });

    const sellProductsIds = sellerProducts.map(
      (product: any) => product.dataValues.id
    );

    const sellerProductWishes = await Wish.findAll({
      where: { productId: sellProductsIds }
    });

    for (const wish of sellerProductWishes) {
      sellerProducts.map((product) => {
        if (wish.dataValues.productId == product.dataValues.id) {
          productsInWishes.push({
            ...wish.dataValues,
            product: product.dataValues
          });
        }
      });
    }
    res.status(200).send({
      message: "your products that are being wished",
      data: productsInWishes
    });
  }
};

export const flushUserWishes = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const userId: string = user.dataValues.id as string;
  if (userId != null) {
    const wishes = await wishServices.flushWishes(userId);
    res.status(200).send({ message: "Product wishes flushed" });
  }
};

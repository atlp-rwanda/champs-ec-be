/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
import dotenv from "dotenv";
import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/user";
import Order from "../models/Order";

import {
  handleProductStockChanges,
  orderItems,
  productInCart,
  userCartInfo
} from "../services/payment.services";
import {
  ILINESITEM,
  INTUSERPRODUCT,
  IPRODUCTINCART
} from "../types/order.types";
import Cart from "../models/Cart";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10"
});

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const userId = user.dataValues.id;
    const customer = await stripe.customers.create({
      name: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
      email: user.dataValues.email,
      address: {
        line1: user.dataValues.billingAddress,
        city: user.dataValues.whereYouLive
      }
    });

    const cartProduct = (await userCartInfo(
      userId as string
    )) as IPRODUCTINCART[];

    if (cartProduct.length < 1) {
      return res.status(200).json({
        message:
          "you can'nt pay an empty cart, please add some product into your cart"
      });
    }

    const userProduct = await productInCart(cartProduct);

    const line_items: ILINESITEM[] = userProduct.map(
      (element: INTUSERPRODUCT) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: element.name,
            images: element.image
          },
          unit_amount: element.unit_amount
        },
        quantity: element.quantity
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.BASE_URL}/api/payments/success?sessionID={CHECKOUT_SESSION_ID}&user=${userId}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      customer: customer.id
    });

    return res.status(200).json({ paymenturl: session.url });
  } catch (error) {
    return res.status(500).json({ err: error });
  }

  // const session2 = await stripe.checkout.sessions.retrieve(session.id);
};

export const checkoutSuccess = async (req: Request, res: Response) => {
  const { sessionID } = req.query;
  const userId = req.query.user as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionID as string,
      {
        expand: ["setup_intent"]
      }
    );

    if (session.payment_status === "paid") {
      const cartProduct = (await userCartInfo(
        userId as string
      )) as IPRODUCTINCART[];

      const orders = orderItems(cartProduct, userId);
      const order: Array<Order> = await Order.bulkCreate(orders);

      await handleProductStockChanges(cartProduct);

      await Cart.destroy({ where: { userId } });

      return res
        .status(200)
        .json({ message: "Order is successful creates", order });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ err: "Error handling payment success:", error });
  }
};

export const checkoutCancel = async (req: Request, res: Response) => {
  res.render("payment/cancel");
};

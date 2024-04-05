import { Request, Response } from "express";
import Product from "../models/Product";
import Order from "../models/Order";
// import { OrderUpdated } from "../services/eventEmit.services";
import User from "../models/user";
import NodeEvents from "../services/eventEmit.services";
import Reviews from "../models/review";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const loggedUser: any = req.user;
    const userId: string = loggedUser.dataValues.id as string;
    const userRole = loggedUser.dataValues.Role;
    const roleName = userRole.dataValues.name;
    if (roleName === "buyer") {
      const orders = await Order.findAll({
        where: { buyerId: loggedUser.dataValues.id },
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "productName",
              "productPrice",
              "productThumbnail",
              "productCurrency"
            ],
            include: [
              {
                model: User,
                as: "seller",
                attributes: [
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "whereYouLive",
                  "billingAddress"
                ]
              },
              {
                model: Reviews,
                as: "reviews",
                attributes: ["buyerId", "rating", "feedback"]
              }
            ]
          },
          {
            model: User,
            as: "buyer",
            attributes: [
              "firstName",
              "lastName",
              "email",
              "phone",
              "whereYouLive",
              "billingAddress"
            ]
          }
        ]
      });
      return res.status(200).json({ orders });
    }
    if (roleName === "seller") {
      const data = await Order.findAll({
        include: [
          {
            model: Product,
            where: {
              sellerId: userId
            },
            include: [
              {
                model: User,
                as: "seller",
                attributes: [
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "whereYouLive",
                  "billingAddress"
                ]
              }
            ]
          },
          {
            model: User,
            as: "buyer",
            attributes: [
              "firstName",
              "lastName",
              "email",
              "phone",
              "whereYouLive",
              "billingAddress"
            ]
          }
        ]
      });
      return res
        .status(200)
        .json({ message: "successful selected", orders: data });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const loggedUser: any = req.user;
    const userId: string = loggedUser.dataValues.id as string;
    const userRole = loggedUser.dataValues.Role;
    const roleName = userRole.dataValues.name;
    const { orderId } = req.params;
    if (roleName === "seller") {
      const data = await Order.findOne({
        where: { id: orderId },
        include: [
          {
            model: Product,
            where: {
              sellerId: userId
            },
            include: [
              {
                model: User,
                as: "seller",
                attributes: [
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "whereYouLive",
                  "billingAddress"
                ]
              }
            ]
          },
          {
            model: User,
            as: "buyer",
            attributes: [
              "firstName",
              "lastName",
              "email",
              "phone",
              "whereYouLive",
              "billingAddress"
            ]
          }
        ]
      });
      return res
        .status(200)
        .json({ message: "successful selected", orders: data });
    }
    if (roleName === "buyer") {
      const order = await Order.findOne({
        where: { id: orderId, buyerId: userId },
        include: [
          {
            model: Product,
            attributes: [
              "id",
              "productName",
              "productPrice",
              "productThumbnail",
              "productCurrency"
            ],
            include: [
              {
                model: User,
                as: "seller",
                attributes: [
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "whereYouLive",
                  "billingAddress"
                ]
              },
              {
                model: Reviews,
                as: "reviews",
                attributes: ["buyerId", "rating", "feedback"]
              }
            ]
          },
          {
            model: User,
            as: "buyer",
            attributes: [
              "firstName",
              "lastName",
              "email",
              "phone",
              "whereYouLive",
              "billingAddress"
            ]
          }
        ]
      });
      return res.status(200).json({ order });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const seller: User = req.user as User;

  await Order.update(
    {
      deliveryStatus: status
    },
    { where: { id: orderId }, returning: true }
  )
    .then((result) => {
      const order: Array<Order> = result[1];
      if (order.length > 0) {
        NodeEvents.emit("OrderUpdated", status, order, seller);
        return res
          .status(200)
          .json({ message: "Order status updated successful", order });
      }
      return res.status(404).json({ message: "this Order not exist" });
    })
    .catch((err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error occurred in updating order status", err });
      }
    });
};

// start order status

export const getOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findByPk(orderId);
  if (order != null) {
    const data = {
      status: order.dataValues.deliveryStatus,
      deliveryDate: order.dataValues.deliveryDate
    };
    res.status(200).send({
      message: "Order found",
      data
    });
  } else {
    res.status(404).send({ message: "Order not found" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { orderId } = req.params;
  const validOrderStatus = ["Pending", "Shipped", "Delivered"];

  if (!validOrderStatus.includes(status)) {
    return res.status(400).send({
      error: "Please provide valid order status"
    });
  }

  const order = await Order.findByPk(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const newOrder = await order.update({
    deliveryStatus: status
  });

  const data = {
    status: newOrder.dataValues.deliveryStatus,
    deliveryDate: newOrder.dataValues.deliveryDate
  };

  res.status(200).send({
    message: "Order status updated",
    data
  });
};
// end order status

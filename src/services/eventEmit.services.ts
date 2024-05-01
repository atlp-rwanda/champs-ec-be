import { EventEmitter } from "events";
import Notification from "../models/Notifications";
import User from "../models/user";
import { senderNotitficationToclient } from "../utils/mailer";
import Product from "../models/Product";
import Wish from "../models/Wish";

const Notified = new EventEmitter();

Notified.on("productWished", async (productId, userName) => {
  const productOne: Product = (await Product.findOne({
    where: {
      id: productId
    }
  })) as Product;
  const Seller: any = await User.findOne({
    where: { id: productOne.dataValues.sellerId }
  });
  if (!Seller) {
    return;
  }

  const email: string = Seller.dataValues.email as string;
  const name: string = Seller.dataValues.firstName as string;
  const subject = `Congraturation `;
  const messages = `
    Hi ${name},
    ${userName} added your  product to their wishlist.
    Thank you,
    Champs Bay
  `;
  await Notification.create({
    reciepent_id: Seller.dataValues.id,
    message: messages
  });
  senderNotitficationToclient(email, messages, subject);
});
Notified.on("productUnWished", async (productId, userName) => {
  const productOne: Product = (await Product.findOne({
    where: {
      id: productId
    }
  })) as Product;
  const Seller: any = await User.findOne({
    where: { id: productOne.dataValues.sellerId }
  });
  if (!Seller) {
    return;
  }

  const email: string = Seller.dataValues.email as string;
  const name: string = Seller.dataValues.firstName as string;
  const subject = `You Lost The wishes 😔 `;
  const messages = `
    Hi ${name},
    ${userName} removed your  product to their wishlist.
    Thank you,
    Champs Bay
  `;
  await Notification.create({
    reciepent_id: Seller.dataValues.id,
    message: messages
  });
  senderNotitficationToclient(email, messages, subject);
});
Notified.on("productUpdated", async (product) => {
  const WishesOfProduct = await Wish.findAll({
    where: { productId: product.dataValues.id }
  });

  // AFTER GET ALL WISHES I CAN FIN ALL USER WHO CREATED THAT WISHES

  WishesOfProduct.forEach(async (el) => {
    const UserWished: User = (await User.findOne({
      where: { id: el.dataValues.userId }
    })) as User;
    const email: string = UserWished.dataValues.email as string;
    const name: string = UserWished.dataValues.firstName as string;
    const subject = `The  Product ${product.dataValues.productName} Are Updated`;
    const messages = `
    Hi ${name},
    The ${product.dataValues.productName} product are now Updated you can check the changes. 
    Thank you,
    Champs Bay
  `;
    await Notification.create({
      reciepent_id: UserWished.dataValues.id,
      message: messages
    });
    senderNotitficationToclient(email, messages, subject);
  });
});
Notified.on("productAvailable", async (product) => {
  const allwish = await Wish.findAll({
    where: { productId: product.dataValues.id }
  });
  allwish.forEach(async (el) => {
    const UserWished: User = (await User.findOne({
      where: { id: el.dataValues.userId }
    })) as User;
    const email: string = UserWished.dataValues.email as string;
    const name: string = UserWished.dataValues.firstName as string;
    const subject = `The  Product ${product.dataValues.productName} Are now Available`;
    const messages = `
    Hi ${name},
    The ${product.dataValues.productName} product are now available you can buy it🫰. 
    Thank you,
    Champs Bay
  `;
    await Notification.create({
      reciepent_id: UserWished.dataValues.id,
      message: messages
    });
    senderNotitficationToclient(email, messages, subject);
  });
});

// waiting fo the data comming from Emmanuel
Notified.on("orderUpdated", async (order) => {});
export default Notified;

import { EventEmitter } from "events";
import Notification from "../models/Notifications";
import User from "../models/user";
import { senderNotitficationToclient } from "../utils/mailer";
import Product from "../models/Product";
import Wish from "../models/Wish";

const Notified = new EventEmitter();

Notified.on("productEnd", async (product) => {
  const users = await User.findAll({});

  if (!users) {
    return;
  }

  users.forEach(async (element) => {
    const email: string = element.dataValues.email as string;
    const name: string = element.dataValues.firstName as string;
    const productName: string = product.productName as string;

    const message = `The product "${product.name}" has been bought by `;
    await Notification.create({
      reciepent_id: element.dataValues.id,
      message: `The product "${productName}" has been bought by ${name}`
    });
    await Notification.create({
      reciepent_id: element.dataValues.id,
      message
    });
    senderNotitficationToclient(email, name, message);
  });
});

Notified.on("productDeleted", async (product, productName) => {
  const allWishes = await Wish.findAll({
    where: {
      productId: product.dataValues.id
    }
  });
  if (!allWishes) {
    return;
  }

  // FIND ALL USER WISHED THAT PRODUCT AND NOTIFIE THEM
  allWishes.forEach(async (el) => {
    const UserWished: User = (await User.findOne({
      where: { id: el.dataValues.userId }
    })) as User;
    const email: string = UserWished.dataValues.email as string;
    const name: string = UserWished.dataValues.firstName as string;
    const subject = `Temporary Unavailability of ${productName} Product`;
    const message = `
    Hi ${name},
    The ${productName} product has been removed from the market. If it becomes available again, we will notify you. 
    Thank you,
    Champs Bay
  `;
    await Notification.create({
      reciepent_id: UserWished.dataValues.id,
      message
    });
    senderNotitficationToclient(email, message, subject);
  });
});

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
Notified.on("productCreated", async (product) => {
  const users = await User.findAll({});
  users.forEach(async (el) => {
    const email: string = el.dataValues.email as string;
    const name: string = el.dataValues.firstName as string;
    const subject = `New Product On the Market`;
    const messages = `
  Hi ${name},
  The ${product.dataValues.productName} product are now on The market you can check. 
  Thank you,
  Champs Bay
`;
    await Notification.create({
      reciepent_id: el.dataValues.id,
      message: messages
    });
    senderNotitficationToclient(email, messages, subject);
  });
});

export default Notified;

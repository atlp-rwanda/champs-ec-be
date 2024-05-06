import EventEmitter from "events";
import Notification from "../models/Notifications";
import User from "../models/user";
import { senderNotitficationToclient } from "../utils/mailer";
import Product from "../models/Product";
import Wish from "../models/Wish";
import Order from "../models/Order";
import { SocketTrigger } from "../socket.notification";

const NodeEvents = new EventEmitter();

NodeEvents.on("productWished", async (productId: string, userName: string) => {
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
  const sellerid: string = Seller.dataValues.id as string;
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

  SocketTrigger(sellerid, email, messages, subject);
  senderNotitficationToclient(email, messages, subject);
});
NodeEvents.on("productAvailable", async (product: Product) => {
  const allwish = await Wish.findAll({
    where: { productId: product.dataValues.id }
  });
  allwish.forEach(async (el) => {
    const UserWished: User = (await User.findOne({
      where: { id: el.dataValues.userId }
    })) as User;
    const email: string = UserWished.dataValues.email as string;
    const name: string = UserWished.dataValues.firstName as string;
    const sellerid: string = UserWished.dataValues.id as string;
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

    SocketTrigger(sellerid, email, messages, subject);
    senderNotitficationToclient(email, messages, subject);
  });
});
NodeEvents.on("newOrder", async (orders: Order[], sellerID: string) => {
  const Buyer: User = (await User.findOne({
    where: { id: sellerID }
  })) as User;
  const email: string = Buyer.dataValues.email as string;
  const name: string = Buyer.dataValues.firstName as string;
  const UserId: string = Buyer.dataValues.id as string;
  const subject = `New order `;
  const messages = `
  Hi ${name},
  your have paid successffull and you have a new order which are Pending.
  Thank you ,
  Champs Bay
`;

  // BUYER SIDE
  await Notification.create({
    reciepent_id: Buyer.dataValues.id,
    message: messages
  });

  SocketTrigger(UserId, email, messages, subject);
  senderNotitficationToclient(email, messages, subject);

  // SELLERS SIDE FOR MANY SELLER
  orders.forEach(async (el: Order) => {
    const product: Product = (await Product.findOne({
      where: { id: el.dataValues.productId }
    })) as Product;

    const seller: User = (await User.findOne({
      where: { id: product.dataValues.sellerId }
    })) as User;

    const emailSeller: string = seller.dataValues.email as string;
    const nameSeller: string = seller.dataValues.firstName as string;
    const UserIdSeller: string = seller.dataValues.id as string;
    const subjectSeller = `Congraturation you sold new product 😇 `;
    const messagesSeller = `
  Hi ${nameSeller},
  your sold ${product.dataValues.productName} product to the client ${Buyer.dataValues.firstName}.
  Thank you ,
  Champs Bay
`;

    await Notification.create({
      reciepent_id: seller.dataValues.id,
      message: messagesSeller
    });

    SocketTrigger(UserIdSeller, emailSeller, messagesSeller, subjectSeller);
    senderNotitficationToclient(emailSeller, messagesSeller, subjectSeller);
  });
});
NodeEvents.on(
  "OrderUpdated",
  async (status: string, order: Order[], seller: User) => {
    const Buyer: User = (await User.findOne({
      where: { id: order[0].dataValues.buyerId }
    })) as User;

    const email: string = Buyer.dataValues.email as string;
    const name: string = Buyer.dataValues.firstName as string;
    const sellerId: string = Buyer.dataValues.id as string;
    const subject = `Update on Your order `;
    const messages = `
  Hi ${name},
  your order are now ${status}.
  Thank you,
  Champs Bay
`;

    // BUYER SIDE
    await Notification.create({
      reciepent_id: Buyer.dataValues.id,
      message: messages
    });

    SocketTrigger(sellerId, email, messages, subject);
    senderNotitficationToclient(email, messages, subject);

    // SELLER SIDE

    const emailSeller: string = seller.dataValues.email as string;
    const nameSeller: string = seller.dataValues.firstName as string;
    const sellerIdSeller: string = seller.dataValues.id as string;
    const subjectSeller = `Update on  order `;
    const messagesSeller = `
  Hi ${nameSeller},
  your order are now ${status}.
  Thank you,
  Champs Bay
`;
    await Notification.create({
      reciepent_id: seller.dataValues.id,
      message: messagesSeller
    });

    SocketTrigger(sellerIdSeller, emailSeller, messagesSeller, subjectSeller);
    senderNotitficationToclient(emailSeller, messagesSeller, subjectSeller);
  }
);
NodeEvents.on("productUnavailable", async (product: Product) => {
  // SELLER SECTION
  console.log("kotwahageze-------------");
  const seller: User = (await User.findOne({
    where: { id: product.dataValues.sellerId }
  })) as User;
  const email: string = seller.dataValues.email as string;
  const name: string = seller.dataValues.firstName as string;
  // const userId: string = seller.dataValues.id;
  const subject = `Your  Product ${product.dataValues.productName} Are now out of stock`;
  const messages = `
  Hi ${name},
 your product  ${product.dataValues.productName} are now out of stock you can increase the quantity because it have different wishes .
  Thank you ,
  Champs Bay
`;
  const sellerId: string = seller.dataValues.id as string;
  await Notification.create({
    reciepent_id: seller.dataValues.id,
    message: messages
  });

  SocketTrigger(sellerId, email, messages, subject);
  senderNotitficationToclient(email, messages, subject);

  // CREATE NOTIFICATION FOR ALL CRIENT

  const allwish = await Wish.findAll({
    where: { productId: product.dataValues.id }
  });
  allwish.forEach(async (el) => {
    const UserWished: User = (await User.findOne({
      where: { id: el.dataValues.userId }
    })) as User;
    const email1: string = UserWished.dataValues.email as string;
    const name1: string = UserWished.dataValues.firstName as string;
    const userId1: string = UserWished.dataValues.id as string;
    const subject1 = `The  Product ${product.dataValues.productName} Are now Available`;
    const messages1 = `
    Hi ${name1},
    The ${product.dataValues.productName} product you wished before  are now unavailable but soon it will be available.
    Thank you for understunding,
    Champs Bay
  `;
    await Notification.create({
      reciepent_id: UserWished.dataValues.id,
      message: messages
    });

    SocketTrigger(userId1, email1, messages1, subject1);
    senderNotitficationToclient(email1, messages1, subject1);
  });
});

export default NodeEvents;

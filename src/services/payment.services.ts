import Cart from "../models/Cart";
import Product from "../models/Product";
import { INTUSERPRODUCT, IORDER, IPRODUCTINCART } from "../types/order.types";

export const userCartInfo = async (userId: string) => {
  const cart = (await Cart.findOne({
    where: { userId }
  })) as Cart;
  const cartProduct = cart.dataValues.product;
  return cartProduct;
};

export const getAllProductInCatrt = async (ProductID: Array<string>) => {
  const products = await Product.findAll({
    where: {
      id: ProductID
    }
  });
  const arr = [...products];
  return arr;
};

export const productInCart = async (cartProduct: IPRODUCTINCART[]) => {
  const userProduct: Array<INTUSERPRODUCT> = [];
  const promises = cartProduct.map(async (element) => {
    const product: any = (await Product.findOne({
      where: { id: element.product }
    })) as Product;
    const productQuantity: INTUSERPRODUCT = {
      quantity: 0,
      name: "",
      image: "",
      unit_amount: 0
    };
    productQuantity.quantity = element.quantity;
    productQuantity.name = product.dataValues.productName as string;
    productQuantity.unit_amount = Number(product.dataValues.productPrice);
    userProduct.push(productQuantity);
  });
  await Promise.all(promises);
  return userProduct;
};

export const orderItems = (
  cartProduct: Array<IPRODUCTINCART>,
  userId: string
): Array<IORDER> => {
  const deliverDate = new Date();
  const orders: Array<IORDER> = [];
  deliverDate.setDate(deliverDate.getDate() + 2);
  cartProduct.forEach(
    (element: { product: string; quantity: number; totalPrice: number }) => {
      let listOrders: IORDER = {
        buyerId: "",
        productId: "",
        totalAmount: 0,
        deliveryDate: new Date(),
        quantity: 0,
        isPaid: false,
        paymentDate: new Date()
      };
      listOrders = {
        buyerId: userId,
        productId: element.product,
        totalAmount: element.totalPrice,
        deliveryDate: deliverDate,
        quantity: element.quantity,
        isPaid: true,
        paymentDate: new Date()
      };
      orders.push(listOrders);
    }
  );
  return orders;
};

export const handleProductStockChanges = async (
  cartProduct: Array<IPRODUCTINCART>
) => {
  const promises = cartProduct.map(async (element) => {
    const product: any = (await Product.findOne({
      where: { id: element.product }
    })) as Product;
    await Product.update(
      { stockLevel: product.dataValues.stockLevel - element.quantity },
      { where: { id: element.product } }
    );
  });
  await Promise.all(promises);
};

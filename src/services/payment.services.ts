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

export const productInCart = async (
  cartProduct: IPRODUCTINCART[]
): Promise<Array<INTUSERPRODUCT>> => {
  const ProductID: Array<string> = [];

  const userProduct: Array<INTUSERPRODUCT> = [];

  cartProduct.forEach((element: { product: string; quantity: number }) => {
    ProductID.push(element.product);
    const productQuantity: any = {
      quantity: 0
    };
    productQuantity.quantity = element.quantity;
    userProduct.push(productQuantity);
  });

  const products = await getAllProductInCatrt(ProductID);

  for (let i: number = 0; i < products.length; i++) {
    userProduct[i].name = products[i].dataValues.productName as string;
    userProduct[i].unit_amount = Number(products[i].dataValues.productPrice);
  }
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

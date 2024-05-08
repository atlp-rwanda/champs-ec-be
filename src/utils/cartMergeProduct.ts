import Product from "../models/Product";

interface CartItem {
  productId: string;
  Quantity: number;
}
const findProduct = async (prod: CartItem) => {
  const product: any = await Product.findOne({
    where: {
      id: prod.productId
    }
  });
  return product;
};
const checkifExist = async (products: Array<object>): Promise<boolean> => {
  const checks = await Promise.all(
    products.map(async (el: any) => {
      const product = await Product.findOne({
        where: {
          id: el.product
        }
      });
      const finalProduct: any = product?.dataValues;
      const number = finalProduct.stockLevel;

      return el.quantity <= Number(number);
    })
  );

  return checks.every((check) => check);
};
export const mergeDuplicatedProduct = async (products: any[]) => {
  const mergedproductMap = new Map<string, any>();
  products.forEach((el) => {
    const { product: productId, quantity, totalPrice } = el;

    if (mergedproductMap.has(productId)) {
      const existproduct = mergedproductMap.get(productId);
      existproduct.quantity += quantity;
      existproduct.totalPrice += totalPrice;
    } else {
      mergedproductMap.set(productId, {
        product: productId,
        quantity,
        totalPrice
      });
    }
  });
  const mergedProducts = Array.from(mergedproductMap.values());
  const StockCheck = await checkifExist(mergedProducts);

  const totalPrice = mergedProducts.reduce(
    (sum, product) => sum + product.totalPrice,
    0
  );
  return { product: mergedProducts, totalPrice, StockCheck };
};

export const getProductsWithQuantity = async (cartItems: CartItem[]) => {
  const productsWithQuantity = await Promise.all(
    cartItems.map(async (cartItem: CartItem, index) => {
      const product: any = await findProduct(cartItem);
      if (!product) {
        const error: Error | any = new Error(
          `The product of id: ${cartItem.productId} does not exist on the market. Please change it to an existing product.`
        );
        error.status = 404;
        error.productNumber = index + 1;
        throw error;
      }
      return {
        product: cartItem.productId,
        quantity: cartItem.Quantity,
        totalPrice: product.dataValues.productPrice * cartItem.Quantity
      };
    })
  );
  return productsWithQuantity;
};

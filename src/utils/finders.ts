import { Request } from "express";
import User from "../models/user";
import Product from "../models/Product";

/*
    This function 'findUserByEmail' finds a user by provided email
    and returns either a user or an error object. It can be reused across 
    the whole application.
*/

export const findUserByEmail = async (req: Request) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  return user;
};

/*
    This function below fetches all products from the database it 
    either returns an array or an error object. it can also be reused 
    across the whole app
*/

export const findAllProducts = async (): Promise<Product[] | object[]> => {
  try {
    const products = await Product.findAll();
    return products;
  } catch (err) {
    console.error(err);
    throw new Error("Couldn't Perform task at the moment");
  }
};

/*
    This function below fetches all products from the database iterates 
    through the returned array of object to identify and flagg products that 
    are expired. 
*/

export const checkExpiredProducts = async (): Promise<void> => {
  const products = await findAllProducts();
  if (!products.length) {
    console.error("No Products found");
    return;
  }
  const checkProduct = async (index: number): Promise<number | undefined> => {
    if (index < 0) return; // Base case
    const currentItem = products[index] as Product;
    const expiryDate = new Date(currentItem.dataValues.expireDate as Date);
    if (expiryDate <= new Date()) {
      await currentItem.update({ isExpired: true });
      if (new Date() > expiryDate && currentItem.dataValues.isFeatured) {
        await currentItem.update({ isFeatured: false });
      }
    }
    checkProduct(index - 1);
  };
  checkProduct(products.length - 1);
  console.log("SUCCESS: ALL PRODUCTS EXPIRATION DATES HAVE BEEN CHECKED");
};

export const findAllUsers = async (): Promise<User[]> => {
  return await User.findAll();
};

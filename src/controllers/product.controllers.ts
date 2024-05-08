/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable radix */
/* eslint-disable no-await-in-loop */
import { Request, Response, NextFunction } from "express";
import sequelize, { Op } from "sequelize";

import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import { checkExpiredProducts } from "../utils/finders";

import { isImageExist } from "../utils/product.image.check";
import Product from "../models/Product";
import { cloudinary } from "../config/cloudinary.config";
import {
  ProductAttributes,
  ProductPictureAtributes
} from "../types/product.types";

import User from "../models/user";
import formatString from "../utils/string.manipulation";
import Reviews from "../models/reviews";
import NodeEvents from "../services/eventEmit.services";

export const createProducts = async (req: Request, res: Response) => {
  try {
    const logedUser: User = req.user as User;
    const sellerId: string = logedUser.dataValues.id as string;

    const {
      stockLevel,
      productCategory,
      productPrice,
      productCurrency,
      productDiscount,
      productDescription,
      expireDate
    } = req.body;
    const productName = formatString(req.body.productName);
    const urls: Array<ProductPictureAtributes> = [];
    const images = req.files as Express.Multer.File[];
    const multiplePicturePromise = images.map((picture) =>
      cloudinary.uploader.upload(picture.path, { folder: "product" })
    );

    const imageResponses: any = await Promise.all(multiplePicturePromise)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });

    imageResponses.forEach((img: { secure_url: any; asset_id: any }) => {
      const data: ProductPictureAtributes = {
        url: img.secure_url,
        imgId: img.asset_id
      };
      urls.push(data);
    });

    const product = await Product.create({
      sellerId,
      productName,
      stockLevel,
      productCategory,
      productPrice,
      productCurrency,
      productDiscount,
      productDescription,
      productThumbnail: urls[0].url,
      productPictures: urls,
      expireDate
    });
    res
      .status(201)
      .json({ message: "Product item is successful created", product });
  } catch (error: any) {
    return res.status(500).json({
      errors: "Internal server error",
      error: error.message
    });
  }
};

/* this function will help to lists all product items in seller collection */

export const getAllSellerProducts = async (req: any, res: Response) => {
  try {
    const logedUser: any = req.user as User;

    if (logedUser.Role && logedUser.Role.dataValues.name === "seller") {
      const userId: string = logedUser.dataValues.id as string;

      if (logedUser.Role.dataValues.name === "seller") {
        const products = await Product.findAll({
          where: {
            sellerId: userId
          },
          include: [
            {
              model: Reviews,
              as: "reviews",
              attributes: ["buyerId", "rating", "feedback"]
            }
          ]
        });
        if (products.length < 1) {
          return res
            .status(404)
            .json({ message: "no product found, please add new" });
        }

        return res.status(200).json({ products });
      }
    } else {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;

      // Query the database for available products with pagination
      const { count, rows: products } = await Product.findAndCountAll({
        where: { isAvailable: true },
        include: [
          {
            model: Reviews,
            as: "reviews",
            attributes: ["buyerId", "rating", "feedback"]
          }
        ],
        offset,
        limit
      });
      // Return a response with paginated list and metadata
      res.status(200).json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        products
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const logedUser: any = req.user as User;

    if (logedUser.Role && logedUser.Role.dataValues.name === "seller") {
      const userId: string = logedUser.dataValues.id as string;
      if (logedUser.Role.dataValues.name === "seller") {
        const product = await Product.findOne({
          where: {
            id: req.params.productId,
            sellerId: userId
          },
          include: [
            {
              model: Reviews,
              as: "reviews",
              attributes: ["buyerId", "rating", "feedback"]
            }
          ]
        });

        return res.status(200).json({ product });
      }
    } else {
      const product = await Product.findOne({
        where: {
          id: req.params.productId,
          isAvailable: true
        },
        include: [
          {
            model: Reviews,
            as: "reviews",
            attributes: ["buyerId", "rating", "feedback"]
          }
        ]
      });
      res.status(200).json(product);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* this function will help to update product item information within seller collection */

export const updateSellerProduct = async (req: Request, res: Response) => {
  try {
    const logedUser: User = req.user as User;
    const userId: string = logedUser.dataValues.id as string;
    const product: ProductAttributes | any = await Product.findOne({
      where: {
        id: req.params.productId,
        sellerId: userId
      }
    });

    if (req.body.productName) {
      const productName = formatString(req.body.productName);
      product.productName = productName;
    }
    if (req.body.stockLevel) {
      product.stockLevel = req.body.stockLevel;
    }
    if (req.body.productCategory) {
      product.productCategory = req.body.productCategory;
    }
    if (req.body.productPrice) {
      product.productPrice = req.body.productPrice;
    }
    if (req.body.productCurrency) {
      product.productCurrency = req.body.productCurrency;
    }
    if (req.body.productDiscount) {
      const discount: number = parseInt(req.body.productDiscount, 10);
      const price: number = parseInt(product.dataValues.productPrice, 10);
      if (discount > price) {
        return res
          .status(403)
          .json({ error: "product discount can't be greater than price" });
      }
      product.productDiscount = req.body.productDiscount;
    }
    if (req.body.productDescription) {
      product.productDescription = req.body.productDescription;
    }
    if (req.body.expireDate) {
      product.expireDate = req.body.expireDate;
    }

    if (req.file) {
      if (product.dataValues.productPictures.length >= 10) {
        return res.status(403).json({
          message:
            "product item can't exceed 10 pictures, please delete some image or update one "
        });
      }

      const existingImage: [{ url: string; imgId: string }] =
        product.dataValues.productPictures;
      const img = [...existingImage];
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "product"
      });

      const newImage = {
        url: uploadedImage.secure_url,
        imgId: uploadedImage.asset_id
      };
      img.push(newImage);
      product.productPictures = img;
    }

    await product.update(product);
    return res
      .status(200)
      .json({ message: "product item is updated successful", product });
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

/* this function will help to delete  product item from the collection */

export const removeSellerProduct = async (req: Request, res: Response) => {
  const logedUser: User = req.user as User;
  const userId: string = logedUser.dataValues.id as string;

  await Product.destroy({
    where: {
      id: req.params.productId,
      sellerId: userId
    }
  });
  return res.status(203).json({ message: "one product is removed" });
};

/* this function will help to replace one picture of product item with an other from the collection and keep the list order */

export const updateProductPictures = async (req: Request, res: Response) => {
  const logedUser: User = req.user as User;
  const userId: string = logedUser.dataValues.id as string;
  const product: Product = (await Product.findOne({
    where: {
      id: req.params.productId,
      sellerId: userId
    }
  })) as Product;

  const images: [{ url: string; imgId: string }] =
    product.dataValues.productPictures;
  const newImage = [...images];

  const singleObject = isImageExist(newImage, req.params.imgId);

  if (singleObject === -1) {
    return res.status(404).json({ message: "the image id doesn't exist" });
  }

  if (req.file) {
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "product"
    });
    const img = {
      url: uploadedImage.secure_url,
      imgId: uploadedImage.asset_id
    };
    newImage[singleObject] = img;
    product.productPictures = newImage;
    await product.update(product);
    return res
      .status(201)
      .json({ message: "image pictures is updated", product });
  }
  return res
    .status(403)
    .json({ message: "Please select a new image for product item" });
};

/* this function will help to delete one picture of product item from the collection */

export const removeProductPictures = async (req: Request, res: Response) => {
  const logedUser: User = req.user as User;
  const userId: string = logedUser.dataValues.id as string;
  const product: Product | null = await Product.findOne({
    where: {
      id: req.params.productId,
      sellerId: userId
    }
  });

  if (product) {
    const images: [{ url: string; imgId: string }] =
      product.dataValues.productPictures;
    const newImage = [...images];
    const singleObject = isImageExist(newImage, req.params.imgId);
    if (singleObject === -1) {
      return res.status(404).json({ message: "the image id doesn't exist" });
    }
    newImage.splice(singleObject, 1);

    product.productPictures = newImage;
    await product.update(product);

    return res
      .status(203)
      .json({ message: "image pictures is removed", product });
  }
};

export const setProductThumbnail = async (req: Request, res: Response) => {
  const logedUser: User = req.user as User;
  const userId: string = logedUser.dataValues.id as string;
  const product: Product | null = (await Product.findOne({
    where: {
      id: req.params.productId,
      sellerId: userId
    }
  })) as Product;

  const images: [{ url: string; imgId: string }] =
    product.dataValues.productPictures;
  const newImage = [...images];
  const singleObject = isImageExist(newImage, req.params.imgId);

  if (singleObject === -1) {
    return res.status(404).json({ message: "the image id doesn't exist" });
  }

  product.productThumbnail = newImage[singleObject].url;
  await product.update(product);

  return res
    .status(201)
    .json({ message: "the item thumbnail is updated", product });
};

// trigger check products expiration from API request

export const productExpirationChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await checkExpiredProducts();
    return res
      .status(200)
      .json({ msg: "Expired products unlisted successfully." });
  } catch (err) {
    console.error("FAILURE: COULD NOT PERFORM TASK AT THE MOMENT");
    return res
      .status(500)
      .json({ msg: "Couldn't check all products' expiration dates" });
  }
};
// update product status
export const updateProductStatus = async (req: Request, res: Response) => {
  const logedUser: User = req.user as User;
  const { productId } = req.params;
  const userId: string = logedUser.dataValues.id as string;
  const { isAvailable } = req.body;

  try {
    // Find the product
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
        sellerId: userId
      }
    });

    // Check if product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.update({ isAvailable: req.body.isAvailable });
    if (isAvailable) {
      NodeEvents.emit("productAvailable", product);
    }
    // Return success response
    res.status(200).json({
      message: `Product marked as ${isAvailable ? "available" : "unavailable"}`
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// products stats
dayjs.extend(utc);
export const getProductsStatsbySeller = async (req: Request) => {
  const logedUser: User = req.user as User;
  const sellerId: string = logedUser.dataValues.id as string;

  const { end } = req.query as any;
  const { start } = req.query as any;
  const startDate = dayjs(start).startOf("day").utc().toDate();
  try {
    const endDate = dayjs(end).endOf("day").utc().toDate();
    const products = await Product.findAll({
      where: {
        sellerId: sellerId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    return products.length;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
// expired products status
export const expiredProductsStats = async (req: Request) => {
  const logedUser: User = req.user as User;
  const sellerId: string = logedUser.dataValues.id as string;
  const { end } = req.query as any;
  const { start } = req.query as any;
  const startDate = dayjs(start).startOf("day").utc().toDate();
  const endDate = dayjs(end).endOf("day").utc().toDate();
  try {
    const products = await Product.findAll({
      where: {
        sellerId: sellerId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        isExpired: true
      }
    });
    return products.length;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const availableProductsStats = async (req: Request) => {
  const loggedUser = req.user as User;
  const sellerId = loggedUser.dataValues.id as string;
  const { end } = req.query as any;
  const { start } = req.query as any;
  const startDate = dayjs(start).startOf("day").utc().toDate();
  const endDate = dayjs(end).endOf("day").utc().toDate();
  try {
    const products = await Product.findAll({
      where: {
        sellerId: sellerId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        isAvailable: true
      }
    });
    return products.length;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
const getStockLevelForDate = async (
  date: Date,
  sellerId: string
): Promise<number> => {
  try {
    const products = await Product.findAll({
      where: {
        sellerId: sellerId,
        createdAt: {
          [Op.lte]: date
        }
      }
    });
    const productsObj = products.map((product) => product.toJSON());
    let totalStock = 0;
    for (let i = 0; i < productsObj.length; i++) {
      const product = productsObj[i];
      if (product.stockLevel) {
        const stockQuantity = parseFloat(
          String(product.stockLevel).split(" ")[0]
        );
        totalStock += stockQuantity;
      }
    }
    return totalStock;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getStockStats = async (req: Request) => {
  const loggedUser = req.user as User;
  const sellerId = loggedUser.dataValues.id as string;
  const { end } = req.query as any;
  const { start } = req.query as any;
  const startDate = dayjs(start).startOf("day").utc().toDate();
  const endDate = dayjs(end).endOf("day").utc().toDate();
  const startStockLevel = await getStockLevelForDate(startDate, sellerId);
  const endStockLevel = await getStockLevelForDate(endDate, sellerId);
  const stockChange: number = endStockLevel - startStockLevel;
  if (stockChange > 0) {
    return parseInt(`+${stockChange}`);
  }
  return parseInt(`-${stockChange}`);
};

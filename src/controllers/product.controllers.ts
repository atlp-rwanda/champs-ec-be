/* eslint-disable no-await-in-loop */
import { Request, Response, NextFunction } from "express";
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
  } catch (error) {
    return res.status(500).json({ errors: "Internal server error", error });
  }
};

/* this function will help to lists all product items in seller collection */

export const getAllSellerProducts = async (req: Request, res: Response) => {
  try {
    const logedUser: User = req.user as User;
    const userId: string = logedUser.dataValues.id as string;

    const products = await Product.findAll({
      where: {
        sellerId: userId
      }
    });
    if (products.length < 1) {
      return res
        .status(404)
        .json({ message: "no product found, please add new" });
    }
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* this function will help to get information for one product item in seller collection */

export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const logedUser: User = req.user as User;
    const userId: string = logedUser.dataValues.id as string;
    const product = await Product.findOne({
      where: {
        id: req.params.productId,
        sellerId: userId
      }
    });

    return res.status(200).json({ product });
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
    console.error("FAILURE: COULD NOT PERFORM TASK AT THE MOMENT", err);
    return res
      .status(500)
      .json({ msg: "Couldn't check all products' expiration dates" });
  }
};

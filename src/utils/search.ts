import { Op } from "sequelize";
import Product from "../models/Product";
import { isValidUUID } from "./uuid";

interface QueryParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export const buildWhereClause = async (
  queryParams: QueryParams,
  userId?: string
) => {
  const { name, minPrice, maxPrice, category } = queryParams;
  const whereClause: any = {};

  if (name) {
    const nameKeywords = name.split(" ");
    whereClause.productName = {
      [Op.and]: nameKeywords.map((keyword) => ({
        [Op.iLike]: `%${keyword}%`
      }))
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    if (minPrice !== undefined && maxPrice !== undefined) {
      whereClause.productPrice = {
        [Op.between]: [minPrice, maxPrice]
      };
    } else if (minPrice !== undefined) {
      whereClause.productPrice = {
        [Op.gte]: minPrice
      };
    } else if (maxPrice !== undefined) {
      whereClause.productPrice = {
        [Op.lte]: maxPrice
      };
    }

    const productsExist = await Product.findOne({
      where: whereClause.productPrice ? whereClause : {}
    });

    if (!productsExist) {
      throw new Error("No products found within the specified price range");
    }
  }

  if (category) {
    if (category !== null) {
      const isValidId: boolean = isValidUUID(category);
      if (!isValidId) {
        throw new Error("nvalid UUID format, please try again ");
      }
      whereClause.productCategory = category;
    } else {
      throw new Error("Category not found");
    }
  }

  if (userId === "") {
    delete whereClause.sellerId;
  } else {
    whereClause.sellerId = userId;
  }

  return whereClause;
};

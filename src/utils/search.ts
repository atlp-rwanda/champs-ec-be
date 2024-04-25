import { Op } from "sequelize";
import { getCategoryIdByName } from "../middlewares/productCategory.middlewares";

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
      [Op.or]: [
        { [Op.iLike]: `%${name}%` },
        {
          [Op.and]: nameKeywords.map((keyword) => ({
            [Op.iLike]: `%${keyword}%`
          }))
        }
      ]
    };
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    whereClause.productPrice = {
      [Op.between]: [minPrice, maxPrice]
    };
  } else {
    if (minPrice !== undefined) {
      whereClause.productPrice = { [Op.gte]: minPrice };
    }
    if (maxPrice !== undefined) {
      whereClause.productPrice = {
        ...whereClause.productPrice,
        [Op.lte]: maxPrice
      };
    }
  }

  if (category) {
    const categoryId = await getCategoryIdByName(category);
    if (categoryId !== null) {
      whereClause.productCategory = categoryId;
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

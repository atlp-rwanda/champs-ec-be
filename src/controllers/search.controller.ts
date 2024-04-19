import { Request, Response } from "express";
import Product from "../models/Product";
import { buildWhereClause } from "../utils/search";
import User from "../models/user";

interface QueryParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}
export const searchProducts = async (req: Request, res: Response) => {
  const queryParams = req.query as QueryParams;
  let userId;
  if (req.user) {
    const role = (req.user as any).Role.dataValues.name;
    if (role === "seller") {
      const loggedUser: User = req.user as User;
      userId = loggedUser.id;
    }
    console.log(userId);
  } else {
    userId = "";
  }
  try {
    const whereClause = await buildWhereClause(queryParams, userId);
    const products = await Product.findAll({
      where: whereClause
    });
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default searchProducts;

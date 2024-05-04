import { Request, Response } from "express";
import { getWishesStatistics } from "./wish.controller";
import {
  expiredProductsStats,
  getProductsStatsbySeller,
  availableProductsStats,
  getStockStats
} from "./product.controllers";

export const getGeneralStats = async (req: Request, res: Response) => {
  try {
    const productsStats = await getProductsStatsbySeller(req);
    const expiredProducts = await expiredProductsStats(req);
    const wishesStats = await getWishesStatistics(req);
    const availableProducts = await availableProductsStats(req);
    const stockLevelStats = await getStockStats(req);

    res.status(200).json({
      status: "success",
      data: {
        productsStats,
        expiredProducts,
        wishesStats,
        availableProducts,
        stockLevelStats
      }
    });
  } catch (error) {
    console.error("Error fetching general statistics:", error);
    res.status(500).json({
      status: "error",
      error: "Internal server error"
    });
  }
};

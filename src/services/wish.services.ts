import Product from "../models/Product";
import Wish from "../models/Wish";
import { WishCreationAttributes } from "../types/wish.types";

class WishService {
  async createWish(data: WishCreationAttributes) {
    return await Wish.create(data);
  }

  async getSingleWish(data: WishCreationAttributes) {
    return await Wish.findOne({ where: data });
  }

  async deleteWish(data: WishCreationAttributes) {
    return await Wish.destroy({ where: data });
  }

  async getUserWishes(userId: string) {
    return await Wish.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "productThumbnail", "stockLevel"]
        }
      ]
    });
  }

  async flushWishes(userId: string) {
    return await Wish.destroy({ where: { userId } });
  }
}

export default new WishService();

import Wish from "../models/Wish";
import { WishCreationAttributes } from "../types/wish.types";

class WishService {
  async createWish(data: WishCreationAttributes) {
    try {
      return await Wish.create(data);
    } catch (error) {
      console.error("could not create wish", error);
    }
  }

  async getSingleWish(data: WishCreationAttributes) {
    try {
      return await Wish.findOne({ where: data });
    } catch (error) {
      console.error("could not get wish", error);
    }
  }

  async deleteWish(data: WishCreationAttributes) {
    try {
      return await Wish.destroy({ where: data });
    } catch (error) {
      console.error("could not delete wish", error);
    }
  }

  async getUserWishes(userId: string) {
    try {
      return await Wish.findAll({ where: { userId } });
    } catch (error) {
      console.error("could not get wish", error);
    }
  }

  async getProductWishes(productId: string) {
    try {
      return await Wish.findAll({ where: { productId } });
    } catch (error) {
      console.error("could not get wishes", error);
    }
  }

  async flushWishes(userId: string) {
    try {
      return await Wish.destroy({ where: { userId } });
    } catch (error) {
      console.error("could not flush wishes", error);
    }
  }
}

export default new WishService();

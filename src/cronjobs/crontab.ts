import cron from "node-cron";
import { checkExpiredProducts } from "../utils/finders";
import { checkExpiredPasswords } from "../utils/checkExpiredPassword";
import Product from "../models/Product";
import NodeEvents from "../services/eventEmit.services";

// Cron job to check product expiry and unlist expired products
export const startProductsExpirationCronJob = (targetDate: string): void => {
  cron.schedule(targetDate, async () => {
    try {
      await checkExpiredProducts(); // axios request goes here
      console.log(
        "Expired products unlisted successfully and unfeature the expired product."
      );
    } catch (error) {
      console.error("Error: unlisting expired products:", error);
    }
  });
};

// Cron job to check expired passwords
export const startPasswordExpirationCronJob = (targetDate: string): void => {
  cron.schedule(targetDate, async () => {
    try {
      await checkExpiredPasswords();
      console.log("Expired password flaged successfully from cronjob.");
    } catch (error) {
      console.error("Error: flaging expired passwords : ", error);
      throw new Error("Error starting cronjob");
    }
  });
};

// / CRON JOB TO NOTIFY THE SELLER CRIENTS WHO WISHED THE PRODUCT

export const handleUnavailable = (targetDate: string): void => {
  cron.schedule(targetDate, async () => {
    const productend = await Product.findOne({
      where: { stockLevel: 0 }
    });

    if (productend) {
      NodeEvents.emit("productUnavailable", productend);
      console.log("product Un available ------------------------");
    }
  });
};

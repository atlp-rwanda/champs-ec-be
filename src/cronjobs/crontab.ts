import cron from "node-cron";
import { checkExpiredProducts } from "../utils/finders";
import { checkExpiredPasswords } from "../utils/checkExpiredPassword";

// Cron job to check product expiry and unlist expired products

export const startProductsExpirationCronJob = (targetDate: string): void => {
  cron.schedule(targetDate, async () => {
    try {
      await checkExpiredProducts(); // axios request goes here
      console.log("Expired products unlisted successfully.");
    } catch (error) {
      console.error("Error: unlisting expired products:", error);
    }
  });
};

// Cron job to check e xpired passwords

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

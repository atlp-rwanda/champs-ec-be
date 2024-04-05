import cron from "node-cron";
import { checkExpiredProducts } from "../utils/finders";

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

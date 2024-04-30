import { z } from "zod";

export const productReviewSchema = z
  .object({
    rating: z
      .number({
        required_error: "Rating is required"
      })
      .refine((value) => value >= 0 && value <= 5, {
        message: "Rating must be from 0 - 5 range",
        path: ["rating"]
      }),
    feedback: z.string({ required_error: "Feedback is required" })
  })
  .strict();

export const productIdValidation = z
  .object({
    productId: z.string().uuid({
      message: " Product Id is in wrong format"
    })
  })
  .strict();

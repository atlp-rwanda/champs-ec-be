import { z } from "zod";

const roleSchema = z.object({
  name: z
    .string({ required_error: "Role name is required" })
    .min(2, "Use at least 2 characters for Role name")
    .max(50, "No more than 50 characters for Role name")
    .regex(/^[a-zA-Z\s]*$/, "Role name should only contain letters and spaces")
});

export { roleSchema };

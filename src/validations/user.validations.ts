import { z } from "zod";

const passwordStrength =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

const userSchema = z.object({
  firstName: z
    .string({ required_error: "FirstName is required" })
    .min(3, "Use atleast 2 charaters for Firstname field")
    .max(30, "No more than 30 charaters for firstname field")
    .regex(/[A-Za-z\s]$/, "Firstname should not contain a number"),
  lastName: z
    .string({ required_error: "LastName is required" })
    .min(2, "Use atleast 2 charaters for Lastname field")
    .max(50, "No more than 50 charaters for Lastname field")
    .regex(/[A-Za-z\s]$/, "Lastname should not contain a number"),
  email: z.string().email("Email field must be a valid email"),
  password: z
    .string()
    .min(8, "password should be atleast 8 characters length")
    .regex(passwordStrength, "Password should be alphanumeric ")
});

export { userSchema };

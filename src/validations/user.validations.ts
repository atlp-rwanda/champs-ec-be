import { z } from "zod";

const passwordStrength =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

const userSchema = z
  .object({
    firstName: z
      .string({ required_error: "FirstName is required" })
      .min(3, "Use atleast 2 characters for Firstname field")
      .max(30, "No more than 30 characters for firstname field")
      .regex(/[A-Za-z\s]$/, "Firstname should not contain a number"),
    lastName: z
      .string({ required_error: "LastName is required" })
      .min(2, "Use atleast 2 characters for Lastname field")
      .max(50, "No more than 50 characters for Lastname field")
      .regex(/[A-Za-z\s]$/, "Lastname should not contain a number"),
    email: z.string().email("Email field must be a valid email"),
    password: z
      .string()
      .min(8, "password should be atleast 8 characters length")
      .regex(passwordStrength, "Password should be alphanumeric ")
  })
  .strict();

const updateSchema = z.object({
  firstName: z
    .string()
    .min(3, "Use atleast 3 character")
    .max(50, "No more than 50 character")
    .optional(),
  lasttName: z
    .string()
    .min(3, "Use atleast 3 character")
    .max(50, "No more than 50 character")
    .optional(),
  phone: z
    .string()
    .min(10, "minimum number is 10")
    .max(20, "maximum number are 20")
    .optional(),
  birthDate: z.string().optional(),
  profileImage: z.any(),
  preferredLanguage: z
    .string()
    .min(10, "Use atleast 3 character")
    .max(70, "No more than 50 character")
    .optional(),
  whereYouLive: z
    .string()
    .min(5, "Use atleast 3 character")
    .max(70, "No more than 50 character")
    .optional(),
  preferredcurrency: z
    .string()
    .min(5, "Use atleast 3 character")
    .max(70, "No more than 50 character")
    .optional(),
  billingAddress: z
    .string()
    .min(5, "Use atleast 3 character")
    .max(70, "No more than 50 character")
    .optional()
});

export { userSchema, updateSchema };

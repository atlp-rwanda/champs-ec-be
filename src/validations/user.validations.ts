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
    .string({ required_error: "FirstName is required" })
    .min(3, "Use atleast 3 character for firstName")
    .max(50, "No more than 50 character for firstName"),
  lastName: z
    .string({ required_error: "lastName is required" })
    .min(3, "Use atleast 3 character for lastName")
    .max(50, "No more than 50 character for lastName"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(10, "minimum number for phone field is 10")
    .max(20, "maximum number for phone field are 20"),
  birthDate: z.coerce
    .date({ required_error: "the date is required" })
    .refine((data) => data < new Date(), {
      message: `Thedate must be the date `
    }),
  profileImage: z.any(),
  preferredLanguage: z
    .string({ required_error: "Preferred Language is required" })
    .min(10, "Use atleast 3 character for preffedLanguage")
    .max(70, "No more than 50 character for preffedLanguage"),
  whereYouLive: z
    .string({ required_error: "Where you live  is required" })
    .min(5, "Use atleast 3 character for whereYouLive")
    .max(70, "No more than 50 character for whereYouLive"),
  preferredCurrency: z
    .string({ required_error: "PreffedCurrency is required" })
    .min(5, "Use atleast 3 character for preffedCurrency")
    .max(70, "No more than 50 character for preffedCurrency"),
  billingAddress: z
    .string({ required_error: "Your Address  is required" })
    .min(5, "Use atleast 3 character for billingAddress")
    .max(70, "No more than 50 character for billingAddress")
});

export { userSchema, updateSchema };

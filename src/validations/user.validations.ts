import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { isValidUUID } from "../utils/uuid";

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
      .min(8, "password should be atleast 8 characters")
      .regex(
        passwordStrength,
        "Password should be contain a capital letter, a number and a symbol "
      )
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
    .refine((data: any) => data < new Date(), {
      message: `Thedate must be the date `
    }),
  profileImage: z.any(),
  preferredLanguage: z
    .string({ required_error: "Preferred Language is required" })
    .min(10, "Use atleast 3 character for preffedLanguage")
    .max(70, "No more than 50 character for preffedLanguage"),
  whereYouLive: z
    .string({ required_error: "Where you live  is required" })
    .min(3, "Use atleast 3 character for whereYouLive")
    .max(70, "No more than 50 character for whereYouLive"),
  preferredCurrency: z
    .string({ required_error: "PreffedCurrency is required" })
    .min(2, "Use atleast 2 character for preffedCurrency")
    .max(10, "No more than 10 character for preffedCurrency"),
  billingAddress: z
    .string({ required_error: "Your Address  is required" })
    .min(5, "Use atleast 3 character for billingAddress")
    .max(70, "No more than 50 character for billingAddress")
});

const userLoginValidation = z
  .object({
    email: z.string().email("Please put valid Email."),
    password: z
      .string()
      .min(8, "password of length less than 8")
      .regex(passwordStrength, "You are using wrong password please try again")
  })
  .strict();
const userUpdatePassValidation = z
  .object({
    oldPassword: z
      .string({ required_error: "oldPassword is required" })
      .min(8, "password of length less than 8")
      .regex(
        passwordStrength,
        "Password must be alphaNumeric don't exit 15 characters"
      ),
    newPassword: z
      .string({ required_error: "newPassword is required" })
      .min(8, "password of length less than 8")
      .regex(
        passwordStrength,
        "Password must be alphaNumeric don't exit 15 characters"
      ),
    confirmPassword: z
      .string({ required_error: "confirmPassword is required" })
      .min(8, "password of length less than 8")
      .regex(
        passwordStrength,
        "Password must be alphaNumeric don't exit 15 characters"
      )
  })
  .strict();

const accountSChema = z
  .object({
    status: z.enum(["activate", "deactivate"]),
    message: z
      .string()
      .min(
        10,
        "Please provive a clear message why you deactivated this user account with atleast 10 minimum characters "
      )
      .optional()
      .or(z.literal(""))
  })
  .strict();

const accountStatusValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = accountSChema.parse(req.body);
    if (result) {
      const isValidId: boolean = isValidUUID(req.params.userId);
      if (!isValidId) {
        return res.status(403).json({
          error: "invalid user Id, please try again"
        });
      }
      if (result.status === "deactivate" && !result.message) {
        return res.status(400).json({
          err: "Message field is required. please provide a clear message why you are deactivating this account "
        });
      }
      if (result.status === "activate" && result.message) {
        return res.status(400).json({
          err: "Message field is not required to activate user"
        });
      }
      next();
    }
  } catch (error: any) {
    return res.status(400).json({ err: error.errors[0].message });
  }
};

export {
  userSchema,
  updateSchema,
  userLoginValidation,
  userUpdatePassValidation,
  accountStatusValidation
};

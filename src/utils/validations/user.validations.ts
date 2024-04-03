import { z } from "zod";

const passwordStrength =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
const userLoginValidation = z
  .object({
    email: z.string().email("Please put valid Email."),
    password: z
      .string()
      .min(8, "password of length less than 8")
      .regex(passwordStrength, "You are using wrong password please try again")
  })
  .strict();
export { userLoginValidation };

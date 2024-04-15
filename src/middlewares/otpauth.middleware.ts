import { NextFunction, Request, Response } from "express";
import randomstring from "randomstring";
import Jwt from "jsonwebtoken";
import { config } from "dotenv";
import { tokenDecode, tokenVerify } from "../utils/token.generator";
import { DataInfo } from "../controllers/otpauth.controllers";
import { sendOTPCode } from "../utils/mailer";

config();

export const isCreateOtpToken = async (id: string, email: string) => {
  const code = await randomstring.generate({
    length: 6,
    charset: "numeric"
  });
  // The body for JWT token data
  const body = {
    id,
    email,
    otp: code
  };
  await sendOTPCode(email, code);
  const token = await Jwt.sign({ body }, process.env.JWT_SECRET as string, {
    expiresIn: "180s"
  });
  return token;
};
// decode function
export const isDecodeOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { otp } = req.body;
    if (!otp) {
      return res.status(404).json({ message: "Invalid OTP" });
    }
    // this function will decode the token and get errors in case
    const result = async (err: Error, decoded: any) => {
      const data = decoded as DataInfo;
      if (err) {
        if (err.message.includes("expired")) {
          const dataDecoded = tokenDecode(token) as DataInfo;
          const newToken = await isCreateOtpToken(
            dataDecoded.body.id,
            dataDecoded.body.email
          );
          return res.status(403).json({
            message: "Token expired, new Token generated",
            newToken
          });
        }
        return res.status(404).json({ message: "Invalid token" });
      }
      if (data?.body?.otp !== otp) {
        return res.status(401).json({ message: "Wrong OTP entered" });
      }
      req.user = data;
      next();
    };
    tokenVerify(token, result);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

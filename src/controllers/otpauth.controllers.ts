import { Request, Response } from "express";
import randomstring from "randomstring";
import Jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sendOTPCode } from "../utils/mailer";
import { tokenVerify } from "../utils/token.generator";

config();

export interface DataInfo {
  body: {
    email: string;
    otp: string;
  };
}
interface UserData {
  dataValues: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
// Controller to send the OTP to the server
const sendOtp = (req: Request, res: Response) => {
  const user = req.user as UserData;

  const { email } = user.dataValues;

  // Generate a unique 6 number digit
  const code = randomstring.generate({
    length: 6,
    charset: "numeric"
  });
  // The body for JWT token data
  const body = {
    email,
    otp: code
  };
  // create a new JWT token
  // tokenAssign({ body }, "60s");
  const token = Jwt.sign({ body }, process.env.JWT_SECRET as string, {
    expiresIn: "60s"
  });
  sendOTPCode(email, code);
  res.status(201).json({
    message: "Verification code sent successfully",
    otpToken: `${token}`
  });
};

// Controller to verify the token
const verifyOtp = (req: Request, res: Response) => {
  const { token } = req.params;
  const { otp } = req.body;
  if (!otp) {
    return res.status(404).json({ message: "Invalid OTP" });
  }
  // this function will decode the token and get errors in case
  const result = (err: Error, decoded: any) => {
    if (err) {
      if (err.message.includes("expired")) {
        // When the token expires it shows that the token has expired
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(404).json({ message: "Invalid token" });
    }
    const data = decoded as DataInfo;
    if (data?.body?.otp !== otp) {
      return res.status(401).json({ message: "Wrong OTP entered" });
    }
    // Access Granted after all the conditions have been satisfied
    res.status(200).json({ message: "Access granted" });
  };
  tokenVerify(token, result);
};

export { verifyOtp, sendOtp };

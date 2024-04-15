import { Request, Response } from "express";
import { config } from "dotenv";
import { isCreateOtpToken } from "../middlewares/otpauth.middleware";
import User from "../models/user";
import { userToken } from "../utils/token.generator";

config();

export interface DataInfo {
  body: {
    id: string;
    email: string;
    otp: string;
  };
}
export interface UserData {
  dataValues: {
    roleId: string;
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
}
// Controller to send the OTP to the server
// Controller to send the OTP to the server
const sendOtp = async (req: Request, res: Response, isEmail: string) => {
  const user = (await User.findOne({
    where: {
      email: isEmail
    }
  })) as UserData;

  const { id, email } = user.dataValues;
  // Generate a unique 6 number digit
  const token = await isCreateOtpToken(id, email);
  // creates a token that will be used to create a token for verification
  res.status(201).json({
    message: "Verify with 2FA before access is granted",
    otpToken: `${token}`
  });
};

// Controller to verify the token
const verifyOtp = async (req: Request, res: Response) => {
  const data = req.user as DataInfo;
  // create a new token that gives access to the other endpoints
  const tokenSeller = await userToken(data.body.id, data.body.email);

  res.status(200).send({
    message: "Login seller successful",
    success: true,
    token: `Bearer ${tokenSeller}`
  });
};

export { verifyOtp, sendOtp };

import { config } from "dotenv";
import nodemailer from "nodemailer";
// import io from "../socket.notification";

config();

const appUrl: string =
  process.env.DB_HOST_TYPE === "local"
    ? `http://localhost:${process.env.PORT}/`
    : "https://champs-ec-be.onrender.com/";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME as string,
    pass: process.env.EMAIL_PASSWORD as string
  }
});

const mailOptions = {
  from: `"Champs bay" <atlptestauth@gmail.com>`,
  to: "",
  subject: "",
  text: ""
};

export const sendMail = async (options: any) => {
  try {
    const info = await transporter.sendMail(options);
  } catch (error) {
    console.log("error in sending email");
  }
};

export const sendVerificationMail = (
  mail: string,
  link: string,
  name: string
) => {
  const options = {
    ...mailOptions,
    to: mail,
    subject: "Account Verification Required: Please Verify Your Account",
    text: `
      Hi ${name},
      Thank you for signing up with us! 
      To complete your registration and gain access to all features, please click the link below to verify your email address:
      - Please click here to verify your account ${appUrl}${link}
      If you did not create an account with us, please disregard this email.
      Regards,
      Champs Bay
    `
  };
  sendMail(options);
};

// mailer functions
export const sendOTPCode = (email: string, code: string) => {
  const options = {
    ...mailOptions,
    to: email,
    subject: "Verification code",
    html: `
          <p style="font-size:15px; color:black;">
              Hello,<br>
              Here is your verification code:<br>
              Verification Code: <strong style="font-size: 20px;">${code}</strong><br>
              Please enter this code on the verification page to confirm your identity.<br>
              Thank you for using our service.<br>
              Champs Bay
          </p>
    `
  };
  sendMail(options);
};

export const sendResetMail = (email: string, link: string, name: string) => {
  const options = {
    ...mailOptions,
    to: email,
    subject: "Password reset request",
    text: `
      Hi ${name},
      you are trying to reset your password:
      [Verification Code: ]
      To continue to reset your password please click on the link below in the next 60 minutes. 
      ${link}
      Thank you for using our service.
      Champs Bay
    `
  };
  sendMail(options);
};

export const sendNotificationInactiveAccount = (
  mail: string,
  name: string,
  message: string
) => {
  const options = {
    ...mailOptions,
    to: mail,
    subject: "User account status notification",
    html: `
  
    ${message}
   
    <br/><br/>
    Regards,
      Champs Bay
    `
  };
  sendMail(options);
};

export const senderNotitficationToclient = (
  mail: string,
  message: string,
  subject: string
) => {
  const options = {
    ...mailOptions,
    to: mail,
    subject,
    html: `
  
    ${message}
   
    <br/><br/>
    Regards,
      Champs Bay
    `
  };
  sendMail(options);
};

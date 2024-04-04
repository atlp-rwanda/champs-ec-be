import { config } from "dotenv";
import nodemailer from "nodemailer";

config();

const appUrl: string =
  process.env.DB_HOST_TYPE == "local"
    ? `http://localhost:${process.env.PORT}/`
    : "https://champs-ec-be.onrender.com/";
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PWD
  }
});

const mailOptions = {
  from: `"Champs bay" <${process.env.MAILER_EMAIL}>`,
  to: "",
  subject: "",
  text: ""
};

const sendMail = async (options: any) => {
  try {
    const info = await transporter.sendMail(options);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
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
Champs Bay`
  };
  sendMail(options);
};

// mailer functions
export const sendOTPCode = (email: string, code: number, name: string) => {
  const options = {
    ...mailOptions,
    to: email,
    subject: "Verification code",
    text: `
Hi ${name},

Here is your verification code:

[Verification Code: ${code}]

Please enter this code on the verification page to confirm your identity.

Thank you for using our service.

Champs Bay
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

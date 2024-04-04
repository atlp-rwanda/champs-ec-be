import bcrypt from "bcrypt";

export const passwordEncrypt = async (password: string) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// function to compare password on user login
export const passwordCompare = async (
  userPassword: string,
  inputPassword: string
) => {
  const verifyPassword = await bcrypt.compare(inputPassword, userPassword);
  return verifyPassword;
};

// export const encryptString = (text: string, secretKey: string) => {
//   const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
//   return encodeURIComponent(btoa(encrypted));
// };

// export const decryptString = (encryptedString: string, secretKey: string) => {
//   const decodedString = decodeURIComponent(encryptedString);
//   const bytes = CryptoJS.AES.decrypt(atob(decodedString), secretKey);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

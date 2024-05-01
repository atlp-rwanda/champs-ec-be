/* eslint-disable no-await-in-loop */

import User from "../models/user";
import { findAllUsers } from "./finders";

export const checkExpiredPasswords = async () => {
  const users = await findAllUsers();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < users.length; i++) {
    const currentUser = users[i] as User;
    const expiryDate = new Date(
      currentUser.dataValues.passwordExpiresAt as Date
    );

    if (expiryDate.getTime() <= new Date().getTime()) {
      await currentUser.update({
        isPasswordExpired: true
      });
    }
  }
  console.log(
    "SUCCESS: ALL PASSWORD EXPIRATION DATES HAVE BEEN CHECKED",
    new Date()
  );
};

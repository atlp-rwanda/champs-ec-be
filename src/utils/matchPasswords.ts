export const matchPasswords = (
  newPassword: string,
  confirmPassword: string
) => {
  if (!newPassword || !confirmPassword) {
    return false;
  }
  if (newPassword === confirmPassword) {
    return true;
  }
  return false;
};

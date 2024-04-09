// utils.ts

export const isValidUUID = (uuid: string): boolean => {
  const UUID_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return UUID_REGEX.test(uuid);
};

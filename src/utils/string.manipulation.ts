import { z } from "zod";

const formatString = (inputStr: string) => {
  inputStr = inputStr.replace(/(^\s*)|(\s*$)/gi, "");
  inputStr = inputStr.replace(/[ ]{2,}/gi, " ");
  inputStr = inputStr.replace(/\n /, "\n");
  return inputStr.toLowerCase();
};

const StringParamSchema = z.string();

export function validateStringParam(param: unknown): string {
  try {
    const validatedParam = StringParamSchema.parse(param);
    return validatedParam;
  } catch (error) {
    throw new Error("Parameter must be a string");
  }
}

const NumberParamSchema = z.number();

export function validateNumberParam(param: unknown): number {
  try {
    const validatedParam = NumberParamSchema.parse(param);
    return validatedParam;
  } catch (error) {
    throw new Error("Parameter must be a number");
  }
}
export default formatString;

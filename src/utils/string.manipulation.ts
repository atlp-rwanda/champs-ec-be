const formatString = (inputStr: string) => {
  inputStr = inputStr.replace(/(^\s*)|(\s*$)/gi, "");
  inputStr = inputStr.replace(/[ ]{2,}/gi, " ");
  inputStr = inputStr.replace(/\n /, "\n");
  return inputStr.toLowerCase();
};
export default formatString;

const extendPasswordValidity = async () => {
  let myDate = new Date(Date.now());
  const addedTime = Number(process.env.PASSWORD_LIFE_SPAN);
  myDate = new Date(myDate.setMonth(myDate.getMonth() + addedTime));
  return myDate;
};
export default extendPasswordValidity;

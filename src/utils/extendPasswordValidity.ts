const extendPasswordValidity = async () => {
  let myDate = new Date(Date.now());
  const addedTime = Number(process.env.PASSWORD_LIFE_SPAN);
  myDate = new Date(myDate.setMonth(myDate.getMonth() + addedTime));
  console.log("added validity", myDate);
  return myDate;
};
export default extendPasswordValidity;

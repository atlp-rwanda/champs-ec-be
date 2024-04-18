export type ResponseOutPut = {
  isActive: boolean;
  message: string;
  emailNotification: string;
  success: string;
};

export type DataInput = {
  status: string;
  message: string;
};
export const userStatusData = async (inputData: DataInput) => {
  const data: ResponseOutPut = {
    isActive: false,
    message: "",
    emailNotification: "",
    success: ""
  };
  if (inputData.status === "deactivate") {
    // sendNotificationInactiveAccount(email, name, req.body.message);

    data.isActive = false;
    data.message = inputData.message;
    data.emailNotification = inputData.message;
    data.success = "user account is deactivated";
  }

  if (inputData.status === "activate") {
    const notification: string =
      "We hope this message finds you well. We've noticed that your account has been inactive for a while, and we'd love to welcome you back to champs E-comerce!";
    data.isActive = true;
    data.message = "";
    data.emailNotification = notification;
    data.success = "user account is re-activated";
  }

  return data;
};

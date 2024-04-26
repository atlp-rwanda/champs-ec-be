import { Request, Response } from "express";
import User from "../models/user";
import Notification from "../models/Notifications";

export const GetUserNotification = async (req: Request, res: Response) => {
  try {
    const user: User = req.user as user;
    const AllUserNotification = await Notification.findAll({
      where: {
        reciepent_id: user.dataValues.id
      }
    });
    if (!AllUserNotification) {
      return res
        .status(200)
        .json({ message: "you dont have any Notification" });
    }
    res
      .status(200)
      .json({ Success: "success", Notification: AllUserNotification });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const ReadOneNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const notification: Notification = (await Notification.findOne({
      where: { id: notificationId }
    })) as Notification;
    const updatenotification = {
      reciepent_id: notification.dataValues.reciepent_id,
      message: notification.dataValues.message,
      read: true
    };
    if (notification.dataValues.read) {
      return res
        .status(200)
        .json({ Message: "the Notification is already readen" });
    }
    await notification.update(updatenotification);
    res
      .status(201)
      .json({ status: "success", message: "notification updated successful" });
  } catch (error) {
    return res.status(500).json({ Error: "Internal server Error" });
  }
};
export const ReadAllNotification = async (req: Request, res: Response) => {
  try {
    const user: User = req.user as User;
    const allUserNotifications = await Notification.findAll({
      where: { reciepent_id: user.dataValues.id }
    });

    allUserNotifications.map(async (el) => {
      const notification: Notification = (await Notification.findOne({
        where: { id: el.dataValues.id }
      })) as Notification;
      const updatenotification = {
        reciepent_id: el.dataValues.reciepent_id,
        message: el.dataValues.message,
        read: true
      };

      await notification.update(updatenotification);
      return notification;
    });
    res.status(201).json({
      status: "success",
      message: "ALL notification Marked as Readen successful"
    });
  } catch (error) {
    return res.status(500).json({ Error: "Internal Server error" });
  }
};

import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { NotificationModel } from "../models/NotificationModel.js";

export const notificationApp = exp.Router();


// Get notifications of logged in user
notificationApp.get("/notifications", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const userId = req.user?.id;

    const notificationsList = await NotificationModel.find({
      user: userId,
    })
      .populate("workspace", "workspaceName")
      .populate("channel", "channelName")
      .populate("message", "content")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Notifications fetched successfully",
      payload: notificationsList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: err.message,
    });
  }
});


// Mark one notification as read
notificationApp.patch("/notification/read", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user?.id;

    const updatedNotification = await NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId,
      },
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({
        message: "Notification not found",
        error: "Invalid notification id",
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      payload: updatedNotification,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating notification",
      error: err.message,
    });
  }
});


// Mark all notifications as read
notificationApp.patch("/notifications/read", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const userId = req.user?.id;

    const updatedNotifications = await NotificationModel.updateMany(
      {
        user: userId,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      message: "All notifications marked as read",
      payload: updatedNotifications,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating notifications",
      error: err.message,
    });
  }
});

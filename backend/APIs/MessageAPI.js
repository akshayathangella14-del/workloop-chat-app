import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { WorkspaceModel } from "../models/WorkspaceModel.js";
import { ChannelModel } from "../models/ChannelModel.js";
import { MessageModel } from "../models/MessageModel.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { getIO } from "../sockets/socket.js";

export const messageApp = exp.Router();


const triggerReminder = async (messageId) => {
  try {
    const message = await MessageModel.findById(messageId)
      .populate("sender", "firstName lastName");

    if (!message || message.isReminderTriggered || !message.isMessageActive) {
      return;
    }

    await MessageModel.findByIdAndUpdate(messageId, { isReminderTriggered: true });

    let recipientIds = [];

    if (message.messageType === "DIRECT" && message.receiver) {
      recipientIds = [message.receiver.toString()];
    } else if (message.messageType === "CHANNEL" && message.workspace) {
      const workspace = await WorkspaceModel.findById(message.workspace);
      if (workspace) {
        recipientIds = workspace.members
          .map((m) => m.user.toString())
          .filter((id) => id !== message.sender._id.toString());
      }
    }

    const senderName =
      `${message.sender?.firstName || ""} ${message.sender?.lastName || ""}`.trim() || "Someone";

    const notifications = recipientIds.map((userId) => ({
      user: userId,
      workspace: message.workspace,
      channel: message.channel || undefined,
      message: message._id,
      notificationType: "REMINDER",
      text: `Reminder: ${senderName} marked a message as ${message.priority} priority`,
    }));

    if (notifications.length > 0) {
      const saved = await NotificationModel.insertMany(notifications);

      try {
        const io = getIO();
        saved.forEach((notif) => {
          io.to(`user-${notif.user.toString()}`).emit("new-notification", {
            message: "Reminder notification",
            payload: notif,
          });
        });
      } catch {
        // Socket may not be ready during startup recovery — notifications are persisted in DB
      }
    }

    console.log(`Reminder triggered for message ${messageId}`);
  } catch (err) {
    console.log("Reminder error:", err.message);
  }
};

const scheduleMessageReminder = (messageDoc) => {
  if (!messageDoc.reminderTime) {
    return;
  }

  const reminderDate = new Date(messageDoc.reminderTime);
  const delay = reminderDate.getTime() - Date.now();

  if (delay <= 0) {
    triggerReminder(messageDoc._id);
    return;
  }

  setTimeout(() => {
    triggerReminder(messageDoc._id);
  }, delay);
};

export const recoverPendingReminders = async () => {
  try {
    const pending = await MessageModel.find({
      reminderTime: { $ne: null },
      isReminderTriggered: false,
      isMessageActive: true,
    });

    pending.forEach((msg) => scheduleMessageReminder(msg));

    if (pending.length > 0) {
      console.log(`Recovered ${pending.length} pending reminders`);
    }
  } catch (err) {
    console.log("Error recovering reminders:", err.message);
  }
};




// Send channel message
messageApp.post(
  "/channel-message",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const messageObj = req.body;

      const userId = req.user?.id;

      const role = req.user?.role;

      // Validate channel
      const channel = await ChannelModel.findOne({
        _id: messageObj.channel,
        isChannelActive: true,
      });

      if (!channel) {
        return res.status(404).json({
          message: "Channel not found",
          error: "Invalid channel id",
        });
      }

      // Workspace access check
      let workspaceFilter = {
        _id: messageObj.workspace,
        isWorkspaceActive: true,
      };

      if (role !== "ADMIN") {
        workspaceFilter["members.user"] =
          userId;
      }

      const workspace =
        await WorkspaceModel.findOne(
          workspaceFilter
        );

      if (!workspace) {
        return res.status(403).json({
          message: "You are not authorised",
          error:
            "You are not a workspace member",
        });
      }

      // Private channel access check
      if (
        role !== "ADMIN" &&
        channel.channelType === "PRIVATE" &&
        !channel.members.some(
          (member) =>
            member.toString() === userId
        )
      ) {
        return res.status(403).json({
          message: "You are not authorised",
          error:
            "You are not a channel member",
        });
      }

      // Validate content
      if (
        !messageObj.content?.trim() &&
        !messageObj.file
      ) {
        return res.status(400).json({
          message: "Message content required",
          error:
            "Cannot send empty message",
        });
      }

      // Normalize reminder
      if (!messageObj.reminderTime) {
        messageObj.reminderTime = null;
      }

      // Prepare message
      messageObj.sender = userId;

      messageObj.messageType =
        "CHANNEL";

      messageObj.parentMessage = null;

      messageObj.isReminderTriggered =
        false;

      // Create message
      const newMessage =
        new MessageModel(messageObj);

      await newMessage.save();

      // Notify workspace members
      const workspaceMembers =
        workspace.members
          .map((member) =>
            member.user.toString()
          )
          .filter(
            (memberId) =>
              memberId !== userId
          );

      if (workspaceMembers.length > 0) {
        const notifications =
          workspaceMembers.map(
            (memberId) => ({
              user: memberId,
              workspace:
                messageObj.workspace,
              channel:
                messageObj.channel,
              message: newMessage._id,
              notificationType:
                "MESSAGE",
              text: `New message in #${channel.channelName}`,
            })
          );

        await NotificationModel.insertMany(
          notifications
        );
      }



      // Schedule reminder
      scheduleMessageReminder(newMessage);

      // Populate sender before response
      const populatedMessage =
        await MessageModel.findById(
          newMessage._id
        )
          .populate(
            "sender",
            "firstName lastName email profileImageUrl"
          )
          .populate(
            "reactions.user",
            "firstName lastName email profileImageUrl"
          );

      res.status(201).json({
        message:
          "Message sent successfully",
        payload: populatedMessage,
      });

      try {
        const io = getIO();
        io.to(`channel-${messageObj.channel}`).emit("receive-message", {
          message: "Message received",
          payload: populatedMessage,
        });

        if (workspaceMembers.length > 0 && notifications?.length > 0) {
          notifications.forEach((notif) => {
            io.to(`user-${notif.user.toString()}`).emit("new-notification", {
              message: "New notification",
              payload: notif,
            });
          });
        }
      } catch (socketErr) {
        console.log("Socket emit error in channel-message:", socketErr.message);
      }
    } catch (err) {
      res.status(500).json({
        message:
          "Error sending message",
        error: err.message,
      });
    }
  }
);


// Send direct message
messageApp.post(
  "/direct-message",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const messageObj = req.body;

      const userId = req.user?.id;

      const role = req.user?.role;

      // Workspace access check
      let workspaceFilter = {
        _id: messageObj.workspace,
        isWorkspaceActive: true,
      };

      if (role !== "ADMIN") {
        workspaceFilter["members.user"] =
          userId;
      }

      const workspace =
        await WorkspaceModel.findOne(
          workspaceFilter
        );

      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found",
          error:
            "Invalid workspace or you are not a member",
        });
      }

      // Receiver validation
      const isReceiverMember =
        workspace.members.some(
          (member) =>
            member.user.toString() ===
            messageObj.receiver
        );

      if (
        role !== "ADMIN" &&
        !isReceiverMember
      ) {
        return res.status(403).json({
          message:
            "User is not a workspace member",
          error:
            "Direct messages are allowed only inside same workspace",
        });
      }

      // Prevent self messaging
      if (
        messageObj.receiver === userId
      ) {
        return res.status(400).json({
          message:
            "Invalid direct message",
          error:
            "You cannot message yourself",
        });
      }

      // Validate content
      if (
        !messageObj.content?.trim() &&
        !messageObj.file
      ) {
        return res.status(400).json({
          message: "Message content required",
          error:
            "Cannot send empty message",
        });
      }

      // Normalize reminder
      if (!messageObj.reminderTime) {
        messageObj.reminderTime = null;
      }

      // Prepare message
      messageObj.sender = userId;

      messageObj.messageType =
        "DIRECT";

      messageObj.parentMessage = null;

      messageObj.isReminderTriggered =
        false;

      // Create message
      const newMessage =
        new MessageModel(messageObj);

      await newMessage.save();

      // Schedule reminder
      scheduleMessageReminder(newMessage);

      // Create DM notification
      const dmNotif = await NotificationModel.create({
        user: messageObj.receiver,
        workspace: messageObj.workspace,
        message: newMessage._id,
        notificationType: "MESSAGE",
        text:
          "You received a new direct message",
      });

      // Populate response
      const populatedMessage =
        await MessageModel.findById(
          newMessage._id
        )
          .populate(
            "sender",
            "firstName lastName email profileImageUrl"
          )
          .populate(
            "receiver",
            "firstName lastName email profileImageUrl"
          )
          .populate(
            "reactions.user",
            "firstName lastName email profileImageUrl"
          );
      const io = getIO();

      const roomId = [
        populatedMessage.sender._id.toString(),
        populatedMessage.receiver._id.toString(),
      ]
        .sort()
        .join("-");

      io.to(`dm-${roomId}`).emit(
        "receive-message",
        {
          payload: populatedMessage,
        }
      );

      io.to(`user-${messageObj.receiver.toString()}`).emit(
        "new-notification",
        {
          message: "New notification",
          payload: dmNotif,
        }
      );

      res.status(201).json({
        message:
          "Direct message sent successfully",
        payload: populatedMessage,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error sending direct message",
        error: err.message,
      });
    }
  }
);



// Send file message
messageApp.post("/file-message", verifyToken("USER", "ADMIN"), upload.single("file"), async (req, res) => {
  try {
    const messageObj = req.body;
    const userId = req.user?.id;

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
        error: "No file uploaded",
      });
    }

    const resourceType =
      req.file.mimetype === "application/pdf"
        ? "raw"
        : "auto";

    const result = await uploadToCloudinary(
      req.file.buffer,
      resourceType,
      req.file.mimetype === "application/pdf"
        ? "pdf"
        : null
    );

    messageObj.sender = userId;
    messageObj.file = {
      fileUrl: result.secure_url,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };

    const newMessage = new MessageModel(messageObj);

    await newMessage.save();

    scheduleMessageReminder(newMessage);

    const populatedMessage =
      await MessageModel.findById(newMessage._id)
        .populate(
          "sender",
          "firstName lastName email profileImageUrl"
        )
        .populate(
          "receiver",
          "firstName lastName email profileImageUrl"
        )
        .populate(
          "reactions.user",
          "firstName lastName email profileImageUrl"
        );

    const io = getIO();

    if (messageObj.messageType === "DIRECT") {

      const roomId = [
        populatedMessage.sender._id.toString(),
        populatedMessage.receiver._id.toString(),
      ]
        .sort()
        .join("-");

      io.to(`dm-${roomId}`).emit(
        "receive-message",
        {
          payload: populatedMessage,
        }
      );

    } else {

      io.to(`channel-${messageObj.channel}`).emit(
        "receive-message",
        {
          payload: populatedMessage,
        }
      );
    }

    res.status(201).json({
      message: "File shared successfully",
      payload: populatedMessage,
    });


  } catch (err) {
    res.status(500).json({
      message: "Error sharing file",
      error: err.message,
    });
  }
});


// Get channel messages
messageApp.get("/channel-messages/:channelId", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const userId = req.user?.id;

    const channel = await ChannelModel.findOne({
      _id: channelId,
      isChannelActive: true,
    });

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
        error: "Invalid channel id",
      });
    }

    const workspace = await WorkspaceModel.findOne({
      _id: channel.workspace,
      "members.user": userId,
      isWorkspaceActive: true,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "You are not a workspace member",
      });
    }


    const messagesList = await MessageModel.find({
      channel: channelId,
      messageType: "CHANNEL",
      isMessageActive: true,
      parentMessage: null,
    })
      .populate(
        "sender",
        "firstName lastName email profileImageUrl"
      )
      .populate(
        "reactions.user",
        "firstName lastName email profileImageUrl"
      )
      .sort({ createdAt: 1 });


    res.status(200).json({
      message: "Channel messages fetched successfully",
      payload: messagesList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching channel messages",
      error: err.message,
    });
  }
});


// Edit own message
messageApp.put("/message", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { messageId, content } = req.body;
    const userId = req.user?.id;

    const updatedMessage = await MessageModel.findOneAndUpdate(
      {
        _id: messageId,
        sender: userId,
        isMessageActive: true,
      },
      {
        content,
        isEdited: true,
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "Only sender can edit this message",
      });
    }

    const populatedMessage = await MessageModel.findById(updatedMessage._id)
      .populate("sender", "firstName lastName email profileImageUrl")
      .populate("receiver", "firstName lastName email profileImageUrl")
      .populate("reactions.user", "firstName lastName email profileImageUrl");

    try {
      const io = getIO();
      if (updatedMessage.messageType === "CHANNEL") {
        io.to(`channel-${updatedMessage.channel}`).emit("message-edited", {
          message: "Message edited",
          payload: populatedMessage || updatedMessage,
        });
      } else if (updatedMessage.messageType === "DIRECT") {
        const roomId = [updatedMessage.sender.toString(), updatedMessage.receiver.toString()].sort().join("-");
        io.to(`dm-${roomId}`).emit("message-edited", {
          message: "Message edited",
          payload: populatedMessage || updatedMessage,
        });
      }
    } catch (socketErr) {
      console.log("Socket emit error in edit:", socketErr.message);
    }

    res.status(200).json({
      message: "Message edited successfully",
      payload: populatedMessage || updatedMessage,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error editing message",
      error: err.message,
    });
  }
});


// Get reminders for logged in user
messageApp.get(
  "/reminders",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const userId = req.user?.id;

      // Direct message reminders
      const directReminders =
        await MessageModel.find({
          receiver: userId,
          reminderTime: { $ne: null },
          isMessageActive: true,
        })
          .populate(
            "workspace",
            "workspaceName"
          )
          .populate(
            "channel",
            "channelName"
          )
          .populate(
            "sender",
            "firstName lastName email profileImageUrl"
          )
          .populate(
            "receiver",
            "firstName lastName email profileImageUrl"
          );

      // Channel reminders
      const channelReminders =
        await MessageModel.find({
          messageType: "CHANNEL",
          reminderTime: { $ne: null },
          isMessageActive: true,
          sender: { $ne: userId },
        })
          .populate(
            "workspace",
            "workspaceName members"
          )

          .populate({
            path: "channel",
            select: "channelName members channelType",
          })


          .populate(
            "sender",
            "firstName lastName email profileImageUrl"
          );

      // Only keep reminders
      // from channels user belongs to
      const visibleChannelReminders =
        channelReminders.filter(
          (message) => {
            // PUBLIC channels
            if (
              message.channel?.channelType ===
              "PUBLIC"
            ) {
              return true;
            }

            // PRIVATE channels
            const members =
              message.channel?.members || [];

            return members.some(
              (member) =>
                member.toString() ===
                userId
            );
          }
        );


      const remindersList = [
        ...directReminders,
        ...visibleChannelReminders,
      ].sort(
        (a, b) =>
          new Date(
            a.reminderTime
          ).getTime() -
          new Date(
            b.reminderTime
          ).getTime()
      );

      res.status(200).json({
        message:
          "Reminders fetched successfully",
        payload: remindersList,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching reminders",
        error: err.message,
      });
    }
  }
);


// Add or update reaction
messageApp.put("/message/reaction", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { messageId, reaction } = req.body;
    const userId = req.user?.id;

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        error: "Invalid message id",
      });
    }

    const existingReaction = message.reactions.find(
      item => item.user.toString() === userId
    );

    if (existingReaction) {
      existingReaction.reaction = reaction;
      existingReaction.createdAt = new Date();
    } else {
      message.reactions.push({
        user: userId,
        reaction,
        createdAt: new Date(),
      });
    }

    await message.save();

    const populatedMessage = await MessageModel.findById(message._id)
      .populate("sender", "firstName lastName email profileImageUrl")
      .populate("receiver", "firstName lastName email profileImageUrl")
      .populate("reactions.user", "firstName lastName email profileImageUrl");

    try {
      const io = getIO();
      if (message.messageType === "CHANNEL") {
        io.to(`channel-${message.channel}`).emit("reaction-added", {
          message: "Reaction added",
          payload: populatedMessage || message,
        });
      } else if (message.messageType === "DIRECT") {
        const roomId = [message.sender.toString(), message.receiver.toString()].sort().join("-");
        io.to(`dm-${roomId}`).emit("reaction-added", {
          message: "Reaction added",
          payload: populatedMessage || message,
        });
      }
    } catch (socketErr) {
      console.log("Socket emit error in add reaction:", socketErr.message);
    }

    res.status(200).json({
      message: "Reaction updated successfully",
      payload: populatedMessage || message,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating reaction",
      error: err.message,
    });
  }
});


// Remove reaction
messageApp.patch("/message/reaction", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { messageId } = req.body;
    const userId = req.user?.id;

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        error: "Invalid message id",
      });
    }

    message.reactions = message.reactions.filter(
      item => item.user.toString() !== userId
    );

    await message.save();

    const populatedMessage = await MessageModel.findById(message._id)
      .populate("sender", "firstName lastName email profileImageUrl")
      .populate("receiver", "firstName lastName email profileImageUrl")
      .populate("reactions.user", "firstName lastName email profileImageUrl");

    try {
      const io = getIO();
      if (message.messageType === "CHANNEL") {
        io.to(`channel-${message.channel}`).emit("reaction-removed", {
          message: "Reaction removed",
          payload: populatedMessage || message,
        });
      } else if (message.messageType === "DIRECT") {
        const roomId = [message.sender.toString(), message.receiver.toString()].sort().join("-");
        io.to(`dm-${roomId}`).emit("reaction-removed", {
          message: "Reaction removed",
          payload: populatedMessage || message,
        });
      }
    } catch (socketErr) {
      console.log("Socket emit error in remove reaction:", socketErr.message);
    }

    res.status(200).json({
      message: "Reaction removed successfully",
      payload: populatedMessage || message,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error removing reaction",
      error: err.message,
    });
  }
});


// Create thread reply
messageApp.post(
  "/thread-reply",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const messageObj = req.body;

      const userId = req.user?.id;

      const parentMessage =
        await MessageModel.findOne({
          _id: messageObj.parentMessage,
          isMessageActive: true,
        });

      if (!parentMessage) {
        return res.status(404).json({
          message: "Parent message not found",
          error: "Invalid parent message",
        });
      }

      messageObj.sender = userId;

      messageObj.messageType = "CHANNEL";

      const newReply =
        new MessageModel(messageObj);

      await newReply.save();


      if (
        parentMessage.sender.toString() !==
        userId
      ) {
        await NotificationModel.create({
          user: parentMessage.sender,
          workspace: parentMessage.workspace,
          channel: parentMessage.channel,
          message: newReply._id,
          notificationType:
            "THREAD_REPLY",
          text:
            "Someone replied to your thread",
        });
      }




      const populatedReply =
        await MessageModel.findById(
          newReply._id
        ).populate(
          "sender",
          "firstName lastName email profileImageUrl"
        );

      const io = getIO();

      io.to(`channel-${parentMessage.channel}`).emit(
        "receive-thread-reply",
        {
          payload: populatedReply,
        }
      );

      res.status(201).json({
        message:
          "Thread reply added successfully",
        payload: populatedReply,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error adding thread reply",
        error: err.message,
      });
    }
  }
);


// Get thread replies
messageApp.get(
  "/thread-replies/:messageId",
  verifyToken("USER", "ADMIN"),
  async (req, res) => {
    try {
      const messageId =
        req.params.messageId;

      const replies =
        await MessageModel.find({
          parentMessage: messageId,
          isMessageActive: true,
        })
          .populate(
            "sender",
            "firstName lastName email profileImageUrl"
          )
          .sort({ createdAt: 1 });

      res.status(200).json({
        message:
          "Thread replies fetched successfully",
        payload: replies,
      });
    } catch (err) {
      res.status(500).json({
        message:
          "Error fetching thread replies",
        error: err.message,
      });
    }
  }
);




// Soft delete or restore own message
messageApp.patch("/message/status", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { messageId, isMessageActive } = req.body;
    const userId = req.user?.id;

    const updatedMessage = await MessageModel.findOneAndUpdate(
      {
        _id: messageId,
        sender: userId,
      },
      { isMessageActive },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "Only sender can update message status",
      });
    }

    try {
      const io = getIO();
      if (updatedMessage.messageType === "CHANNEL") {
        io.to(`channel-${updatedMessage.channel}`).emit("message-deleted", {
          message: "Message deleted",
          payload: updatedMessage,
        });
      } else if (updatedMessage.messageType === "DIRECT") {
        const roomId = [updatedMessage.sender.toString(), updatedMessage.receiver.toString()].sort().join("-");
        io.to(`dm-${roomId}`).emit("message-deleted", {
          message: "Message deleted",
          payload: updatedMessage,
        });
      }
    } catch (socketErr) {
      console.log("Socket emit error in status update:", socketErr.message);
    }

    res.status(200).json({
      message: isMessageActive ? "Message restored successfully" : "Message deleted successfully",
      payload: updatedMessage,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating message status",
      error: err.message,
    });
  }
});

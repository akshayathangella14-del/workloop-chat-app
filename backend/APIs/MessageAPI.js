import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { WorkspaceModel } from "../models/WorkspaceModel.js";
import { ChannelModel } from "../models/ChannelModel.js";
import { MessageModel } from "../models/MessageModel.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const messageApp = exp.Router();

const scheduleMessageReminder = (messageDoc) => {
  if (!messageDoc.reminderTime) {
    return;
  }

  const reminderDate = new Date(messageDoc.reminderTime);
  const delay = reminderDate.getTime() - Date.now();

  if (delay <= 0) {
    return;
  }

  setTimeout(async () => {
    try {
      await NotificationModel.create({
        user: messageDoc.sender,
        workspace: messageDoc.workspace,
        channel: messageDoc.channel,
        message: messageDoc._id,
        notificationType: "REMINDER",
        text: `Reminder: ${messageDoc.content || "Check your message"}`,
      });
    } catch (err) {
      console.log("Error creating reminder notification", err.message);
    }
  }, delay);
};


// Send channel message
messageApp.post("/channel-message", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const messageObj = req.body;
    const userId = req.user?.id;

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

    const workspace = await WorkspaceModel.findOne({
      _id: messageObj.workspace,
      "members.user": userId,
      isWorkspaceActive: true,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "You are not a workspace member",
      });
    }

    if (channel.channelType === "PRIVATE" && !channel.members.some(member => member.toString() === userId)) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "You are not a channel member",
      });
    }

    messageObj.sender = userId;
    messageObj.messageType = "CHANNEL";

    const newMessage = new MessageModel(messageObj);
    await newMessage.save();

    scheduleMessageReminder(newMessage);


    res.status(201).json({
      message: "Message sent successfully",
      payload: newMessage,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error sending message",
      error: err.message,
    });
  }
});


// Send direct message
messageApp.post("/direct-message", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const messageObj = req.body;
    const userId = req.user?.id;

    const workspace = await WorkspaceModel.findOne({
      _id: messageObj.workspace,
      "members.user": userId,
      isWorkspaceActive: true,
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        error: "Invalid workspace or you are not a member",
      });
    }

    const isReceiverMember = workspace.members.some(
      member => member.user.toString() === messageObj.receiver
    );

    if (!isReceiverMember) {
      return res.status(403).json({
        message: "User is not a workspace member",
        error: "Direct messages are allowed only inside same workspace",
      });
    }

    messageObj.sender = userId;
    messageObj.messageType = "DIRECT";

    const newMessage = new MessageModel(messageObj);
    await newMessage.save();
    scheduleMessageReminder(newMessage);


    await NotificationModel.create({
      user: messageObj.receiver,
      workspace: messageObj.workspace,
      message: newMessage._id,
      notificationType: "MESSAGE",
      text: "You received a new direct message",
    });

    res.status(201).json({
      message: "Direct message sent successfully",
      payload: newMessage,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error sending direct message",
      error: err.message,
    });
  }
});


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

    const result = await uploadToCloudinary(req.file.buffer);

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


    res.status(201).json({
      message: "File shared successfully",
      payload: newMessage,
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
    })
      .populate("sender", "firstName lastName email profileImageUrl")
      .populate("reactions.user", "firstName lastName email profileImageUrl")
      .populate("threadReplies.sender", "firstName lastName email profileImageUrl")
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

    res.status(200).json({
      message: "Message edited successfully",
      payload: updatedMessage,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error editing message",
      error: err.message,
    });
  }
});

// Get upcoming reminders of logged in user
messageApp.get("/reminders", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const userId = req.user?.id;

    const remindersList = await MessageModel.find({
      sender: userId,
      reminderTime: { $gte: new Date() },
      isMessageActive: true,
    })
      .populate("workspace", "workspaceName")
      .populate("channel", "channelName")
      .populate("receiver", "firstName lastName email profileImageUrl")
      .sort({ reminderTime: 1 });

    res.status(200).json({
      message: "Reminders fetched successfully",
      payload: remindersList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching reminders",
      error: err.message,
    });
  }
});


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

    res.status(200).json({
      message: "Reaction updated successfully",
      payload: message,
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

    res.status(200).json({
      message: "Reaction removed successfully",
      payload: message,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error removing reaction",
      error: err.message,
    });
  }
});


// Add thread reply
messageApp.put("/message/thread", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { messageId, content } = req.body;
    const userId = req.user?.id;

    const message = await MessageModel.findOne({
      _id: messageId,
      isMessageActive: true,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        error: "Invalid message id",
      });
    }

    message.threadReplies.push({
      sender: userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await message.save();

    res.status(200).json({
      message: "Thread reply added successfully",
      payload: message,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error adding thread reply",
      error: err.message,
    });
  }
});


// Get thread replies
messageApp.get("/message/thread/:messageId", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const message = await MessageModel.findById(messageId)
      .populate("threadReplies.sender", "firstName lastName email profileImageUrl");

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        error: "Invalid message id",
      });
    }

    res.status(200).json({
      message: "Thread replies fetched successfully",
      payload: message.threadReplies,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching thread replies",
      error: err.message,
    });
  }
});


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

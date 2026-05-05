import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { WorkspaceModel } from "../models/WorkspaceModel.js";
import { MessageModel } from "../models/MessageModel.js";

export const directMessageApp = exp.Router();


// Get workspace users for direct messages
directMessageApp.get("/users/:workspaceId", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.id;

    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      "members.user": userId,
      isWorkspaceActive: true,
    }).populate("members.user", "firstName lastName email profileImageUrl");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        error: "Invalid workspace or you are not a member",
      });
    }

    const usersList = workspace.members
      .filter(member => member.user._id.toString() !== userId)
      .map(member => member.user);

    res.status(200).json({
      message: "Users fetched successfully",
      payload: usersList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
});


// Get direct messages with one user
directMessageApp.get("/messages/:workspaceId/:receiverId", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { workspaceId, receiverId } = req.params;
    const userId = req.user?.id;

    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
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
      member => member.user.toString() === receiverId
    );

    if (!isReceiverMember) {
      return res.status(403).json({
        message: "User is not a workspace member",
        error: "Direct messages are allowed only inside same workspace",
      });
    }

    const messagesList = await MessageModel.find({
      workspace: workspaceId,
      messageType: "DIRECT",
      isMessageActive: true,
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .populate("sender", "firstName lastName email profileImageUrl")
      .populate("receiver", "firstName lastName email profileImageUrl")
      .populate("reactions.user", "firstName lastName email profileImageUrl")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Direct messages fetched successfully",
      payload: messagesList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching direct messages",
      error: err.message,
    });
  }
});


// Get recent direct message conversations
directMessageApp.get("/conversations/:workspaceId", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user?.id;

    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      "members.user": userId,
      isWorkspaceActive: true,
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        error: "Invalid workspace or you are not a member",
      });
    }

    const messagesList = await MessageModel.find({
      workspace: workspaceId,
      messageType: "DIRECT",
      isMessageActive: true,
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate("sender", "firstName lastName email profileImageUrl")
      .populate("receiver", "firstName lastName email profileImageUrl")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Conversations fetched successfully",
      payload: messagesList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching conversations",
      error: err.message,
    });
  }
});

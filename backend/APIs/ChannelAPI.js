import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { WorkspaceModel } from "../models/WorkspaceModel.js";
import { ChannelModel } from "../models/ChannelModel.js";
import { UserModel } from "../models/UserModel.js";

export const channelApp = exp.Router();


// Create channel
channelApp.post("/channels", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const channelObj = req.body;
    const userId = req.user?.id;

    const workspace = await WorkspaceModel.findOne({
      _id: channelObj.workspace,
      "members.user": userId,
      isWorkspaceActive: true,
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        error: "Invalid workspace or you are not a member",
      });
    }

    channelObj.createdBy = userId;
    channelObj.members = [userId];

    const newChannel = new ChannelModel(channelObj);
    await newChannel.save();

    res.status(201).json({
      message: "Channel created successfully",
      payload: newChannel,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating channel",
      error: err.message,
    });
  }
});


// Get all channels of workspace
channelApp.get("/channels/:workspaceId", verifyToken("USER", "ADMIN"), async (req, res) => {
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

    const channelsList = await ChannelModel.find({
      workspace: workspaceId,
      isChannelActive: true,
      $or: [
        { channelType: "PUBLIC" },
        { members: userId },
      ],
    })
      .populate("createdBy", "firstName lastName email profileImageUrl")
      .populate("members", "firstName lastName email profileImageUrl");

    res.status(200).json({
      message: "Channels fetched successfully",
      payload: channelsList,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching channels",
      error: err.message,
    });
  }
});


// Get single channel
channelApp.get("/channel/:id", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user?.id;

    const channel = await ChannelModel.findOne({
      _id: channelId,
      isChannelActive: true,
    })
      .populate("createdBy", "firstName lastName email profileImageUrl")
      .populate("members", "firstName lastName email profileImageUrl");

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

    if (channel.channelType === "PRIVATE" && !channel.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "You are not a channel member",
      });
    }

    res.status(200).json({
      message: "Channel found",
      payload: channel,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching channel",
      error: err.message,
    });
  }
});


// Add member to channel
channelApp.put("/channel/member", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { channelId, email } = req.body;
    const userId = req.user?.id;

    const channel = await ChannelModel.findById(channelId);

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

    const isAllowed =
      channel.createdBy.toString() === userId ||
      workspace.owner.toString() === userId;

    if (!isAllowed) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "Only workspace owner or channel creator can add members",
      });
    }

    const userToAdd = await UserModel.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({
        message: "User not found",
        error: "No user exists with this email",
      });
    }

    const isWorkspaceMember = workspace.members.some(
      member => member.user.toString() === userToAdd._id.toString()
    );

    if (!isWorkspaceMember) {
      return res.status(403).json({
        message: "User is not a workspace member",
        error: "Add user to workspace first",
      });
    }

    if (channel.members.some(member => member.toString() === userToAdd._id.toString())) {
      return res.status(409).json({
        message: "User already exists in channel",
        error: "Duplicate channel member",
      });
    }

    channel.members.push(userToAdd._id);
    await channel.save();

    res.status(200).json({
      message: "Channel member added successfully",
      payload: channel,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error adding channel member",
      error: err.message,
    });
  }
});


// Leave channel
channelApp.patch("/channel/leave", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.user?.id;

    const channel = await ChannelModel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
        error: "Invalid channel id",
      });
    }

    channel.members = channel.members.filter(
      member => member.toString() !== userId
    );

    await channel.save();

    res.status(200).json({
      message: "Channel left successfully",
      payload: channel,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error leaving channel",
      error: err.message,
    });
  }
});


// Soft delete or restore channel
channelApp.patch("/channel/status", verifyToken("USER", "ADMIN"), async (req, res) => {
  try {
    const { channelId, isChannelActive } = req.body;
    const userId = req.user?.id;

    const updatedChannel = await ChannelModel.findOneAndUpdate(
      {
        _id: channelId,
        createdBy: userId,
      },
      { isChannelActive },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(403).json({
        message: "You are not authorised",
        error: "Only channel creator can update channel status",
      });
    }

    res.status(200).json({
      message: isChannelActive ? "Channel restored successfully" : "Channel deleted successfully",
      payload: updatedChannel,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating channel status",
      error: err.message,
    });
  }
});

import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";

import { WorkspaceModel } from "../models/WorkspaceModel.js";
import { ChannelModel } from "../models/ChannelModel.js";
import { UserModel } from "../models/UserModel.js";

export const adminApp = exp.Router();

adminApp.get(
    "/dashboard",
    verifyToken("ADMIN"),
    async (req, res) => {
        try {
            const [
                totalWorkspaces,
                totalChannels,
                totalUsers,
                activeUsers,
                privateChannels,
                workspaces,
                users,
            ] = await Promise.all([
                WorkspaceModel.countDocuments({
                    isWorkspaceActive: true,
                }),

                ChannelModel.countDocuments({
                    isChannelActive: true,
                }),

                UserModel.countDocuments(),

                UserModel.countDocuments({
                    isUserActive: true,
                }),

                ChannelModel.countDocuments({
                    isChannelActive: true,
                    channelType: "PRIVATE",
                }),

                WorkspaceModel.find({
                    isWorkspaceActive: true,
                })
                    .populate("owner", "firstName lastName email")
                    .lean(),

                UserModel.find({})
                    .select("firstName lastName email role isUserActive")
                    .lean(),
            ]);

            res.status(200).json({
                message: "Admin dashboard fetched successfully",
                payload: {
                    totalWorkspaces,
                    totalChannels,
                    totalUsers,
                    activeUsers,
                    privateChannels,
                    workspaces,
                    users,
                },
            });
        } catch (err) {
            res.status(500).json({
                message: "Error fetching admin dashboard",
                error: err.message,
            });
        }
    }
);
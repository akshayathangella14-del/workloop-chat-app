import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserModel } from "../models/UserModel.js";
import { redisClient } from "../config/redis.js";
import { registerSocketEvents } from "./socketEvents.js";

const { verify } = jwt;

config();

const onlineUsers = new Map();

const getTokenFromCookie = (cookieHeader) => {
  const tokenCookie = cookieHeader
    ?.split(";")
    .find(cookie => cookie.trim().startsWith("token="));

  if (!tokenCookie) return null;

  return decodeURIComponent(tokenCookie.split("=")[1]);
};

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      if (!token && socket.handshake.headers.authorization) {
        token = socket.handshake.headers.authorization.split(" ")[1];
      }

      if (!token && socket.handshake.headers.cookie) {
        token = getTokenFromCookie(socket.handshake.headers.cookie);
      }

      if (!token) {
        return next(new Error("Please login"));
      }

      const decodedToken = verify(token, process.env.SECRET_KEY);

      const user = await UserModel.findById(decodedToken.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      if (!user.isUserActive) {
        return next(new Error("Your account is blocked. Contact admin."));
      }

      socket.user = decodedToken;
      next();

    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user?.id;

    socket.join(`user-${userId}`);

    // store socket id
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // send current online users to newly connected user
    socket.emit("online-users", Array.from(onlineUsers.keys()));

    // notify everyone
    io.emit("user-online", {
      payload: { userId },
    });

    registerSocketEvents(io, socket);

    socket.on("disconnect", async () => {

      const userSockets = onlineUsers.get(userId);

      if (userSockets) {
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);

          io.emit("user-offline", {
            payload: { userId },
          });
        }
      }
    });
  });

  console.log("Socket connected");
};

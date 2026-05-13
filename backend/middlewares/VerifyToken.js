import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserModel } from "../models/UserModel.js";

config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // ONLY get token from cookies
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ message: "Please login" });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      //check user
      const user = await UserModel.findById(decodedToken.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!user.isUserActive) {
        return res.status(403).json({
          message: "Your account is blocked",
        });
      }

      // role check
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "You are not authorised",
        });
      }

      req.user = decodedToken;
      next();

    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
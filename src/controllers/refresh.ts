import { Request, Response } from "express";
import User from "../models/user";
import Token from "../models/token";
import { generateAccessToken } from "../utils/token";
import sequelize from '../config/dbConnection';

const refreshTokenController = async (req: Request, res: Response) => {
  console.log('Refresh token request received');
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      console.log('Invalid token format received');
      return res.status(400).json({ error: "Token is required" });
    }

    // Find refresh token in the database
    console.log('Looking up token in database');
    const storedToken = await Token.findOne({ 
      where: { refresh_token: token },
      attributes: ['id', 'user_id', 'expires_at', 'revoked_at'] // Optimize query
    });

    if (!storedToken) {
      console.log('Token not found in database');
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Check if the token is expired
    if (new Date(storedToken.expires_at) < new Date()) {
      console.log('Token is expired');
      return res.status(403).json({ error: "Refresh token expired" });
    }
    if (storedToken.revoked_at) {
      console.log('Token is revoked');
      return res.status(403).json({ error: "Refresh token has been revoked" });
    }

    // Retrieve the user details
    console.log('Looking up user:', storedToken.user_id);
    const user = await User.findByPk(storedToken.user_id, {
      paranoid: false,
      attributes: ['id', 'email'] // Optimize query
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a new access token
    console.log('Generating new access token');
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });

    // Send response
    res.header('Authorization', `Bearer ${accessToken}`);
    return res.status(200).end(); // Send an empty response to save bandwidth

  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default refreshTokenController;
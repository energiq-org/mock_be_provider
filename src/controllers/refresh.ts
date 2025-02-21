import { Request, Response } from "express";
import User from "../models/user";
import Token from "../models/token"
import { generateAccessToken } from "../utils/token";
import sequelize from '../config/dbConnection';

const refreshTokenController=async (req: Request, res: Response) =>{
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Find refresh token in the database
    const storedToken = await Token.findOne({ where: { refresh_token: token } });


    if (!storedToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    // Check if the token is expired
    if (new Date(storedToken.expires_at) < new Date()) {
        return res.status(403).json({ error: "Refresh token expired" });
    }
    if (storedToken.revoked_at) {
      return res.status(403).json({ error: "Refresh token has been revoked" });
    }
    
   
   // Retrieve the user details - with a separate query to ensure up-to-date data
   const user = await User.findByPk(storedToken.user_id, {
    paranoid: false // Include soft-deleted records
  });
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
    
    // Generate a new access token
      const accessToken = generateAccessToken({ userId: user.id, email: user.email } );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default refreshTokenController

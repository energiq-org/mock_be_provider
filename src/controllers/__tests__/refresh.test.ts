import request from "supertest";
import bcrypt from "bcrypt";
import { createServer } from "../../app";
import Token from "../../models/token";
import User from "../../models/user";
import sequelize from "../../config/dbConnection";
import dotenv from "dotenv";
import { generateRefreshToken } from "../../utils/token";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

describe("Refresh controller", () => {
  const app = createServer();
  let user: any;

  beforeAll(async () => {
    console.log("Setting up test database...");
    await sequelize.sync({ force: true });
    const hashedPassword = await bcrypt.hash("password123", 10);
    const currentDate = new Date();
    user = await User.create({
      email: "test@example.com",
      password: hashedPassword,
      first_name: "Test",
      last_name: "User",
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    console.log("Test user created with ID:", user.id);
  });

  afterAll(async () => {
    console.log("Closing database connection...");
    await sequelize.close();
  });

  beforeEach(async () => {
    await Token.destroy({ where: {} });
  });

  describe("POST /api/auth/refresh", () => {
    it("Should return a new access token in the header when provided a valid refresh token", async () => {
      console.log("Starting refresh token test...");

      // Create refresh token
      const refreshTokenValue = generateRefreshToken();
      console.log("Generated refresh token");

      const refreshToken = await Token.create({
        id: uuidv4(),
        refresh_token: refreshTokenValue,
        user_id: user.id,
        expires_at: new Date(Date.now() + 3600000),
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log("Refresh token stored in database");

      // Make the request with increased timeout
      try {
        console.log("Making API request...");
        const response = await request(app)
          .post("/api/auth/refresh")
          .send({ token: refreshToken.refresh_token })
          .timeout(10000); // Increased timeout to 10 seconds

        console.log("Response received:", {
          status: response.status,
          hasAuthHeader: !!response.headers.authorization,
        });

        expect(response.status).toBe(200);
        expect(response.headers).toHaveProperty("authorization");
        expect(typeof response.headers.authorization.split(" ")[1]).toBe("string");
      } catch (error) {
        console.error("Error during API request:", error);
        throw error;
      }
    }, 20000); // Increased overall test timeout to 20 seconds
    // Test Case: Missing Token
    it("Should return 400 if request body is missing the token field", async () => {
      const response = await request(app).post("/api/auth/refresh").send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Token is required");
    });

    // Test Case: Invalid Refresh Token
    it("Should return 401 for an invalid refresh token", async () => {
      const response = await request(app).post("/api/auth/refresh").send({ token: "invalid_token" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid refresh token");
    });

    // Test Case: Expired Refresh Token
    it("Should return 403 for an expired refresh token", async () => {
      const refreshTokenValue = generateRefreshToken();
      const expiredToken = await Token.create({
        refresh_token: refreshTokenValue,
        user_id: user.id,
        expires_at: new Date(Date.now() - 3600000), // Expired 1 hour ago
      });

      const response = await request(app).post("/api/auth/refresh").send({ token: expiredToken.refresh_token });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Refresh token expired");
    });

    // Test Case: Revoked Refresh Token
    it("Should return 403 for a revoked refresh token", async () => {
      const refreshTokenValue = generateRefreshToken();
      const revokedToken = await Token.create({
        id: uuidv4(),
        refresh_token: refreshTokenValue,
        user_id: user.id,
        expires_at: new Date(Date.now() + 3600000),
        revoked_at: new Date(), // Token is revoked
      });

      const response = await request(app).post("/api/auth/refresh").send({ token: revokedToken.refresh_token });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Refresh token has been revoked");
    });

    // Test Case: Deleted User
    it("Should return 401 if the user associated with the refresh token is deleted", async () => {
      const refreshTokenValue = generateRefreshToken();
      const refreshToken = await Token.create({
        refresh_token: refreshTokenValue,
        user_id: user.id,
        expires_at: new Date(Date.now() + 3600000),
      });

      await user.destroy();

      const response = await request(app).post("/api/auth/refresh").send({ token: refreshToken.refresh_token });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid refresh token");
    });
  });
});

import request from "supertest";
import crypto from "crypto"; // Import crypto for refresh token generation
import bcrypt from 'bcrypt';
import { createServer } from "../../app"; // Import your Express app
import Token from "../../models/token";
import User from "../../models/user";
import sequelize from "../../config/dbConnection";
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables before tests
import { generateRefreshToken } from "../../utils/token";
import { v4 as uuidv4 } from "uuid";




describe("Refresh Token controller", () => {
    const app = createServer();
    
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Reset database before tests
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await User.destroy({ where: {} }); // Clear users before each test
        await Token.destroy({ where: {} }); // Clear tokens before each test
    });

    describe('POST /api/auth/refresh', () => {
        it("Should return a new access token when provided a valid refresh token", async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const currentDate = new Date();
            const user = await User.create({
                id: uuidv4(),
                email: 'test@example.com',
                password: hashedPassword,
                first_name: 'Test',
                last_name: 'User',
                createdAt: currentDate,
                updatedAt: currentDate
            });

            const refreshTokenValue = generateRefreshToken();

            const refreshToken = await Token.create({
                refresh_token: refreshTokenValue,
                user_id: user.id,
                expires_at: new Date(Date.now() + 3600000), // 1 hour from now
            });

            const response = await request(app)
                .post("/api/auth/refresh")
                .send({ token: refreshToken.refresh_token });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("accessToken");
            expect(typeof response.body.accessToken).toBe("string");
        });

        it("Should return 400 if request body is missing the token field", async () => {
            const response = await request(app)
                .post("/api/auth/refresh")
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Token is required");
        });

        it("Should return 401 for an invalid refresh token", async () => {
            const response = await request(app)
                .post("/api/auth/refresh")
                .send({ token: "invalid_token" });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Invalid refresh token");
        });

        it("Should return 403 for an expired refresh token", async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const currentDate = new Date();
            const user = await User.create({
                id: uuidv4(),
                email: 'test@example.com',
                password: hashedPassword,
                first_name: 'Test',
                last_name: 'User',
                createdAt: currentDate,
                updatedAt: currentDate
            });

            const refreshTokenValue = generateRefreshToken();

            const expiredToken = await Token.create({
                refresh_token: refreshTokenValue,
                user_id: user.id,
                expires_at: new Date(Date.now() - 3600000), // Expired 1 hour ago
            });

            const response = await request(app)
                .post("/api/auth/refresh")
                .send({ token: expiredToken.refresh_token });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Refresh token expired");
        });

        it("Should return 403 for a revoked refresh token", async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const currentDate = new Date();
            const user = await User.create({
                id: uuidv4(),
                first_name: "Mike",
                last_name: "Ross",
                email: "mike@example.com",
                password: hashedPassword,
                createdAt: currentDate,
                updatedAt: currentDate,
            });

            const refreshTokenValue = generateRefreshToken();

            const revokedToken = await Token.create({
                id: uuidv4(),
                refresh_token: refreshTokenValue,
                user_id: user.id,
                expires_at: new Date(Date.now() + 3600000), // Still valid
                revoked_at: new Date(), // Token is revoked
            });

            const response = await request(app)
                .post("/api/auth/refresh")
                .send({ token: revokedToken.refresh_token });

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Refresh token has been revoked");
        });

        it("Should return 401 if the user associated with the refresh token does not existor un authorized", async () => {
            // Create a temporary user first
  const hashedPassword = await bcrypt.hash('password123', 10);
  const tempUser = await User.create({
    id: uuidv4(),
    email: 'temp@example.com',
    password: hashedPassword,
    first_name: 'Temp',
    last_name: 'User',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  const refreshTokenValue = generateRefreshToken();
  
  // Create token with the temp user's ID
  const refreshToken = await Token.create({
    refresh_token: refreshTokenValue,
    user_id: tempUser.id,
    expires_at: new Date(Date.now() + 3600000),
  });
  
  // Now delete the user to simulate a non-existent user
  await tempUser.destroy().then(()=>sequelize.sync({ force: true }));
  const response = await request(app)
    .post("/api/auth/refresh")
    .send({ token: refreshToken.refresh_token });
  
  expect(response.status).toBe(401);
  expect(response.body.error).toBe("Invalid refresh token");
        });
    });
});

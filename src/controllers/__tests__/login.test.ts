import request from "supertest";
import { createServer } from "../../app";
import User from "../../models/user";
import Token from "../../models/token";
import bcrypt from "bcrypt";
import sequelize from "../../config/dbConnection";

describe("Login Controller", () => {
  const app = createServer();
  let user: any; // Store the created user for reuse

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
    // Create a test user
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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Token.destroy({ where: {} }); // Clear tokens before each test
  });

  describe("POST /api/auth/login", () => {
    it("should successfully login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body).toHaveProperty("accessTokenExpiresIn");
      expect(response.body).toHaveProperty("refreshTokenExpiresIn");
      expect(response.headers).toHaveProperty("authorization");

      // Verify token was created in database
      const token = await Token.findOne({
        where: { user_id: user.dataValues.id },
      });
      expect(token).toBeTruthy();
    });

    it("should return 401 for non-existent user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("msg", "User not found");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("msg", "Invalid Password");
    });

    it("should return 400 for missing email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain("Email is required");
    });

    it("should return 400 for missing password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain("Password is required");
    });

    it("should return 400 for invalid email format", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain("Invalid Email");
    });
  });
});

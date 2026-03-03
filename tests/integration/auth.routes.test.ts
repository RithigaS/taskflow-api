import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { User } from "../../src/models/User";

describe("Auth Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user and return token", async () => {
      const res = await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "test@mail.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("test@mail.com");
    });

    it("should return error if email already exists", async () => {
      await User.create({
        name: "Test",
        email: "dup@mail.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/signup").send({
        name: "Test",
        email: "dup@mail.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Login User",
        email: "login@mail.com",
        password: "password123",
      });
    });

    it("should login user and return token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@mail.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should return error for wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@mail.com",
        password: "wrongpass",
      });

      expect(res.status).toBe(401);
    });
  });
});

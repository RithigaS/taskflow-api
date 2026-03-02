import authService from "../../src/services/auth.service";
import { User } from "../../src/models/User";

describe("AuthService", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("signup", () => {
    it("should create user and return token", async () => {
      const result = await authService.signup({
        name: "Service Test",
        email: "service@test.com",
        password: "password123",
      });

      expect(result.user.email).toBe("service@test.com");
      expect(result.token).toBeDefined();
    });

    it("should throw error if user exists", async () => {
      await User.create({
        name: "Test",
        email: "exists@test.com",
        password: "password123",
      });

      await expect(
        authService.signup({
          name: "Test",
          email: "exists@test.com",
          password: "password123",
        }),
      ).rejects.toThrow();
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Login User",
        email: "login@test.com",
        password: "password123",
      });
    });

    it("should login successfully", async () => {
      const result = await authService.login("login@test.com", "password123");

      expect(result.token).toBeDefined();
    });

    it("should throw error for invalid email", async () => {
      await expect(
        authService.login("wrong@test.com", "password123"),
      ).rejects.toThrow();
    });

    it("should throw error for wrong password", async () => {
      await expect(
        authService.login("login@test.com", "wrong"),
      ).rejects.toThrow();
    });
  });
});

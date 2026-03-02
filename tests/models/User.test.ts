import { User } from "../../src/models/User";

describe("User Model", () => {
  it("should hash password before saving", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    expect(user.password).not.toBe("password123");
  });

  it("should validate email format", async () => {
    await expect(
      User.create({
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      }),
    ).rejects.toThrow();
  });

  it("comparePassword should return true for correct password", async () => {
    const user = await User.create({
      email: "compare@test.com",
      password: "password123",
      name: "Test User",
    });

    const match = await user.comparePassword("password123");
    expect(match).toBe(true);
  });

  it("generateResetToken should set token and expiry", async () => {
    const user = await User.create({
      email: "reset@test.com",
      password: "password123",
      name: "Test User",
    });

    const token = user.generateResetToken();

    expect(token).toBeDefined();
    expect(user.resetToken).toBe(token);
    expect(user.resetTokenExp).toBeDefined();
  });
});

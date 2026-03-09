import authService from "../../src/services/auth.service";
import { User } from "../../src/models/User";
import bcrypt from "bcryptjs";
import * as jwtUtils from "../../src/utils/jwt";

jest.mock("../../src/models/User");
jest.mock("bcryptjs");
jest.mock("../../src/utils/jwt");

describe("AuthService", () => {
  const mockUser: any = {
    _id: "user123",
    email: "test@example.com",
    password: "hashedPassword",
    save: jest.fn(),
    comparePassword: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register new user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (User.create as jest.Mock).mockResolvedValue(mockUser);

    (jwtUtils.generateToken as jest.Mock).mockReturnValue("accessToken");
    (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue(
      "refreshToken",
    );

    const result = await authService.register({
      email: "test@example.com",
      password: "123456",
    });

    expect(result.accessToken).toBe("accessToken");
    expect(result.refreshToken).toBe("refreshToken");
    expect(result.user).toBe(mockUser);
  });

  it("should throw if user exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      authService.register({
        email: "test@example.com",
        password: "123456",
      }),
    ).rejects.toThrow("User already exists");
  });

  it("should login successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(true);

    (jwtUtils.generateToken as jest.Mock).mockReturnValue("accessToken");
    (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue(
      "refreshToken",
    );

    const result = await authService.login("test@example.com", "123");

    expect(mockUser.comparePassword).toHaveBeenCalledWith("123");
    expect(result.accessToken).toBe("accessToken");
    expect(result.refreshToken).toBe("refreshToken");
  });

  it("should throw if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(authService.login("a@a.com", "123")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should throw if password mismatch", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    mockUser.comparePassword.mockResolvedValue(false);

    await expect(authService.login("a@a.com", "123")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("should generate new access token", async () => {
    (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue({
      userId: "user123",
    });

    (jwtUtils.generateToken as jest.Mock).mockReturnValue("newAccess");

    const result = await authService.refreshToken("refresh123");

    expect(result.accessToken).toBe("newAccess");
  });

  it("should throw if no refresh token", async () => {
    await expect(authService.refreshToken("")).rejects.toThrow(
      "Refresh token required",
    );
  });

  it("should generate reset token", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await authService.forgotPassword("test@example.com");

    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe("Password reset token generated");
  });

  it("should throw if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(authService.forgotPassword("x@x.com")).rejects.toThrow(
      "User not found",
    );
  });

  it("should reset password successfully", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHash");

    const result = await authService.resetPassword("token", "newpass");

    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe("Password reset successful");
  });

  it("should throw if token invalid", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(authService.resetPassword("bad", "123")).rejects.toThrow(
      "Invalid or expired token",
    );
  });
});

import { User } from "../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AppError } from "../utils/AppError";

class AuthService {
  /* ================= REGISTER ================= */
  async register(data: { name?: string; email: string; password: string }) {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      throw new AppError("User already exists", 409);
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name || "User",
      email: data.email,
      password: hashed,
    });

    const accessToken = generateToken({ userId: user._id.toString() });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /* ================= LOGIN ================= */
  async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /* ================= REFRESH TOKEN ================= */
  async refreshToken(token: string) {
    if (!token) {
      throw new AppError("Refresh token required", 400);
    }

    const payload: any = verifyRefreshToken(token);

    const accessToken = generateToken(payload.userId);

    return { accessToken };
  }

  /* ================= FORGOT PASSWORD ================= */
  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    return "Password reset token generated";
  }

  /* ================= RESET PASSWORD ================= */
  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return "Password reset successful";
  }
}

export default new AuthService();

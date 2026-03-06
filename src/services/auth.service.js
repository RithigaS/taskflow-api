"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/AppError");
class AuthService {
    /* ================= REGISTER ================= */
    async register(data) {
        const existing = await User_1.User.findOne({ email: data.email });
        if (existing) {
            throw new AppError_1.AppError("User already exists", 409);
        }
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
        const user = await User_1.User.create({
            name: data.name || "User",
            email: data.email,
            password: hashed,
        });
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id.toString() });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user._id.toString() });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async login(email, password) {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id.toString() });
        const refreshToken = (0, jwt_1.generateRefreshToken)({ userId: user._id.toString() });
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    /* ================= REFRESH TOKEN ================= */
    async refreshToken(token) {
        if (!token) {
            throw new AppError_1.AppError("Refresh token required", 400);
        }
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const accessToken = (0, jwt_1.generateToken)(payload.userId);
        return { accessToken };
    }
    /* ================= FORGOT PASSWORD ================= */
    async forgotPassword(email) {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        return "Password reset token generated";
    }
    /* ================= RESET PASSWORD ================= */
    async resetPassword(token, newPassword) {
        const user = await User_1.User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            throw new AppError_1.AppError("Invalid or expired token", 400);
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return "Password reset successful";
    }
}
exports.default = new AuthService();

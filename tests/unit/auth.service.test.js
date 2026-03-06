"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../../src/services/auth.service"));
const User_1 = require("../../src/models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwtUtils = __importStar(require("../../src/utils/jwt"));
jest.mock("../../src/models/User");
jest.mock("bcryptjs");
jest.mock("../../src/utils/jwt");
describe("AuthService", () => {
    const mockUser = {
        _id: "user123",
        email: "test@example.com",
        password: "hashedPassword",
        save: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should register new user", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        bcryptjs_1.default.hash.mockResolvedValue("hashedPassword");
        User_1.User.create.mockResolvedValue(mockUser);
        jwtUtils.generateToken.mockReturnValue("accessToken");
        jwtUtils.generateRefreshToken.mockReturnValue("refreshToken");
        const result = await auth_service_1.default.register({
            email: "test@example.com",
            password: "123456",
        });
        expect(result.accessToken).toBe("accessToken");
        expect(result.refreshToken).toBe("refreshToken");
        expect(result.user).toBe(mockUser);
    });
    it("should throw if user exists", async () => {
        User_1.User.findOne.mockResolvedValue(mockUser);
        await expect(auth_service_1.default.register({
            email: "test@example.com",
            password: "123456",
        })).rejects.toThrow("User already exists");
    });
    it("should login successfully", async () => {
        User_1.User.findOne.mockResolvedValue(mockUser);
        bcryptjs_1.default.compare.mockResolvedValue(true);
        jwtUtils.generateToken.mockReturnValue("accessToken");
        jwtUtils.generateRefreshToken.mockReturnValue("refreshToken");
        const result = await auth_service_1.default.login("test@example.com", "123");
        expect(result.accessToken).toBe("accessToken");
        expect(result.refreshToken).toBe("refreshToken");
    });
    it("should throw if user not found", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        await expect(auth_service_1.default.login("a@a.com", "123")).rejects.toThrow("Invalid credentials");
    });
    it("should throw if password mismatch", async () => {
        User_1.User.findOne.mockResolvedValue(mockUser);
        bcryptjs_1.default.compare.mockResolvedValue(false);
        await expect(auth_service_1.default.login("a@a.com", "123")).rejects.toThrow("Invalid credentials");
    });
    it("should generate new access token", async () => {
        jwtUtils.verifyRefreshToken.mockReturnValue({
            userId: "user123",
        });
        jwtUtils.generateToken.mockReturnValue("newAccess");
        const result = await auth_service_1.default.refreshToken("refresh123");
        expect(result.accessToken).toBe("newAccess");
    });
    it("should throw if no refresh token", async () => {
        await expect(auth_service_1.default.refreshToken("")).rejects.toThrow("Refresh token required");
    });
    it("should generate reset token", async () => {
        User_1.User.findOne.mockResolvedValue(mockUser);
        const result = await auth_service_1.default.forgotPassword("test@example.com");
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toBe("Password reset token generated");
    });
    it("should throw if user not found", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        await expect(auth_service_1.default.forgotPassword("x@x.com")).rejects.toThrow("User not found");
    });
    it("should reset password successfully", async () => {
        User_1.User.findOne.mockResolvedValue(mockUser);
        bcryptjs_1.default.hash.mockResolvedValue("newHash");
        const result = await auth_service_1.default.resetPassword("token", "newpass");
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toBe("Password reset successful");
    });
    it("should throw if token invalid", async () => {
        User_1.User.findOne.mockResolvedValue(null);
        await expect(auth_service_1.default.resetPassword("bad", "123")).rejects.toThrow("Invalid or expired token");
    });
});

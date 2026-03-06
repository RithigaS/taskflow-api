"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.login = exports.register = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
const User_1 = require("../models/User");
//register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await auth_service_1.default.register({ name, email, password });
        res.status(201).json({
            user: result.user,
            token: result.accessToken,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message,
        });
    }
};
exports.register = register;
//login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.default.login(email, password);
        return res.status(200).json({
            token: result.accessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//refresh token
const refreshToken = async (req, res, next) => {
    try {
        const token = req.body.refreshToken;
        const result = await auth_service_1.default.refreshToken(token);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
//forget
const forgotPassword = async (req, res, next) => {
    try {
        const message = await auth_service_1.default.forgotPassword(req.body.email);
        res.json({ message });
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
//reset password
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const message = await auth_service_1.default.resetPassword(token, password);
        res.json({ message });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
//upload avatar
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No avatar uploaded" });
        }
        const user = await User_1.User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const avatarPath = req.file.path || req.file.filename || req.file.originalname;
        user.avatar = avatarPath;
        await user.save();
        res.status(200).json({ avatar: user.avatar });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.uploadAvatar = uploadAvatar;

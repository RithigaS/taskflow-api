import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { upload } from "../middleware/upload.middleware";
import { User } from "../models/User";

/* ================= REGISTER ================= */

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.register({ name, email, password });

    res.status(201).json({
      user: result.user,
      token: result.accessToken,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

/* ================= LOGIN ================= */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json({
      token: result.accessToken, // ✅ matches your test
    });
  } catch (error) {
    next(error);
  }
};

/* ================= REFRESH TOKEN ================= */

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.body.refreshToken as string;

    const result = await authService.refreshToken(token);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const message = await authService.forgotPassword(req.body.email);
    res.json({ message });
  } catch (err) {
    next(err);
  }
};

/* ================= RESET PASSWORD ================= */

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, password } = req.body;

    const message = await authService.resetPassword(token, password);

    res.json({ message });
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if no file uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // since we are using memoryStorage, store filename instead of path
    user.avatar = req.file.originalname;

    await user.save();

    return res.json({ avatar: user.avatar });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { User } from "../models/User";

//register

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

//login

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.status(200).json({
      token: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

//refresh token

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

//forget

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

//reset password

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

//upload avatar
export const uploadAvatar = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar uploaded" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avatarPath =
      req.file.path || req.file.filename || req.file.originalname;
    user.avatar = avatarPath;
    await user.save();

    res.status(200).json({ avatar: user.avatar });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

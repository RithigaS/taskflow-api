import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuth = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as any;

    req.userId = decoded.userId;

    next(); // ⭐ THIS WAS MISSING OR NOT REACHED
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

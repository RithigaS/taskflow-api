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
      process.env.JWT_SECRET || "testsecret",
    ) as any;

    // Support both 'userId' (from auth service) and 'id' (from tests)
    req.userId = decoded.userId || decoded.id;

    if (!req.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

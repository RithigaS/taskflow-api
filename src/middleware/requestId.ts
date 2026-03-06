import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const requestId = (
  req: Request & { requestId?: string },
  res: Response,
  next: NextFunction,
) => {
  const id = crypto.randomUUID();

  req.requestId = id;
  res.setHeader("X-Request-Id", id);

  next();
};

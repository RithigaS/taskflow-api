import { Request, Response, NextFunction } from "express";
import { upload } from "./upload.middleware";

/**
 * Wrap multer so it NEVER crashes the request (prevents ECONNRESET in tests)
 */
export const uploadSingle = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};

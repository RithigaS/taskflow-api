import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuth } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/multerWrapper";

const router = Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/forgot", authController.forgotPassword);
router.post("/reset", authController.resetPassword);

router.put(
  "/me/avatar",
  isAuth,
  uploadSingle("avatar"),
  authController.uploadAvatar,
);

export default router;

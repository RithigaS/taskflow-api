import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/forgot", authController.forgotPassword);
router.post("/reset", authController.resetPassword);

router.put(
  "/me/avatar",
  isAuth,
  upload.single("avatar"),
  authController.uploadAvatar,
);
export default router;

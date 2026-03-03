import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/forgot", authController.forgotPassword);
router.post("/reset", authController.resetPassword);

export default router;

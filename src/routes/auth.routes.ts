import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuth } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/multerWrapper";

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

router.post("/signup", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     summary: Get password reset token (for manual copy)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset token generated (copy this token)
 *
 */
router.post("/forgot", authController.forgotPassword);
router.post("/token", authController.getResetToken);

/**
 * @swagger
 * /api/auth/reset:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset", authController.resetPassword);

router.put(
  "/me/avatar",
  isAuth,
  uploadSingle("avatar"),
  authController.uploadAvatar,
);

export default router;

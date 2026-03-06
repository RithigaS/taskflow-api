import { Router } from "express";
import { addComment } from "../controllers/comment.controller";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();
/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add comment to a task
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */

router.post("/", isAuth, addComment);

export default router;

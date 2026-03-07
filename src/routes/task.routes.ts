import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { isAuth } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/multerWrapper";

import { validateRequest } from "../middleware/validateRequest";
import { createTaskValidator } from "../validators/task.validators";

const router = Router();

/* PROTECTED ROUTE (used only for auth tests) */
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", isAuth, taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post(
  "/",
  createTaskValidator,
  validateRequest,
  taskController.createTask,
);

/* PUBLIC PAGINATION ROUTE - returns paginated tasks */
router.get("/list", taskController.listTasks);
/**
 * @swagger
 * /api/tasks/project/{projectId}:
 *   get:
 *     summary: Get tasks by project ID
 *     description: Returns all tasks that belong to a specific project.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *           example: 67c123abc456def789000111
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - _id: "task123"
 *                   title: "Implement authentication"
 *                   status: "pending"
 *                 - _id: "task124"
 *                   title: "Write tests"
 *                   status: "completed"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

router.get("/project/:projectId", taskController.getTasksByProject);
router.put("/:taskId", taskController.updateTask);
router.patch("/:taskId/status", taskController.updateTaskStatus);
router.delete("/:taskId", taskController.deleteTask);

/* FILE UPLOAD ROUTES */

/**
 * @swagger
 * /api/tasks/{id}/attachments:
 *   post:
 *     summary: Upload attachment to a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 */
router.post(
  "/:id/attachments",
  isAuth,
  uploadSingle("file"),
  taskController.uploadAttachment,
);
router.get("/:id/attachments/:attachmentId", taskController.downloadAttachment);

export default router;

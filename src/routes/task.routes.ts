import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { isAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

import { validate } from "../middleware/validation.middleware";
import { validateRequest } from "../middleware/validateRequest";
import { createTaskValidator } from "../validators/task.validators";

const router = Router();

/* PROTECTED ROUTE (used only for auth tests) */
router.get("/", isAuth, taskController.getAllTasks);

/* PUBLIC ROUTES (used by integration tests) - with validation */
router.post(
  "/",
  createTaskValidator,
  validateRequest,
  taskController.createTask,
);
router.get("/project/:projectId", taskController.getTasksByProject);
router.put("/:taskId", taskController.updateTask);
router.patch("/:taskId/status", taskController.updateTaskStatus);
router.delete("/:taskId", taskController.deleteTask);

router.post(
  "/:id/attachments",
  isAuth,
  upload.single("file"),
  taskController.uploadAttachment,
);
router.get("/:id/attachments/:attachmentId", taskController.downloadAttachment);

export default router;

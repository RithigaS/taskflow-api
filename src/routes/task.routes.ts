import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { isAuth } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/multerWrapper";

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

/* PUBLIC PAGINATION ROUTE - returns paginated tasks */
router.get("/list", taskController.listTasks);

router.get("/project/:projectId", taskController.getTasksByProject);
router.put("/:taskId", taskController.updateTask);
router.patch("/:taskId/status", taskController.updateTaskStatus);
router.delete("/:taskId", taskController.deleteTask);

/* FILE UPLOAD ROUTES */
router.post(
  "/:id/attachments",
  isAuth,
  uploadSingle("file"),
  taskController.uploadAttachment,
);
router.get("/:id/attachments/:attachmentId", taskController.downloadAttachment);

export default router;

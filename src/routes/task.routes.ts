import { Router } from "express";
import * as taskController from "../controllers/task.controller";

const router = Router();

// Create Task
router.post("/", taskController.createTask);

// Get Tasks by Project
router.get("/project/:projectId", taskController.getTasksByProject);

// Update Full Task
router.put("/:taskId", taskController.updateTask);

// Update Only Status
router.patch("/:taskId/status", taskController.updateTaskStatus);

// Soft Delete Task
router.delete("/:taskId", taskController.deleteTask);

export default router;

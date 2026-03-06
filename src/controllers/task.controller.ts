import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { TaskStatus } from "../models/Task";
import * as fileService from "../services/file.service";
import { getTasksOffset, getTasksCursor } from "../services/task.query.service";
import fs from "fs";

import { getIO } from "../socket";

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);

    try {
      if ((task as any).project) {
        getIO()
          .to(`project:${(task as any).project.toString()}`)
          .emit("task:created", {
            taskId: (task as any)._id,
            projectId: (task as any).project,
            title: (task as any).title,
            status: (task as any).status,
          });
      }
    } catch {}

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasksByProject = async (
  req: Request<{ projectId: string }>,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    const tasks = await taskService.getTasksByProject(projectId);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const listTasks = async (req: Request, res: Response) => {
  const useCursor = Boolean(req.query.cursor);

  const result = useCursor
    ? await getTasksCursor(req.query)
    : await getTasksOffset(req.query);

  if ((result as any).status === 400) {
    return res.status(400).json({
      success: false,
      message: (result as any).error,
    });
  }

  return res.status(200).json({
    success: true,
    data: (result as any).data,
    meta: (result as any).meta,
  });
};

export const updateTask = async (
  req: Request<{ taskId: string }>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;

    const updatedTask = await taskService.updateTask(taskId, req.body);

    try {
      if ((updatedTask as any).projectId) {
        getIO()
          .to((updatedTask as any).projectId.toString())
          .emit("task:updated", {
            taskId: (updatedTask as any)._id,
            projectId: (updatedTask as any).projectId,
            updates: req.body,
          });
      }
    } catch {}

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTaskStatus = async (
  req: Request<{ taskId: string }>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await taskService.updateTaskStatus(
      taskId,
      status as TaskStatus,
    );

    try {
      if ((updatedTask as any).projectId) {
        getIO()
          .to((updatedTask as any).projectId.toString())
          .emit("task:status-changed", {
            taskId: (updatedTask as any)._id,
            projectId: (updatedTask as any).projectId,
            status: (updatedTask as any).status,
          });
      }
    } catch {}

    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTask = async (
  req: Request<{ taskId: string }>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;

    await taskService.softDeleteTask(taskId);

    try {
      getIO().emit("task:updated", { taskId, deleted: true });
    } catch {}

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadAttachment = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const task = await fileService.addAttachment(req.params.id, req.file);

    try {
      if ((task as any).projectId) {
        getIO()
          .to((task as any).projectId.toString())
          .emit("task:updated", {
            taskId: (task as any)._id,
            projectId: (task as any).projectId,
            attachmentAdded: true,
          });
      }
    } catch {}

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const downloadAttachment = async (req: any, res: any) => {
  try {
    const attachment = await fileService.getAttachment(
      req.params.id,
      req.params.attachmentId,
    );

    if (!fs.existsSync(attachment.path)) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.setHeader("Content-Type", attachment.mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${attachment.filename}"`,
    );

    const stream = fs.createReadStream(attachment.path);

    stream.on("error", () => {
      return res.status(500).json({ message: "File stream error" });
    });

    stream.pipe(res);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { Task, TaskStatus } from "../models/Task";

/* ================= CREATE ================= */

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY PROJECT ================= */
export const getTasksByProject = async (
  req: Request<{ projectId: string }>,
  res: Response,
) => {
  try {
    const { projectId } = req.params;

    const tasks = await taskService.getTasksByProject(projectId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateTask = async (
  req: Request<{ taskId: string }>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;

    const updatedTask = await taskService.updateTask(taskId, req.body);

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */
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

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteTask = async (
  req: Request<{ taskId: string }>,
  res: Response,
) => {
  try {
    const { taskId } = req.params;

    await taskService.softDeleteTask(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

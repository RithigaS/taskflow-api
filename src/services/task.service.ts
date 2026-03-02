import { Task, TaskStatus } from "../models/Task";

export const createTask = async (data: any) => {
  return await Task.create(data);
};

export const getTasksByProject = async (projectId: string) => {
  return await Task.find({
    project: projectId,
    deletedAt: null,
  })
    .populate("assignedTo project")
    .sort({ createdAt: -1 });
};

export const updateTask = async (id: string, updates: any) => {
  const task = await Task.findOne({ _id: id, deletedAt: null });

  if (!task) throw new Error("Task not found");

  Object.assign(task, updates);
  await task.save();

  return task;
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
  const task = await Task.findOne({ _id: id, deletedAt: null });

  if (!task) throw new Error("Task not found");

  task.status = status;
  await task.save();

  return task;
};

export const softDeleteTask = async (id: string) => {
  const task = await Task.findOne({ _id: id, deletedAt: null });

  if (!task) throw new Error("Task not found");

  task.deletedAt = new Date();
  await task.save();

  return task;
};

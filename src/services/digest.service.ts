import { Task } from "../models/Task";

export const getOverdueTasks = async () => {
  const now = new Date();

  const tasks = await Task.find({
    dueDate: { $lt: now },
    status: { $ne: "done" },
  });

  return tasks;
};

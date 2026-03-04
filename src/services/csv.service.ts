import { Task, ITask } from "../models/Task";
import mongoose from "mongoose";

export const generateCSV = async (projectId: string): Promise<string> => {
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).lean<ITask[]>();

  const header = "Title,Status,Priority,CreatedAt\n";

  const rows = tasks
    .map((t: ITask & { createdAt?: Date }) => {
      return `${t.title},${t.status},${t.priority || ""},${
        t.createdAt ? t.createdAt.toISOString() : ""
      }`;
    })
    .join("\n");

  return header + rows;
};

import fs from "fs";
import { Task } from "../models/Task";

export const addAttachment = async (
  taskId: string,
  file: Express.Multer.File,
) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  // ensure attachments array exists
  if (!task.attachments) {
    task.attachments = [];
  }

  task.attachments.push({
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
  } as any);

  await task.save();

  return task;
};

export const getAttachment = async (taskId: string, attachmentId: string) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  if (!task.attachments) {
    throw new Error("No attachments found");
  }

  const attachment = task.attachments.id(attachmentId);

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  return attachment;
};

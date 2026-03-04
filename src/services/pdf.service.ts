import PDFDocument from "pdfkit";
import { Project } from "../models/Project";
import { Task, ITask, TaskStatus } from "../models/Task";
import mongoose from "mongoose";

export const generateProjectReport = async (
  projectId: string,
): Promise<Buffer> => {
  const project = await Project.findById(projectId).populate("members");

  const tasks = await Task.find({
    project: projectId,
  }).lean<ITask[]>();

  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => buffers.push(chunk));

  // ✅ FIXED: Added backticks
  doc.fontSize(18).text(`Project Report: ${project?.name}`);
  doc.moveDown();

  doc.text("Members:");
  project?.members.forEach((m: any) => {
    // ✅ FIXED: Added backticks
    doc.text(`- ${m.name}`);
  });

  doc.moveDown();
  doc.text("Task Summary:");

  Object.values(TaskStatus).forEach((status) => {
    const count = tasks.filter((t: ITask) => t.status === status).length;

    // ✅ FIXED: Added backticks
    doc.text(`${status}: ${count}`);
  });

  const overdue = tasks.filter(
    (t: ITask) =>
      t.dueDate &&
      t.status !== TaskStatus.DONE &&
      new Date(t.dueDate) < new Date(),
  );

  doc.moveDown();
  doc.text("Overdue Tasks:");

  overdue.forEach((t: ITask) => {
    // ✅ FIXED: Added backticks
    doc.text(`- ${t.title}`);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
};

import mongoose from "mongoose";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface ITask {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: string;
  assignedTo?: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Task =
  mongoose.models.Project || mongoose.model("Task", TaskSchema);

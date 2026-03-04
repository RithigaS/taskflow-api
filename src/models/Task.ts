import mongoose from "mongoose";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

const AttachmentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  mimetype: String,
});

export interface ITask {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: string;
  assignedTo?: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
  attachments?: any[];
  dueDate?: Date; // ✅ ADD THIS
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

    attachments: [AttachmentSchema], // ✅ ADD THIS
    dueDate: { type: Date },
  },
  { timestamps: true },
);

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

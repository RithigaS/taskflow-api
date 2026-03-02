import mongoose from "mongoose";

export interface IComment {
  content: string;
  task: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId | null;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true },
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

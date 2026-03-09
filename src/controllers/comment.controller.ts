import { Request, Response } from "express";
import { Comment } from "../models/Comment";

export const addComment = async (req: any, res: Response) => {
  try {
    const { taskId, content } = req.body;

    const comment = await Comment.create({
      task: taskId,
      content,
      author: req.userId,
    });

    // Populate task details to return task info
    await comment.populate("task", "title description");

    res.status(201).json({
      success: true,
      data: {
        _id: comment._id,
        taskId: comment.task,
        content: comment.content,
        author: comment.author,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

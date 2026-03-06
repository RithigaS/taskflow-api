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

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

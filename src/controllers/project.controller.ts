import { Request, Response } from "express";
import { Project } from "../models/Project";

export const createProject = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      members: [req.userId],
      createdBy: req.userId,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

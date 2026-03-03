import { body } from "express-validator";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";
import { Project } from "../models/Project";

export const createTaskValidator = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3-100 characters")
    .customSanitizer((v) => sanitizeHtml(v, { allowedTags: [] })),

  body("description")
    .isLength({ max: 2000 })
    .withMessage("Description too long")
    .customSanitizer((v) => sanitizeHtml(v, { allowedTags: [] })),

  body("priority")
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),

  body("projectId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid project ID"),
  //.bail()
  //.custom(async (value) => {
  //  const project = await Project.findById(value);
  //  if (!project) throw new Error("Project not found");
  //}),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date")
    .custom((value) => new Date(value) > new Date())
    .withMessage("Due date must be future"),

  body("tags").optional().isArray({ max: 10 }).withMessage("Max 10 tags"),

  body("tags.*").isLength({ max: 30 }).withMessage("Tag too long"),
];

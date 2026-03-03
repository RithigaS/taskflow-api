import { body } from "express-validator";
import sanitizeHtml from "sanitize-html";

const clean = (value: string) =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),

  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be 3–100 chars")
    .customSanitizer(clean),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty().withMessage("Password required"),
];

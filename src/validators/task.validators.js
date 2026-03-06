"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidator = void 0;
const express_validator_1 = require("express-validator");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createTaskValidator = [
    (0, express_validator_1.body)("title")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be 3-100 characters")
        .customSanitizer((v) => (0, sanitize_html_1.default)(v, { allowedTags: [] })),
    (0, express_validator_1.body)("description")
        .isLength({ max: 2000 })
        .withMessage("Description too long")
        .customSanitizer((v) => (0, sanitize_html_1.default)(v, { allowedTags: [] })),
    (0, express_validator_1.body)("priority")
        .isIn(["LOW", "MEDIUM", "HIGH"])
        .withMessage("Invalid priority"),
    (0, express_validator_1.body)("projectId")
        .optional()
        .custom((value) => mongoose_1.default.Types.ObjectId.isValid(value))
        .withMessage("Invalid project ID"),
    //.bail()
    //.custom(async (value) => {
    //  const project = await Project.findById(value);
    //  if (!project) throw new Error("Project not found");
    //}),
    (0, express_validator_1.body)("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid date")
        .custom((value) => new Date(value) > new Date())
        .withMessage("Due date must be future"),
    (0, express_validator_1.body)("tags").optional().isArray({ max: 10 }).withMessage("Max 10 tags"),
    (0, express_validator_1.body)("tags.*").isLength({ max: 30 }).withMessage("Tag too long"),
];

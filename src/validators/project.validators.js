"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const clean = (value) => (0, sanitize_html_1.default)(value, { allowedTags: [], allowedAttributes: {} });
exports.registerValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars"),
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be 3–100 chars")
        .customSanitizer(clean),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").isEmail().normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password required"),
];

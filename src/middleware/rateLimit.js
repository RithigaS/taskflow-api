"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const isTest = process.env.NODE_ENV === "test";
// Disable rate limiting entirely in test mode
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: isTest ? 999999 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTest,
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: isTest ? 999999 : 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTest,
});

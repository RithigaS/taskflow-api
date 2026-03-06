"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const requestId = (req, res, next) => {
    const id = crypto_1.default.randomUUID();
    req.requestId = id;
    res.setHeader("X-Request-Id", id);
    next();
};
exports.requestId = requestId;

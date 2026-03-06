"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || null;
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400;
        errors = Object.values(err.errors).map((e) => e.message);
    }
    // Invalid ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    // Duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }
    // JWT Errors
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    if (err.name === "MulterError") {
        statusCode = 400;
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File too large. Max size is 5MB";
        }
        else {
            message = err.message || "Upload failed";
        }
    }
    if (err.message === "Invalid file type") {
        statusCode = 400;
        message = "Invalid file type";
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const upload_middleware_1 = require("./upload.middleware");
/**
 * Wrap multer so it NEVER crashes the request (prevents ECONNRESET in tests)
 */
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload_middleware_1.upload.single(fieldName)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }
            next();
        });
    };
};
exports.uploadSingle = uploadSingle;

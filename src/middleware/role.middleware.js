"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (req.user?.role === "admin") {
        return next();
    }
    return res.status(403).json({
        message: "Admin access required",
    });
};
exports.isAdmin = isAdmin;

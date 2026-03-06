"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../../src/middleware/errorHandler");
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe("errorHandler branch coverage", () => {
    const req = {};
    const next = jest.fn();
    it("handles mongoose ValidationError", () => {
        const err = {
            name: "ValidationError",
            errors: {
                email: { message: "Email required" },
                password: { message: "Password required" },
            },
        };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
    it("handles mongoose CastError", () => {
        const err = { name: "CastError" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("handles duplicate key error", () => {
        const err = { code: 11000, keyValue: { email: "a@b.com" } };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(409);
    });
    it("handles TokenExpiredError", () => {
        const err = { name: "TokenExpiredError" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("handles JsonWebTokenError", () => {
        const err = { name: "JsonWebTokenError" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it("handles MulterError LIMIT_FILE_SIZE", () => {
        const err = { name: "MulterError", code: "LIMIT_FILE_SIZE" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("handles invalid file type message", () => {
        const err = { message: "Invalid file type" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

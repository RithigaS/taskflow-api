"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../../src/middleware/errorHandler");
describe("Error Handler", () => {
    const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    it("should handle Mongoose ValidationError", () => {
        const err = {
            name: "ValidationError",
            errors: { field: { message: "Invalid" } },
        };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should handle CastError", () => {
        const err = { name: "CastError" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should handle duplicate key error", () => {
        const err = { code: 11000, keyValue: { email: "test" } };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(409);
    });
    it("should handle JWT expired", () => {
        const err = { name: "TokenExpiredError" };
        const res = mockRes();
        (0, errorHandler_1.errorHandler)(err, {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(401);
    });
});
describe("Error Handler", () => {
    it("should handle duplicate key error", () => {
        const err = { code: 11000, keyValue: { email: "a@a.com" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        (0, errorHandler_1.errorHandler)(err, {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(409);
    });
});
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
it("should handle Mongoose CastError", () => {
    const res = mockRes();
    const err = { name: "CastError" };
    (0, errorHandler_1.errorHandler)(err, {}, res, {});
    expect(res.status).toHaveBeenCalledWith(400);
});
it("should handle duplicate key error", () => {
    const res = mockRes();
    const err = { code: 11000, keyValue: { email: "test@mail.com" } };
    (0, errorHandler_1.errorHandler)(err, {}, res, {});
    expect(res.status).toHaveBeenCalledWith(409);
});
it("should handle JWT errors", () => {
    const res = mockRes();
    const err = { name: "JsonWebTokenError" };
    (0, errorHandler_1.errorHandler)(err, {}, res, {});
    expect(res.status).toHaveBeenCalledWith(401);
});

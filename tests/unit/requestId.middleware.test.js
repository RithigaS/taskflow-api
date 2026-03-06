"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestId_1 = require("../../src/middleware/requestId");
describe("requestId middleware", () => {
    it("adds requestId to req and X-Request-Id header to response", () => {
        const req = {};
        const res = {
            setHeader: jest.fn(),
        };
        const next = jest.fn();
        (0, requestId_1.requestId)(req, res, next);
        expect(req.requestId).toBeDefined();
        expect(typeof req.requestId).toBe("string");
        expect(res.setHeader).toHaveBeenCalledWith("X-Request-Id", req.requestId);
        expect(next).toHaveBeenCalled();
    });
});

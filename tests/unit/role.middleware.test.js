"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_middleware_1 = require("../../src/middleware/role.middleware");
describe("Admin Middleware", () => {
    it("should allow admin", () => {
        const req = {
            user: { role: "admin" },
        };
        const res = {};
        const next = jest.fn();
        (0, role_middleware_1.isAdmin)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    it("should block non-admin", () => {
        const req = {
            user: { role: "user" },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        (0, role_middleware_1.isAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });
});

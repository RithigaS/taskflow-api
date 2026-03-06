"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../src/middleware/auth.middleware");
const jwt_1 = require("../../src/utils/jwt");
describe("Auth Middleware", () => {
    it("should call next if token is valid", () => {
        const token = (0, jwt_1.generateToken)({ userId: "123" });
        const req = {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        (0, auth_middleware_1.isAuth)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.userId).toBeDefined();
    });
    it("should return 401 if no token", () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        (0, auth_middleware_1.isAuth)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
});

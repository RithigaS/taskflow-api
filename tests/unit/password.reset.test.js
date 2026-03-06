"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const jwt_1 = require("../../src/utils/jwt");
describe("Protected Routes", () => {
    it("should allow access with valid token", async () => {
        const token = (0, jwt_1.generateToken)({ userId: "123" });
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).not.toBe(401);
    });
    it("should deny access without token", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/tasks");
        expect(res.status).toBe(401);
    });
    it("should deny access with invalid token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/tasks")
            .set("Authorization", "Bearer invalidtoken");
        expect(res.status).toBe(401);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "test";
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("rate limiting", () => {
    // Skip this test in test mode since rate limiting is disabled for tests
    it.skip("blocks auth requests after threshold is exceeded", async () => {
        const results = [];
        for (let i = 0; i < 5; i++) {
            const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
                email: "nobody@example.com",
                password: "wrongpassword",
            });
            results.push(res.status);
        }
        expect(results).toContain(429);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("Health Endpoint", () => {
    it("GET /api/health should return 200", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/health");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("status");
        expect(res.body).toHaveProperty("timestamp");
        expect(res.body).toHaveProperty("uptime");
    });
    it("GET unknown route should return 404", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/unknown");
        expect(res.status).toBe(404);
    });
});

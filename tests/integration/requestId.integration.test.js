"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("request id integration", () => {
    it("includes X-Request-Id header in response", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/health");
        expect(res.status).toBe(200);
        expect(res.headers["x-request-id"]).toBeDefined();
    });
});

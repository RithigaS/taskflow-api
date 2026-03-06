"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const path_1 = __importDefault(require("path"));
describe("Avatar Upload Integration Tests", () => {
    let token;
    beforeAll(async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
            name: "Test User",
            email: "avatar@test.com",
            password: "Password123",
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });
    it("should upload avatar successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/auth/me/avatar")
            .set("Authorization", `Bearer ${token}`)
            .attach("avatar", path_1.default.join(__dirname, "../fixtures/avatar.png"));
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("avatar");
    });
    it("should fail without authentication", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put("/api/auth/me/avatar")
            .attach("avatar", path_1.default.join(__dirname, "../fixtures/avatar.png"));
        expect(res.status).toBe(401);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const auth_service_1 = __importDefault(require("../../src/services/auth.service"));
// mock authService functions
jest.mock("../../src/services/auth.service", () => ({
    __esModule: true,
    default: {
        register: jest.fn(),
        login: jest.fn(),
        refreshToken: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
    },
}));
describe("Auth Controller Branch Tests", () => {
    afterEach(() => jest.clearAllMocks());
    test("register → success (201)", async () => {
        auth_service_1.default.register.mockResolvedValue({
            user: { id: "1", name: "A", email: "a@test.com" },
            accessToken: "token123",
        });
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
            name: "A",
            email: "a@test.com",
            password: "Password123",
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
    });
    test("register → error with statusCode (covers catch branch)", async () => {
        auth_service_1.default.register.mockRejectedValue({
            statusCode: 400,
            message: "Bad Request",
        });
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
            name: "A",
            email: "a@test.com",
            password: "Password123",
        });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Bad Request");
    });
    test("login → error goes to errorHandler (next(err))", async () => {
        auth_service_1.default.login.mockRejectedValue(new Error("Login failed"));
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            email: "a@test.com",
            password: "wrong",
        });
        // depending on your errorHandler it may return 500 or 401
        expect([401, 500]).toContain(res.status);
    });
    test("refreshToken → success", async () => {
        auth_service_1.default.refreshToken.mockResolvedValue({
            accessToken: "newAccess",
            refreshToken: "newRefresh",
        });
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/refresh").send({
            refreshToken: "oldRefresh",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });
    test("forgotPassword → service throws", async () => {
        auth_service_1.default.forgotPassword.mockRejectedValue(new Error("Email not found"));
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/forgot").send({
            email: "nope@test.com",
        });
        expect([400, 404, 500]).toContain(res.status);
    });
    test("resetPassword → service throws", async () => {
        auth_service_1.default.resetPassword.mockRejectedValue(new Error("Invalid token"));
        const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/reset").send({
            token: "bad",
            password: "NewPassword123",
        });
        expect([400, 401, 500]).toContain(res.status);
    });
});

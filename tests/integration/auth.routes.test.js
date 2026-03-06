"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../src/app"));
const User_1 = require("../../src/models/User");
describe("Auth Routes", () => {
    beforeEach(async () => {
        await User_1.User.deleteMany({});
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
    });
    describe("POST /api/auth/signup", () => {
        it("should create a new user and return token", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
                name: "Test User",
                email: "test@mail.com",
                password: "password123",
            });
            expect(res.status).toBe(201);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe("test@mail.com");
        });
        it("should return error if email already exists", async () => {
            await User_1.User.create({
                name: "Test",
                email: "dup@mail.com",
                password: "password123",
            });
            const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
                name: "Test",
                email: "dup@mail.com",
                password: "password123",
            });
            expect(res.status).toBe(409);
        });
    });
    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await User_1.User.create({
                name: "Login User",
                email: "login@mail.com",
                password: "password123",
            });
        });
        it("should login user and return token", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
                email: "login@mail.com",
                password: "password123",
            });
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        });
        it("should return error for wrong password", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
                email: "login@mail.com",
                password: "wrongpass",
            });
            expect(res.status).toBe(401);
        });
    });
});

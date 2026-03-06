"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const Task_1 = require("../../src/models/Task");
const User_1 = require("../../src/models/User");
describe("Pagination Integration Tests", () => {
    beforeAll(async () => {
        await Task_1.Task.deleteMany({});
        await User_1.User.deleteMany({});
        const user = await User_1.User.create({
            name: "Pagination User",
            email: "pagination@test.com",
            password: "Password123",
            role: "user",
        });
        const tasks = Array.from({ length: 12 }).map((_, i) => ({
            title: `Task ${i + 1}`,
            description: "Pagination Test",
            status: "todo",
            priority: "low",
            createdBy: user._id,
            deletedAt: null,
        }));
        await Task_1.Task.insertMany(tasks);
    });
    it("offset pagination returns correct slice (page=2, limit=5)", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/tasks/list?page=2&limit=5");
        expect(res.status).toBe(200);
        expect(res.body.meta.page).toBe(2);
        expect(res.body.meta.limit).toBe(5);
        expect(res.body.data.length).toBe(5);
    });
});

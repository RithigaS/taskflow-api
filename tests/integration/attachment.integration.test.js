"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const User_1 = require("../../src/models/User");
const Task_1 = require("../../src/models/Task");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("Attachment Integration Tests", () => {
    let token;
    let taskId;
    beforeAll(async () => {
        const user = await User_1.User.create({
            name: "Test User",
            email: "attach@test.com",
            password: "password123",
            role: "user",
        });
        token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "testsecret");
        const task = await Task_1.Task.create({
            title: "Attachment Task",
            description: "Test",
            status: "todo",
            createdBy: user._id,
        });
        taskId = task._id.toString();
    });
    it("should upload attachment successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/tasks/${taskId}/attachments`)
            .set("Authorization", `Bearer ${token}`)
            .attach("file", Buffer.from("dummy attachment content"), {
            filename: "test-file.txt",
            contentType: "text/plain",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    });
    it("should fail without token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post(`/api/tasks/${taskId}/attachments`)
            .attach("file", Buffer.from("dummy attachment content"), {
            filename: "test-file.txt",
            contentType: "text/plain",
        });
        expect(res.status).toBe(401);
    });
});

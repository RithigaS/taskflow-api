"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
describe("phase 8 full journey", () => {
    it("signup -> create project -> create task -> comment -> upload file", async () => {
        const signup = await (0, supertest_1.default)(app_1.default).post("/api/auth/signup").send({
            name: "Rithi",
            email: "rithi@example.com",
            password: "Password123",
        });
        expect(signup.status).toBe(201);
        const token = signup.body.token;
        const project = await (0, supertest_1.default)(app_1.default)
            .post("/api/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
            name: "Test Project",
        });
        expect(project.status).toBe(201);
        const projectId = project.body.data._id;
        const task = await (0, supertest_1.default)(app_1.default)
            .post("/api/tasks")
            .send({
            title: "Test Task",
            priority: "HIGH",
            projectId,
            dueDate: new Date(Date.now() + 86400000).toISOString(),
        });
        expect(task.status).toBe(201);
        const taskId = task.body.data._id;
        const comment = await (0, supertest_1.default)(app_1.default)
            .post("/api/comments")
            .set("Authorization", `Bearer ${token}`)
            .send({
            taskId,
            content: "Test comment",
        });
        expect(comment.status).toBe(201);
        const upload = await (0, supertest_1.default)(app_1.default)
            .post(`/api/tasks/${taskId}/attachments`)
            .set("Authorization", `Bearer ${token}`)
            .attach("file", Buffer.from("hello"), "file.txt");
        expect([200, 201]).toContain(upload.status);
    });
});

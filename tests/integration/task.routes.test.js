"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../../src/app"));
const Project_1 = require("../../src/models/Project");
const User_1 = require("../../src/models/User");
const Task_1 = require("../../src/models/Task");
describe("Task Routes Integration", () => {
    let user;
    let project;
    beforeEach(async () => {
        user = await User_1.User.create({
            name: "Test User",
            email: "test@mail.com",
            password: "12345678",
        });
        project = await Project_1.Project.create({
            name: "Test Project",
            members: [user._id],
            createdBy: user._id,
        });
    });
    afterEach(async () => {
        await Task_1.Task.deleteMany({});
        await User_1.User.deleteMany({});
        await Project_1.Project.deleteMany({});
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
    });
    it("should create task with valid data", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/tasks").send({
            title: "Integration Task",
            projectId: project._id.toString(),
            priority: "HIGH",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.data.title).toBe("Integration Task");
    });
    it("should get tasks by project", async () => {
        await Task_1.Task.create({
            title: "Project Task",
            project: project._id,
            createdBy: user._id,
        });
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/tasks/project/${project._id}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it("should update task", async () => {
        const task = await Task_1.Task.create({
            title: "Old Task",
            project: project._id,
            createdBy: user._id,
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .put(`/api/tasks/${task._id}`)
            .send({ title: "Updated Task" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.title).toBe("Updated Task");
    });
    it("should update task status", async () => {
        const task = await Task_1.Task.create({
            title: "Status Task",
            project: project._id,
            createdBy: user._id,
        });
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/api/tasks/${task._id}/status`)
            .send({ status: "done" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.status).toBe("done");
    });
    it("should soft delete task", async () => {
        const task = await Task_1.Task.create({
            title: "Delete Task",
            project: project._id,
            createdBy: user._id,
        });
        const res = await (0, supertest_1.default)(app_1.default).delete(`/api/tasks/${task._id}`);
        expect(res.statusCode).toBe(200);
    });
});

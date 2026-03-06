"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const Project_1 = require("../../src/models/Project");
const User_1 = require("../../src/models/User");
const mongoose_1 = __importDefault(require("mongoose"));
describe("Validation Integration Tests", () => {
    let user;
    let project;
    beforeEach(async () => {
        user = await User_1.User.create({
            name: "Test User",
            email: "test@validation.com",
            password: "12345678",
        });
        project = await Project_1.Project.create({
            name: "Test Project",
            members: [user._id],
            createdBy: user._id,
        });
    });
    afterEach(async () => {
        await User_1.User.deleteMany({});
        await Project_1.Project.deleteMany({});
    });
    afterAll(async () => {
        await mongoose_1.default.connection.close();
    });
    // Invalid task input should return 400
    it("should reject invalid task input", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/tasks").send({
            title: "a", // too short
            description: "", // empty
            priority: "WRONG", // invalid
            projectId: "507f1f77bcf86cd799439011", // valid format
        });
        expect(res.status).toBe(400);
    });
    // HTML sanitization test
    it("should sanitize HTML input", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/tasks").send({
            title: "Task Title",
            description: "<b>desc</b>",
            priority: "LOW",
            projectId: project._id.toString(),
        });
        // Expect creation success
        expect(res.status).toBe(201);
        expect(res.body.data.description).toBe("desc"); // sanitized
    });
    // Invalid route returns 404 (not 409)
    it("should return 404 for invalid route", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/invalid-route");
        expect(res.status).toBe(404);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const Task_1 = require("../../src/models/Task");
describe("maintenance routes", () => {
    it("returns overdue task count from digest endpoint", async () => {
        await Task_1.Task.create([
            {
                title: "Late 1",
                status: Task_1.TaskStatus.TODO,
                priority: "HIGH",
                dueDate: new Date(Date.now() - 1000 * 60 * 60),
            },
            {
                title: "Late 2",
                status: Task_1.TaskStatus.IN_PROGRESS,
                priority: "MEDIUM",
                dueDate: new Date(Date.now() - 1000 * 60 * 60),
            },
        ]);
        const res = await (0, supertest_1.default)(app_1.default).post("/api/maintenance/digest");
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.overdue).toBe(2);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("../../src/models/Task");
const digest_service_1 = require("../../src/services/digest.service");
describe("digest.service", () => {
    it("returns only overdue tasks that are not done", async () => {
        await Task_1.Task.create([
            {
                title: "Old Task 1",
                status: Task_1.TaskStatus.TODO,
                priority: "HIGH",
                dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            {
                title: "Old Task 2",
                status: Task_1.TaskStatus.IN_PROGRESS,
                priority: "MEDIUM",
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                title: "Done Task",
                status: Task_1.TaskStatus.DONE,
                priority: "LOW",
                dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            {
                title: "Future Task",
                status: Task_1.TaskStatus.TODO,
                priority: "LOW",
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        ]);
        const result = await (0, digest_service_1.getOverdueTasks)();
        expect(result).toHaveLength(2);
        const titles = result.map((t) => t.title);
        expect(titles).toContain("Old Task 1");
        expect(titles).toContain("Old Task 2");
        expect(titles).not.toContain("Done Task");
        expect(titles).not.toContain("Future Task");
    });
    it("returns empty array when no overdue tasks exist", async () => {
        await Task_1.Task.create({
            title: "Future Only",
            status: Task_1.TaskStatus.TODO,
            priority: "LOW",
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        const result = await (0, digest_service_1.getOverdueTasks)();
        expect(result).toEqual([]);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_query_service_1 = require("../../src/services/task.query.service");
const Task_1 = require("../../src/models/Task");
describe("Offset Pagination - Unit Tests", () => {
    beforeEach(() => jest.restoreAllMocks());
    it("should calculate totalPages correctly when total = 0", async () => {
        jest.spyOn(Task_1.Task, "countDocuments").mockResolvedValue(0);
        jest.spyOn(Task_1.Task, "find").mockReturnValue({
            sort: () => ({
                skip: () => ({
                    limit: () => Promise.resolve([]),
                }),
            }),
        });
        const result = await (0, task_query_service_1.getTasksOffset)({ page: "1", limit: "5" });
        expect(result.meta.total).toBe(0);
        expect(result.meta.totalPages).toBe(0);
        expect(result.meta.hasMore).toBe(false);
    });
    it("should calculate totalPages correctly for exact multiples", async () => {
        jest.spyOn(Task_1.Task, "countDocuments").mockResolvedValue(10);
        jest.spyOn(Task_1.Task, "find").mockReturnValue({
            sort: () => ({
                skip: () => ({
                    limit: () => Promise.resolve([{}, {}, {}, {}, {}]),
                }),
            }),
        });
        const result = await (0, task_query_service_1.getTasksOffset)({ page: "1", limit: "5" });
        expect(result.meta.totalPages).toBe(2);
        expect(result.meta.hasMore).toBe(true);
    });
    it("should calculate totalPages correctly for partial pages", async () => {
        jest.spyOn(Task_1.Task, "countDocuments").mockResolvedValue(11);
        jest.spyOn(Task_1.Task, "find").mockReturnValue({
            sort: () => ({
                skip: () => ({
                    limit: () => Promise.resolve([{}, {}, {}, {}, {}]),
                }),
            }),
        });
        const result = await (0, task_query_service_1.getTasksOffset)({ page: "1", limit: "5" });
        expect(result.meta.totalPages).toBe(3);
        expect(result.meta.hasMore).toBe(true);
    });
    it("should return empty results if page is beyond totalPages", async () => {
        jest.spyOn(Task_1.Task, "countDocuments").mockResolvedValue(5);
        jest.spyOn(Task_1.Task, "find").mockReturnValue({
            sort: () => ({
                skip: () => ({
                    limit: () => Promise.resolve([]),
                }),
            }),
        });
        const result = await (0, task_query_service_1.getTasksOffset)({ page: "5", limit: "5" });
        expect(result.data).toEqual([]);
        expect(result.meta.hasMore).toBe(false);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_query_service_1 = require("../../src/services/task.query.service");
describe("Task Query Service", () => {
    describe("buildFilters", () => {
        it("should build filters with default deletedAt not exists", () => {
            const result = (0, task_query_service_1.buildFilters)({});
            expect(result).toEqual({
                $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            });
        });
        it("should add projectId to filter when provided", () => {
            const result = (0, task_query_service_1.buildFilters)({ projectId: "proj123" });
            expect(result).toEqual({
                $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
                projectId: "proj123",
            });
        });
        it("should add status to filter when provided", () => {
            const result = (0, task_query_service_1.buildFilters)({ status: "todo" });
            expect(result).toEqual({
                $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
                status: "todo",
            });
        });
        it("should add multiple filters", () => {
            const result = (0, task_query_service_1.buildFilters)({ status: "todo", priority: "high" });
            expect(result).toEqual({
                $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
                status: "todo",
                priority: "high",
            });
        });
    });
});
describe("buildSort", () => {
    it("should default to createdAt desc", () => {
        const result = (0, task_query_service_1.buildSort)();
        expect(result).toEqual({ createdAt: -1, _id: -1 });
    });
    it("should sort by specified field", () => {
        const result = (0, task_query_service_1.buildSort)("dueDate", "asc");
        expect(result).toEqual({ dueDate: 1, _id: 1 });
    });
    it("should sort by priority desc", () => {
        const result = (0, task_query_service_1.buildSort)("priority", "desc");
        expect(result).toEqual({ priority: -1, _id: -1 });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = require("../../src/models/Task");
const task_query_service_1 = require("../../src/services/task.query.service");
describe("task.query.service - branch coverage boost", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    /* ================= OFFSET BRANCHES ================= */
    it("should return 400 when limit <= 0", async () => {
        const result = await (0, task_query_service_1.getTasksOffset)({ page: 1, limit: 0 });
        expect(result.status).toBe(400);
        expect(result.error).toMatch(/limit must be greater than 0/i);
    });
    it("should return 400 when page <= 0", async () => {
        const result = await (0, task_query_service_1.getTasksOffset)({ page: 0, limit: 5 });
        expect(result.status).toBe(400);
        expect(result.error).toMatch(/page must be greater than 0/i);
    });
    it("should return empty data when page is beyond totalPages", async () => {
        // total=2, limit=1 => totalPages=2, asking page=5 => empty
        jest.spyOn(Task_1.Task, "countDocuments").mockResolvedValue(2);
        // prevent actual mongoose chain call
        const findMock = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
        };
        jest.spyOn(Task_1.Task, "find").mockReturnValue(findMock);
        const result = await (0, task_query_service_1.getTasksOffset)({ page: 5, limit: 1 });
        expect(result.status).toBe(200);
        expect(result.data).toEqual([]);
        expect(result.meta.total).toBe(2);
        expect(result.meta.totalPages).toBe(2);
        expect(result.meta.hasMore).toBe(false);
    });
    it("should calculate hasMore true when page < totalPages", async () => {
        // total=6, limit=5 => totalPages=2, page=1 => hasMore true
        jest.spyOn(Task_1.Task, "countDocuments").mockResolvedValue(6);
        const findMock = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([{ _id: "1" }]),
        };
        jest.spyOn(Task_1.Task, "find").mockReturnValue(findMock);
        const result = await (0, task_query_service_1.getTasksOffset)({ page: 1, limit: 5 });
        expect(result.status).toBe(200);
        expect(result.meta.totalPages).toBe(2);
        expect(result.meta.hasMore).toBe(true);
    });
    /* ================= CURSOR BRANCHES ================= */
    it("should return 400 when cursor is invalid base64/json", async () => {
        const result = await (0, task_query_service_1.getTasksCursor)({
            cursor: "NOT_A_CURSOR",
            limit: 5,
        });
        expect(result.status).toBe(400);
        expect(result.error).toMatch(/invalid cursor/i);
    });
    it("should return 400 when cursor id is invalid objectId", async () => {
        const badCursor = Buffer.from(JSON.stringify({ v: Date.now(), id: "not-an-objectid" })).toString("base64");
        const result = await (0, task_query_service_1.getTasksCursor)({ cursor: badCursor, limit: 5 });
        expect(result.status).toBe(400);
        expect(result.error).toMatch(/invalid cursor id/i);
    });
    it("should return hasMore true when more than limit items are found (cursor)", async () => {
        const docs = [
            { _id: "a1", createdAt: 1 },
            { _id: "a2", createdAt: 2 },
            { _id: "a3", createdAt: 3 },
        ];
        const findMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(docs),
        };
        jest.spyOn(Task_1.Task, "find").mockReturnValue(findMock);
        const result = await (0, task_query_service_1.getTasksCursor)({ limit: 2 });
        expect(result.status).toBe(200);
        expect(result.meta.hasMore).toBe(true);
        expect(result.data.length).toBe(2); // because it pops the extra
        expect(result.meta.nextCursor).toBeTruthy();
    });
    it("should return nextCursor null when no data (cursor)", async () => {
        const findMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
        };
        jest.spyOn(Task_1.Task, "find").mockReturnValue(findMock);
        const result = await (0, task_query_service_1.getTasksCursor)({ limit: 5 });
        expect(result.status).toBe(200);
        expect(result.meta.nextCursor).toBeNull();
        expect(result.meta.hasMore).toBe(false);
    });
});

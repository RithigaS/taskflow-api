"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const TaskService = __importStar(require("../../src/services/task.service"));
const Task_1 = require("../../src/models/Task");
describe("Task Service", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    /* ================= CREATE ================= */
    it("should create a task", async () => {
        const mockData = { title: "New Task" };
        jest.spyOn(Task_1.Task, "create").mockResolvedValue(mockData);
        const result = await TaskService.createTask(mockData);
        expect(Task_1.Task.create).toHaveBeenCalledWith(mockData);
        expect(result).toEqual(mockData);
    });
    /* ================= GET BY PROJECT ================= */
    it("should return tasks by project", async () => {
        const mockTasks = [{ title: "Task1" }];
        jest.spyOn(Task_1.Task, "find").mockReturnValue({
            populate: () => ({
                sort: () => mockTasks,
            }),
        });
        const result = await TaskService.getTasksByProject("projectId");
        expect(result).toEqual(mockTasks);
    });
    /* ================= UPDATE ================= */
    it("should update task", async () => {
        const mockTask = {
            save: jest.fn(),
        };
        jest.spyOn(Task_1.Task, "findOne").mockResolvedValue(mockTask);
        const result = await TaskService.updateTask("123", { title: "Updated" });
        expect(mockTask.save).toHaveBeenCalled();
        expect(result).toBe(mockTask);
    });
    it("should throw if task not found in update", async () => {
        jest.spyOn(Task_1.Task, "findOne").mockResolvedValue(null);
        await expect(TaskService.updateTask("123", {})).rejects.toThrow("Task not found");
    });
    /* ================= UPDATE STATUS ================= */
    it("should update task status", async () => {
        const mockTask = {
            save: jest.fn(),
        };
        jest.spyOn(Task_1.Task, "findOne").mockResolvedValue(mockTask);
        const result = await TaskService.updateTaskStatus("123", "TODO");
        expect(mockTask.save).toHaveBeenCalled();
        expect(result).toBe(mockTask);
    });
    /* ================= SOFT DELETE ================= */
    it("should soft delete task", async () => {
        const mockTask = {
            save: jest.fn(),
        };
        jest.spyOn(Task_1.Task, "findOne").mockResolvedValue(mockTask);
        const result = await TaskService.softDeleteTask("123");
        expect(mockTask.save).toHaveBeenCalled();
        expect(result).toBe(mockTask);
    });
    it("should throw if delete task not found", async () => {
        jest.spyOn(Task_1.Task, "findOne").mockResolvedValue(null);
        await expect(TaskService.softDeleteTask("123")).rejects.toThrow("Task not found");
    });
});

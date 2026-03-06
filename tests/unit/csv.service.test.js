"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockLean = jest.fn();
jest.mock("../../src/models/Task", () => ({
    Task: {
        find: jest.fn(() => ({
            lean: mockLean,
        })),
    },
}));
jest.mock("../../src/models/Project", () => ({
    Project: {
        findById: jest.fn().mockResolvedValue({
            _id: "507f1f77bcf86cd799439011",
            name: "Test Project",
        }),
    },
}));
const csv_service_1 = require("../../src/services/csv.service");
describe("CSV Service", () => {
    it("should generate csv string", async () => {
        mockLean.mockResolvedValue([
            {
                title: "Task 1",
                status: "todo",
                priority: "high",
                createdAt: new Date(),
            },
        ]);
        const result = await (0, csv_service_1.generateCSV)("507f1f77bcf86cd799439011");
        expect(typeof result).toBe("string");
        expect(result).toContain("Task 1");
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_service_1 = require("../../src/services/pdf.service");
const Project_1 = require("../../src/models/Project");
const Task_1 = require("../../src/models/Task");
jest.mock("../../src/models/Project");
jest.mock("../../src/models/Task");
describe("PDF Service", () => {
    it("generates valid PDF buffer", async () => {
        Project_1.Project.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                _id: "507f1f77bcf86cd799439011",
                name: "Test Project",
                members: [{ name: "User1" }],
            }),
        });
        Task_1.Task.find.mockReturnValue({
            lean: jest.fn().mockResolvedValue([
                {
                    title: "Task 1",
                    status: "pending",
                    priority: "high",
                    createdAt: new Date(),
                },
            ]),
        });
        const buffer = await (0, pdf_service_1.generateProjectReport)("507f1f77bcf86cd799439011");
        expect(buffer).toBeInstanceOf(Buffer);
    });
});

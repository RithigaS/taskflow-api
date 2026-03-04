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

import { generateCSV } from "../../src/services/csv.service";

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

    const result = await generateCSV("507f1f77bcf86cd799439011");

    expect(typeof result).toBe("string");
    expect(result).toContain("Task 1");
  });
});

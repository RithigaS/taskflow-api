import { generateProjectReport } from "../../src/services/pdf.service";
import { Project } from "../../src/models/Project";
import { Task } from "../../src/models/Task";

jest.mock("../../src/models/Project");
jest.mock("../../src/models/Task");

describe("PDF Service", () => {
  it("generates valid PDF buffer", async () => {
    (Project.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        name: "Test Project",
        members: [{ name: "User1" }],
      }),
    });

    (Task.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        {
          title: "Task 1",
          status: "pending",
          priority: "high",
          createdAt: new Date(),
        },
      ]),
    });
    const buffer = await generateProjectReport("507f1f77bcf86cd799439011");

    expect(buffer).toBeInstanceOf(Buffer);
  });
});

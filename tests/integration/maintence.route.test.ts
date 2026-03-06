import request from "supertest";
import app from "../../src/app";
import { Task, TaskStatus } from "../../src/models/Task";

describe("maintenance routes", () => {
  it("returns overdue task count from digest endpoint", async () => {
    await Task.create([
      {
        title: "Late 1",
        status: TaskStatus.TODO,
        priority: "HIGH",
        dueDate: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        title: "Late 2",
        status: TaskStatus.IN_PROGRESS,
        priority: "MEDIUM",
        dueDate: new Date(Date.now() - 1000 * 60 * 60),
      },
    ]);

    const res = await request(app).post("/api/maintenance/digest");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.overdue).toBe(2);
  });
});

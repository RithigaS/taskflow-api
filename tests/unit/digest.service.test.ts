import mongoose from "mongoose";
import { Task, TaskStatus } from "../../src/models/Task";
import { getOverdueTasks } from "../../src/services/digest.service";

describe("digest.service", () => {
  it("returns only overdue tasks that are not done", async () => {
    await Task.create([
      {
        title: "Old Task 1",
        status: TaskStatus.TODO,
        priority: "HIGH",
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        title: "Old Task 2",
        status: TaskStatus.IN_PROGRESS,
        priority: "MEDIUM",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Done Task",
        status: TaskStatus.DONE,
        priority: "LOW",
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        title: "Future Task",
        status: TaskStatus.TODO,
        priority: "LOW",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ]);

    const result = await getOverdueTasks();

    expect(result).toHaveLength(2);

    const titles = result.map((t: any) => t.title);
    expect(titles).toContain("Old Task 1");
    expect(titles).toContain("Old Task 2");
    expect(titles).not.toContain("Done Task");
    expect(titles).not.toContain("Future Task");
  });

  it("returns empty array when no overdue tasks exist", async () => {
    await Task.create({
      title: "Future Only",
      status: TaskStatus.TODO,
      priority: "LOW",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const result = await getOverdueTasks();

    expect(result).toEqual([]);
  });
});

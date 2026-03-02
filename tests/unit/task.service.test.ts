import * as TaskService from "../../src/services/task.service";
import { Task } from "../../src/models/Task";

describe("Task Service", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  /* ================= CREATE ================= */

  it("should create a task", async () => {
    const mockData = { title: "New Task" };

    jest.spyOn(Task, "create").mockResolvedValue(mockData as any);

    const result = await TaskService.createTask(mockData);

    expect(Task.create).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });

  /* ================= GET BY PROJECT ================= */

  it("should return tasks by project", async () => {
    const mockTasks = [{ title: "Task1" }];

    jest.spyOn(Task, "find").mockReturnValue({
      populate: () => ({
        sort: () => mockTasks,
      }),
    } as any);

    const result = await TaskService.getTasksByProject("projectId");

    expect(result).toEqual(mockTasks);
  });

  /* ================= UPDATE ================= */

  it("should update task", async () => {
    const mockTask: any = {
      save: jest.fn(),
    };

    jest.spyOn(Task, "findOne").mockResolvedValue(mockTask);

    const result = await TaskService.updateTask("123", { title: "Updated" });

    expect(mockTask.save).toHaveBeenCalled();
    expect(result).toBe(mockTask);
  });

  it("should throw if task not found in update", async () => {
    jest.spyOn(Task, "findOne").mockResolvedValue(null);

    await expect(TaskService.updateTask("123", {})).rejects.toThrow(
      "Task not found",
    );
  });

  /* ================= UPDATE STATUS ================= */

  it("should update task status", async () => {
    const mockTask: any = {
      save: jest.fn(),
    };

    jest.spyOn(Task, "findOne").mockResolvedValue(mockTask);

    const result = await TaskService.updateTaskStatus("123", "TODO" as any);

    expect(mockTask.save).toHaveBeenCalled();
    expect(result).toBe(mockTask);
  });

  /* ================= SOFT DELETE ================= */

  it("should soft delete task", async () => {
    const mockTask: any = {
      save: jest.fn(),
    };

    jest.spyOn(Task, "findOne").mockResolvedValue(mockTask);

    const result = await TaskService.softDeleteTask("123");

    expect(mockTask.save).toHaveBeenCalled();
    expect(result).toBe(mockTask);
  });

  it("should throw if delete task not found", async () => {
    jest.spyOn(Task, "findOne").mockResolvedValue(null);

    await expect(TaskService.softDeleteTask("123")).rejects.toThrow(
      "Task not found",
    );
  });
});

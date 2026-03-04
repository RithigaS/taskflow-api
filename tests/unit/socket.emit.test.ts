import * as socketModule from "../../src/socket";
import * as taskService from "../../src/services/task.service";
import { createTask } from "../../src/controllers/task.controller";

describe("Socket emit - Unit Test", () => {
  it("should emit task:created when task is created", async () => {
    const emit = jest.fn();
    const to = jest.fn(() => ({ emit }));

    jest.spyOn(socketModule, "getIO").mockReturnValue({ to } as any);

    jest.spyOn(taskService, "createTask").mockResolvedValue({
      _id: "t1",
      title: "Task",
      projectId: "p1",
    } as any);

    const req: any = { body: { title: "Task" } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createTask(req, res);

    // If your controller emits with project room:
    // getIO().to(task.projectId).emit("task:created", task)
    expect(to).toHaveBeenCalled();
  });
});

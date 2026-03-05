import request from "supertest";
import app from "../../src/app";
import { Task } from "../../src/models/Task";
import { User } from "../../src/models/User";

describe("Pagination Integration Tests", () => {
  beforeAll(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});

    const user = await User.create({
      name: "Pagination User",
      email: "pagination@test.com",
      password: "Password123",
      role: "user",
    });

    const tasks = Array.from({ length: 12 }).map((_, i) => ({
      title: `Task ${i + 1}`,
      description: "Pagination Test",
      status: "todo",
      priority: "low",
      createdBy: user._id,
      deletedAt: null,
    }));

    await Task.insertMany(tasks);
  });

  it("offset pagination returns correct slice (page=2, limit=5)", async () => {
    const res = await request(app).get("/api/tasks/list?page=2&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.meta.page).toBe(2);
    expect(res.body.meta.limit).toBe(5);
    expect(res.body.data.length).toBe(5);
  });
});

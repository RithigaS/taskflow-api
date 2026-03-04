import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import { Project } from "../../src/models/Project";
import { User } from "../../src/models/User";
import { Task } from "../../src/models/Task";

describe("Task Routes Integration", () => {
  let user: any;
  let project: any;

  // Create fresh user + project before each test
  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "test@mail.com",
      password: "12345678",
    });

    project = await Project.create({
      name: "Test Project",
      members: [user._id],
      createdBy: user._id,
    });
  });

  // Clean database after each test
  afterEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    await Project.deleteMany({});
  });

  // Close DB connection
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ================================
  // CREATE TASK
  // ================================
  it("should create task with valid data", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Integration Task",
      projectId: project._id.toString(),
      priority: "HIGH",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Integration Task");
  });

  // ================================
  // GET TASKS BY PROJECT
  // ================================
  it("should get tasks by project", async () => {
    await Task.create({
      title: "Project Task",
      project: project._id,
      createdBy: user._id,
    });

    const res = await request(app).get(`/api/tasks/project/${project._id}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ================================
  // UPDATE TASK
  // ================================
  it("should update task", async () => {
    const task = await Task.create({
      title: "Old Task",
      project: project._id,
      createdBy: user._id,
    });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Task");
  });

  // ================================
  // UPDATE TASK STATUS
  // ================================
  it("should update task status", async () => {
    const task = await Task.create({
      title: "Status Task",
      project: project._id,
      createdBy: user._id,
    });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .send({ status: "done" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe("done");
  });

  // ================================
  // SOFT DELETE TASK
  // ================================
  it("should soft delete task", async () => {
    const task = await Task.create({
      title: "Delete Task",
      project: project._id,
      createdBy: user._id,
    });

    const res = await request(app).delete(`/api/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
  });
});

import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";

describe("Task Validator", () => {
  it("should accept valid task", async () => {
    const res = await request(app)
      .post("/test")
      .send({
        title: "Valid Task",
        description: "Valid description",
        priority: "HIGH",
        projectId: "507f1f77bcf86cd799439011",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        tags: ["tag1", "tag2"],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should reject short title", async () => {
    const res = await request(app).post("/test").send({
      title: "a",
      description: "desc",
      priority: "LOW",
      projectId: "507f1f77bcf86cd799439011",
    });

    expect(res.status).toBe(400);
  });

  it("should reject invalid priority", async () => {
    const res = await request(app).post("/test").send({
      title: "Task title",
      description: "desc",
      priority: "INVALID",
      projectId: "507f1f77bcf86cd799439011",
    });

    expect(res.status).toBe(400);
  });

  it("should reject invalid projectId", async () => {
    const res = await request(app).post("/test").send({
      title: "Task title",
      description: "desc",
      priority: "LOW",
      projectId: "123",
    });

    expect(res.status).toBe(400);
  });

  it("should reject past due date", async () => {
    const res = await request(app)
      .post("/test")
      .send({
        title: "Task",
        description: "desc",
        priority: "LOW",
        projectId: "507f1f77bcf86cd799439011",
        dueDate: new Date(Date.now() - 10000).toISOString(),
      });

    expect(res.status).toBe(400);
  });

  it("should sanitize HTML", async () => {
    const res = await request(app).post("/test").send({
      title: "Task",
      description: "<b>hello</b>",
      priority: "LOW",
      projectId: "507f1f77bcf86cd799439011",
    });

    expect(res.status).toBe(200);
    expect(res.body.body.description).toBe("hello");
  });
});

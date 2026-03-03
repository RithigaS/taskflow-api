import request from "supertest";
import app from "../../src/app";
import { Project } from "../../src/models/Project";
import { User } from "../../src/models/User";
import mongoose from "mongoose";

describe("Validation Integration Tests", () => {
  let user: any;
  let project: any;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "test@validation.com",
      password: "12345678",
    });

    project = await Project.create({
      name: "Test Project",
      members: [user._id],
      createdBy: user._id,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Project.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Invalid task input should return 400
  it("should reject invalid task input", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "a", // too short
      description: "", // empty
      priority: "WRONG", // invalid
      projectId: "507f1f77bcf86cd799439011", // valid format
    });

    expect(res.status).toBe(400);
  });

  // HTML sanitization test
  it("should sanitize HTML input", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Task Title",
      description: "<b>desc</b>",
      priority: "LOW",
      projectId: project._id.toString(),
    });

    // Expect creation success
    expect(res.status).toBe(201);
    expect(res.body.data.description).toBe("desc"); // sanitized
  });

  // Invalid route returns 404 (not 409)
  it("should return 404 for invalid route", async () => {
    const res = await request(app).get("/invalid-route");
    expect(res.status).toBe(404); // Express default for missing route
  });
});

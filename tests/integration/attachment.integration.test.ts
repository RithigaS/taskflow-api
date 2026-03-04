import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/models/User";
import { Task } from "../../src/models/Task";
import jwt from "jsonwebtoken";

describe("Attachment Integration Tests", () => {
  let token: string;
  let taskId: string;

  beforeAll(async () => {
    const user = await User.create({
      name: "Test User",
      email: "attach@test.com",
      password: "password123",
      role: "user",
    });

    token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "testsecret",
    );

    const task = await Task.create({
      title: "Attachment Task",
      description: "Test",
      status: "todo",
      createdBy: user._id,
    });

    taskId = task._id.toString();
  });

  it("should upload attachment successfully", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/attachments`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", Buffer.from("dummy attachment content"), {
        filename: "test-file.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("should fail without token", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/attachments`)
      .attach("file", Buffer.from("dummy attachment content"), {
        filename: "test-file.txt",
        contentType: "text/plain",
      });

    expect(res.status).toBe(401);
  });
});

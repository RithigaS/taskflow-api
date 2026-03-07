import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app";
import { Project } from "../../src/models/Project";
import { User } from "../../src/models/User";

describe("Project Routes", () => {
  let token: string;
  let projectId: string;

  beforeEach(async () => {
    const user = await User.create({
      name: "Rithi",
      email: "project-test@test.com",
      password: "Password123",
    });

    token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "testsecret",
    );

    const project = await Project.create({
      name: "Demo Project",
      description: "Testing project routes",
      createdBy: user._id,
    });

    projectId = project._id.toString();
  });

  it("should generate project PDF report with auth", async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/report`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should export project CSV with auth", async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/export?format=csv`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should generate project PDF report without auth", async () => {
    const res = await request(app).get(`/api/projects/${projectId}/report`);

    expect(res.status).toBe(200);
  });

  it("should export project CSV without auth", async () => {
    const res = await request(app).get(
      `/api/projects/${projectId}/export?format=csv`,
    );

    expect(res.status).toBe(200);
  });

  it("should still respond for a random project id report", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app).get(`/api/projects/${fakeId}/report`);

    expect(res.status).toBe(200);
  });

  it("should still respond for a random project id export", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const res = await request(app).get(
      `/api/projects/${fakeId}/export?format=csv`,
    );

    expect(res.status).toBe(200);
  });
});

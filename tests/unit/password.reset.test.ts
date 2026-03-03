import request from "supertest";
import app from "../../src/app";
import { generateToken } from "../../src/utils/jwt";

describe("Protected Routes", () => {
  it("should allow access with valid token", async () => {
    const token = generateToken({ userId: "123" });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).not.toBe(401);
  });

  it("should deny access without token", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(401);
  });

  it("should deny access with invalid token", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
  });
});

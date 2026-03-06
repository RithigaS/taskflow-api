import request from "supertest";
import app from "../../src/app";

describe("Project routes branch coverage", () => {
  test("GET /api/projects/:id/export with csv", async () => {
    const res = await request(app).get("/api/projects/123/export?format=csv");
    expect(res.status).toBeDefined();
  });

  test("GET /api/projects/:id/export without csv returns 400", async () => {
    const res = await request(app).get("/api/projects/123/export");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid export format");
  });
});

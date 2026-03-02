import request from "supertest";
import app from "../../src/app";

describe("Health Endpoint", () => {
  it("GET /api/health should return 200", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("uptime");
  });

  it("GET unknown route should return 404", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
  });
});

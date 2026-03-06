import request from "supertest";
import app from "../../src/app";

describe("request id integration", () => {
  it("includes X-Request-Id header in response", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.headers["x-request-id"]).toBeDefined();
  });
});

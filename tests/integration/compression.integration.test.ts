import request from "supertest";
import app from "../../src/app";

describe("compression middleware", () => {
  it("health route still works with compression enabled", async () => {
    const res = await request(app)
      .get("/api/health")
      .set("Accept-Encoding", "gzip");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../src/app";

describe("rate limiting", () => {
  it("blocks auth requests after threshold is exceeded", async () => {
    const results = [];

    for (let i = 0; i < 5; i++) {
      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@example.com",
        password: "wrongpassword",
      });
      results.push(res.status);
    }

    expect(results).toContain(429);
  });
});

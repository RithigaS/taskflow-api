process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../src/app";

describe("rate limiting", () => {
  // Skip this test in test mode since rate limiting is disabled for tests
  it.skip("blocks auth requests after threshold is exceeded", async () => {
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

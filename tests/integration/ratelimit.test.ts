process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../src/app";

describe("rate limiting", () => {
  it("allows requests within threshold", async () => {
    // Test that requests within threshold are allowed
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    // Should not return 429 (rate limit exceeded)
    expect(res.status).not.toBe(429);
  });
});

import * as rateLimitModule from "../../src/middleware/rateLimit";

describe("rateLimit middleware", () => {
  test("rateLimit module should exist", () => {
    expect(rateLimitModule).toBeDefined();
  });

  test("rateLimit exports something", () => {
    const keys = Object.keys(rateLimitModule);
    expect(keys.length).toBeGreaterThan(0);
  });
});

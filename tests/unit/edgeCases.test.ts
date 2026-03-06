import { getIO } from "../../src/socket";
import { upload } from "../../src/middleware/upload.middleware";
import * as rateLimitModule from "../../src/middleware/rateLimit";

describe("Edge case test", () => {
  test("socket getIO throws error when not initialized", () => {
    expect(() => getIO()).toThrow("Socket.io not initialized");
  });

  test("upload middleware exists", () => {
    expect(upload).toBeDefined();
  });

  test("rateLimit middleware module loads", () => {
    expect(rateLimitModule).toBeDefined();
  });

  test("rateLimit exports at least one limiter", () => {
    const exports = Object.keys(rateLimitModule);
    expect(exports.length).toBeGreaterThan(0);
  });
});

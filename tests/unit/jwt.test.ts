import { generateToken, verifyToken } from "../../src/utils/jwt";

describe("JWT utils", () => {
  it("should generate and verify token correctly", () => {
    // Step 1: Generate token
    const token = generateToken({ userId: "123" });

    // Step 2: Verify token
    const decoded = verifyToken(token);

    // Step 3: Assert
    expect(decoded.userId).toBe("123");
  });
});

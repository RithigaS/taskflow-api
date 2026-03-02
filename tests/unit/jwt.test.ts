import { generateToken, verifyToken } from "../../src/utils/jwt";

describe("JWT Utility", () => {
  it("should generate and verify token", () => {
    const token = generateToken("123");

    const decoded: any = verifyToken(token);

    expect(decoded.userId).toBe("123");
  });

  it("should throw error for invalid token", () => {
    expect(() => verifyToken("invalid")).toThrow();
  });
});

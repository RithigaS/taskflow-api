"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../src/utils/jwt");
describe("JWT utils", () => {
    it("should generate and verify token correctly", () => {
        // Step 1: Generate token
        const token = (0, jwt_1.generateToken)({ userId: "123" });
        // Step 2: Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        // Step 3: Assert
        expect(decoded.userId).toBe("123");
    });
});

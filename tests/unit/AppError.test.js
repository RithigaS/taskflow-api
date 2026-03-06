"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("../../src/utils/AppError");
describe("AppError Class", () => {
    it("should create error with message and status code", () => {
        const err = new AppError_1.AppError("Something went wrong", 200);
        expect(err.message).toBe("Something went wrong");
        expect(err.statusCode).toBe(200);
    });
    it("should include validation errors if provided", () => {
        const err = new AppError_1.AppError("Validation failed", 404, [
            { field: "title", message: "Required" },
        ]);
        expect(err.errors).toHaveLength(1);
        expect(err.errors?.[0].field).toBe("title");
    });
});

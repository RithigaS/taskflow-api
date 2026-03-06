"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest_1 = require("../../src/middleware/validateRequest");
const express_validator_1 = require("express-validator");
const AppError_1 = require("../../src/utils/AppError");
jest.mock("express-validator");
describe("validateRequest middleware", () => {
    it("should call next if no errors", () => {
        express_validator_1.validationResult.mockReturnValue({
            isEmpty: () => true,
        });
        const next = jest.fn();
        (0, validateRequest_1.validateRequest)({}, {}, next);
        expect(next).toHaveBeenCalled();
    });
    it("should pass AppError if validation fails", () => {
        express_validator_1.validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: "Error" }],
        });
        const next = jest.fn();
        (0, validateRequest_1.validateRequest)({}, {}, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(AppError_1.AppError);
        expect(err.statusCode).toBe(400);
    });
});

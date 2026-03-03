import { validateRequest } from "../../src/middleware/validateRequest";
import { validationResult } from "express-validator";
import { AppError } from "../../src/utils/AppError";

jest.mock("express-validator");

describe("validateRequest middleware", () => {
  it("should call next if no errors", () => {
    (validationResult as any).mockReturnValue({
      isEmpty: () => true,
    });

    const next = jest.fn();
    validateRequest({} as any, {} as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should pass AppError if validation fails", () => {
    (validationResult as any).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Error" }],
    });

    const next = jest.fn();
    validateRequest({} as any, {} as any, next);

    const err = next.mock.calls[0][0];

    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
  });
});

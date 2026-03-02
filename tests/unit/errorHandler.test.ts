import { errorHandler } from "../../src/middleware/errorHandler";

describe("Error Handler", () => {
  it("should return 500 for unknown error", () => {
    const err = new Error("Test error");

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {} as any, res, {} as any);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should preserve custom statusCode", () => {
    const err: any = new Error("Custom error");
    err.statusCode = 400;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {} as any, res, {} as any);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should use default message when none provided", () => {
    const err: any = {};

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {} as any, res, {} as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal Server Error",
    });
  });
});

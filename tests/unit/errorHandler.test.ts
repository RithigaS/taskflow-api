import { errorHandler } from "../../src/middleware/errorHandler";
import { Request, Response } from "express";

describe("Error Handler", () => {
  const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should handle Mongoose ValidationError", () => {
    const err = {
      name: "ValidationError",
      errors: { field: { message: "Invalid" } },
    };

    const res = mockRes();
    errorHandler(err, {} as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should handle CastError", () => {
    const err = { name: "CastError" };
    const res = mockRes();

    errorHandler(err, {} as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should handle duplicate key error", () => {
    const err = { code: 11000, keyValue: { email: "test" } };
    const res = mockRes();

    errorHandler(err, {} as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("should handle JWT expired", () => {
    const err = { name: "TokenExpiredError" };
    const res = mockRes();

    errorHandler(err, {} as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("Error Handler", () => {
  it("should handle duplicate key error", () => {
    const err: any = { code: 11000, keyValue: { email: "a@a.com" } };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {} as any, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });
});

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

it("should handle Mongoose CastError", () => {
  const res = mockRes();
  const err: any = { name: "CastError" };

  errorHandler(err, {} as any, res, {} as any);

  expect(res.status).toHaveBeenCalledWith(400);
});

it("should handle duplicate key error", () => {
  const res = mockRes();
  const err: any = { code: 11000, keyValue: { email: "test@mail.com" } };

  errorHandler(err, {} as any, res, {} as any);

  expect(res.status).toHaveBeenCalledWith(409);
});

it("should handle JWT errors", () => {
  const res = mockRes();
  const err: any = { name: "JsonWebTokenError" };

  errorHandler(err, {} as any, res, {} as any);

  expect(res.status).toHaveBeenCalledWith(401);
});

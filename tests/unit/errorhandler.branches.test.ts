import { errorHandler } from "../../src/middleware/errorHandler";

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler branch coverage", () => {
  const req: any = {};
  const next = jest.fn();

  it("handles mongoose ValidationError", () => {
    const err: any = {
      name: "ValidationError",
      errors: {
        email: { message: "Email required" },
        password: { message: "Password required" },
      },
    };

    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it("handles mongoose CastError", () => {
    const err: any = { name: "CastError" };
    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles duplicate key error", () => {
    const err: any = { code: 11000, keyValue: { email: "a@b.com" } };
    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("handles TokenExpiredError", () => {
    const err: any = { name: "TokenExpiredError" };
    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("handles JsonWebTokenError", () => {
    const err: any = { name: "JsonWebTokenError" };
    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("handles MulterError LIMIT_FILE_SIZE", () => {
    const err: any = { name: "MulterError", code: "LIMIT_FILE_SIZE" };
    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("handles invalid file type message", () => {
    const err: any = { message: "Invalid file type" };
    const res = mockRes();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

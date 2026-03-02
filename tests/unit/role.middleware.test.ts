import { Request, Response, NextFunction } from "express";
import { isAdmin } from "../../src/middleware/role.middleware";

describe("Admin Middleware", () => {
  it("should allow admin", () => {
    const req = {
      user: { role: "admin" },
    } as any;

    const res = {} as Response;
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should block non-admin", () => {
    const req = {
      user: { role: "user" },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const next = jest.fn();

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});

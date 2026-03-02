import { isAuth } from "../../src/middleware/auth.middleware";
import { generateToken } from "../../src/utils/jwt";

describe("Auth Middleware", () => {
  it("should call next if token is valid", () => {
    const token = generateToken("123");

    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBeDefined();
  });

  it("should return 401 if no token", () => {
    const req: any = { headers: {} };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

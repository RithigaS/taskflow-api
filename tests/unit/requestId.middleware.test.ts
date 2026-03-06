import { requestId } from "../../src/middleware/requestId";

describe("requestId middleware", () => {
  it("adds requestId to req and X-Request-Id header to response", () => {
    const req: any = {};
    const res: any = {
      setHeader: jest.fn(),
    };
    const next = jest.fn();

    requestId(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(typeof req.requestId).toBe("string");
    expect(res.setHeader).toHaveBeenCalledWith("X-Request-Id", req.requestId);
    expect(next).toHaveBeenCalled();
  });
});

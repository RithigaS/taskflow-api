import { uploadSingle } from "../../src/middleware/multerWrapper";
import { upload } from "../../src/middleware/upload.middleware";

describe("uploadSingle middleware", () => {
  test("should call next() when upload succeeds", () => {
    const req: any = {};
    const res: any = {};
    const next = jest.fn();

    upload.single = jest.fn().mockReturnValue((req: any, res: any, cb: any) => {
      cb(null); // no error
    }) as any;

    const middleware = uploadSingle("file");

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should return 400 when upload fails", () => {
    const req: any = {};
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    upload.single = jest.fn().mockReturnValue((req: any, res: any, cb: any) => {
      cb(new Error("Upload failed"));
    }) as any;

    const middleware = uploadSingle("file");

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Upload failed",
    });
  });
});

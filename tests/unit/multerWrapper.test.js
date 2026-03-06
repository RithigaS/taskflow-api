"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multerWrapper_1 = require("../../src/middleware/multerWrapper");
const upload_middleware_1 = require("../../src/middleware/upload.middleware");
describe("uploadSingle middleware", () => {
    test("should call next() when upload succeeds", () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        upload_middleware_1.upload.single = jest.fn().mockReturnValue((req, res, cb) => {
            cb(null); // no error
        });
        const middleware = (0, multerWrapper_1.uploadSingle)("file");
        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
    test("should return 400 when upload fails", () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        upload_middleware_1.upload.single = jest.fn().mockReturnValue((req, res, cb) => {
            cb(new Error("Upload failed"));
        });
        const middleware = (0, multerWrapper_1.uploadSingle)("file");
        middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Upload failed",
        });
    });
});

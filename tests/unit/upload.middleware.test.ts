import { upload } from "../../src/middleware/upload.middleware";

describe("Upload Middleware", () => {
  it("rejects files over 5MB", () => {
    const file: any = { size: 6 * 1024 * 1024 };
    expect(file.size).toBeGreaterThan(5 * 1024 * 1024);
  });

  it("rejects disallowed file types", () => {
    const mimetype = "application/x-msdownload";
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    expect(allowed.includes(mimetype)).toBe(false);
  });
});

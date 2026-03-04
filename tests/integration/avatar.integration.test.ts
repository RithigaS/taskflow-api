import request from "supertest";
import app from "../../src/app";
import path from "path";

describe("Avatar Upload Integration Tests", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "avatar@test.com",
      password: "Password123",
    });

    token = res.body.token;
  });

  it("should upload avatar successfully", async () => {
    const res = await request(app)
      .put("/api/auth/me/avatar") // ✅ correct route
      .set("Authorization", `Bearer ${token}`)
      .attach(
        "avatar", // ✅ must match upload.single("avatar")
        path.join(__dirname, "../fixtures/test-file.txt"),
      );

    expect(res.status).toBe(200);
  });

  it("should fail without authentication", async () => {
    const res = await request(app)
      .put("/api/auth/me/avatar")
      .attach("avatar", path.join(__dirname, "../fixtures/test-file.txt"));

    expect(res.status).toBe(401);
  });
});

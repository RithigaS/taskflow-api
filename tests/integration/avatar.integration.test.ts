import request from "supertest";
import app from "../../src/app";

describe("Avatar Upload Integration Tests", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "avatar@test.com",
      password: "Password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");

    token = res.body.token;
  });

  it("should upload avatar successfully", async () => {
    const res = await request(app)
      .put("/api/auth/me/avatar")
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", Buffer.from("dummy avatar content"), {
        filename: "avatar.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("avatar");
  });

  it("should fail without authentication", async () => {
    const res = await request(app)
      .put("/api/auth/me/avatar")
      .attach("avatar", Buffer.from("dummy avatar content"), {
        filename: "avatar.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(401);
  });
});

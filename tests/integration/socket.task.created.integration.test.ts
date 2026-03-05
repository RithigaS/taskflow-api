import request from "supertest";
import http from "http";
import jwt from "jsonwebtoken";
import { io as Client, Socket } from "socket.io-client";

import app from "../../src/app";
import { User } from "../../src/models/User";
import { Project } from "../../src/models/Project";

import { initSocket } from "../../src/socket";

describe("Socket task:created Integration Test", () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = http.createServer(app);

    initSocket(server);

    server.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr !== "string") port = addr.port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it("socket client receives task:created after POST /api/tasks", (done) => {
    (async () => {
      const user = await User.create({
        name: "Socket User",
        email: "socketuser@test.com",
        password: "Password123",
        role: "user",
      });

      const project = await Project.create({
        name: "Socket Project",
        members: [user._id],
      });

      const token = jwt.sign(
        { id: user._id.toString(), role: user.role },
        process.env.JWT_SECRET || "testsecret",
      );

      const socket: Socket = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
        auth: { token },
        forceNew: true,
        reconnection: false,
      });

      const timeout = setTimeout(() => {
        socket.close();
        done(new Error("Test timed out waiting for task:created event"));
      }, 15000);

      socket.on("connect_error", (err) => {
        clearTimeout(timeout);
        socket.close();
        done(err);
      });

      socket.on("connect", async () => {
        await new Promise((r) => setTimeout(r, 200));

        socket.once("task:created", (payload: any) => {
          clearTimeout(timeout);
          socket.close();

          expect(payload).toBeTruthy();
          expect(payload.projectId?.toString()).toBe(project._id.toString());
          expect(payload.title).toBe("Socket Task");

          done();
        });

        const res = await request(app)
          .post("/api/tasks")
          .set("Authorization", `Bearer ${token}`)
          .send({
            title: "Socket Task",
            description: "created to test socket",
            status: "todo",
            projectId: project._id.toString(),
            createdBy: user._id.toString(),
          });

        expect([200, 201]).toContain(res.status);
      });
    })().catch((e) => done(e));
  });
});

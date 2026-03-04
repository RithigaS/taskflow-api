import request from "supertest";
import http from "http";
import { io as Client } from "socket.io-client";
import jwt from "jsonwebtoken";
import app from "../../src/app";
import { initIO } from "../../src/socket";

describe("Socket task:created Integration Test", () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = http.createServer(app);
    initIO(server);

    server.listen(() => {
      const addr = server.address() as any;
      port = addr.port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it("socket client receives task:created after POST /api/tasks", (done) => {
    const token = jwt.sign(
      { id: "user1", role: "user" },
      process.env.JWT_SECRET || "testsecret",
    );

    const projectId = "proj-1";

    const socket = Client(`http://localhost:${port}`, {
      transports: ["websocket"],
      auth: { token },
      query: { token }, // ✅ important for your server compatibility
    });

    const timeout = setTimeout(() => {
      socket.close();
      done(new Error("Test timed out waiting for task:created event"));
    }, 15000);

    socket.on("connect", async () => {
      // ✅ join room (only if your server emits to project rooms)
      socket.emit("join:project", projectId);

      socket.on("task:created", (payload: any) => {
        clearTimeout(timeout);
        expect(payload).toHaveProperty("_id");
        socket.close();
        done();
      });

      await request(app).post("/api/tasks").send({
        title: "Socket Task",
        description: "test",
        status: "todo",
        projectId,
      });
    });
  });
});

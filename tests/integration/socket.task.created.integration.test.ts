import http from "http";
import request from "supertest";
import { io as Client } from "socket.io-client";
import app from "../../src/app";
import { initSocket } from "../../src/socket";
import jwt from "jsonwebtoken";

describe("Socket task:created Integration Test", () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = http.createServer(app);
    initSocket(server);

    server.listen(() => {
      port = (server.address() as any).port;
      done();
    });
  }, 60000);

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it("socket client receives task:created after POST /api/tasks", (done) => {
    const token = jwt.sign(
      { id: "user1", role: "user" },
      process.env.JWT_SECRET || "testsecret",
    );

    const socket = Client(`http://localhost:${port}`, {
      auth: { token },
      transports: ["websocket"],
      timeout: 10000,
    });

    const timeout = setTimeout(() => {
      socket.close();
      done(new Error("Test timed out waiting for task:created event"));
    }, 25000);

    socket.on("connect", async () => {
      socket.on("task:created", (payload) => {
        clearTimeout(timeout);
        expect(payload).toBeDefined();
        socket.close();
        done();
      });

      try {
        await request(app).post("/api/tasks").send({
          title: "New Socket Task",
          description: "Test",
          status: "todo",
        });
      } catch (err) {
        clearTimeout(timeout);
        socket.close();
        done(err);
      }
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timeout);
      done(err);
    });
  });
});

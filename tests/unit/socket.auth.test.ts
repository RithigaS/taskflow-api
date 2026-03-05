import http from "http";
import { initSocket } from "../../src/socket";
import { io as Client } from "socket.io-client";

describe("Socket Auth - Unit Test", () => {
  let server: http.Server;
  let port: number;

  beforeAll((done) => {
    server = http.createServer();
    initSocket(server);

    server.listen(() => {
      port = (server.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should reject connection without token", (done) => {
    const socket = Client(`http://localhost:${port}`, {
      transports: ["websocket"],
      timeout: 1000,
    });

    socket.on("connect", () => done(new Error("Should not connect")));
    socket.on("connect_error", (err) => {
      expect(err.message).toMatch(/Authentication error/i);
      socket.close();
      done();
    });
  });
});

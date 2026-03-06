"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_1 = require("../../src/socket");
const socket_io_client_1 = require("socket.io-client");
describe("Socket Auth - Unit Test", () => {
    let server;
    let port;
    beforeAll((done) => {
        server = http_1.default.createServer();
        (0, socket_1.initSocket)(server);
        server.listen(() => {
            port = server.address().port;
            done();
        });
    });
    afterAll((done) => {
        server.close(done);
    });
    it("should reject connection without token", (done) => {
        const socket = (0, socket_io_client_1.io)(`http://localhost:${port}`, {
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

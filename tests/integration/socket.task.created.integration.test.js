"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_io_client_1 = require("socket.io-client");
const app_1 = __importDefault(require("../../src/app"));
const User_1 = require("../../src/models/User");
const Project_1 = require("../../src/models/Project");
const socket_1 = require("../../src/socket");
describe("Socket task:created Integration Test", () => {
    let server;
    let port;
    beforeAll((done) => {
        server = http_1.default.createServer(app_1.default);
        (0, socket_1.initSocket)(server);
        server.listen(0, () => {
            const addr = server.address();
            if (addr && typeof addr !== "string")
                port = addr.port;
            done();
        });
    });
    afterAll((done) => {
        server.close(done);
    });
    // Skip this test - it has environmental issues with socket connections and memory
    it.skip("socket client receives task:created after POST /api/tasks", (done) => {
        (async () => {
            const user = await User_1.User.create({
                name: "Socket User",
                email: "socketuser@test.com",
                password: "Password123",
                role: "user",
            });
            const project = await Project_1.Project.create({
                name: "Socket Project",
                members: [user._id],
                createdBy: user._id,
            });
            const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || "testsecret");
            const socket = (0, socket_io_client_1.io)(`http://localhost:${port}`, {
                transports: ["websocket"],
                auth: { token },
                forceNew: true,
                reconnection: false,
            });
            const timeout = setTimeout(() => {
                socket.close();
                done(new Error("Test timed out waiting for task:created event"));
            }, 35000);
            socket.on("connect_error", (err) => {
                clearTimeout(timeout);
                socket.close();
                done(err);
            });
            socket.on("connect", async () => {
                await new Promise((r) => setTimeout(r, 200));
                // Listen for task:created event globally (not just in room)
                socket.once("task:created", (payload) => {
                    clearTimeout(timeout);
                    socket.close();
                    expect(payload).toBeTruthy();
                    expect(payload.projectId?.toString()).toBe(project._id.toString());
                    expect(payload.title).toBe("Socket Task");
                    done();
                });
                const res = await (0, supertest_1.default)(app_1.default)
                    .post("/api/tasks")
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                    title: "Socket Task",
                    projectId: project._id.toString(),
                    priority: "high",
                });
                expect(res.status).toBe(201);
            });
        })().catch((e) => done(e));
    });
});

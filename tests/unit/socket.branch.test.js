"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../../src/socket");
describe("socket branch", () => {
    test("getIO throws error if socket not initialized", () => {
        expect(() => (0, socket_1.getIO)()).toThrow("Socket.io not initialized");
    });
});

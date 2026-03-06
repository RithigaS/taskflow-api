"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = exports.getIO = exports.initIO = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let io;
/**
 * Initialize Socket.io
 */
const initIO = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "testsecret");
            socket.user = decoded;
            next();
        }
        catch (err) {
            next(new Error("Authentication error"));
        }
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        /**
         * join project room
         */
        socket.on("join:project", (projectId) => {
            socket.join(`project:${projectId}`);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
    return io;
};
exports.initIO = initIO;
/**
 * Access IO instance anywhere
 */
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
// Alias for backward compatibility
exports.initSocket = exports.initIO;

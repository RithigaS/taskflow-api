import { Server as IOServer } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";

let io: IOServer;

/**
 * Initialize Socket.io
 */
export const initIO = (server: http.Server) => {
  io = new IOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.query?.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "testsecret");

      (socket as any).user = decoded;

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * join project room
     */
    socket.on("join:project", (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

/**
 * Access IO instance anywhere
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

// Alias for backward compatibility
export const initSocket = initIO;

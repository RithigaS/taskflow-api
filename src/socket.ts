import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

let io: Server;

/* ================= INIT SOCKET ================= */

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  /* ===== AUTH MIDDLEWARE ===== */

  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token || (socket.handshake.query?.token as string);

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "testsecret",
      );

      socket.data.userId = decoded.userId || decoded.id;

      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  /* ===== CONNECTION ===== */

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

/* ================= GET SOCKET INSTANCE ================= */

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

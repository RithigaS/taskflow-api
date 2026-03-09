import mongoose from "mongoose";
import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { initSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("PORT from env:", PORT);
console.log("MONGO_URI exists:", !!MONGO_URI);

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected");

    const server = http.createServer(app);

    // initialize socket.io
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

startServer();

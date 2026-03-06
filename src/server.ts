import mongoose from "mongoose";
import http from "http";
import app from "./app";
import dotenv from "dotenv";
import { initSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("PORT from env:", process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected");

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

startServer();

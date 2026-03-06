"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("./socket");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
console.log("PORT from env:", process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
const startServer = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env");
        }
        await mongoose_1.default.connect(MONGO_URI);
        console.log("MongoDB Connected");
        const server = http_1.default.createServer(app_1.default);
        (0, socket_1.initSocket)(server);
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
    }
};
startServer();

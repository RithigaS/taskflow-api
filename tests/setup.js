"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
jest.setTimeout(30000);
let mongo;
beforeAll(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose_1.default.connect(uri);
});
afterEach(async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        await mongoose_1.default.connection.db.dropDatabase();
    }
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongo.stop();
});

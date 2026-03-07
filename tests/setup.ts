import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.setTimeout(30000);

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (mongoose.connection.readyState === 1 && db) {
    await db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

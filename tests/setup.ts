import mongoose from "mongoose";

jest.setTimeout(30000);

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/testdb";

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  const db = mongoose.connection.db;

  if (db) {
    const collections = await db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

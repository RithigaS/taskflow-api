import mongoose from "mongoose";

jest.setTimeout(30000);

beforeAll(async () => {
  // your connection code
});

afterEach(async () => {
  const db = mongoose.connection.db;
  if (db) {
    await db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

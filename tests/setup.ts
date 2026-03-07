import mongoose from "mongoose";

jest.setTimeout(30000);

beforeAll(async () => {
  // your connection code
});

afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

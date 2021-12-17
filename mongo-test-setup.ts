import mongoose, { startMongoose } from './src/database/connection';

beforeAll(async () => {
  await startMongoose();
});

afterAll(async () => {
  await mongoose.connection.close();
});

import mongoose from 'mongoose';
import { connectDb } from './server/db/connection';

beforeAll(async ()=> {
    // use a separate test database
    process.env.MONGODB_URI = 'your-connection-string';
    process.env.DB_NAME = 'test_db';
    process.env.JWT_SECRET = 'test-secret';
    await connectDb();
});

afterAll(async () => {
    // clean up test data
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});
import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../server/db/schemas';
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;
process.env.JWT_SECRET = 'test-secret';

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await UserModel.deleteMany({});
});

describe('POST /uvu/login', () => {
    beforeEach(async () => {
        // seed a test user before each test
        await UserModel.create({
            Id: "test123",
            Username: "testuser",
            PasswordHash: await bcrypt.hash("password123", 10),
            Role: "student",
            School: "uvu",
            Courses: [],
            CoursesTA: []
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/uvu/login')
            .send({ username: 'testuser', password: 'password123' });

        expect(res.status).toBe(302); // redirect on success
        expect(res.headers.location).toBe('/uvu/dashboard');
    });

    it('should fail with wrong password', async () => {
        const res = await request(app)
            .post('/uvu/login')
            .send({ username: 'testuser', password: 'wrongpassword' });

        expect(res.status).toBe(200); // re-renders login page
        expect(res.text).toContain('Invalid username or password');
    });

    it('should fail with non-existent user', async () => {
        const res = await request(app)
            .post('/uvu/login')
            .send({ username: 'nobody', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.text).toContain('Invalid username or password');
    });
});
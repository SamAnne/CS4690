import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { UserModel, CourseModel } from '../../server/db/schemas';
import { MongoMemoryServer } from 'mongodb-memory-server';

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

// helper to generate a test token
function makeToken(role: string, school: string) {
    return jwt.sign(
        { username: 'testuser', role, school },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
    );
}

describe('GET /uvu/dashboard/courses', () => {
    beforeEach(async () => {
        await UserModel.create({
            Id: "test123",
            Username: "testuser",
            Role: "student",
            School: "uvu",
            PasswordHash: "hash",
            Courses: ["cs4690"],
            CoursesTA: []
        });
        await CourseModel.create({
            Id: "cs4690",
            display: "CS 4690",
            school: "uvu"
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await CourseModel.deleteMany({});
    });

    it('should return student courses', async () => {
        const token = makeToken('student', 'uvu');
        const res = await request(app)
            .get('/uvu/dashboard/courses')
            .set('Cookie', `token=${token}`);

        expect(res.status).toBe(200);
        expect(res.body.courses.length).toBe(1);
        expect(res.body.courses[0].display).toBe('CS 4690');
    });

    it('should redirect wrong school user to login', async () => {
        const token = makeToken('student', 'uofu');
        const res = await request(app)
            .get('/uvu/dashboard/courses')
            .set('Cookie', `token=${token}`);

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/uvu/login');
    });
});
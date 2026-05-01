import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserRepository } from '../../server/db/UserRepository';
import { UserModel } from '../../server/db/schemas';
import bcrypt from 'bcrypt';

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('UserRepository', () => {
    const userRepo = new UserRepository();

    beforeEach(async () => {
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

    it('should find user by username and school', async () => {
        const user = await userRepo.getByUsername('testuser', 'uvu');
        expect(user).not.toBeNull();
        expect(user.Username).toBe('testuser');
        expect(user.School).toBe('uvu');
    });

    it('should not find user from different school', async () => {
        const user = await userRepo.getByUsername('testuser', 'uofu');
        expect(user).toBeNull();
    });

    it('should add a course to user', async () => {
        const updated = await userRepo.addCourse('testuser', 'cs4690', 'uvu');
        expect(updated.Courses).toContain('cs4690');
    });

    it('should not add duplicate courses', async () => {
        await userRepo.addCourse('testuser', 'cs4690', 'uvu');
        await userRepo.addCourse('testuser', 'cs4690', 'uvu');
        const user = await userRepo.getByUsername('testuser', 'uvu');
        expect(user.Courses.filter((c: string) => c === 'cs4690').length).toBe(1);
    });
});
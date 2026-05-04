// UserRepository.ts
import { Repository } from './Repository';
import { UserModel } from './schemas';
import type { IEntity } from '../models/IEntity';

class UserRepository extends Repository<IEntity> {
    public constructor() {
        super(UserModel);
    }

    public async getByUsername(username: string, school?: string): Promise<any | null>{
        const query: any = { Username: username };
        if (school) query.School = school;
        return await UserModel.findOne(query);
    }

    public async getStudentCourses(username: string, school?: string): Promise<any> {
        const query: any = { Username: username };
        if (school) query.School = school;
        const user = await UserModel.findOne(query);
        return user?.Courses ?? [];
    }

    public async getTACourses(username: string, school?: string): Promise<any> {
        const query: any = { Username: username };
        if (school) query.School = school;
        const user = await UserModel.findOne(query);
        console.log("user found:", user);
        console.log("CoursesTA:", user?.CoursesTA);
        return user?.CoursesTA ?? [];
    }

    public async getAvailableCourses(username: string, school?: string): Promise<any | null>{
        const query: any = { Username: { $ne: username } };
        if (school) query.School = school;
        return await UserModel.find(query);
    }

    public async addCourse(uvuId: string, courseId: string, school?: string): Promise<any> {
        const query: any = { Username: uvuId };
        if (school) query.School = school;
        return await UserModel.findOneAndUpdate(
            query,
            { $addToSet: { Courses: courseId } },
            { returnDocument: 'after' }
        );
    }

    public async addCourseTA(uvuId: string, courseId: string, school?: string): Promise<any> {
        const query: any = { Username: uvuId };
        if (school) query.School = school;
        return await UserModel.findOneAndUpdate(
            query,
            { 
                $addToSet: { CoursesTA: courseId },
                $set: { Role: 'TA' }
            },
            { returnDocument: 'after' }
        );
    }

    public async addTeacher(uvuId: string, courseId: string, school?: string): Promise<any> {
        const query: any = { Username: uvuId };
        if (school) query.School = school;
        return await UserModel.findOneAndUpdate(
            query,
            { 
                $addToSet: { Courses: courseId },
                $set: { Role: 'teacher' }
            },
            { returnDocument: 'after' }
        );
    }

    public async getByGoogleId(googleId: string, school: string){
        return await UserModel.findOne({ GoogleId: googleId, School: school });
    }
}

export { UserRepository };
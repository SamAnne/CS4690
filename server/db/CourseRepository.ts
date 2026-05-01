import { Repository } from './Repository';
import { CourseModel } from './schemas';
import { UserModel } from './schemas';
import type { IEntity } from '../models/IEntity';

class CourseRepository extends Repository<IEntity> {
    public constructor() {
        super(CourseModel);
    }

    public async getById(id: string, school?: string): Promise<any> {
        const query: any = { Id: id };
        if (school) query.school = school;
        return await CourseModel.findOne(query);
    }

    public async getAvailableCourses(username: string, school?: string): Promise<any[]> {
        const query: any = { Username: username };
        if (school) query.School = school;
        const user = await UserModel.findOne(query);
        const enrolledCourses = user?.Courses ?? [];

        const courseQuery: any = { Id: { $nin: enrolledCourses } };
        if (school) courseQuery.school = school;
        return await CourseModel.find(courseQuery);
    }

    public async getAll(school: string): Promise<any[]> {
        return await CourseModel.find({ school });
    }
}

export { CourseRepository };
// LogRepository.ts
import { Repository } from './Repository';
import { LogModel } from './schemas';
import type { IEntity } from '../models/IEntity';

class LogRepository extends Repository<IEntity> {
    public constructor() {
        super(LogModel); // pass the Mongoose model instead of the class
    }

    public async getCourseLogs(course: string, school?: string, username?: string): Promise<any> {
        const query: any = { courseId: course };
        if (school) query.school = school;
        if (username) query.uvuId = username;
        const logs = await LogModel.find(query);
        return logs ?? [];
    }

    public async updateLog(id: string, text: string, username: string, role: string, school: string): Promise<any> {
        const query: any = { _id: id, school };
        // students can only edit their own logs
        if (role === 'student') query.uvuId = username;
        
        return await LogModel.findOneAndUpdate(
            query,
            { $set: { text } },
            { returnDocument: 'after' }
        );
    }

    public async deleteLog(id: string, username: string, role: string, school: string): Promise<any> {
        const query: any = { _id: id, school };
        // students can only delete their own logs
        if (role === 'student') query.uvuId = username;

        return await LogModel.findOneAndDelete(query);
    }
}

export { LogRepository };
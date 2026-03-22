import type { IRepository } from './IRepository';
import type { IEntity } from '../models/IEntity';
import { Model } from 'mongoose';

function generateUUIDv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

class Repository<T extends IEntity> implements IRepository<T> {
    private model: Model<any>;

    public constructor(model: Model<any>) {
        this.model = model;
    }

    public async save(t: T): Promise<T> {
        if (!t.Id) {
            t.Id = generateUUIDv4();
        }

        // upsert — insert if new, update if exists
        await this.model.findOneAndReplace(
            { Id: t.Id },
            t,
            { upsert: true, new: true }
        );

        console.log(`✅ Saved to ${this.model.modelName}`);
        return t;
    }

    public async get(filters?: Map<string, string>): Promise<Array<T>> {
        // convert filters Map to plain object for Mongoose query
        const query: Record<string, string> = {};
        if (filters && filters.size > 0) {
            for (const [key, value] of filters.entries()) {
                query[key] = value;
            }
        }

        console.log(`📦 Querying ${this.model.modelName} with`, query);
        const results = await this.model.find(query).lean();
        return results as unknown as T[];
    }
}

export { Repository };
import type { IRepository } from "./IRepository";
import type { IEntity } from "../models/IEntity";
import { getDb } from "./connection";

function generateUUIDv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

class Repository<T extends IEntity> implements IRepository<T> {
    protected entityClass: new (...args: any[]) => T;

    protected get collectionName(): string {
        return `${this.entityClass.name.toLowerCase()}s`;
        // Log → "logs", Course → "courses"
    }

    public constructor(entityClass: new (...args: any[]) => T) {
        this.entityClass = entityClass;
    }

    public async save(t: T): Promise<T> {
        const db = await getDb();
        const collection = db.collection(this.collectionName);

        // Generate Id if it's a new record
        if (!t.Id) {
            t.Id = generateUUIDv4();
        }

        // upsert — insert if new, update if exists
        await collection.replaceOne(
            { Id: t.Id },
            { ...t as any },
            { upsert: true }
        );

        console.log(`✅ Saved ${JSON.stringify(t)} to ${this.collectionName}`);
        return t;
    }

    public async get(filters?: Map<string, string>): Promise<Array<T>> {
        console.log('📦 Fetching from MongoDB');
        const db = await getDb();
        const collection = db.collection(this.collectionName);

        // Convert filters Map to a MongoDB query object
        const query: Record<string, string> = {};
        if (filters && filters.size > 0) {
            for (const [key, value] of filters.entries()) {
                query[key] = value;
            }
        }

        console.log(`Query: ${JSON.stringify(query)}`);
        const results = await collection.find(query).toArray();
        console.log(`Found ${results.length} results`);
        return results as unknown as T[];
    }
}

export { Repository };

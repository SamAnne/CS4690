import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let db: Db;

async function getDb(): Promise<Db> {
    if (db) return db; // reuse existing connection

    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log('Connected to MongoDB Atlas');
    return db;
}

export { getDb };
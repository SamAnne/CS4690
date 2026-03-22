import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connectDb(): Promise<void> {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, 
            {
                dbName: process.env.DB_NAME as string
            });
    } catch (error) {
        console.log(error);
    }
}

export { connectDb };
import bcrypt from 'bcrypt';
import { UserRepository } from './UserRepository';
import Role from '../models/Role';
import {connectDb} from '../db/connection'; 

async function seed() {
    await connectDb();
    const userRepo = new UserRepository();

    const admin1 = {
        Username: "root_uvu",
        PasswordHash: await bcrypt.hash("willy", 10),
        Role: Role.Admin,
        School: 'uvu'
    } as any;
    await userRepo.save(admin1);

    const admin2 = {
        Username: "root_uofu",
        PasswordHash: await bcrypt.hash("swoopy", 10),
        Role: Role.Admin,
        School: 'uofu'
    } as any;
    await userRepo.save(admin2);

    console.log("Admins seeded");
}

seed();
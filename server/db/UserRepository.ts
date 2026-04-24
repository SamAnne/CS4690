// UserRepository.ts
import { Repository } from './Repository';
import { UserModel } from './schemas';
import type { IEntity } from '../models/IEntity';

class UserRepository extends Repository<IEntity> {
    public constructor() {
        super(UserModel); // pass the Mongoose model instead of the class
    }

    public async getByUsername(username: string): Promise<any | null>{
        return await UserModel.findOne({ Username: username });
    }
}

export { UserRepository };
// LogRepository.ts
import { Repository } from './Repository';
import { LogModel } from './schemas';
import type { IEntity } from '../models/IEntity';

class LogRepository extends Repository<IEntity> {
    public constructor() {
        super(LogModel); // pass the Mongoose model instead of the class
    }
}

export { LogRepository };
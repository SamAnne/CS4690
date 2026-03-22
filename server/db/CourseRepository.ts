import { Repository } from './Repository';
import { CourseModel } from './schemas';
import type { IEntity } from '../models/IEntity';

class CourseRepository extends Repository<IEntity> {
    public constructor() {
        super(CourseModel);
    }
}

export { CourseRepository };
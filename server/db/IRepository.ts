import { IEntity } from "../models/IEntity";

interface IRepository<T extends IEntity> {
    save(t: T): Promise<T>;
    get(filters?: Map<string, string>): Promise<Array<T>>;
    // delete(id: string | number): Promise<boolean>;
}

export { IRepository };
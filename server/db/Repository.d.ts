import { IRepository } from "./IRepository";
import { IEntity } from "../models/IEntity";
import 'reflect-metadata';
declare class Repository<T extends IEntity> implements IRepository<T> {
    private lock;
    private hasLoadedData;
    private data;
    protected entityClass: new (...args: any[]) => T;
    protected get collectionName(): string;
    constructor(entityClass: new (...args: any[]) => T);
    save(t: T): Promise<T>;
    private SaveData;
    get(filters?: Map<string, string>): Promise<Array<T>>;
    protected LoadData(): Promise<boolean>;
}
export { Repository };
//# sourceMappingURL=Repository.d.ts.map
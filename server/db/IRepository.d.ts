import { IEntity } from "../models/IEntity";
interface IRepository<T extends IEntity> {
    save(t: T): Promise<T>;
    get(filters?: Map<string, string>): Promise<Array<T>>;
}
export { IRepository };
//# sourceMappingURL=IRepository.d.ts.map
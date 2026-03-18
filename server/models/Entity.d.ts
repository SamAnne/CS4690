import { IEntity } from "./IEntity";
declare class Entity implements IEntity {
    private id;
    constructor(id?: string);
    get Id(): string;
    set Id(value: string);
}
export { Entity };
//# sourceMappingURL=Entity.d.ts.map
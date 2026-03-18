import { Entity } from "./Entity";
declare class Course extends Entity {
    private display;
    constructor(id?: string, display?: string);
    get Display(): string;
    set Display(value: string);
}
export default Course;
//# sourceMappingURL=Course.d.ts.map
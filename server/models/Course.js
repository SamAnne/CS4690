import { Entity } from "./Entity";
// {"id":"cs4690","display":"CS 4690"}
class Course extends Entity {
    constructor(id = "", display = "") {
        super(id);
        this.display = "";
        this.display = display;
    }
    get Display() {
        return this.display;
    }
    set Display(value) {
        this.display = value;
    }
}
export default Course;
//# sourceMappingURL=Course.js.map
import { Entity } from "./Entity";

// {"id":"cs4690","display":"CS 4690"}
class Course extends Entity {
    private display: string = "";

    constructor(id: string = "", display: string = "") {
        super(id);
        this.display = display;
    }

    public get Display() : string
    {
        return this.display;
    }

    public set Display(value: string)
    {
        this.display = value;
    }
}

export default Course;
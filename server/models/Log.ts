import { Entity } from "./Entity";

// {"courseId":"cs4660","uvuId":"10111111","date":"1/23/2021 1:23:36 PM","text":"Initial comment. Hello World"
class Log extends Entity {
    private courseId: string = "";
    private uvuId: string = "";
    private date: Date = new Date();
    private text: string = "";

    constructor(_id: string = "", _courseId: string = "", _uvuId: string = "", _date: Date = new Date(), _text: string = "") {
        super(_id);
        this.courseId = _courseId;
        this.uvuId = _uvuId;
        this.date = _date;
        this.text = _text;
    }
}

export { Log };
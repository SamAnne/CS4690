import { Entity } from "./Entity";
// {"courseId":"cs4660","uvuId":"10111111","date":"1/23/2021 1:23:36 PM","text":"Initial comment. Hello World"
class Log extends Entity {
    constructor(_id = "", _courseId = "", _uvuId = "", _date = new Date(), _text = "") {
        super(_id);
        this.courseId = "";
        this.uvuId = "";
        this.date = new Date();
        this.text = "";
        this.courseId = _courseId;
        this.uvuId = _uvuId;
        this.date = _date;
        this.text = _text;
    }
}
export { Log };
//# sourceMappingURL=Log.js.map
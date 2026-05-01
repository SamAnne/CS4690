import { Entity } from "./Entity";
import Role from "./Role";

class User extends Entity {
    private username: string = "";
    private passwordHash: string = "";
    private role: Role = Role.Student;
    private courses: string[] = [];
    private coursesTA: string[] = [];

    constructor(_id: string = "", username: string, passwordHash: string, role: Role) {
        super(_id);
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
    }
}

export default User;
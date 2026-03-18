import { IEntity } from "../models/IEntity";
import { Repository } from "./Repository";
import { Log } from "../models/Log";

class LogRepository extends Repository<Log> {
    public constructor()
    {
        super(Log);
    }
}

export {
    LogRepository
}
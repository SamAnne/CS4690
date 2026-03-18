import { IEntity } from "./IEntity";

class Entity implements IEntity{
    private id : string = "";

    public constructor(id: string = "")
    {
        this.id = id;
    }

    public get Id() : string 
    {
        return this.id;
    }
    public set Id(value : string)
    {
        this.id = value;
    }
}

export { Entity };
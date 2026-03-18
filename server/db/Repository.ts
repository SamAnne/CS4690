import { IRepository } from "./IRepository";
import { IEntity } from "../models/IEntity";
import { chown, promises as fsPromises} from "fs";
import path from 'path';
import AsyncLock from 'async-lock';
import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';
import { Entity } from "../models/Entity";
import { ResourceLimits } from "worker_threads";
import { captureRejectionSymbol } from "events";

function generateUUIDv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0; // Generate a random number between 0 and 15
      const v = c === 'x' ? r : (r & 0x3) | 0x8; // Apply UUID v4 specific logic for 'y' characters
      return v.toString(16); // Convert to hexadecimal string
    });
  }

const jsonDataFileName = path.join(__dirname, './db.json');
console.log(__dirname);

class Repository<T extends IEntity> implements IRepository<T> {
    private lock : AsyncLock;
    private hasLoadedData : boolean;
    private data : Map<string /* collection  name, like 'Logs' */,
        Map<string /* id */, IEntity /* entity with that id*/>>;
    
    protected entityClass: new (...args: any[]) => T;

    // collectionName is assigned in child class constructors
    // like 'logs' or 'courses'
    protected get collectionName() : string {
        return `${this.entityClass.name.toLowerCase()}s`;
    }

    public constructor(entityClass: new (...args: any[]) => T)
    {
        this.lock = new AsyncLock();
        this.hasLoadedData = false;
        this.data = new Map<string /* collection  name, like 'Logs' */,
            Map<string /* id */, IEntity /* entity with that id*/>>();
        this.entityClass = entityClass;
    }

    public async save(t: T): Promise<T>
    {
        await this.LoadData(); // read file if necessary
        // todo..find in list and update

        await this.lock.acquire('logsData', async () => {
            let collection : Map<string /* id */, IEntity /* entity with that id*/> = this.data.get(this.collectionName)
                ?? new Map<string /* id */, IEntity /* entity with that id*/>();

            console.log(`Data before:  ${JSON.stringify(this.data)}`);

            // if it's an insert, then we need to create the id!
            if (!t.Id) {
                t.Id = generateUUIDv4();
                //if we kept track of something like the insert timestamp
            }

            // if we kept track of things like updated timestamp, version number, etc.

            // But for now, we simply need to add it to the collection (or update if it's already there)
            collection.set(t.Id, t);

            // never hurts to log "I made it here!"
            console.log(`Saved ${JSON.stringify(t)} to collection`);

            console.log(`Data after:  ${JSON.stringify(this.data)}`);
        });

        // now write it to disk
        await this.SaveData();

        return t;
    }
    
    private async SaveData() {
        await this.lock.acquire('jsonData', async () => {
            try {
                console.log(`SaveData:  ${JSON.stringify(this.data)}`);
                await fsPromises.writeFile(jsonDataFileName, 
                    JSON.stringify(this.data), 'utf8');
                console.log(`Saved to ${jsonDataFileName}.`);
            }
            catch (err) {
                console.error(`Error writing file: ${err}`);
            }
        });
    }

    async get(filters?: Map<string, string>): Promise<Array<T>>
    {
        await this.LoadData(); // read file if necessary

        let results = await this.lock.acquire('logsData', async () => {
            let collection : Map<string /* id */, IEntity /* entity with that id*/> = this.data.get(this.collectionName)
                ?? new Map<string /* id */, IEntity /* entity with that id*/>();

            let results: T[] = Array.from(collection.values()) as T[];

            // If no filters provided, return all
            if (!filters || filters.size === 0) {
                return results;
            }

            // Filter results based on any provided filters
            results = results.filter(item => {
                for (const [key, value] of filters.entries()) {
                    if ((item as any)[key] !== value) {
                        return false;
                    }
                }
                return true;
            });

            return results;
        });

        return results;
    }

    protected async LoadData() : Promise<boolean>
    {
        if (this.hasLoadedData == false)
        {
            await this.lock.acquire('jsonData', async () => {
                if (this.hasLoadedData == false)
                {
                    try {
                        let jsonString : string = await fsPromises.readFile(jsonDataFileName, 'utf8');
                        const jsonData = JSON.parse(jsonString);
                        console.log("Parsed JSON data: ", jsonData);

                        // Convert JSON structure (object with arrays) to nested Maps
                        // Structure: Map<collectionName, Map<id, entity>>
                        this.data = new Map();
                        for (const [collectionName, entities] of Object.entries(jsonData)) {
                            if (Array.isArray(entities)) {
                                const entityMap = new Map<string, IEntity>();
                                // Deserialize plain JSON objects to typed class instances
                                const typedEntities = plainToInstance(this.entityClass, entities);
                                for (const entity of typedEntities) {
                                    if (entity.Id) {
                                        entityMap.set(entity.Id, entity);
                                    }
                                }
                                this.data.set(collectionName, entityMap);

                                console.log(`collection name: ${collectionName},\nentityMap: ${JSON.stringify(Array.from(entityMap.entries()))}\n`);
                            }
                        }
                        
                        this.hasLoadedData = true;
                    } catch (error) {
                        console.error("Error loading data:", error);
                        throw error; // Re-throw to let caller handle
                    }
                }
            });
        }

        return this.hasLoadedData;
    }
}

export { Repository };
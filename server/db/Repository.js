var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fsPromises } from "fs";
import path from 'path';
import AsyncLock from 'async-lock';
import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0; // Generate a random number between 0 and 15
        const v = c === 'x' ? r : (r & 0x3) | 0x8; // Apply UUID v4 specific logic for 'y' characters
        return v.toString(16); // Convert to hexadecimal string
    });
}
const jsonDataFileName = path.join(__dirname, './db.json');
console.log(__dirname);
class Repository {
    // collectionName is assigned in child class constructors
    // like 'logs' or 'courses'
    get collectionName() {
        return `${this.entityClass.name.toLowerCase()}s`;
    }
    constructor(entityClass) {
        this.lock = new AsyncLock();
        this.hasLoadedData = false;
        this.data = new Map();
        this.entityClass = entityClass;
    }
    save(t) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.LoadData(); // read file if necessary
            // todo..find in list and update
            yield this.lock.acquire('logsData', () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let collection = (_a = this.data.get(this.collectionName)) !== null && _a !== void 0 ? _a : new Map();
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
            }));
            // now write it to disk
            yield this.SaveData();
            return t;
        });
    }
    SaveData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.lock.acquire('jsonData', () => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log(`SaveData:  ${JSON.stringify(this.data)}`);
                    yield fsPromises.writeFile(jsonDataFileName, JSON.stringify(this.data), 'utf8');
                    console.log(`Saved to ${jsonDataFileName}.`);
                }
                catch (err) {
                    console.error(`Error writing file: ${err}`);
                }
            }));
        });
    }
    get(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.LoadData(); // read file if necessary
            let results = yield this.lock.acquire('logsData', () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let collection = (_a = this.data.get(this.collectionName)) !== null && _a !== void 0 ? _a : new Map();
                let results = Array.from(collection.values());
                // If no filters provided, return all
                if (!filters || filters.size === 0) {
                    return results;
                }
                // Filter results based on any provided filters
                results = results.filter(item => {
                    for (const [key, value] of filters.entries()) {
                        if (item[key] !== value) {
                            return false;
                        }
                    }
                    return true;
                });
                return results;
            }));
            return results;
        });
    }
    LoadData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasLoadedData == false) {
                yield this.lock.acquire('jsonData', () => __awaiter(this, void 0, void 0, function* () {
                    if (this.hasLoadedData == false) {
                        try {
                            let jsonString = yield fsPromises.readFile(jsonDataFileName, 'utf8');
                            const jsonData = JSON.parse(jsonString);
                            console.log("Parsed JSON data: ", jsonData);
                            // Convert JSON structure (object with arrays) to nested Maps
                            // Structure: Map<collectionName, Map<id, entity>>
                            this.data = new Map();
                            for (const [collectionName, entities] of Object.entries(jsonData)) {
                                if (Array.isArray(entities)) {
                                    const entityMap = new Map();
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
                        }
                        catch (error) {
                            console.error("Error loading data:", error);
                            throw error; // Re-throw to let caller handle
                        }
                    }
                }));
            }
            return this.hasLoadedData;
        });
    }
}
export { Repository };
//# sourceMappingURL=Repository.js.map
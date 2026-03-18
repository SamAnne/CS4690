var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { LogRepository } from '../db/LogRepository';
const router = express.Router();
/* GET logs with optional filters (courseId, uvuId, logId, etc.) */
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Convert URL query parameters to Map for filtering
            // Only include string values, skip arrays/objects
            const filters = new Map(Object.entries(req.query)
                .filter(([_key, value]) => typeof value === 'string')
                .map(([key, value]) => [key, value]));
            const logRepo = new LogRepository();
            const logs = yield logRepo.get(filters);
            res.json(logs);
        }
        catch (error) {
            next(error);
        }
    });
});
router.post('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const logRepo = new LogRepository();
            // use the code that converts json into a log using body-parser
            let log = req.body;
            // we need logRepo to return a log object in case:
            // 1.  it's an insert to get the Id from the returned object on the post, 
            // 2.  for updates, the data should match, unless updates also do something like 
            //     a. updates the version number or 
            //     b. updates the last modified time, etc.
            //     c. in which case, the inserts should do 2.a-2.b type changes also!
            log = yield logRepo.save(log);
            res.json(log);
        }
        catch (error) {
            next(error);
        }
    });
});
export default router;
//# sourceMappingURL=logs.js.map
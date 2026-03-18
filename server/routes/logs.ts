import express, { Request, Response, NextFunction } from 'express';
import { LogRepository } from '../db/LogRepository';
import { Log } from '../models/Log';

const router = express.Router();

/* GET logs with optional filters (courseId, uvuId, logId, etc.) */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  try {
    // Convert URL query parameters to Map for filtering
    // Only include string values, skip arrays/objects
    const filters = new Map(
      Object.entries(req.query)
        .filter(([_key, value]) => typeof value === 'string')
        .map(([key, value]) => [key, value as string])
    );

    const logRepo = new LogRepository();
    const logs = await logRepo.get(filters);

    res.json(logs);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const logRepo = new LogRepository();

    // use the code that converts json into a log using body-parser
    let log : Log = req.body;


    // we need logRepo to return a log object in case:
    // 1.  it's an insert to get the Id from the returned object on the post, 
    // 2.  for updates, the data should match, unless updates also do something like 
    //     a. updates the version number or 
    //     b. updates the last modified time, etc.
    //     c. in which case, the inserts should do 2.a-2.b type changes also!
    log = await logRepo.save(log);
    
    res.json(log);
  } catch (error) {
    next(error);
  }

});


export default router;
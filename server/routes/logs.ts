import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { LogRepository } from '../db/LogRepository';

const router = express.Router();

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
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
        const log = {
            Id: req.body.Id ?? "",
            courseId: req.body.courseId,
            uvuId: req.body.uvuId,
            date: req.body.date,
            text: req.body.text
        } as any;

        const saved = await logRepo.save(log);
        res.json(saved);
    } catch (error) {
        next(error);
    }
});

export default router;
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { CourseRepository } from '../db/CourseRepository';

const router = express.Router();

router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = new Map(
            Object.entries(req.query)
                .filter(([_key, value]) => typeof value === 'string')
                .map(([key, value]) => [key, value as string])
        );

        const courseRepo = new CourseRepository();
        const courses = await courseRepo.get(filters);
        res.json(courses);
    } catch (error) {
        next(error);
    }
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const courseRepo = new CourseRepository();
        const course = {
            Id: req.body.Id ?? "",
            display: req.body.display
        } as any;

        const saved = await courseRepo.save(course);
        res.json(saved);
    } catch (error) {
        next(error);
    }
});

export default router;

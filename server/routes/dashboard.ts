import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { UserRepository } from '../db/UserRepository';
import { LogRepository } from '../db/LogRepository';
import { CourseRepository } from '../db/CourseRepository';
import { requireAuth, requireRole } from './roles';
import Role from '../models/Role';

/* GET dashboard page. */
router.get('/', function(req, res, next) {
    res.render('dashboard', { title: 'Dashboard' });
});

// GET courses
router.get('/courses', async function(req, res, next) {
    try {
        const userRepo = new UserRepository();
        const courseRepo = new CourseRepository();
        const { username, school, role } = res.locals.user;

        if (role === 'admin') {
            const allCourses = await courseRepo.getAll(school);
            return res.json({ courses: allCourses, coursesTA: [] });
        }

        const courseIds = await userRepo.getStudentCourses(username, school);
        const courseTAIds = await userRepo.getTACourses(username, school);

        const allCourseIds = [...new Set([...courseIds, ...courseTAIds])];
        if (allCourseIds.length === 0) {
            return res.json({ courses: [], coursesTA: [] });
        }

        const courses = await Promise.all(
            courseIds.map((id: string) => courseRepo.getById(id, school))
        );
        console.log("courses is " + courses);

        const coursesTA = await Promise.all(
            courseTAIds.map((id: string) => courseRepo.getById(id, school))
        );

        return res.json({ courses, coursesTA });
    } catch (error) {
        next(error);
    }
});

router.get('/courses-available', async function(req, res, next) {
    try {
        const courseRepo = new CourseRepository();
        const { username, school } = res.locals.user;
        const courses = await courseRepo.getAvailableCourses(username, school);
        return res.json(courses);
    } catch (error) {
        next(error);
    }
});

// GET logs for a specific course
router.get('/logs', async function(req, res, next) {
    try {
        const { course } = req.query;
        const { username, role, school } = res.locals.user;
        const logRepo = new LogRepository();
        const logs = await logRepo.getCourseLogs(
            course as string,
            school,
            role === Role.Student ? username : undefined
        );
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

// POST add course
router.post('/add-course', async function(req, res, next) {
    try {
        const courseRepo = new CourseRepository();
        const userRepo = new UserRepository();
        const { username, school } = res.locals.user;
        const course = {
            Id: req.body.Id ?? "",
            display: req.body.display,
            school: school
        } as any;
        const existing = await courseRepo.getById(course.Id, school);
        if (!existing) {
            await courseRepo.save(course);
            await userRepo.addCourse(username, req.body.Id, school);
            return res.json(course);
        }
        await userRepo.addCourse(username, req.body.Id, school);
        return res.json(existing);
    }
    catch (error){
        next(error);
    }
});

router.post('/add-student', requireRole(Role.Teacher), async function(req, res, next) {
    try {
        const { uvuId, courseId } = req.body;
        const { school } = res.locals.user;
        const userRepo = new UserRepository();
        
        const student = await userRepo.getByUsername(uvuId, school);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const updated = await userRepo.addCourse(uvuId, courseId, school);
        return res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.post('/add-TA', requireRole(Role.Teacher), async function(req, res, next) {
    try {
        const { uvuId, courseId } = req.body;
        const { school } = res.locals.user;
        const userRepo = new UserRepository();
        
        const student = await userRepo.getByUsername(uvuId, school);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const updated = await userRepo.addCourseTA(uvuId, courseId, school);
        return res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.post('/add-teacher', requireRole(Role.Admin), async function(req, res, next) {
    try {
        const { uvuId, courseId } = req.body;
        const { school } = res.locals.user;
        const userRepo = new UserRepository();
        
        const student = await userRepo.getByUsername(uvuId, school);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const updated = await userRepo.addTeacher(uvuId, courseId, school);
        return res.json(updated);
    } catch (error) {
        next(error);
    }
});

// POST create a log
router.post('/logs', async function(req, res, next) {
    try {
        const { courseId, text } = req.body;
        const { username, school } = res.locals.user;
        const logRepo = new LogRepository();

        const log = {
            Id: "",
            courseId,
            uvuId: username,
            date: new Date().toLocaleDateString(),
            text,
            school
        } as any;

        const saved = await logRepo.save(log);
        return res.json(saved);
    } catch (error) {
        next(error);
    }
});

// PUT update a log
router.put('/logs/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const { username, role, school } = res.locals.user;
        const logRepo = new LogRepository();

        const updated = await logRepo.updateLog(id, text, username, role, school);
        if (!updated) {
            return res.status(403).json({ error: 'Not allowed to edit this log' });
        }
        return res.json(updated);
    } catch (error) {
        next(error);
    }
});

// DELETE a log
router.delete('/logs/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        const { username, role, school } = res.locals.user;
        const logRepo = new LogRepository();

        const deleted = await logRepo.deleteLog(id, username, role, school);
        if (!deleted) {
            return res.status(403).json({ error: 'Not allowed to delete this log' });
        }
        return res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;

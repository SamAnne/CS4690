import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import User from '../models/User'
import Role from '../models/Role'
import { UserRepository } from '../db/UserRepository';
import bcrypt from 'bcrypt';

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  const school = res.locals.school;
  res.render('signup', { title: 'Sign Up', school });
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  const { username, email, password } = req.body;
  const school = res.locals.school;
  const roleMap: { [key: string]: Role } = {
    'student': Role.Student,
    'teacher': Role.Teacher
  };
  console.log("req is " + req);
  
  try {
    const userRepo = new UserRepository();

    const existing = await userRepo.getByUsername(username, school);
    if (existing) {
        return res.render('signup', { 
            error: 'Username already taken',
            title: 'Sign Up',
            school
        });
    }

    const user = {
        Id: req.body.Id ?? "",
        Username: username,
        Email: email,
        PasswordHash: await bcrypt.hash(password, 10),
        Role: roleMap[req.body.role] ?? Role.Student,
        School: school,
        Courses: [],
        CoursesTA: []
    } as any;

    const saved = await userRepo.save(user);
    return res.redirect(`/${school}/login`);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});

export default router;
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import User from '../models/User'
import Role from '../models/Role'
import { UserRepository } from '../db/UserRepository';
import bcrypt from 'bcrypt';

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('signup', { title: 'Sign Up' });
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  const roleMap: { [key: string]: Role } = {
    'student': Role.Student,
    'teacher': Role.Teacher
  };
  console.log("req is " + req);
  
  try {
    const userRepo = new UserRepository();

    const existing = await userRepo.getByUsername(username);
    if (existing) {
        return res.render('signup', { 
            error: 'Username already taken',
            title: 'Sign Up'
        });
    }

    const user = {
        Id: req.body.Id ?? "",
        Username: username,
        PasswordHash: await bcrypt.hash(password, 10),
        Role: roleMap[req.body.role] ?? Role.Student
    } as any;

    const saved = await userRepo.save(user);
    return res.redirect('/login');
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});

export default router;
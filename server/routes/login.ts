import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { UserRepository } from '../db/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  const school = res.locals.school;
  res.render('login', { title: 'Login', school });
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body;
  const school = res.locals.school;
  try {
    const userRepo = new UserRepository();
    const user = await userRepo.getByUsername(username, school);
    console.log(user);
    if (!user) {
        return res.render('login', { error: 'Invalid username or password', school });
    }

    const match = await bcrypt.compare(password, user.PasswordHash);
    console.log(match);
    if (!match){
        return res.render('login', { error: 'Invalid username or password', school });
    }

    const token = jwt.sign(
      { username: user.Username, role: user.Role, school: user.School },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // token expires in 1 day
    );

    // store token in a cookie
    res.cookie('token', token, { httpOnly: true });
    res.redirect(`/${school}/dashboard`);
  }
  catch (error){
    next(error);
  }
});



export default router;
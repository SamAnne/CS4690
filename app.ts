import createError from 'http-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import jwt from 'jsonwebtoken';
import { requireAuth, requireRole } from './server/routes/roles';

import indexRouter from './server/routes/index';
import logsRouter from './server/routes/logs';
import coursesRouter from './server/routes/courses';
import loginRouter from './server/routes/login';
import signupRouter from './server/routes/signup';
import dashboardRouter from './server/routes/dashboard';

import passport from './server/auth/google';




const app: Express = express();
const VALID_SCHOOLS = ['uvu', 'uofu'];

// view engine setup
app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(passport.initialize());

app.use((req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            res.locals.user = decoded;
            res.locals.school = decoded.school;
        } catch {
            res.locals.user = null;
            res.locals.school = null;
        }
    } else {
        res.locals.school = null;
    }
    next();
});


app.use((req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            res.locals.user = decoded;
            res.locals.school = decoded.school;
        } catch {
            res.locals.user = null;
            res.locals.school = null;
        }
    } else {
        res.locals.school = null;
    }
    next();
});


app.use((req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            res.locals.user = decoded;
            res.locals.school = decoded.school;
        } catch {
            res.locals.user = null;
            res.locals.school = null;
        }
    } else {
        res.locals.school = null;
    }
    next();
});


app.use('/', indexRouter);

// school-specific routes
app.use('/:school', function(req: Request, res: Response, next: NextFunction) {
    const school = req.params.school as string;
    if (VALID_SCHOOLS.includes(school)) {
        res.locals.school = school;
        next();
    } else {
        next(); // not a school route
    }
});

app.get('/:school/logout', function(req: Request, res: Response) {
    res.clearCookie('token');
    const school = req.params.school;
    res.redirect(`/${school}/login`);
});

app.use('/:school/login', loginRouter);
app.use('/:school/signup', signupRouter);
app.use('/:school/dashboard', requireAuth, dashboardRouter);

app.get('/:school/auth/google', (req, res, next) => {
    res.locals.school = req.params.school;
    passport.authenticate('google', {
        scope: ['openid', 'email', 'profile'],
        state: req.params.school  // pass school through oauth flow
    })(req, res, next);
});

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/:school/login' }),
    (req: any, res) => {
        const user = req.user;
        const school = user.School;

        const token = jwt.sign(
            { username: user.Username, role: user.Role, school },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, { httpOnly: true });
        res.redirect(`/${school}/dashboard`);
    }
);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



export default app;
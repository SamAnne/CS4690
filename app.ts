import createError from 'http-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import jwt from 'jsonwebtoken';

import indexRouter from './server/routes/index';
import logsRouter from './server/routes/logs';
import coursesRouter from './server/routes/courses';
import loginRouter from './server/routes/login';
import signupRouter from './server/routes/signup';
import { connectDb } from './server/db/connection';

connectDb();

const app: Express = express();

// view engine setup
app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            res.locals.user = decoded;
        } catch {
            res.locals.user = null;
        }
    }
    next();
});

app.use('/', indexRouter);
app.use('/logs', logsRouter);
app.use('/courses', coursesRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter); 

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
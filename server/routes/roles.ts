import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    const school = res.locals.school;
    if (!token) {
        return res.redirect(`/${school}/login`);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        
        // check token school matches URL school
        if (decoded.school !== school) {
            res.clearCookie('token');
            return res.redirect(`/${school}/login`);
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.redirect(`/${school}/login`);
    }
}

export function requireRole(role: Role) {
    return function(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.token;
        const school = res.locals.school ?? 'uvu';
        if (!token) {
            return res.redirect(`${school}/login`);
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            if (decoded.role !== role) {
                return res.status(403).render('error', { message: 'Forbidden' });
            }
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.clearCookie('token');
            return res.redirect(`${school}/login`);
        }
    }
}
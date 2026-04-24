import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.redirect('/login');
    }
}

export function requireRole(role: Role) {
    return function(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            if (decoded.role !== role) {
                return res.status(403).render('error', { message: 'Forbidden' });
            }
            (req as any).user = decoded;
            next();
        } catch (error) {
            return res.redirect('/login');
        }
    }
}
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../constants';
import { env } from '../config/env';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export interface AuthUser {
  id: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next(new UnauthorizedError('Authentication required'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    req.user = { id: String(payload.sub), role: String(payload.role) };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired session'));
  }
};

export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role)) return next(new ForbiddenError());
    next();
  };

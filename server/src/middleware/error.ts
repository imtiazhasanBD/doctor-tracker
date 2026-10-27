import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { AppError, FieldError, NotFoundError } from '../utils/errors';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

function send(res: Response, status: number, message: string, errors?: FieldError[]) {
  res.status(status).json({ message, ...(errors?.length ? { errors } : {}) });
}

// One error shape for the whole API: { message, errors?: [{ path, message }] }
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) return send(res, err.status, err.message, err.errors);

  if (err instanceof ZodError) {
    return send(
      res,
      422,
      'Validation failed',
      err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
    );
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return send(
      res,
      422,
      'Validation failed',
      Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }))
    );
  }

  if (err instanceof mongoose.Error.CastError) return send(res, 400, `Invalid ${err.path}`);

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0] ?? 'field';
    return send(res, 409, `${field} already exists`, [{ path: field, message: `${field} already exists` }]);
  }

  if (err instanceof jwt.JsonWebTokenError) return send(res, 401, 'Invalid or expired session');
  if (err?.type === 'entity.parse.failed') return send(res, 400, 'Malformed JSON body');
  if (err?.type === 'entity.too.large') return send(res, 413, 'Request body too large');

  console.error(err);
  send(res, 500, 'Internal server error');
};

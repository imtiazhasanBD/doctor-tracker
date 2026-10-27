export interface FieldError {
  path: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: FieldError[]
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors?: FieldError[]) {
    super(400, message, errors);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}
export class ConflictError extends AppError {
  constructor(message = 'Conflict', errors?: FieldError[]) {
    super(409, message, errors);
  }
}

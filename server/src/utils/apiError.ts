// ──────────────────────────────────────────────
// Custom API Error Classes
// ──────────────────────────────────────────────

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export class ValidationError extends ApiError {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation failed', 422);
    this.errors = errors;
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500, false);
  }
}
